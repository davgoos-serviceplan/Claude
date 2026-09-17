-- Einmalig im Supabase SQL-Editor ausführen (siehe README.md Schritt 2).
-- Kann mehrfach ausgeführt werden (z.B. nach einem Update dieses Projekts),
-- ohne bestehende Daten zu verlieren.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- Zugriffs-Kontrolle: nur eure Firmendomain darf sich registrieren,
-- und jede Registrierung muss von einem Admin freigegeben werden,
-- bevor die Person Ideen/Prozesse sehen oder bearbeiten kann.
-- ============================================================

-- Passe diese Domain und Admin-E-Mail an eure Firma an, falls nötig.
create or replace function restrict_signup_domain()
returns trigger as $$
begin
  if lower(new.email) !~ '@house-of-communication\.com$' then
    raise exception 'Registrierung ist nur mit einer @house-of-communication.com E-Mail-Adresse möglich.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists restrict_signup_domain_trigger on auth.users;
create trigger restrict_signup_domain_trigger
  before insert on auth.users
  for each row
  execute function restrict_signup_domain();

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_approved boolean not null default false,
  is_admin boolean not null default false,
  is_rejected boolean not null default false,
  created_at timestamptz not null default now()
);

-- Für Projekte, die die profiles-Tabelle schon vor der Ablehnen-Funktion
-- angelegt hatten: Spalte nachträglich ergänzen.
alter table profiles add column if not exists is_rejected boolean not null default false;

create or replace function handle_new_user()
returns trigger as $$
declare
  is_the_admin boolean := lower(new.email) = 'd.goos@house-of-communication.com';
begin
  insert into public.profiles (id, email, is_approved, is_admin)
  values (new.id, new.email, is_the_admin, is_the_admin);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- Hilfsfunktionen, die den Freigabe-/Admin-Status der eingeloggten Person
-- lesen. Als "security definer" umgehen sie beim internen Lesen von
-- "profiles" dessen eigene Zugriffsregeln - das ist hier bewusst so und
-- notwendig, weil eine Regel auf "profiles", die direkt wieder "profiles"
-- abfragt, sonst eine Endlosschleife auslöst ("infinite recursion
-- detected in policy for relation profiles").
create or replace function is_approved_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_approved from public.profiles where id = auth.uid()), false);
$$;

create or replace function is_admin_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

alter table profiles enable row level security;

drop policy if exists "Profiles: select own" on profiles;
create policy "Profiles: select own"
  on profiles for select
  using (id = auth.uid());

drop policy if exists "Profiles: admin select all" on profiles;
create policy "Profiles: admin select all"
  on profiles for select
  using (is_admin_user());

drop policy if exists "Profiles: admin update all" on profiles;
create policy "Profiles: admin update all"
  on profiles for update
  using (is_admin_user());

-- Für Projekte, die schon vor der Freigabe-Funktion Nutzer:innen hatten:
-- fehlende Profile nachträglich anlegen (Admin-E-Mail wird automatisch freigeschaltet).
insert into public.profiles (id, email, is_approved, is_admin)
select
  u.id,
  u.email,
  lower(u.email) = 'd.goos@house-of-communication.com',
  lower(u.email) = 'd.goos@house-of-communication.com'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ============================================================
-- Kostenstellen-Zugriff: das bisherige "Abteilung"-Feld (department bei
-- ideas/processes) ist konzeptionell die Kostenstelle. Jede Person
-- braucht pro Kostenstelle einen expliziten Zugriffs-Level, um deren
-- Ideen/Prozesse zu sehen bzw. zu bearbeiten - keine Zeile heißt kein
-- Zugriff. Admins sehen/bearbeiten unabhängig davon immer alles.
-- ============================================================

create table if not exists kostenstellen (
  code text primary key,
  name text not null default ''
);

-- Die bisher einzige, fest in der App hinterlegte Kostenstelle einmalig
-- übernehmen, damit der Dropdown nicht leer ist.
insert into kostenstellen (code, name)
values ('050005 CO', 'Group Controlling')
on conflict (code) do nothing;

-- Teams gehören zu genau einer Kostenstelle (nicht global) - jede
-- Kostenstelle kann ihre eigene, unabhängige Teamliste haben. Ideen/
-- Prozesse verweisen auf die Team-ID statt auf den Namen als Text, damit
-- eine Umbenennung überall automatisch mitzieht (genau wie bei
-- Kostenstellen-Namen schon heute).
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  kostenstelle_code text not null references kostenstellen (code) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (kostenstelle_code, name)
);

