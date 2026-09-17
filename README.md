# Process- & AI-Usecase Management

Eine kleine App, um die Prozesse eures Bereichs zu dokumentieren, sie auf
AI-Potenzial zu prüfen und AI-Use-Case-Ideen sekundenschnell zu erfassen,
euren Prozessen zuzuordnen und später mit KI-Unterstützung zu bewerten und
auszuarbeiten. Läuft als Web-App, die man sich aufs Handy holt wie eine
normale App (kein App Store nötig).

Es gibt **keinen eigenen Server**, den ihr betreiben müsst – nur zwei fertige
Bausteine, die einmalig eingerichtet werden:

1. **Supabase** (kostenloser Baukasten für Login + Datenbank)
2. **GitHub Pages** (kostenloses Hosting für diese Web-App)

Die Einrichtung dauert einmalig ca. 15–20 Minuten. Danach nutzt ihr die App
einfach.

---

## Schritt 1: Supabase-Projekt anlegen

1. Gehe auf [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto.
2. Klicke auf **"New Project"**. Name frei wählbar (z.B. `ai-ideen`), Passwort merken/notieren.
3. Warte, bis das Projekt fertig eingerichtet ist (ca. 2 Minuten).

## Schritt 2: Datenbank einrichten

1. Klicke links im Menü auf **"SQL Editor"**.
2. Öffne die Datei [`supabase/schema.sql`](supabase/schema.sql) aus diesem Projekt, kopiere den
   gesamten Inhalt und füge ihn im SQL Editor ein.
3. Klicke auf **"Run"**. Das legt die Tabelle für die Ideen an.
4. Gehe links auf **"Project Settings" -> "API"**. Dort findest du:
   - **Project URL**
   - **anon public** Key
5. Öffne die Datei [`js/config.js`](js/config.js) in diesem Projekt und trage beide Werte ein:

   ```js
   window.APP_CONFIG = {
     SUPABASE_URL: "https://xxxxxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOi...",
   };
   ```

## Schritt 3: App online stellen (GitHub Pages)

GitHub Pages ist bei privaten Repos nur mit einem kostenpflichtigen
GitHub-Plan möglich. Ist euer Repo privat und ihr habt keinen solchen Plan,
müsst ihr es zuerst öffentlich machen (Settings -> ganz unten "Danger Zone"
-> "Change visibility"). Im Code liegen keine Geheimnisse (der anon-Key ist
bewusst öffentlich nutzbar, siehe Schritt 2), das ist also unbedenklich.

1. Auf GitHub im Repository: **Settings -> Pages**.
2. Bei "Source" den Branch auswählen, auf dem dieser Code liegt (aktuell
   `claude/ai-usecase-collection-app-ldxcdk`, nach dem Zusammenführen ggf. `main`), Ordner `/ (root)`.
3. Speichern. Nach 1–2 Minuten ist die App unter der angezeigten Adresse
   erreichbar (z.B. `https://dein-name.github.io/dein-repo/`). Diese Adresse
   brauchst du gleich in Schritt 4.

## Schritt 4: Login-Adresse bei Supabase eintragen

Relevant, sobald irgendein Auth-Link per E-Mail versendet wird (z.B. bei
einem später ergänzten eigenen SMTP-Dienst, siehe Schritt 5) – ohne
diesen Schritt würde ein solcher Link auf eine falsche Adresse
("localhost") zeigen statt in eure App. Mit dem Standard-Ablauf ohne
eigenen SMTP-Dienst schickt die App aktuell keine solchen Links; diesen
Schritt kannst du also auch erst später nachholen.

1. Im Supabase-Dashboard zu **Authentication -> URL Configuration**.
2. **Site URL** auf die Adresse aus Schritt 3 setzen, z.B.
   `https://dein-name.github.io/dein-repo/`.
3. Unter **Redirect URLs** eine Zeile hinzufügen:
   `https://dein-name.github.io/dein-repo/**`
4. Speichern.

## Schritt 5: Registrierung schließen – Konten nur durch dich anlegen

**Sicherheitshintergrund:** Solange Supabase keine Bestätigungsmail
verschicken kann (siehe unten), prüft niemand, ob die Person, die sich
registriert, wirklich Zugriff auf die eingetippte Adresse hat. Die
Domain-Sperre verhindert nur fremde Domains – ein erfundener Name wie
`chef@house-of-communication.com` würde die Sperre trotzdem passieren.
Deshalb gibt es in der App gar keine offene Registrierung mehr: Kolleg:innen
können nur noch **Zugang anfragen** (Mail/Teams an dich), das Konto legst
du danach selbst an, nachdem du die Person über einen dir bekannten,
vertrauten Kanal identifiziert hast (z.B. Namenssuche im Teams-/
Outlook-Firmenverzeichnis – nicht einfach die im Request angegebene
Adresse blind übernehmen).

1. Im Supabase-Dashboard zu **Authentication -> Sign In / Providers ->
   Email**.
2. **"Confirm email"** deaktivieren und speichern (Supabases eingebauter
   Mailversand ohne eigenen SMTP-Server verschickt Auth-Mails ohnehin nur
   an Adressen, die selbst Mitglied eurer Supabase-Organisation sind –
   diese Einstellung ist für von dir angelegte Konten nicht mehr relevant,
   schadet aber nicht).
3. Direkt darüber/darunter die Option zum offenen Registrieren
   deaktivieren – je nach Dashboard-Version heißt sie **"Allow new users
   to sign up"** oder **"Enable email signups"**. Damit ist der komplette
   öffentliche Registrierungs-Endpunkt geschlossen, nicht nur der Button
   in der App – niemand kann sich mehr selbst ein Konto anlegen, auch nicht
   über einen direkten API-Aufruf an Supabase vorbei an der App.

Ab jetzt läuft die Aufnahme neuer Kolleg:innen in drei Schritten:

1. **Anfrage erhalten**: Die Person tippt in der App auf "Zugang
   anfragen" – das öffnet eine vorausgefüllte Mail an dich (oder sie
   schreibt dir direkt in Teams) mit Name, gewünschter E-Mail-Adresse und
   den benötigten Kostenstelle(n)/Team(s) zum Ausfüllen.