-- Die bisher fest in js/app.js hinterlegten 5 Teams einmalig für die
-- bestehende Kostenstelle übernehmen, damit sich für die heutige Nutzung
-- nichts ändert.
insert into teams (kostenstelle_code, name)
select '050005 CO', t
from unnest(array['Group Controlling', 'Treasury', 'Cost Allocation', 'Workforce Controlling', 'BI-Strategy']) as t
where exists (select 1 from kostenstellen k where k.code = '050005 CO')
on conflict (kostenstelle_code, name) do nothing;

-- Kein Primary Key inline: team_id (siehe unten) ist nullable ("alle
-- Teams") und kann daher nicht Teil eines Primary Keys sein. Stattdessen
-- weiter unten ein eigener id-Primary-Key plus zwei partielle
-- Unique-Indexe - das muss unbedingt unconditional (nicht nur bei einer
-- Migration von der alten team-Text-Spalte) passieren, sonst würde eine
-- brandneue Datenbank fälschlich nur einen Zugriffs-Eintrag pro Person
-- und Kostenstelle zulassen, statt einen pro Team.
create table if not exists kostenstelle_access (
  user_id uuid not null references auth.users (id) on delete cascade,
  kostenstelle_code text not null references kostenstellen (code) on delete cascade,
  access_level text not null check (access_level in ('read', 'write'))
);

-- Team-Dimension: Zugriff wird pro (Kostenstelle, Team) statt nur pro
-- Kostenstelle vergeben, damit innerhalb einer Kostenstelle mehrere Teams
-- unabhängig voneinander freigeschaltet werden können. team_id NULL heißt
-- "alle Teams dieser Kostenstelle" (Vollzugriff) - so bleiben bereits
-- vergebene, aus der Zeit vor der Team-Trennung stammende Zugriffe
-- unverändert gültig.
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'kostenstelle_access' and column_name = 'team') then
    alter table kostenstelle_access add column if not exists team_id uuid references teams (id) on delete cascade;
    update kostenstelle_access a
    set team_id = t.id
    from teams t
    where t.kostenstelle_code = a.kostenstelle_code and t.name = a.team and a.team <> '*';
    alter table kostenstelle_access drop column team;
  end if;
end $$;

alter table kostenstelle_access add column if not exists team_id uuid references teams (id) on delete cascade;
alter table kostenstelle_access drop constraint if exists kostenstelle_access_pkey;
alter table kostenstelle_access add column if not exists id uuid not null default gen_random_uuid();

do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'kostenstelle_access' and c.contype = 'p'
  ) then
    alter table kostenstelle_access add primary key (id);
  end if;
end $$;

-- Höchstens ein Vollzugriff-Eintrag (team_id NULL) pro Person+Kostenstelle,
-- höchstens ein Eintrag pro Person+Kostenstelle+konkretem Team.
create unique index if not exists kostenstelle_access_team_unique
  on kostenstelle_access (user_id, kostenstelle_code, team_id) where team_id is not null;
create unique index if not exists kostenstelle_access_wildcard_unique
  on kostenstelle_access (user_id, kostenstelle_code) where team_id is null;

-- Migration: freigegebene Personen, die noch NIE einen Zugriffs-Eintrag
-- hatten, bekommen einmalig automatisch Vollzugriff (alle Teams) auf die
-- bisherige Kostenstelle, damit sich für die heutige Nutzung nichts
-- ändert. Bewusst nur für Personen ohne jeden bestehenden Eintrag - sonst
-- würde ein erneutes Ausführen dieses Skripts eine später über die
-- Verwaltungsoberfläche gezielt auf einzelne Teams eingeschränkte Person
-- bei jedem Lauf wieder auf Vollzugriff zurücksetzen.
insert into kostenstelle_access (user_id, kostenstelle_code, team_id, access_level)
select p.id, '050005 CO', null, 'write'
from profiles p
where p.is_approved = true
  and not exists (select 1 from kostenstelle_access a2 where a2.user_id = p.id)
on conflict (user_id, kostenstelle_code) where team_id is null do nothing;

-- cascade: bestehende Policies auf processes/ideas hängen noch an der alten
-- Signatur (Kostenstelle + Team-Name) - die werden hier mitgelöscht und
-- weiter unten mit der neuen Version (Kostenstelle + Team-ID) neu angelegt.
drop function if exists can_read_kostenstelle(text, text) cascade;
drop function if exists can_write_kostenstelle(text, text) cascade;

create or replace function can_read_kostenstelle(ks text, tm uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select is_admin_user() or exists (
    select 1 from public.kostenstelle_access a
    where a.user_id = auth.uid() and a.kostenstelle_code = ks
      and (a.team_id is null or a.team_id = tm)
  );
$$;

create or replace function can_write_kostenstelle(ks text, tm uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select is_admin_user() or exists (
    select 1 from public.kostenstelle_access a
    where a.user_id = auth.uid() and a.kostenstelle_code = ks
      and (a.team_id is null or a.team_id = tm) and a.access_level = 'write'
  );
$$;

-- Wer Vollzugriff (Schreiben, alle Teams) auf eine Kostenstelle hat, darf
-- deren Teams anlegen/umbenennen/löschen - wer nur auf einzelne Teams
-- Zugriff hat, darf das nicht.
create or replace function can_manage_teams(ks text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select is_admin_user() or exists (
    select 1 from public.kostenstelle_access a
    where a.user_id = auth.uid() and a.kostenstelle_code = ks
      and a.team_id is null and a.access_level = 'write'
  );
$$;

alter table kostenstellen enable row level security;

drop policy if exists "Kostenstellen: select for approved users" on kostenstellen;
create policy "Kostenstellen: select for approved users"
  on kostenstellen for select
  using (is_approved_user());

drop policy if exists "Kostenstellen: admin manage" on kostenstellen;
create policy "Kostenstellen: admin manage"
  on kostenstellen for all
  using (is_admin_user())
  with check (is_admin_user());

alter table teams enable row level security;

drop policy if exists "Teams: select for approved users" on teams;
create policy "Teams: select for approved users"
  on teams for select
  using (is_approved_user());

drop policy if exists "Teams: manage with full kostenstelle access" on teams;
create policy "Teams: manage with full kostenstelle access"
  on teams for all
  using (can_manage_teams(kostenstelle_code))
  with check (can_manage_teams(kostenstelle_code));

alter table kostenstelle_access enable row level security;

drop policy if exists "Access: select own" on kostenstelle_access;
create policy "Access: select own"
  on kostenstelle_access for select
  using (user_id = auth.uid());

drop policy if exists "Access: admin manage" on kostenstelle_access;
create policy "Access: admin manage"
  on kostenstelle_access for all
  using (is_admin_user())
  with check (is_admin_user());

-- Prozesse: alle Abläufe eines Bereichs, die auf AI-Potenzial geprüft werden.
create table if not exists processes (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  department text not null default '',
  description text not null default '',
  ai_potential smallint not null default 3 check (ai_potential between 1 and 5),
  realized_potential smallint not null default 0 check (realized_potential between 0 and 100),
  notes text not null default '',
  status text not null default 'open'
    check (status in ('open', 'reviewed')),
  parent_process_id uuid references processes (id) on delete set null
);

-- Für Projekte, die die processes-Tabelle schon vor der Teilprozess-
-- Verknüpfung angelegt hatten: Spalte nachträglich ergänzen.
alter table processes add column if not exists parent_process_id uuid references processes (id) on delete set null;

-- Anteil des AI-Potenzials, der bereits gehoben wurde (0-100%) - separat vom
-- Potenzial selbst, damit sichtbar wird, wo noch freies Potenzial liegt.
alter table processes add column if not exists realized_potential smallint not null default 0 check (realized_potential between 0 and 100);

-- Abteilung (= Kostenstelle, siehe oben) ist Pflichtfeld (Dropdown in der
-- App). Team ist ebenfalls Pflichtfeld, aber als team_id (siehe
-- teams-Tabelle oben) statt als Text - so wirkt eine Umbenennung eines
-- Teams automatisch auch bei bereits bestehenden Prozessen.
alter table processes add column if not exists team_id uuid references teams (id) on delete set null;

do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'processes' and column_name = 'team') then
    insert into teams (kostenstelle_code, name)
    select distinct department, team from processes
    where team <> '' and exists (select 1 from kostenstellen k where k.code = processes.department)
    on conflict (kostenstelle_code, name) do nothing;

    update processes p
    set team_id = t.id
    from teams t
    where t.kostenstelle_code = p.department and t.name = p.team and p.team_id is null and p.team <> '';

    alter table processes drop column team;
  end if;
end $$;

-- Zweisprachige Inhalte: optionale "_en"-Spalten für eine vom Admin auf
-- Zuruf im Chat gepflegte Übersetzung (siehe README "Zweisprachige
-- Inhalte"). Leer = noch keine Übersetzung hinterlegt, die App zeigt dann
-- automatisch das Original an.
alter table processes add column if not exists name_en text not null default '';
alter table processes add column if not exists description_en text not null default '';
alter table processes add column if not exists notes_en text not null default '';

-- Benutzerdefinierte Sortierung (Auf/Ab in der App) - "position" bestimmt
-- die Reihenfolge innerhalb der jeweiligen Geschwister-Ebene (gleiche
-- parent_process_id, Top-Level-Prozesse zählen dabei auch als eine
-- gemeinsame Ebene). Gleiches Prinzip wie bei process_steps oben.
alter table processes add column if not exists position integer not null default 0;

-- Einmalige Einsortierung nach bisherigem Anzeige-Datum (created_at), damit
-- der erste Lauf dieser Migration die bisherige Reihenfolge nicht
-- durcheinanderwirft. Läuft nur, solange noch nirgends manuell umsortiert
-- wurde (sonst gäbe es schon Zeilen mit position <> 0).
do $$
begin
  if not exists (select 1 from processes where position <> 0) then
    update processes p
    set position = ranked.rn
    from (
      select id, row_number() over (
        partition by parent_process_id
        order by created_at asc
      ) - 1 as rn
      from processes
    ) ranked
    where ranked.id = p.id;
  end if;
end $$;

create index if not exists processes_parent_position_idx on processes (parent_process_id, position);

drop trigger if exists processes_set_updated_at on processes;
create trigger processes_set_updated_at
  before update on processes
  for each row
  execute function set_updated_at();

alter table processes enable row level security;

drop policy if exists "Processes: select for logged in users" on processes;
drop policy if exists "Processes: select for approved users" on processes;
drop policy if exists "Processes: select with kostenstelle access" on processes;
create policy "Processes: select with kostenstelle access"
  on processes for select
  using (is_approved_user() and can_read_kostenstelle(department, team_id));

drop policy if exists "Processes: insert for logged in users" on processes;
drop policy if exists "Processes: insert for approved users" on processes;
drop policy if exists "Processes: insert with kostenstelle access" on processes;
create policy "Processes: insert with kostenstelle access"
  on processes for insert
  with check (is_approved_user() and can_write_kostenstelle(department, team_id));

drop policy if exists "Processes: update for logged in users" on processes;
drop policy if exists "Processes: update for approved users" on processes;
drop policy if exists "Processes: update with kostenstelle access" on processes;
create policy "Processes: update with kostenstelle access"
  on processes for update
  using (is_approved_user() and can_write_kostenstelle(department, team_id))
  with check (is_approved_user() and can_write_kostenstelle(department, team_id));

drop policy if exists "Processes: delete for logged in users" on processes;
drop policy if exists "Processes: delete for approved users" on processes;
drop policy if exists "Processes: delete with kostenstelle access" on processes;
create policy "Processes: delete with kostenstelle access"
  on processes for delete
  using (is_approved_user() and can_write_kostenstelle(department, team_id));

-- Ideen / AI Use Cases
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  quick_note text not null,
  description text not null default '',
  tags text not null default '',
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'done', 'discarded')),
  impact smallint not null default 3 check (impact between 1 and 5),
  feasibility smallint not null default 3 check (feasibility between 1 and 5),
  effort smallint not null default 3 check (effort between 1 and 5),
  risk smallint not null default 3 check (risk between 1 and 5),
  tools text not null default '',
  considerations text not null default '',
  initial_prompt text not null default '',
  process_id uuid references processes (id) on delete set null
);