2. **Identität prüfen**: Bevor du irgendetwas anlegst, prüfe über einen
   dir vertrauten Kanal, dass es sich wirklich um die angegebene Person
   handelt – z.B. sie im Teams-/Outlook-Firmenverzeichnis nach Namen
   suchen und die dort hinterlegte Adresse mit der angefragten
   vergleichen, statt die selbst eingetippte Adresse blind zu übernehmen.
3. **Konto anlegen** im 🛡 Admin-Bereich der App (Karte "Neuen User
   anlegen") – dafür einmalig die zugehörige Edge Function deployen, siehe
   "Einmalige Einrichtung" gleich unten. Danach:
   1. E-Mail-Adresse eintragen, mit **"🎲 Generieren"** ein Start-Passwort
      erzeugen (oder selbst eins eintippen) und auf **"Konto anlegen"**
      tippen. Läuft komplett ohne Mailversand und ohne dass du irgendeinen
      Key selbst anfassen musst – die App ruft dafür die Edge Function auf,
      die den geheimen `service_role`-Key serverseitig verwendet.
   2. Das Start-Passwort über den gleichen (verifizierten) Kanal an die
      Person weitergeben. Sie kann es nach dem Einloggen unter
      ⚙ Einstellungen selbst durch ein eigenes ersetzen.
   3. Mit **"🔑 Testen"** neben dem neuen Eintrag lässt sich das Konto in
      einem eigenen Tab direkt ausprobieren (z.B. um zu prüfen, dass Freigabe
      und Kostenstellen-Zugriff wie gewünscht wirken) – ohne das Passwort zu
      kennen und ohne dich selbst auszuloggen. Der Tab ist deutlich als
      Test-Login markiert; einfach schließen, um ihn zu beenden. Am
      zuverlässigsten in einem normalen Desktop-Browser (nicht in der aufs
      Handy installierten App-Version) – manche mobilen Browser blockieren
      das automatische Öffnen eines neuen Tabs.
   4. Im gleichen 🛡 Admin-Bereich wartet danach automatisch ein neuer
      Eintrag (der `handle_new_user`-Trigger legt bei jedem neuen Konto ein
      Profil an) – dort noch auf **"Freigeben"** tippen. Das ist bewusst
      ein zweiter, unabhängiger Schritt (Konto anlegen + Freigeben), auch
      wenn du die Person schon geprüft hast – doppelte Absicherung, falls
      die Registrierung versehentlich doch mal wieder offen sein sollte.
   5. Direkt im selben Bereich außerdem die in der Anfrage genannte(n)
      Kostenstelle(n)/Team(s) mit dem passenden Zugriffslevel zuweisen
      (siehe "Kostenstellen- & Team-Zugriff" weiter unten) – ohne das
      sieht die Person trotz Freigabe erstmal eine leere Liste.

   **Einmalige Einrichtung der Edge Function** (nur beim ersten Mal nötig):
   1. [Supabase CLI installieren](https://supabase.com/docs/guides/cli),
      dann auf deinem eigenen Rechner im Terminal (nicht in der App):
      ```
      supabase login
      supabase link --project-ref <project-ref>
      supabase functions deploy admin-users
      ```
      (`<project-ref>` steht in der Supabase-Projekt-URL,
      `https://<project-ref>.supabase.co`.) `SUPABASE_URL`,
      `SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` stehen der Function
      danach automatisch zur Verfügung – dafür ist nichts weiter
      einzurichten, und der `service_role`-Key landet dabei zu keinem
      Zeitpunkt im Browser.
   2. Fertig – ab jetzt reicht "Konto anlegen" in der App, ohne dass du
      diesen Schritt je wiederholen müsstest (nur nach einer Änderung an
      `supabase/functions/admin-users/index.ts` erneut deployen).

   **Alternative ganz ohne Edge Function** (z.B. für das allererste, eigene
   Admin-Konto bei einer Neuinstallation, oder falls du die Function nicht
   deployen willst): weiterhin direkt über die Supabase-Admin-API, wie
   bisher:
   1. Unter **Project Settings -> API** deinen **service_role**-Key
      kopieren (geheim halten, nirgends veröffentlichen, niemals mit
      Claude teilen).
   2. Auf deinem eigenen Rechner im Terminal (nicht in der App):
      ```
      curl -X POST 'https://<project-ref>.supabase.co/auth/v1/admin/users' \
        -H 'apikey: <service-role-key>' \
        -H 'Authorization: Bearer <service-role-key>' \
        -H 'Content-Type: application/json' \
        -d '{"email": "kollege@house-of-communication.com", "password": "EinStartPasswort123", "email_confirm": true}'
      ```
   3. Weiter wie oben ab Schritt 3.2 (Passwort weitergeben, Freigeben,
      Kostenstellen/Team zuweisen).

**Passwort vergessen** läuft nach demselben Prinzip komplett ohne
E-Mail-Versand durch Supabase: Der "Passwort vergessen?"-Button in der
App zeigt nur einen Hinweis, sich bei dir zu melden. Der
"Passwort zurücksetzen"-Button im Supabase-Dashboard selbst hilft dabei
*nicht*, der löst genau die blockierte Mail aus. Stattdessen setzt du das
Passwort direkt über die Admin-API:

1. Im **SQL Editor** die User-ID der Person ermitteln:
   ```sql
   select id from auth.users where email = 'kollege@house-of-communication.com';
   ```
2. Auf deinem eigenen Rechner im Terminal:
   ```
   curl -X PUT 'https://<project-ref>.supabase.co/auth/v1/admin/users/<user-id>' \
     -H 'apikey: <service-role-key>' \
     -H 'Authorization: Bearer <service-role-key>' \
     -H 'Content-Type: application/json' \
     -d '{"password": "EinTemporaeresPasswort123"}'
   ```
3. Das temporäre Passwort über den verifizierten Kanal weitergeben.

Optional für später: Mit einem eigenen SMTP-Dienst (z.B.
[Resend](https://resend.com), kostenlos für kleine Mengen) unter
**Authentication -> Sign In / Providers -> SMTP Provider** ließe sich
echter, automatischer E-Mail-Versand (Bestätigung, Passwort-Reset)
wieder aktivieren, ganz ohne Admin-Beteiligung bei jedem einzelnen Fall –
dann könnte auch "Allow new users to sign up" wieder aktiviert werden,
weil eine echte Bestätigungsmail dieselbe Identitätsprüfung übernehmen
würde.

## Schritt 6: App aufs Handy holen

1. Öffne den Link aus Schritt 3 im Handy-Browser (Safari bei iPhone, Chrome bei Android).
2. Tippe auf **"Zum Home-Bildschirm"** (iPhone) bzw. **"App installieren"** (Android).
3. Fertig – die App hat jetzt ein eigenes Icon auf dem Home-Bildschirm.

## Schritt 7: Login & Kollegen einladen

- Erstanmeldung: Es gibt keine offene Registrierung mehr (siehe Schritt 5).
  Kolleg:innen tippen auf **"Zugang anfragen"** – das öffnet eine
  vorausgefüllte Mail an dich (oder sie schreiben dir direkt in Teams).
  Du prüfst die Identität, legst das Konto im 🛡 Admin-Bereich an und
  gibst das Start-Passwort weiter (siehe Schritt 5) – die Person meldet
  sich damit an und kann es unter ⚙ Einstellungen selbst ändern.
- **Zugriff ist auf drei Arten geschützt:**
  1. **Kein offenes Self-Signup**: Registrierungen entstehen ausschließlich
     durch dich als Admin – über den 🛡 Admin-Bereich (bzw. dessen Edge
     Function) oder direkt über die Supabase-Admin-API – nachdem du die
     Person identifiziert hast – das schließt die frühere Lücke, dass sich
     theoretisch jede:r mit einer erfundenen
     `@house-of-communication.com`-Adresse hätte anmelden können.
  2. **Domain-Sperre**: Zusätzlich lässt die Datenbank ohnehin nur
     E-Mail-Adressen mit `@house-of-communication.com` zu (fest im
     Datenbank-Skript hinterlegt – bei einer anderen Firmendomain in
     `supabase/schema.sql` nach `house-of-communication` suchen und
     ersetzen) – als zweite Absicherung, falls das offene Signup doch mal
     aus Versehen wieder aktiviert wird.
  3. **Admin-Freigabe**: Auch ein von dir angelegtes Konto sieht zunächst
     keine Daten, sondern einen "Warten auf Freigabe"-Bildschirm. Der Admin
     (**d.goos@house-of-communication.com**, automatisch beim ersten Login
     als Admin markiert) sieht oben rechts einen Button **"🛡 Freigaben"**,
     dort die wartende Person freischalten – danach hat sie normalen
     Zugriff. Statt "Freigeben" kann der Admin auch **"Ablehnen"** wählen
     (mit Sicherheitsabfrage) – z.B. falls sich doch mal jemand über einen
     versehentlich offenen Signup-Endpunkt registriert hat. Das entfernt
     die Registrierung dauerhaft aus der Warteliste, die Person bleibt
     ohne Zugriff. Nicht rückgängig zu machen über die Oberfläche – nur
     über einen direkten Datenbank-Eingriff (`update profiles set
     is_rejected = false where email = '...'` im SQL Editor).
- Wächst das Team stark oder ihr braucht mehr/andere Teams, lässt sich das
  jederzeit direkt in der App anpassen (kein Code-Deploy nötig) – siehe
  "🧩 Teams" im Punkt "Kostenstellen- & Team-Zugriff" unten.

## Schritt 8: Supabase-Projekt wach halten (Free-Tier)

Supabase pausiert Projekte im kostenlosen Free-Tier automatisch nach **7
Tagen ohne API-Aktivität** – danach ist die App offline, bis jemand manuell
im Supabase-Dashboard auf "Restore" klickt. Bei einem internen Tool mit
sporadischer Nutzung (Urlaubszeit, ruhige Wochen) ist das der
wahrscheinlichste reale Ausfallgrund.

Dagegen gibt es die GitHub-Actions-Workflow-Datei
[`.github/workflows/keep-supabase-awake.yml`](.github/workflows/keep-supabase-awake.yml):
Sie schickt montags und donnerstags automatisch eine harmlose Anfrage an
die Supabase-REST-API (liest URL/Key direkt aus `js/config.js`, keine
zusätzliche Konfiguration nötig) und verhindert damit die Pause.

**Wichtig:** GitHub führt geplante ("schedule") Workflow-Läufe nur für
Dateien auf dem **Standard-Branch** des Repos aus (i.d.R. `main`). Liegt
diese Datei nur auf einem Feature-Branch, läuft sie nicht automatisch –
erst nach dem Mergen in den Standard-Branch. Manuelles Testen geht davon
unabhängig jederzeit über **Actions -> "Keep Supabase awake" -> "Run
workflow"**. Ob die geplanten Läufe tatsächlich feuern, siehst du im
gleichen Actions-Tab an den grünen Haken bzw. per E-Mail-Benachrichtigung,
falls ein Lauf fehlschlägt (z.B. weil das Projekt doch pausiert ist).

## KI-Unterstützung: Start-Prompt für die Umsetzungsplanung

Der Abschnitt "KI-Unterstützung" bei einer Idee (eingeklappt unter "Weitere
Katalog-Felder") erzeugt **keine** fertige Ausarbeitung von Problem/Ziel/
Business Benefit – die müssen vorher bereits von Hand ausgefüllt sein. Die
KI soll sie als gegeben nehmen, nicht neu erfinden (sonst zirkulärer
Bezug: man würde sie bitten, etwas neu zu erfinden, das man ihr gerade
selbst gegeben hat).

Stattdessen tippt man auf **"📋 Start-Prompt erzeugen"**: Die App baut daraus
einen Prompt, der eine KI bittet, mögliche Umsetzungswege einzuschätzen –
welche Tool-Stufe realistisch nötig ist (reicht ein einfacher Chat, ein
Cowork-artiges No-Code-Setup, oder braucht es einen echten
Coding-Assistenten?), welche Ausprägungen der Umsetzung denkbar sind, wo die
Grenzen/Risiken liegen, ob IT nötig ist oder es im Alleingang geht, und wie
es mit der Skalierbarkeit aussieht. Der erzeugte Text landet direkt im Feld
"Start-Prompt fürs Projekt" (inkl. Kopieren-Button) und wird 1:1 in ein
beliebiges KI-Chat-Tool eingefügt, das man ohnehin schon nutzt – Copilot,
ChatGPT, Claude.ai, Gemini, völlig egal. Kein API-Key, keine Anmeldung bei
einem Entwickler-Portal nötig.

Die Antwort der KI kann man optional zur Dokumentation in das Feld
"KI-Antwort (Notiz, optional)" zurückkopieren – die App liest daraus nichts
automatisch aus oder schreibt es in andere Felder; es ist eine reine
Gedächtnisstütze, die mit der Idee gespeichert wird.

---

## Was die App kann

- **Start als Cockpit**: Beim Öffnen der App landet ihr im Tab "Start" –
  Begrüßung, Ø KI-Potenzial über alle Prozesse als Ring, Kennzahlen (offene
  Ideen, in Umsetzung, dokumentierte Prozesse), Schnellzugriff auf
  Prozesse/Ideen/Auswertungen, eine Kachel-Reihe "Verwaltung & mehr"
  (Anleitung, Teams, Export, für Admins zusätzlich Freigaben, Einstellungen –
  bündelt, was früher als einzelne Icons in jedem Tab-Header stand) sowie die
  zuletzt bearbeiteten Ideen. Zeigt außerdem das Logo des Bereichs.
- **Lichtstimmung nach Tageszeit**: Der Header des Cockpits zeigt statt eines
  festen Verlaufs eine von vier Himmelsgrafiken – Sonnenaufgang, Hochstand,
  Sonnenuntergang, Nachthimmel mit Halbmond und erleuchteten Fenstern –, alle
  über derselben stilisierten Bürozeile am Horizont. Richtet sich rein nach
  der Uhrzeit des Geräts (`dayPart()` in `js/app.js`) und ist bewusst
  unabhängig vom Hell-/Dunkelmodus-Schalter, der nur den Rest der App betrifft.
- **Schnell erfassen**: Kurznotiz eintippen, speichern – fertig.
- **Später ausarbeiten**: Beschreibung, Tags, Status pro Idee ergänzen.
- **Bewerten**: Nutzen / Machbarkeit / Aufwand / Risiko einschätzen, die App
  zeigt direkt eine Einordnung ("Quick Win", "Großes Projekt", ...).
- **Start-Prompt für die Umsetzung erzeugen**: Aus dem bereits ausgefüllten
  Problem/Ziel/Business Benefit einen Prompt bauen, der eine KI bittet,
  mögliche Umsetzungswege einzuschätzen (Tool-Bedarf, Grenzen,
  Skalierbarkeit, IT-Bedarf ...) – zum Einfügen in ein beliebiges
  KI-Chat-Tool, kein API-Key nötig (siehe "KI-Unterstützung" unten).
- **Gemeinsam nutzen**: Mehrere Kolleg:innen loggen sich ein und sehen/bearbeiten dieselbe Liste
  – geschützt durch Domain-Sperre + Admin-Freigabe (siehe Schritt 7).
- **Am PC nutzen**: Läuft genauso im Desktop-Browser, das Layout passt sich
  automatisch an breitere Bildschirme an.
- **Prozesse dokumentieren**: Im Tab "Prozesse" alle Abläufe eures Bereichs
  erfassen und mit einer AI-Potenzial-Einschätzung versehen. Die
  Detailansicht ist bewusst schlank gehalten: Status und eine separate
  Freitext-Beschreibung gibt es hier nicht (mehr) – der Ablauf steckt
  stattdessen detailliert in den Prozessschritten (siehe unten).
- **Prozess duplizieren ("🗐 Duplizieren")**: In der Detailansicht eines
  Prozesses erzeugt dieser Button eine unabhängige Kopie – inklusive aller
  Prozessschritte und aller hinterlegten Dokumente/Links – und springt
  direkt zu dieser Kopie, damit man sie nur noch umbenennen und
  anpassen muss, statt einen stark ähnlichen Prozess komplett neu
  aufzusetzen. Der Bearbeitungsstatus der Kopie startet bewusst wieder
  bei "Offen" und der realisierte Anteil des AI-Potenzials (Prozess UND
  Schritte) wird auf 0% zurückgesetzt, da beides Fortschritt am
  Original ist, nicht an der neuen Kopie. Ebenfalls nicht mitkopiert:
  eine Verknüpfung von Schritten auf einen Detailprozess (die verwies
  auf einen Teilprozess des Originals) sowie die pro Schritt geflaggten
  Use Cases – beides lässt sich in der Kopie bei Bedarf neu setzen.
- **Prozesse per ▲/▼ sortieren**: Sowohl in der Prozessliste (Tab
  "Prozesse", je Baum-Ebene) als auch bei den Teilprozessen einer
  Detailansicht lässt sich die Reihenfolge frei per ▲/▼ anpassen – genau
  wie bei den Prozessschritten (siehe unten). Neu angelegte Prozesse
  landen zunächst am Ende ihrer Ebene.
- **Realisiertes vs. offenes Potenzial**: Neben der AI-Potenzial-Einschätzung
  lässt sich für jeden Prozess und jeden einzelnen Prozessschritt zusätzlich
  einschätzen, wie viel Prozent dieses Potenzials bereits gehoben wurden. Ein
  zweigeteilter Balken (realisiert / offen, in der Potenzial-Farbe) macht auf
  Prozesslisten, in der Detailansicht und in der Heatmap der Auswertungen auf
  einen Blick sichtbar, wo schon Effizienzen gehoben wurden und wo noch
  freies Potenzial liegt.
- **Teilprozesse & Use Cases im ersten Block**: Ganz oben bei Name,
  Kostenstelle/Team und übergeordnetem Prozess stehen auch gleich die
  Teilprozesse und die zugehörigen Use Cases dieses Prozesses – mit
  Verlinkung und Möglichkeit, direkt einen neuen Teilprozess bzw. eine
  neue Idee dafür anzulegen.
- **Ablauf als Flowchart visualisieren**: Danach folgt der Ablauf als
  geordnete Kette von Schritten (Start/Schritt/Entscheidung/Ende, jeweils
  mit Titel + Notiz, per ▲/▼ sortierbar) – mit verbindenden Pfeilen
  dargestellt wie ein einfaches Flowchart. Bewusst kein frei
  verzweigbares Diagramm mit Drag & Drop, damit es auch am Handy
  zuverlässig bedienbar bleibt (siehe unten "Verzweigungen &
  Parallelprozesse" für den Umgang mit Entscheidungspunkten). Jeder
  einzelne Schritt hat außerdem seine eigene AI-Potenzial-Einschätzung
  (1-5) plus kurze Notiz sowie einen eigenen Wert für den bereits
  realisierten Anteil (0-100%) – so lässt sich auf einen Blick erkennen, an
  welcher Stelle im Ablauf der größte Hebel steckt und wo davon schon
  etwas gehoben wurde, statt nur den Prozess als Ganzes zu bewerten.
- **Von groben Schritten in den Detailprozess drillen**: Jeder
  Prozessschritt kann optional mit einem der eigenen Teilprozesse
  verknüpft werden (Dropdown zeigt nur die Teilprozesse dieses
  Prozesses, siehe oben). Ist ein Schritt verknüpft, wird sein Titel zu
  einem Link (↗), der direkt zur Detailansicht dieses Teilprozesses
  springt – so lässt sich ein grober Ablauf Schritt für Schritt weiter
  aufschlüsseln.
- **Verzweigungen & Parallelprozesse**: Die Schritt-Kette ist bewusst
  linear (siehe oben) und bildet Verzweigungen (z.B. unterschiedliche
  Fortsetzung nach einer Entscheidung) oder parallele Abläufe nicht
  strukturell ab. Empfohlener Umgang: Bei einem Entscheidungsschritt in
  der Notiz kurz beschreiben, wohin die jeweilige Antwort führt (z.B.
  "Ja → weiter mit Schritt 4, Nein → Ende"); für einen eigenständigen
  Parallelzweig oder eine komplexere Verzweigung lohnt sich oft ein
  eigener Teilprozess, den man dann per Drill-down (siehe oben) direkt
  am betreffenden Schritt verlinkt. Für parallel laufende Schritte, die
  eigentlich zusammengehören, gibt es außerdem die frei vergebbare
  Schritt-Nummer (siehe nächster Punkt) – z.B. "2.1", "2.2", "2.3" für
  drei Schritte, die gleichzeitig zu Schritt 2 gehören.
- **Schritt-Nummern frei vergeben**: Jeder Prozessschritt hat ein eigenes
  Textfeld für eine Nummer/Bezeichnung (z.B. "1", "2.1", "3"). Diese
  Nummer ist rein ein von Hand gepflegtes Anzeige-Label und hat keinen
  Einfluss auf die tatsächliche Reihenfolge – die bestimmt weiterhin
  allein die Position in der Kette (▲/▼). So lassen sich parallel
  laufende Schritte kenntlich machen, ohne eine echte Verzweigungslogik
  im Datenmodell zu brauchen.
- **AI-Support pro Schritt markieren**: Ist einem Prozess bereits mindestens
  ein Use Case zugeordnet (siehe "Use Cases zu Prozessen zuordnen" unten),
  kann bei jedem einzelnen Prozessschritt per Checkbox markiert werden,
  welcher dieser Use Cases an genau dieser Stelle im Ablauf zum Einsatz
  kommt. So ist auf einen Blick erkennbar, an welchen Schritten welcher
  AI Support tatsächlich greift, statt nur zu wissen, dass ein Use Case
  irgendwo im Gesamtprozess relevant ist.
- **Dokumente & Links hinterlegen**: Ganz am Ende der Prozessansicht –
  eine einfache Liste aus Titel + URL (z.B. Link zu einer Datei in
  SharePoint/Teams/OneDrive oder einer Webseite). Es gibt keinen
  eigenen Datei-Upload/Storage, nur Links zu bereits woanders
  gespeicherten Dokumenten.
- **Use Cases zu Prozessen zuordnen**: Jede Idee kann optional einem Prozess
  zugeordnet werden (dieser bestimmt auch die Stufenkette, siehe unten); in
  der Prozess-Detailansicht seht ihr alle dazu bereits erfassten Use Cases
  (siehe "Teilprozesse & Use Cases im ersten Block" oben). Zusätzlich lässt
  sich in der Use-Case-Detailansicht derselbe Use Case über "Weitere
  Prozesse" auch bei beliebig vielen anderen Prozessen als verknüpft
  anzeigen – er taucht dann in allen diesen Prozess-Detailansichten auf.
- **Kostenstelle & Team pflichtig**: Sowohl bei Ideen als auch bei Prozessen
  müssen Kostenstelle und Team aus einem Dropdown gewählt werden (auch
  schon beim schnellen Erfassen). Beide kommen aus der Datenbank
  (Tabellen `kostenstellen` und `teams`) und werden über die
  Verwaltungsoberfläche gepflegt, siehe nächste zwei Punkte. Teams
  gehören dabei immer zu genau einer Kostenstelle – zwei Kostenstellen
  können also unterschiedliche Teams haben.
- **Kostenstellen- & Team-Zugriff (🛡 Freigaben)**: Der Admin legt im
  Freigaben-Bereich neue Kostenstellen an und weist jeder freigegebenen
  Person Zugriff zu – und zwar pro Kombination aus Kostenstelle **und**
  Team, nicht nur pro Kostenstelle. Jede Kostenstellen-Karte zeigt dafür
  mehrere Unterbereiche: **"Alle Teams (ganze Kostenstelle)"** ganz oben,
  darunter je ein Unterbereich pro Team dieser Kostenstelle. Pro Person
  und Unterbereich lässt sich einstellen: **Kein Zugriff** (Standard –
  nichts sichtbar), **Nur Lesen** oder **Lesen & Schreiben**. Ein Zugriff
  im Unterbereich "Alle Teams" gilt automatisch für alle Teams dieser
  Kostenstelle; ein zusätzlicher Zugriff bei einem einzelnen Team wirkt
  nur für genau dieses Team. Damit lässt sich z.B. jemandem
  Schreibzugriff nur für ein einzelnes Team innerhalb einer Kostenstelle
  geben, ohne die übrigen Teams dieser Kostenstelle mitzugeben. Der Admin
  selbst sieht und bearbeitet unabhängig davon immer alles. **Wichtig für
  den Ablauf:** Freigeben (🛡 Freigaben → "Freigeben") reicht allein nicht
  mehr aus – ohne mindestens einen zugewiesenen Kostenstelle/Team-Zugriff
  sieht eine frisch freigegebene Person eine leere Ideen-/Prozessliste
  und kann nichts anlegen. Zugriffs-Änderungen wirken bei bereits
  eingeloggten Personen erst nach einem Neuladen der Seite bzw. erneuten
  Login.
- **Nutzerstatistiken (🛡 Freigaben)**: Unterhalb der freigegebenen
  Mitglieder zeigt der Admin-Bereich pro Person den Zeitpunkt, wann sie
  die App zuletzt geöffnet hat, sowie die Gesamtzahl bisheriger
  App-Aufrufe, sortiert nach zuletzt aktiv – als grobes Maß dafür, wie
  häufig die App tatsächlich genutzt wird. Grundlage ist eine eigene
  `login_events`-Tabelle, in die die App bei jedem tatsächlichen Öffnen
  mit gültiger Session einen Datensatz schreibt (auch beim erneuten
  Öffnen der installierten PWA oder einem Seiten-Reload – nicht nur beim
  expliziten Einloggen). Lesbar sind diese Rohdaten ausschließlich für
  Admins.
- **Teams verwalten ("🧩 Teams")**: Anders als Kostenstellen (nur der
  Admin legt sie an) dürfen Teams auch von Personen mit **Vollzugriff**
  (Lesen & Schreiben, "Alle Teams") auf eine Kostenstelle angelegt,
  umbenannt und gelöscht werden – ganz ohne Admin-Rechte. Der Button
  "🧩 Teams" steht deshalb allen freigegebenen Personen offen (bei den
  Ideen/Prozessen/Auswertungen oben in der Kopfzeile) und zeigt dort die
  Teams jeder Kostenstelle, auf die man selbst Zugriff hat – Bearbeiten-
  Knöpfe erscheinen nur bei den Kostenstellen mit eigenem Vollzugriff.
  Wer nur auf einzelne Teams Zugriff hat, sieht die Liste nur lesend.
  Eine Umbenennung wirkt sich sofort auch auf alle bereits bestehenden
  Ideen/Prozesse dieses Teams aus (der Name wird nicht als Text
  gespeichert, sondern live nachgeschlagen) – bestehende Zugriffsrechte
  bleiben davon unberührt, da sie intern nicht am Namen, sondern an einer
  festen Team-ID hängen. Ein gelöschtes Team verschwindet bei betroffenen
  Ideen/Prozessen einfach aus der Team-Spalte (keine Löschung der
  Ideen/Prozesse selbst).
- **Deutsch/Englisch umschalten**: Ein Sprachschalter (DE/EN-Knopf oben
  rechts, u.a. auf dem Login-Bildschirm und den beiden Haupt-Listen)
  übersetzt die komplette Oberfläche inkl. der von der KI angefragten
  Sprache. Die Einstellung wird pro Gerät gespeichert. Zusätzlich zeigt
  der Schalter für Ideen/Prozesse mit hinterlegter Übersetzung (siehe
  "Zweisprachige Inhalte" unten) auch die erfassten Inhalte selbst auf
  Englisch, nicht nur Buttons/Bezeichnungen.
- **Zweisprachige Inhalte**: Die wichtigsten Freitextfelder (Kurznotiz,
  Problem, Ziel, Business Benefit, Wichtige Gedanken vorab, Qualitativer
  Nutzen, Kommentar bei Ideen; Name, Beschreibung, Notizen bei Prozessen)
  haben im Hintergrund eine zusätzliche, unsichtbare Übersetzungsspalte.
  Es gibt **keine automatische Live-Übersetzung** in der App – dafür
  reicht es einfach im Chat mit Claude Bescheid zu geben (z.B. "Übersetze
  bitte den Case GC29 ins Englische" oder "Übersetze alle offenen
  Ideen"), Claude liefert dann fertige `update`-Statements zum Einfügen
  im SQL Editor. Ist eine Übersetzung hinterlegt, zeigt die App sie bei
  EN automatisch an – das jeweilige Feld ist dann aber nur lesbar (kein
  versehentliches Überschreiben des deutschen Originals); zum Bearbeiten
  einfach auf Deutsch (DE) umschalten. Ohne Übersetzung wird ganz normal
  das deutsche Original angezeigt, auch auf Englisch – nichts bleibt je
  leer. Der 🔄 Export in die AI Ambassadors Usecase-Collection nutzt
  bewusst immer das deutsche Original, unabhängig vom Sprachschalter.
- **Hell-/Dunkelmodus umschalten**: Ein weiterer Knopf oben rechts (☀️/🌙)
  wechselt zwischen Dunkelmodus (Standard, Akzent Smaragdgrün) und
  Hellmodus (Akzent Azurblau). Die Einstellung wird ebenfalls
  pro Gerät gespeichert.
- **Problem / Ziel / Business Benefit getrennt**: Statt einem einzigen
  Beschreibungsfeld gibt es drei eigene Felder, die exakt den Spalten der
  zentralen AI Ambassadors Usecase-Collection entsprechen. Das macht das
  spätere Übertragen eindeutig (kein Raten mehr nötig, wie der Text
  aufzuteilen ist).
- **Katalog-Abgleich (optional)**: In der Idee-Detailansicht gibt es einen
  ausklappbaren Bereich "Weitere Katalog-Felder" (Katalog-ID, KI-Rolle,
  Systeme, Input, Output, Kind of KPI, quantifizierter/qualitativer Nutzen,
  Kommentar, Priorität laut Liste, Skill Level laut Liste) – für den
  Abgleich mit der zentralen AI Ambassadors Usecase-Collection (der
  SharePoint-Excel-Datei). Für die tägliche Nutzung optional – wer eine
  Idee aber später per 🔄 Export als Case in die Collection kopieren will,
  sollte genau diese Felder vorher ausfüllen, da sie dort die eigentlichen
  Inhaltsspalten sind. Die Katalog-ID (z.B. "GC29") muss eindeutig sein und
  dient als Schlüssel für spätere Abgleiche zwischen App und Collection.
  "Systeme" ist bewusst ein eigenes Feld, getrennt von "KI-Rolle"/den Tools
  weiter oben, weil es in der Collection eine eigene Spalte zwischen
  "KI Lösung" und "Input" ist. Die vier ganz rechten Spalten der Collection
  (Änderungsstatus, Geändert von, Änderungsdatum, Was wurde geändert) haben
  bewusst kein eigenes Feld in der App – sie werden in der Collection
  praktisch nie gepflegt und beim Update-Export (siehe unten) automatisch
  erzeugt statt gespeichert.
- **Usecase-Geber / Ansprechpartner**: Direkt im Hauptbereich jeder Idee
  lässt sich der Name der verantwortlichen Person hinterlegen, damit klar
  ist, wer bei Rückfragen anzusprechen ist.
- **In die AI Ambassadors Usecase-Collection kopieren (🔄 Export, für alle
  sichtbar)**: Zeigt alle Ideen ohne Katalog-ID, also solche, die noch
  nicht in der Collection stehen. **Reines Copy & Paste** – nichts wird
  automatisch geschrieben oder synchronisiert. Über "Tab-getrennt
  (Excel-Zeile)" wird eine fertige Zeile in der exakten Spaltenreihenfolge
  der Collection in die Zwischenablage kopiert, zum direkten Einfügen
  (Strg+V) in eine neue Zeile dort. Alternativ "Kopieren" für einen
  lesbaren Textblock, z.B. zum Posten in den Chat mit Claude, wenn man
  beim Einordnen Unterstützung möchte (Claude kann die Datei aus
  technischen Gründen nicht selbst beschreiben, nur den Text dafür
  vorbereiten). Nach dem Eintragen die vergebene GC-Nummer als Katalog-ID
  bei der Idee eintragen, danach taucht sie hier nicht mehr auf, sondern
  weiter unten im Abschnitt "Bereits synchronisierte Cases aktualisieren".
  Der umgekehrte Weg (Import aus der Collection in die App) läuft über den
  Chat mit Claude: Case-Nummer(n) nennen, Claude liest sie aus der
  Collection und erzeugt SQL zum Einfügen in Supabase.
- **Bereits synchronisierte Cases aktualisieren (🔄 Export, zweiter
  Abschnitt)**: Zeigt alle Ideen, die schon eine Katalog-ID haben. Wird
  eine solche Idee in der App weitergepflegt (sie ist ab dann die führende
  Quelle für diesen Case), veraltet die Collection dadurch punktuell –
  dieser Abschnitt liefert dafür eine "Update-Zeile (Excel)" pro Idee: eine
  Excel-Zeile mit derselben Spaltenreihenfolge wie beim normalen Export,
  aber mit ausgefüllter ID Nr (zur Kontrolle vor dem Überschreiben) und
  automatisch befüllten Änderungsspalten (Änderungsstatus "geändert",
  Geändert von = eigene E-Mail, Änderungsdatum = heute). Auch hier reines
  Copy & Paste: die Zeile direkt **auf die bestehende Zeile mit dieser
  ID Nr** einfügen (Strg+V), nicht als neue Zeile darunter.
- **Onboarding-Anleitung als eigene In-App-Ansicht**: Die Kachel
  "📋 Anleitung" unter "Verwaltung & mehr" auf der Startseite öffnet die
  Route `#/guide` – eine für Kolleg:innen gedachte Erklärseite (was die App
  kann, wie man Zugriff bekommt, wie man sie aufs eigene Gerät holt), im
  gleichen Look wie der Rest der App und zweisprachig über das normale
  DE/EN-System. Der Link in der Registrierungs-Mail
  (`registrationMailto` in js/app.js) verweist ebenfalls auf diese Route
  (`.../index.html#/guide`) statt auf eine externe Seite – funktioniert
  also für alle, die die App-URL erhalten, ohne eigenen Claude-Zugang.
- **Prozesse und Ideen als ein-/ausklappbarer Baum**: Teilprozesse hängen
  in der Prozess-Liste sichtbar unter ihrem übergeordneten Prozess und
  lassen sich per Pfeil ein-/ausklappen. Bei Ideen gilt das Gleiche für die
  Stufenkette, nur umgekehrt: die jeweils neueste Entwicklungsstufe steht
  oben in der Liste, die Vorstufen hängen als ausklappbare Kinder darunter.

## Projektstruktur

```
index.html                Haupt-App
css/style.css             Design
js/config.js              Supabase-Zugangsdaten (Schritt 2)
js/app.js                 App-Logik
manifest.json, sw.js, icons/   PWA-Grundlagen (Installierbarkeit)
supabase/schema.sql       Datenbank-Struktur (Ideen inkl. Stufenketten + Prozesse inkl. Teilprozess-Hierarchie)
```