-- Für Projekte, die die ideas-Tabelle schon vor der Prozess-Verknüpfung
-- angelegt hatten: Spalte nachträglich ergänzen.
alter table ideas add column if not exists process_id uuid references processes (id) on delete set null;

-- Migration: Status "idea" ("Idee") und "evaluating" ("In Bewertung")
-- entfallen (siehe js/app.js STATUS_ORDER) - bestehende Zeilen in diesen
-- Status werden nach "planned" ("Geplant / PoC") verschoben, bevor der
-- neue Check-Constraint angezogen wird.
update ideas set status = 'planned' where status in ('idea', 'evaluating');
alter table ideas drop constraint if exists ideas_status_check;
alter table ideas add constraint ideas_status_check
  check (status in ('planned', 'in_progress', 'done', 'discarded'));
alter table ideas alter column status set default 'planned';

-- Abteilung (= Kostenstelle) / Team sind Pflichtfelder (Dropdown in der
-- App, siehe Hinweis bei der processes-Tabelle oben).
alter table ideas add column if not exists department text not null default '';
alter table ideas add column if not exists team_id uuid references teams (id) on delete set null;

do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'ideas' and column_name = 'team') then
    insert into teams (kostenstelle_code, name)
    select distinct department, team from ideas
    where team <> '' and exists (select 1 from kostenstellen k where k.code = ideas.department)
    on conflict (kostenstelle_code, name) do nothing;

    update ideas i
    set team_id = t.id
    from teams t
    where t.kostenstelle_code = i.department and t.name = i.team and i.team_id is null and i.team <> '';

    alter table ideas drop column team;
  end if;
end $$;

-- Zusätzliche, optionale Felder für den Abgleich mit dem bestehenden
-- Excel-Use-Case-Katalog (Import/Export). Dropdown-Werte werden wie bei
-- Abteilung/Team nur in js/app.js gepflegt, nicht als DB-Constraint.
alter table ideas add column if not exists ai_role text not null default '';
alter table ideas add column if not exists input_source text not null default '';
alter table ideas add column if not exists output_result text not null default '';
alter table ideas add column if not exists kpi_kind text not null default '';
alter table ideas add column if not exists quantified_benefit text not null default '';
alter table ideas add column if not exists qualitative_benefit text not null default '';
alter table ideas add column if not exists comment text not null default '';
alter table ideas add column if not exists list_priority text not null default 'Low';

-- Migration: list_priority folgt jetzt zwingend dem Status (siehe
-- js/app.js LIST_PRIORITY_FORCED_BY_STATUS): "done" ("Integrated") ->
-- "in using", "discarded" ("Verworfen") -> "ungültig", alle anderen Status
-- nur High/Medium/Low (Default "Low"). Bestehende Zeilen werden vor dem
-- Check-Constraint entsprechend nachgezogen.
update ideas set list_priority = 'in using' where status = 'done' and list_priority <> 'in using';
update ideas set list_priority = 'ungültig' where status = 'discarded' and list_priority <> 'ungültig';
update ideas set list_priority = 'Low' where status not in ('done', 'discarded') and list_priority not in ('High', 'Medium', 'Low');
alter table ideas alter column list_priority set default 'Low';
alter table ideas drop constraint if exists ideas_list_priority_status_check;
alter table ideas add constraint ideas_list_priority_status_check
  check (
    (status = 'done' and list_priority = 'in using')
    or (status = 'discarded' and list_priority = 'ungültig')
    or (status not in ('done', 'discarded') and list_priority in ('High', 'Medium', 'Low'))
  );

-- Spalte "Systeme" des Excel-Katalogs (zwischen "KI Lösung" und "Input" -
-- eigene Spalte, kein Teil von "tools"). "skill_level" entspricht der
-- gleichnamigen Spalte ganz rechts im Katalog (z.B. "Skill 2 - Ambassador"),
-- die dort nur vereinzelt gepflegt wird - daher Freitext statt Dropdown.
alter table ideas add column if not exists systeme text not null default '';
alter table ideas add column if not exists skill_level text not null default '';

-- Die übrigen rechten Katalog-Spalten ("Änderungsstatus", "Geändert von",
-- "Änderungsdatum", "Was wurde geändert") werden bewusst NICHT als eigene
-- Felder abgebildet: Sie stehen in der Liste bei keiner einzigen der 32
-- bestehenden Zeilen befüllt (Stand 2026-08), sind also totes Gewicht.
-- Für den Update-Export (siehe js/app.js buildUpdateRow) werden sie
-- stattdessen zur Laufzeit erzeugt: Änderungsdatum aus "updated_at",
-- Geändert von aus der eingeloggten Nutzer-E-Mail, Änderungsstatus als
-- fixer Text "geändert" - "Was wurde geändert" bleibt leer.

-- Eindeutige ID aus dem Excel-Katalog (z.B. "GC29"), für den Abgleich
-- zwischen App und Liste. Nullable, da nur importierte Ideen eine haben;
-- ein Unique-Index statt eines Constraints, damit "add ... if not exists"
-- funktioniert (mehrere NULLs sind dabei weiterhin erlaubt).
alter table ideas add column if not exists catalog_id text;
create unique index if not exists ideas_catalog_id_key on ideas (catalog_id);

-- Ansprechpartner/in für den Use Case (freier Name, keine Verknüpfung zu
-- einem Nutzerkonto).
alter table ideas add column if not exists owner_name text not null default '';

-- Freitext-Notiz: Kopie der Antwort einer KI auf den in der App erzeugten
-- Start-Prompt (siehe js/app.js buildKickoffPrompt), rein zur Dokumentation.
-- Wird von der App nicht ausgewertet oder in andere Felder übernommen.
alter table ideas add column if not exists ai_plan_notes text not null default '';

-- "description" war ein einziges Freitextfeld für Problem/Ziel/Business
-- Benefit zusammen - der Excel-Katalog braucht die drei aber als getrennte
-- Spalten (sonst muss man beim Export jedes Mal raten, wie der Text
-- aufzuteilen ist). Deshalb drei eigene Felder; bestehender Text aus
-- "description" wandert einmalig komplett ins neue "problem"-Feld, "goal"
-- und "business_benefit" bleiben erstmal leer zum späteren Nachpflegen.
alter table ideas add column if not exists problem text not null default '';
alter table ideas add column if not exists goal text not null default '';
alter table ideas add column if not exists business_benefit text not null default '';

update ideas set problem = description where problem = '' and description <> '';

-- Stufenkette: ein Use Case ist oft nur der erste Schritt einer mehrstufigen
-- Weiterentwicklung (z.B. GC12 -> GC13 -> GC14). "parent_idea_id" verweist auf
-- die jeweils vorherige Stufe; die Stufennummer und die Folgestufen werden in
-- js/app.js aus dieser Kette berechnet, nicht separat gespeichert.
alter table ideas add column if not exists parent_idea_id uuid references ideas (id) on delete set null;
create index if not exists ideas_parent_idea_id_idx on ideas (parent_idea_id);

-- Zweisprachige Inhalte: optionale "_en"-Spalten für eine vom Admin auf
-- Zuruf im Chat gepflegte Übersetzung (siehe README "Zweisprachige
-- Inhalte"). Leer = noch keine Übersetzung hinterlegt, die App zeigt dann
-- automatisch das Original an.
alter table ideas add column if not exists quick_note_en text not null default '';
alter table ideas add column if not exists problem_en text not null default '';
alter table ideas add column if not exists goal_en text not null default '';
alter table ideas add column if not exists business_benefit_en text not null default '';
alter table ideas add column if not exists considerations_en text not null default '';
alter table ideas add column if not exists qualitative_benefit_en text not null default '';
alter table ideas add column if not exists comment_en text not null default '';

drop trigger if exists ideas_set_updated_at on ideas;
create trigger ideas_set_updated_at
  before update on ideas
  for each row
  execute function set_updated_at();

-- Row Level Security: nur freigegebene Personen mit passendem
-- Kostenstellen-/Team-Zugriff (siehe oben) sehen/bearbeiten Ideen.
alter table ideas enable row level security;

drop policy if exists "Ideas: select for logged in users" on ideas;
drop policy if exists "Ideas: select for approved users" on ideas;
drop policy if exists "Ideas: select with kostenstelle access" on ideas;
create policy "Ideas: select with kostenstelle access"
  on ideas for select
  using (is_approved_user() and can_read_kostenstelle(department, team_id));

drop policy if exists "Ideas: insert for logged in users" on ideas;
drop policy if exists "Ideas: insert for approved users" on ideas;
drop policy if exists "Ideas: insert with kostenstelle access" on ideas;
create policy "Ideas: insert with kostenstelle access"
  on ideas for insert
  with check (is_approved_user() and can_write_kostenstelle(department, team_id));

drop policy if exists "Ideas: update for logged in users" on ideas;
drop policy if exists "Ideas: update for approved users" on ideas;
drop policy if exists "Ideas: update with kostenstelle access" on ideas;
create policy "Ideas: update with kostenstelle access"
  on ideas for update
  using (is_approved_user() and can_write_kostenstelle(department, team_id))
  with check (is_approved_user() and can_write_kostenstelle(department, team_id));

drop policy if exists "Ideas: delete for logged in users" on ideas;
drop policy if exists "Ideas: delete for approved users" on ideas;
drop policy if exists "Ideas: delete with kostenstelle access" on ideas;
create policy "Ideas: delete with kostenstelle access"
  on ideas for delete
  using (is_approved_user() and can_write_kostenstelle(department, team_id));

-- ============================================================
-- Prozessschritte: geordnete Kette statt freiem Diagramm (bewusste
-- Entscheidung, siehe README) - "position" bestimmt die Reihenfolge,
-- Umsortieren tauscht die position zweier benachbarter Schritte. Der
-- Zugriff hängt am Elternprozess (department/team_id), deshalb per
-- Subquery auf "processes" statt eigener Kostenstelle/Team-Spalte.
-- ============================================================
create table if not exists process_steps (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references processes (id) on delete cascade,
  position integer not null default 0,
  step_type text not null default 'step' check (step_type in ('start', 'step', 'decision', 'end')),
  title text not null default '',
  description text not null default '',
  ai_potential smallint not null default 3 check (ai_potential between 1 and 5),
  ai_potential_note text not null default '',
  realized_potential smallint not null default 0 check (realized_potential between 0 and 100),
  created_at timestamptz not null default now()
);

-- Für Installationen, bei denen process_steps schon vor der
-- AI-Potenzial-Einschätzung pro Schritt angelegt wurde: Spalten
-- nachträglich ergänzen.
alter table process_steps add column if not exists ai_potential smallint not null default 3 check (ai_potential between 1 and 5);
alter table process_steps add column if not exists ai_potential_note text not null default '';

-- Anteil des AI-Potenzials, der auf dieser Schrittebene bereits gehoben
-- wurde (0-100%), analog zu processes.realized_potential.
alter table process_steps add column if not exists realized_potential smallint not null default 0 check (realized_potential between 0 and 100);

-- Drill-down: ein grober Schritt kann auf einen (bereits als Teilprozess
-- angelegten) Detailprozess verweisen, der diesen Schritt genauer
-- dokumentiert. Bewusst kein neues Konzept, sondern eine Verknüpfung auf
-- die bestehende Teilprozess-Beziehung (parent_process_id) - deshalb kein
-- eigener Check auf "gehört wirklich zu diesem Prozess", das regelt allein
-- die App (Dropdown zeigt nur die eigenen Teilprozesse).
alter table process_steps add column if not exists linked_process_id uuid references processes (id) on delete set null;

-- Freitext statt Zahl: "position" (siehe oben) bestimmt weiterhin die
-- tatsächliche Reihenfolge/Sortierung, "step_number" ist nur ein von Hand
-- gepflegtes Anzeige-Label - so lassen sich parallel laufende Schritte
-- z.B. als "2.1", "2.2", "2.3" kennzeichnen, ohne eine echte
-- Verzweigungslogik im Datenmodell zu brauchen.
alter table process_steps add column if not exists step_number text not null default '';

create index if not exists process_steps_process_id_idx on process_steps (process_id, position);

alter table process_steps enable row level security;

drop policy if exists "Process steps: select with kostenstelle access" on process_steps;
create policy "Process steps: select with kostenstelle access"
  on process_steps for select
  using (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_read_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process steps: insert with kostenstelle access" on process_steps;
create policy "Process steps: insert with kostenstelle access"
  on process_steps for insert
  with check (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process steps: update with kostenstelle access" on process_steps;
create policy "Process steps: update with kostenstelle access"
  on process_steps for update
  using (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ))
  with check (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process steps: delete with kostenstelle access" on process_steps;
create policy "Process steps: delete with kostenstelle access"
  on process_steps for delete
  using (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

-- ============================================================
-- Schritt <-> Use Case: markiert, bei welchen Prozessschritten welcher
-- (dem Gesamtprozess bereits zugeordnete) Use Case tatsächlich zum Einsatz
-- kommt. Bewusst keine neue Verknüpfung, sondern nur ein Flag auf die
-- bestehende Beziehung "ideas.process_id" - ein Use Case muss also schon
-- am Gesamtprozess hängen, bevor er an einem Schritt markiert werden kann.
-- ============================================================
create table if not exists process_step_ideas (
  step_id uuid not null references process_steps (id) on delete cascade,
  idea_id uuid not null references ideas (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (step_id, idea_id)
);

alter table process_step_ideas enable row level security;

drop policy if exists "Process step ideas: select with kostenstelle access" on process_step_ideas;
create policy "Process step ideas: select with kostenstelle access"
  on process_step_ideas for select
  using (is_approved_user() and exists (
    select 1 from process_steps ps join processes pr on pr.id = ps.process_id
    where ps.id = step_id and can_read_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process step ideas: insert with kostenstelle access" on process_step_ideas;
create policy "Process step ideas: insert with kostenstelle access"
  on process_step_ideas for insert
  with check (is_approved_user() and exists (
    select 1 from process_steps ps join processes pr on pr.id = ps.process_id
    where ps.id = step_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process step ideas: update with kostenstelle access" on process_step_ideas;
create policy "Process step ideas: update with kostenstelle access"
  on process_step_ideas for update
  using (is_approved_user() and exists (
    select 1 from process_steps ps join processes pr on pr.id = ps.process_id
    where ps.id = step_id and can_write_kostenstelle(pr.department, pr.team_id)
  ))
  with check (is_approved_user() and exists (
    select 1 from process_steps ps join processes pr on pr.id = ps.process_id
    where ps.id = step_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process step ideas: delete with kostenstelle access" on process_step_ideas;
create policy "Process step ideas: delete with kostenstelle access"
  on process_step_ideas for delete
  using (is_approved_user() and exists (
    select 1 from process_steps ps join processes pr on pr.id = ps.process_id
    where ps.id = step_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

-- ============================================================
-- Dokumente & Links: reine URL-Liste (z.B. Link zu einer Datei in
-- SharePoint/Teams/OneDrive oder eine Webseite) statt echtem
-- Datei-Upload - braucht deshalb keinen eigenen Storage-Bucket (bewusste
-- Entscheidung, siehe README).
-- ============================================================
create table if not exists process_resources (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references processes (id) on delete cascade,
  kind text not null default 'link' check (kind in ('link', 'document')),
  label text not null default '',
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists process_resources_process_id_idx on process_resources (process_id);

alter table process_resources enable row level security;

drop policy if exists "Process resources: select with kostenstelle access" on process_resources;
create policy "Process resources: select with kostenstelle access"
  on process_resources for select
  using (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_read_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process resources: insert with kostenstelle access" on process_resources;
create policy "Process resources: insert with kostenstelle access"
  on process_resources for insert
  with check (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process resources: update with kostenstelle access" on process_resources;
create policy "Process resources: update with kostenstelle access"
  on process_resources for update
  using (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ))
  with check (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

drop policy if exists "Process resources: delete with kostenstelle access" on process_resources;
create policy "Process resources: delete with kostenstelle access"
  on process_resources for delete
  using (is_approved_user() and exists (
    select 1 from processes pr where pr.id = process_id and can_write_kostenstelle(pr.department, pr.team_id)
  ));

-- ============================================================
-- Weitere Prozesse pro Use Case: "ideas.process_id" bleibt der eine
-- Prozess, der die Stufenkette (Vorgänger-/Nachfolger-Stufen, siehe oben)
-- bestimmt. Zusätzlich soll sich derselbe Use Case aber auch bei anderen
-- Prozessen als verknüpft zeigen lassen (n:m), ohne die Stufenkette
-- anzufassen - deshalb eine reine Zusatz-Verknüpfungstabelle statt eines
-- Umbaus von process_id. Zugriff hängt (wie bei "ideas" selbst) an der
-- Kostenstelle/Team der Idee, nicht des zusätzlichen Prozesses.
-- ============================================================
create table if not exists idea_processes (
  idea_id uuid not null references ideas (id) on delete cascade,
  process_id uuid not null references processes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, process_id)
);

create index if not exists idea_processes_process_id_idx on idea_processes (process_id);

alter table idea_processes enable row level security;

drop policy if exists "Idea processes: select with kostenstelle access" on idea_processes;
create policy "Idea processes: select with kostenstelle access"
  on idea_processes for select
  using (is_approved_user() and exists (
    select 1 from ideas i where i.id = idea_id and can_read_kostenstelle(i.department, i.team_id)
  ));

drop policy if exists "Idea processes: insert with kostenstelle access" on idea_processes;
create policy "Idea processes: insert with kostenstelle access"
  on idea_processes for insert
  with check (is_approved_user() and exists (
    select 1 from ideas i where i.id = idea_id and can_write_kostenstelle(i.department, i.team_id)
  ));

drop policy if exists "Idea processes: delete with kostenstelle access" on idea_processes;
create policy "Idea processes: delete with kostenstelle access"
  on idea_processes for delete
  using (is_approved_user() and exists (
    select 1 from ideas i where i.id = idea_id and can_write_kostenstelle(i.department, i.team_id)
  ));

-- ============================================================
-- Nutzungs-Tracking: pro tatsächlichem Öffnen der App mit gültiger Session
-- ein Datensatz (Supabase-Events "INITIAL_SESSION" und "SIGNED_IN" - siehe
-- init() in js/app.js; ein bloßer Token-Refresh im Hintergrund zählt
-- bewusst nicht) - Grundlage für die Nutzerstatistik im Admin-Bereich
-- (zuletzt aktiv, Anzahl App-Aufrufe pro Person über die Zeit). Jede
-- freigegebene Person darf nur ihre eigene Zeile anlegen; lesen dürfen nur
-- Admins, da die Auswertung eine reine Admin-Funktion ist.
-- ============================================================
create table if not exists login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists login_events_user_id_idx on login_events (user_id, created_at);

alter table login_events enable row level security;

drop policy if exists "Login events: insert own" on login_events;
create policy "Login events: insert own"
  on login_events for insert
  with check (is_approved_user() and user_id = auth.uid());

drop policy if exists "Login events: admin select all" on login_events;
create policy "Login events: admin select all"
  on login_events for select
  using (is_admin_user());

-- ============================================================
-- App-Feedback (Kachel "Feedback" unter Verwaltung & mehr): freigegebene
-- Personen bewerten die App per Schieberegler (1-5) in mehreren Kategorien
-- und können optional Freitext hinterlassen. Wie bei login_events oben darf
-- jede Person nur ihre eigene Zeile anlegen; lesen dürfen nur Admins.
-- ============================================================
create table if not exists app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  rating_usability smallint not null check (rating_usability between 1 and 5),
  rating_design smallint not null check (rating_design between 1 and 5),
  rating_features smallint not null check (rating_features between 1 and 5),
  rating_performance smallint not null check (rating_performance between 1 and 5),
  comment text not null default ''
);

create index if not exists app_feedback_created_at_idx on app_feedback (created_at desc);

alter table app_feedback enable row level security;

drop policy if exists "App feedback: insert own" on app_feedback;
create policy "App feedback: insert own"
  on app_feedback for insert
  with check (is_approved_user() and user_id = auth.uid());

drop policy if exists "App feedback: admin select all" on app_feedback;
create policy "App feedback: admin select all"
  on app_feedback for select
  using (is_admin_user());
