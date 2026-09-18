const sb = window.supabaseClient;

// ============================================================
// i18n
// ============================================================

const LANG_STORAGE = "ai_ideen_lang";
let currentLang = localStorage.getItem(LANG_STORAGE) === "en" ? "en" : "de";

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE, lang);
  render();
}

function t(key) {
  const value = (I18N[currentLang] && I18N[currentLang][key]) ?? I18N.de[key];
  return value === undefined ? key : value;
}

// ============================================================
// Hell-/Dunkelmodus
// ============================================================

const THEME_STORAGE = "ai_ideen_theme";

// Ohne gespeicherte Präferenz richtet sich der Default nach der Tageszeit
// (hell tagsüber, dunkel nachts) - siehe auch greetingText()/greetingIcon().
function timeDefaultTheme() {
  const h = new Date().getHours();
  return h >= 5 && h < 22 ? "light" : "dark";
}

const storedTheme = localStorage.getItem(THEME_STORAGE);
let currentTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : timeDefaultTheme();
document.documentElement.setAttribute("data-theme", currentTheme);

// Spiegelt die Akzentfarbe des aktuellen Modus in der Browser-/OS-Oberfläche
// (z.B. Android-Statusleiste), damit sie zum jeweiligen Modus passt.
function updateThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = currentTheme === "light" ? "#0369a1" : "#047857";
}
updateThemeColorMeta();

// Ein einziges Icon für Homescreen wie Login-/Status-Bildschirme: das feste
// Schwarz des Serviceplan-Zeichens (siehe icons/icon.svg) passt unabhängig
// vom Hell-/Dunkelmodus, ein Hell-/Dunkel-Pendant ist dafür nicht mehr nötig.
function loginLogoSrc() {
  return "icons/icon-192.png";
}

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE, theme);
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeColorMeta();
  render();
}

const I18N = {
  de: {
    appName: "Process- & AI-Usecase Management",
    tagline:
      "Dokumentiere eure Prozesse, prüft sie auf AI-Potenzial und erfasst AI-Use-Cases in Sekunden – inklusive Bewertung und KI-gestützter Ausarbeitung.",
    login: "Anmelden",
    requestAccessTab: "Zugang anfragen",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "deine@email.de",
    passwordPlaceholder: "Passwort",
    loggingIn: "Melde an...",
    forgotPassword: "Passwort vergessen?",
    requestAccessDesc:
      "Aus Sicherheitsgründen gibt es keine offene Registrierung mehr. Schick mir kurz deinen Namen, die gewünschte E-Mail-Adresse sowie die Kostenstelle(n) und das/die Team(s), für die du Zugriff brauchst – ich lege dir dann ein Konto an und schicke dir ein Start-Passwort.",
    requestAccessMailBtn: "📧 Mail an den Admin öffnen",
    requestAccessTeamsNote: "Geht auch ganz einfach per Nachricht in Teams.",
    errorPrefix: "Fehler: ",
    forgotPasswordContactMsg: "Bitte melde dich bei d.goos@house-of-communication.com – dein Passwort wird manuell zurückgesetzt.",
    setNewPasswordTitle: "Neues Passwort setzen",
    setNewPasswordDesc: "Vergib ein neues Passwort für dein Konto.",
    newPasswordPlaceholder: "Neues Passwort",
    savePassword: "Passwort speichern",
    passwordSavedMsg: "Passwort gespeichert, du bist eingeloggt.",
    changePasswordTitle: "Passwort ändern",
    changePasswordDesc: "Eigenes Passwort jederzeit selbst setzen – z.B. nach einem vom Admin vergebenen temporären Passwort.",
    passwordChangedMsg: "Passwort geändert",

    pendingTitle: "Warten auf Freigabe",
    pendingDesc:
      "ist bestätigt, muss aber noch von einem Admin freigegeben werden, bevor du Ideen und Prozesse sehen kannst. Melde dich kurz bei d.goos@house-of-communication.com.",
    checkStatus: "Status prüfen",
    logout: "Ausloggen",
    profileErrorTitle: "Profil nicht gefunden",
    profileErrorDesc:
      "Es gab ein Problem beim Laden deines Konto-Profils. Bitte kurz neu laden oder bei d.goos@house-of-communication.com melden.",

    startTab: "Start",
    ideasTab: "Ideen",
    processesTab: "Prozesse",
    dashboardTab: "Auswertungen",
    dashboardHeaderTitle: "Auswertungen",
    logoutBtn: "Logout",
    ideasHeaderTitle: "Ideen",
    processesHeaderTitle: "Prozesse",

    greetingMorning: "Guten Morgen",
    greetingAfternoon: "Guten Tag",
    greetingEvening: "Guten Abend",
    greetingNight: "Gute Nacht",
    aiPotentialAvgLabel: "Ø KI-Potenzial im Bereich",
    realizedPotentialAvgLabel: "Ø bereits realisiert",
    statOpenIdeasLabel: "Offene Ideen",
    statInProgressLabel: "In Umsetzung",
    statProcessesLabel: "Prozesse dokumentiert",
    quickAccessTitle: "Schnellzugriff",
    manageMoreTitle: "Verwaltung & mehr",
    recentlyEditedTitle: "Zuletzt bearbeitet",
    emptyRecentlyEdited: "Noch nichts bearbeitet.",
    utilGuideLabel: "Anleitung",
    utilTeamsLabel: "Teams",
    utilExportLabel: "Export",
    utilPermissionsLabel: "Freigaben",
    utilSettingsLabel: "Einstellungen",
    utilFeedbackLabel: "Feedback",
    adminOnlyTag: "Admin",
    brandFooterCaption: "Ein Tool von",

    guideIntroEyebrow: "Kurzanleitung",
    guideIntroLede:
      "Dokumentiere eure Prozesse, prüft sie auf AI-Potenzial und erfasst AI-Use-Cases in Sekunden – inklusive Bewertung und KI-gestützter Ausarbeitung.",
    guideAccessEyebrow: "Zugang",
    guideAccessH2: "So bekommst du Zugriff",
    guideAccessDesc: "Dein Zugang wird dir persönlich eingerichtet. Einmaliger Aufwand, etwa eine Minute.",
    guideStep1Title: "Zugang anfragen",
    guideStep1Desc:
      "Kurze Nachricht an den Admin: Name, gewünschte Firmen-E-Mail-Adresse, Kostenstelle(n) und Team(s). Am schnellsten über den Tab „Zugang anfragen“ auf dem Login-Bildschirm der App – der öffnet direkt eine vorausgefüllte Mail. Eine kurze Teams-Nachricht tut es genauso. Kontakt:",
    guideStep2Title: "Zugangsdaten bekommen",
    guideStep2Desc: "Der Admin legt dein Konto an und schickt dir E-Mail-Adresse und ein Start-Passwort direkt zu.",
    guideStep3Title: "Einloggen & loslegen",
    guideStep3Desc:
      "App öffnen, mit E-Mail und Start-Passwort einloggen. Unter „Einstellungen“ gleich ein eigenes Passwort setzen.",
    guidePendingTitle: "Steht dort „Warten auf Freigabe“?",
    guidePendingDesc:
      "Dann ist dein Konto zwar angelegt, aber Freigabe und Kostenstellen-Zugriff sind beim Admin noch nicht ganz abgeschlossen. Kurz nachfragen, das geht meist sofort.",
    guideForgotTitle: "Passwort vergessen?",
    guideForgotDesc: "Meld dich beim Admin (siehe Kontakt unten) oder per Teams – er setzt dir ein neues Passwort.",

    guideTourEyebrow: "Rundgang",
    guideTourH2: "Was in welchem Tab passiert",
    guideTourDesc: "Die App hat vier Haupt-Tabs, unten in der App genauso benannt und angeordnet wie hier.",
    guideStartF1Name: "KI-Potenzial-Ring & Kennzahlen",
    guideStartF1Desc:
      "Durchschnittliches AI-Potenzial eurer dokumentierten Prozesse, plus offene Ideen, Ideen in Umsetzung und Anzahl dokumentierter Prozesse – auf einen Blick.",
    guideStartF2Name: "Schnellzugriff",
    guideStartF2Desc:
      "Direkt-Kacheln zu Prozessen, Ideen und Auswertungen, plus „Verwaltung & mehr“ mit Anleitung, Teams, Export und Einstellungen.",
    guideStartF3Name: "Zuletzt bearbeitet",
    guideStartF3Desc: "Deine drei zuletzt bearbeiteten Ideen und Prozesse, damit du direkt dort weitermachen kannst, wo du aufgehört hast.",
    guideProcF1Name: "Prozesse dokumentieren",
    guideProcF1Desc:
      "Wiederkehrende Abläufe eures Bereichs erfassen – z.B. Angebote erstellen, Rechnungsprüfung, Kundenonboarding. Optional, aber hilfreich, um Optimierungspotenzial zu erkennen.",
    guideProcF2Name: "AI-Potenzial & Teilprozesse",
    guideProcF2Desc: "Jeden Prozess auf AI-Potenzial einschätzen und begründen, größere Abläufe in Teilprozesse gliedern.",
    guideProcF3Name: "Prozessschritte als Flowchart",
    guideProcF3Desc:
      "Den Ablauf als Kette aus Start / Schritt / Entscheidung / Ende aufbauen und pro Schritt markieren, wo KI unterstützen könnte.",
    guideProcF4Name: "Dokumente, Links & Use Cases",
    guideProcF4Desc:
      "SharePoint-/Teams-/OneDrive-Links hinterlegen (nur URLs, kein Upload) und Ideen mit dem Prozess verknüpfen – so entsteht Schritt für Schritt eine AI-/Prozess-Landkarte.",
    guideIdeaF1Name: "In Sekunden erfassen",
    guideIdeaF1Desc:
      "Kurznotiz eintippen, sobald dir etwas einfällt – auf dem Weg zum Meeting oder direkt am Schreibtisch. Filterbar nach Kostenstelle, Team und Usecase-Geber.",
    guideIdeaF2Name: "Bewerten statt raten",
    guideIdeaF2Desc:
      "Nutzen, Machbarkeit, Aufwand und Risiko einschätzen – die App ordnet automatisch ein: Quick Win, großes Projekt, Nice to have, eher verschieben, prüfen, kaum machbar oder hohes Risiko.",
    guideIdeaF3Name: "Mit KI ausarbeiten",
    guideIdeaF3Desc:
      "Aus Problem, Ziel und Business Benefit einen Start-Prompt erzeugen, in ein beliebiges KI-Tool einfügen (Copilot, ChatGPT, Claude, Gemini …) und die Antwort optional zur Doku zurückkopieren – kein eigener API-Key nötig.",
    guideIdeaF4Name: "Stufenketten",
    guideIdeaF4Desc:
      "Baut eine Idee auf einer anderen auf (z.B. GC12 → GC13 → GC14)? Hier verknüpfen, dann ist überall sichtbar, an welcher Stufe gerade gearbeitet wird.",
    guideIdeaF5Name: "Katalog-Felder & Export",
    guideIdeaF5Desc:
      "Sobald eine Idee reif ist: die zusätzlichen „Für die Ambassador-Liste“-Felder ausfüllen und über den Export-Tab copy-paste-fertig in die zentrale AI Ambassadors Usecase-Collection übernehmen.",
    guideDashF1Name: "Nutzen × Aufwand-Matrix",
    guideDashF1Desc: "Alle bewerteten Ideen auf einen Blick positioniert – Quick Wins oben links.",
    guideDashF2Name: "Einheiten, Prozesse & Use Cases",
    guideDashF2Desc: "Baumansicht: welche Prozesse und Ideen zu welcher Kostenstelle/welchem Team gehören.",
    guideDashF3Name: "Status je Team & AI-Potenzial-Heatmap",
    guideDashF3Desc: "Wie weit Teams mit ihren Ideen sind, und wo bei den Prozessen das meiste AI-Potenzial steckt.",
    guideDashF4Name: "Top Quick-Wins & Verlauf",
    guideDashF4Desc:
      "Ranking der aussichtsreichsten offenen Ideen, dazu der Erfassungsverlauf über die Zeit – alles filterbar nach Kostenstelle und Team.",

    guideFirstEyebrow: "Für den Einstieg",
    guideFirstH2: "Schritt für Schritt, Feld für Feld",
    guideFirstDesc:
      "Nicht sicher, wo du anfangen sollst oder was ein Feld bedeutet? Hier ist wirklich jeder Schritt und jedes Feld, in genau der Reihenfolge, wie sie in der App auftauchen.",

    guideFirstProcTitle: "Einen Prozess dokumentieren",
    guideFirstProc1: "Tab „Prozesse“ öffnen.",
    guideFirstProc2: "Oben bei „Neuen Prozess dokumentieren“ den Namen eintippen – z.B. „Rechnungsprüfung“ oder „Angebote erstellen“.",
    guideFirstProc3: "Kostenstelle und Team auswählen – beide sind Pflicht, ohne sie lässt sich nicht speichern.",
    guideFirstProc4:
      "„Prozess speichern“ tippen – der Prozess erscheint sofort in der Liste darunter. Antippen, um ihn zu öffnen – ab hier geht es in vier Kacheln weiter.",
    guideFirstProc5:
      "Erste Kachel: „Prozessname“ lässt sich hier jederzeit korrigieren. „Übergeordneter Prozess“ ist nur nötig, wenn dieser Prozess eigentlich ein Teilschritt eines größeren Ablaufs ist – sonst auf „Keiner (Top-Level-Prozess)“ lassen. Darunter „Teilprozesse“: über „+ Neuen Teilprozess anlegen“ (fragt nach einem Namen) legst du untergeordnete Prozesse an, die automatisch hierhin zurückverweisen. Ganz unten „Zugehörige Use Cases“: über „+ Neue Idee für diesen Prozess“ (fragt nach einer Kurznotiz) eine neue, direkt verknüpfte Idee anlegen – bestehende Ideen verknüpfst du stattdessen später bei der Idee selbst über „Zugehöriger Prozess“.",
    guideFirstProc6:
      "Zweite Kachel „AI-Potenzial“: Regler von 1 (gering) bis 5 (hoch) einstellen – die App zeigt darüber sofort eine automatische Einordnung an. Darunter „Notizen/Begründung“: warum viel oder wenig Potenzial, erste Ansätze.",
    guideFirstProc7:
      "Dritte Kachel „Prozessschritte“: den Ablauf als Kette aufbauen. Unten Titel eintippen (z.B. „Rechnung prüfen“), Typ wählen (Start / Schritt / Entscheidung / Ende), „+ Schritt hinzufügen“. Jeder Schritt lässt sich danach einzeln bearbeiten: eine Nummer geben (z.B. „2.1“), mit einem Teilprozess verknüpfen (für einen Detail-Ablauf hinter diesem Schritt), per ▲/▼ verschieben, mit ✏️ Titel und Notiz bearbeiten, mit 🗑 löschen. Pro Schritt gibt es außerdem einen eigenen AI-Potenzial-Regler plus Notizfeld, und – sobald Use Cases mit dem Prozess verknüpft sind – Checkboxen unter „AI Support durch:“, um genau zu markieren, welche Idee an diesem Schritt ansetzt.",
    guideFirstProc8:
      "Vierte Kachel „Dokumente & Links“: Titel eintippen, Art wählen (Link oder Dokument), URL eintragen, „+ Hinzufügen“ – nur Adressen, kein Datei-Upload. Gedacht für Links auf SharePoint, Teams oder OneDrive.",

    guideFirstIdeaTitle: "Eine Idee / einen Use Case erfassen",
    guideFirstIdea1: "Tab „Ideen“ öffnen.",
    guideFirstIdea2: "Oben bei „Neue Idee erfassen“ reicht ein Satz – z.B. „Automatische Zusammenfassung von Kundenmails per KI“.",
    guideFirstIdea3: "Kostenstelle und Team auswählen – auch hier Pflicht.",
    guideFirstIdea4:
      "„Idee speichern“ tippen – fertig, sie steht sofort in der Liste. Antippen, um sie zu öffnen – der Rest ist komplett optional und lässt sich jederzeit später nachtragen.",
    guideFirstIdea5:
      "Erste Kachel: „Kurznotiz“ ist der Titel, den du oben eingetippt hast – hier korrigierbar. „Katalog-ID“ bitte leer lassen, bis der Case offiziell in der zentralen Liste eine GC-Nummer bekommen hat (siehe Export weiter unten). „Usecase-Geber/Ansprechpartner“ ist der Name der verantwortlichen Person, falls das nicht du selbst bist. „Status“ (Geplant/PoC, In Umsetzung, Integrated, Verworfen) und „Kostenstelle/Team“ lassen sich hier jederzeit ändern. „Tags“ sind frei, Komma-getrennt, z.B. „Vertrieb, Automatisierung“.",
    guideFirstIdea6:
      "Zweite Kachel (Beschreibung): „Problem“ – was ist aktuell schwierig/aufwendig; „Ziel“ – was soll die Lösung konkret erreichen; „Business Benefit“ – welcher Nutzen entsteht (Zeit, Qualität, Kosten, Risiko); „Quantifizierter Nutzen“ als Zahl, z.B. „20 Std./Jahr Ersparnis“; „Qualitativer Nutzen“, z.B. „bessere Entscheidungsgrundlage“.",
    guideFirstIdea7:
      "Dritte Kachel „Bewertung“: vier Regler von 1–5 – Nutzen, Machbarkeit, Aufwand, Risiko. Der Banner darüber zeigt live die daraus abgeleitete Einordnung: Quick Win, großes Projekt, Nice to have, eher verschieben, prüfen, kaum machbar oder hohes Risiko.",
    guideFirstIdea8:
      "Vierte Kachel „Lösungsansatz“: „KI-Rolle“ (Dropdown, z.B. welche Art von KI-Einsatz); „Tools & Umsetzungsoptionen“ – konkrete Tools/Frameworks; „Systeme“ – beteiligte Plattformen, bewusst getrennt von den Tools; „Input (Datenquelle)“ – woher kommen die Daten; „Output (Datenausgabe)“ – was liefert der Use Case; „Wichtige Gedanken vorab“ – z.B. Datenschutz, Kosten, Risiken.",
    guideFirstIdea9:
      "Fünfte Kachel „Für die Ambassador-Liste“: „Kind of KPI“, „Priorität (Liste)“ (bei manchen Status automatisch vorgegeben und gesperrt), „Kommentar“, „Skill Level“ (z.B. „Skill 2 - Ambassador“). Diese Felder werden für die tägliche Nutzung nicht gebraucht, aber für einen vollständigen Eintrag in der zentralen Liste.",
    guideFirstIdea10:
      "Ausklappbereich „KI-Unterstützung“: „Start-Prompt erzeugen“ braucht vorher ausgefülltes Problem, Ziel und Business Benefit. Den erzeugten Text in ein beliebiges KI-Tool einfügen (Copilot, ChatGPT, Claude, Gemini …) und die Antwort optional unter „KI-Antwort (Notiz)“ zurückkopieren – ausgewertet wird sie nicht automatisch.",
    guideFirstIdea11:
      "Kachel „Stufenkette“: „Zugehöriger Prozess“ verknüpft die Idee mit einem Prozess. „Vorherige Stufe“ setzt du, wenn diese Idee die Weiterentwicklung einer anderen ist (z.B. GC12 → GC13). Über „+ Neue Folgestufe anlegen“ entsteht direkt die nächste Stufe, mit Kostenstelle, Team und Prozess automatisch übernommen.",
    guideFirstIdea12:
      "Kachel „Weitere Prozesse“: zusätzliche Prozesse verknüpfen, falls die Idee über den oben gesetzten „Zugehörigen Prozess“ hinaus noch an anderer Stelle relevant ist. Ganz unten nicht „Speichern“ vergessen – Freitextfelder werden erst dabei übernommen.",

    guideFirstExportNewTitle: "Einen neuen Case in die Ambassador-Liste exportieren",
    guideFirstExportNew1:
      "Zur Kachel „Export“ (unter „Verwaltung & mehr“). Oben stehen alle Ideen ohne Katalog-ID – also alle, die noch nicht in der zentralen Liste sind.",
    guideFirstExportNew2:
      "Vor dem Kopieren bei der Idee kurz die Felder aus „Lösungsansatz“ und „Für die Ambassador-Liste“ prüfen (KI-Rolle, Systeme, Input, Output, Kind of KPI, Nutzen, Kommentar, Priorität, Skill Level) – für die tägliche Nutzung optional, für einen vollständigen Case in der Liste aber relevant.",
    guideFirstExportNew3:
      "Bei der Idee „📋 Tab-getrennt (Excel-Zeile)“ antippen – oder „📋 Kopieren“ für eine lesbare Textfassung, z.B. um sie stattdessen in einen Chat mit Claude zu posten, wenn du beim Einordnen Unterstützung möchtest.",
    guideFirstExportNew4:
      "In der Ambassador-Excel-Liste eine neue Zeile anhängen und dort einfügen (Strg+V). „ID Nr“ bleibt leer – dort selbst die nächste freie GC-Nummer eintragen. Brand/Agency sind schon mit „Shared Service“/„Group Controlling“ vorbelegt. Die Übersetzungs-Formelspalten („#CONNECT!“) danach aus der Zeile darüber nach unten ziehen.",
    guideFirstExportNew5:
      "Die dort vergebene Katalog-ID (z.B. „GC30“) zurück in der App bei dieser Idee unter „Katalog-ID“ eintragen und speichern. Die Idee verschwindet dadurch aus dieser Liste und taucht ab sofort unten bei den Aktualisierungen auf.",

    guideFirstExportUpdateTitle: "Einen bereits exportierten Case aktualisieren",
    guideFirstExportUpdate1:
      "Sobald eine Idee eine Katalog-ID hat, steht sie automatisch im unteren Bereich „Bereits synchronisierte Cases aktualisieren“ (sortiert nach Katalog-ID) – kein zusätzlicher Schritt nötig.",
    guideFirstExportUpdate2:
      "Sinnvoll, sobald du eine solche Idee in der App weiter bearbeitet hast (z.B. Bewertung geändert, Texte ergänzt) und der Stand in der zentralen Liste das nachziehen soll – die App synchronisiert nichts von selbst.",
    guideFirstExportUpdate3:
      "Bei der Idee „📋 Update-Zeile (Excel)“ antippen (oder „📋 Alle Update-Zeilen“, um mehrere Cases auf einmal zu kopieren).",
    guideFirstExportUpdate4:
      "Diese Zeile enthält – anders als beim Neu-Export – die Katalog-ID an erster Stelle, damit klar ist, welche Zeile betroffen ist, plus vier automatisch befüllte Spalten ganz rechts: Änderungsstatus („geändert“), Geändert von (deine E-Mail), Änderungsdatum (heute). „Was wurde geändert“ bleibt leer, optional von dir selbst auszufüllen.",
    guideFirstExportUpdate5:
      "Wichtig: diese Zeile nicht als neue Zeile einfügen, sondern direkt auf der bestehenden Zeile mit der passenden ID Nr in der Liste einfügen (die Zeile markieren, Strg+V) – dadurch wird die alte Zeile komplett mit dem aktuellen Stand aus der App überschrieben.",

    guideMoreEyebrow: "Verwaltung & mehr",
    guideMoreH2: "Der Rest des Schnellzugriffs",
    guideMoreDesc: "Über die Kachel „Verwaltung & mehr“ auf der Startseite erreichbar.",
    guideMgmtExportD: "Brücke zur zentralen AI Ambassadors Usecase-Collection – reines Copy & Paste, nichts läuft automatisch oder synchronisiert.",
    guideMgmtTeamsD: "Mit vollem Schreibrecht auf eine Kostenstelle könnt ihr hier die Teams darin anlegen, umbenennen oder löschen.",
    guideMgmtSettingsD: "Eigenes Passwort setzen. Sprache (DE/EN) und Hell-/Dunkelmodus lassen sich oben rechts auf jedem Bildschirm umschalten.",
    guideMgmtAccessD: "Nur für Admins sichtbar: neue Konten anlegen, freigeben und Kostenstellen-/Team-Zugriff je Person verwalten.",

    guideGoodEyebrow: "Gut zu wissen",
    guideGoodH2: "Drei Dinge vorab",
    guideGood1Title: "Rechte sind gestaffelt",
    guideGood1Desc:
      "Zugriff wird pro Kostenstelle und Team vergeben (Nur Lesen oder Lesen & Schreiben) – je nach Freigabe siehst oder bearbeitest du unterschiedlich viel.",
    guideGood2Title: "Freiwillig, kein Ersatz",
    guideGood2Desc:
      "Die Nutzung ist freiwillig und ersetzt nicht die offizielle Meldung im Rahmen der AI-Ambassador-Organisation – der Export liefert euch dafür aber den Input copy-paste-fertig.",
    guideGood3Title: "Noch im Aufbau",
    guideGood3Desc: "Funktionen können sich noch ändern. Bugs und Ideen für die App selbst gerne direkt an den Admin.",

    guideDeviceEyebrow: "Extra-Tipp",
    guideDeviceH2: "Auf dem eigenen Gerät einrichten",
    guideDeviceDesc: "Kein App Store, keine IT-Anfrage nötig – danach startet die App wie jede andere, mit eigenem Icon.",
    guideDevice1Name: "Laptop · Chrome / Edge",
    guideDevice1Li1: "Adressleiste rechts: Installieren-Symbol anklicken",
    guideDevice1Li2: "oder Menü ⋮ → „App installieren“",
    guideDevice2Name: "Laptop · Safari (Mac)",
    guideDevice2Li1: "Menü „Ablage“ → „Zum Dock hinzufügen“",
    guideDevice2Li2: "ab macOS Sonoma – sonst als Lesezeichen speichern",
    guideDevice3Name: "iPhone · Safari",
    guideDevice3Li1: "Teilen-Symbol (Quadrat mit Pfeil) tippen",
    guideDevice3Li2: "„Zum Home-Bildschirm“ wählen",
    guideDevice4Name: "Android · Chrome",
    guideDevice4Li1: "Menü ⋮ öffnen",
    guideDevice4Li2: "„App installieren“ wählen",

    guideFooter1: "Fragen oder Zugang? Schreib kurz an den Admin (derzeit",
    guideFooter1Suffix: ") oder per Teams.",
    guideFooter2: "Alle Daten bleiben innerhalb des Teams – sichtbar nur für freigegebene Kolleg:innen mit Firmen-Mail-Adresse.",

    newIdeaLabel: "Neue Idee erfassen",
    ideaPlaceholder: "z.B. Automatische Zusammenfassung von Kundenmails per KI...",
    saveIdea: "Idee speichern",
    ideaSavedMsg: "Idee gespeichert",
    filterAll: "Alle",
    filterAllKostenstellenOption: "Alle Kostenstellen",
    filterAllTeamsOption: "Alle Teams",
    filterAllOwnersOption: "Alle Usecase-Geber",
    emptyIdeas: "Noch keine Ideen hier. Trag oben deine erste Idee ein!",
    loadingIdeas: "Lade Ideen...",

    status_planned: "Geplant / PoC",
    status_in_progress: "In Umsetzung",
    status_done: "Integrated",
    status_discarded: "Verworfen",

    priority_quickWin: "Quick Win",
    priority_bigProject: "Großes Projekt",
    priority_niceToHave: "Nice to have",
    priority_postpone: "Eher verschieben",
    priority_review: "Prüfen",
    priority_hardToImplement: "Kaum machbar",
    priority_highRisk: "Hohes Risiko",

    ai_high: "Hohes AI-Potenzial",
    ai_low: "Geringes AI-Potenzial",
    ai_medium: "Mittleres AI-Potenzial",

    backBtn: "← Zurück",
    deleteBtn: "Löschen",
    quickNoteLabel: "Kurznotiz",
    statusLabel: "Status",
    relatedProcessLabel: "Zugehöriger Prozess",
    noneOption: "— Keiner —",
    additionalProcessesLabel: "Weitere Prozesse",
    additionalProcessesDesc:
      "Zusätzlich zum oben zugeordneten Prozess (der die Stufenkette bestimmt) lässt sich dieser Use Case auch bei anderen Prozessen als verknüpft anzeigen.",
    emptyAdditionalProcesses: "Noch keine weiteren Prozesse verknüpft.",
    addProcessBtn: "+ Hinzufügen",
    processLinkedMsg: "Prozess verknüpft",
    processUnlinkedMsg: "Verknüpfung entfernt",
    stageChainTitle: "Stufenkette",
    stageChainDesc:
      "Ist dieser Use Case der erste Schritt oder eine Weiterentwicklung eines anderen (z.B. GC12 → GC13 → GC14)? Hier verknüpfen, dann ist überall erkennbar, welche Stufe woran gerade gearbeitet wird.",
    previousStageLabel: "Vorherige Stufe",
    noneFirstStageOption: "— Keine (erste Stufe) —",
    stageChainPositionLabel: "Position in der Stufenkette",
    stagePrefix: "Stufe ",
    followUpStagesTitle: "Folgestufen",
    emptyFollowUpStages: "Noch keine Folgestufe angelegt.",
    addFollowUpStageBtn: "+ Neue Folgestufe anlegen",
    newFollowUpStagePrompt: "Kurznotiz für die neue Folgestufe:",
    followUpStageSavedMsg: "Folgestufe gespeichert",
    lastSavedTitle: "Zuletzt gespeichert",
    tagsLabel: "Tags (Komma-getrennt)",
    tagsPlaceholder: "z.B. Vertrieb, Automatisierung",
    descriptionPlaceholder: "Was ist das Problem, was soll die Lösung bringen?",
    problemLabel: "Problem",
    problemPlaceholder: "Welches Problem soll gelöst werden? Was ist aktuell schwierig/aufwendig?",
    goalLabel: "Ziel",
    goalPlaceholder: "Was soll die Lösung konkret erreichen?",
    businessBenefitLabel: "Business Benefit",
    businessBenefitPlaceholder: "Welcher konkrete Nutzen (Zeit, Qualität, Kosten, Risiko) entsteht dadurch?",
    departmentLabel: "Kostenstelle",
    teamLabel: "Team",
    selectPlaceholderOption: "— Bitte wählen —",
    departmentTeamRequiredMsg: "Bitte Kostenstelle und Team auswählen.",
    readOnlyNotice: "Nur Lesezugriff auf diese Kostenstelle – Änderungen können hier nicht gespeichert werden.",
    listFieldsHint:
      "Felder mit farbigem Rand links stehen auch in der zentralen AI Ambassadors Usecase-Collection (🔄 Export) – alle anderen Felder gibt es nur hier in der App.",
    solutionApproachTitle: "Lösungsansatz",
    listDetailsTitle: "Für die Ambassador-Liste",
    aiRoleLabel: "KI-Rolle",
    systemeLabel: "Systeme",
    systemePlaceholder: "Beteiligte Systeme/Plattformen (eigene Spalte in der Liste, getrennt von KI-Lösung)",
    inputSourceLabel: "Input (Datenquelle)",
    inputSourcePlaceholder: "Woher kommen die Daten/Eingaben?",
    outputResultLabel: "Output (Datenausgabe)",
    outputResultPlaceholder: "Was liefert der Use Case als Ergebnis?",
    kpiKindLabel: "Kind of KPI",
    quantifiedBenefitLabel: "Quantifizierter Nutzen",
    quantifiedBenefitPlaceholder: "z.B. 20 Std./Jahr Ersparnis",
    qualitativeBenefitLabel: "Qualitativer Nutzen",
    qualitativeBenefitPlaceholder: "z.B. bessere Entscheidungsgrundlage",
    commentLabel: "Kommentar",
    listPriorityLabel: "Priorität (Liste)",
    skillLevelLabel: "Skill Level (Liste)",
    skillLevelPlaceholder: "z.B. Skill 2 - Ambassador (in der Liste nur vereinzelt gepflegt)",
    catalogIdLabel: "Katalog-ID",
    catalogIdPlaceholder: "z.B. GC29 (muss eindeutig sein)",
    ownerNameLabel: "Usecase-Geber / Ansprechpartner",
    ownerNamePlaceholder: "Name der verantwortlichen Person",

    exportTitle: "Neue Ideen für die AI Ambassadors Usecase-Collection kopieren",
    exportIntro:
      "Hier stehen alle Ideen, die noch keine Katalog-ID haben – also noch nicht in der zentralen AI Ambassadors Usecase-Collection stehen. Wichtig: Das ist reines Copy & Paste, hier wird nichts automatisch geschrieben oder synchronisiert. Kopiere eine Idee (oder alle) und füge sie selbst als neue Zeile in die Usecase-Collection ein (am einfachsten mit der Tab-getrennt-Option unten), oder poste den Text stattdessen in den Chat mit Claude, wenn du beim Einordnen Unterstützung möchtest. Trag die dort vergebene Katalog-ID (z.B. GC30) anschließend hier bei der Idee ein, dann verschwindet sie aus dieser Liste und taucht stattdessen unten bei den Aktualisierungen auf.",
    exportFieldsNote:
      "Vor dem Kopieren prüfen: Bei der Idee gibt es einen ausklappbaren Bereich \"Weitere Katalog-Felder\" (KI-Rolle, Systeme, Input, Output, Kind of KPI, quantifizierter/qualitativer Nutzen, Kommentar, Priorität, Skill Level). Die sind für die tägliche Nutzung optional – für einen vollständigen Case in der Usecase-Collection sind es aber genau die relevanten Felder und sollten ausgefüllt sein, bevor du kopierst.",
    exportEmpty: "Alle Ideen haben bereits eine Katalog-ID – nichts zu kopieren.",
    copyOneBtn: "📋 Kopieren",
    copyAllBtn: "📋 Alle kopieren",
    copyTsvOneBtn: "📋 Tab-getrennt (Excel-Zeile)",
    copyTsvAllBtn: "📋 Alle als Excel-Zeilen",
    exportTsvNote:
      "Reines Copy & Paste: die Excel-Zeile(n) direkt ab einer neuen Zeile in der AI Ambassadors Usecase-Collection einfügen (Strg+V) – nichts davon läuft automatisch. ID Nr bleibt leer – dort die nächste freie GC-Nummer aus der Collection eintragen. Brand/Agency werden mit \"Shared Service\"/\"Group Controlling\" vorbelegt. Die Übersetzungs-Formelspalten (\"#CONNECT!\") danach aus der Zeile darüber nach unten ziehen.",

    updateExportTitle: "Bereits synchronisierte Cases aktualisieren",
    updateExportIntro:
      "Hier stehen alle Ideen, die schon eine Katalog-ID haben – also schon einmal in die Usecase-Collection übertragen wurden. Wenn du eine davon in der App weiter gepflegt hast, kannst du hier eine aktuelle Excel-Zeile kopieren und damit die bestehende Zeile mit der passenden ID Nr in der Collection überschreiben (Strg+V direkt auf der vorhandenen Zeile, nicht als neue Zeile einfügen!). Auch hier reines Copy & Paste, nichts läuft automatisch.",
    updateExportFieldsNote:
      "Die Zeile enthält zusätzlich Änderungsstatus (\"geändert\"), Geändert von (deine E-Mail) und Änderungsdatum (heute) – \"Was wurde geändert\" bleibt leer zum selbst Ausfüllen, das pflegt aktuell niemand in der Liste.",
    updateExportEmpty: "Keine Ideen mit Katalog-ID vorhanden – nichts zu aktualisieren.",
    copyUpdateTsvOneBtn: "📋 Update-Zeile (Excel)",
    copyUpdateTsvAllBtn: "📋 Alle Update-Zeilen",

    evaluationTitle: "Bewertung",
    impactLabel: "Nutzen",
    feasibilityLabel: "Machbarkeit",
    effortLabel: "Aufwand",
    riskLabel: "Risiko",
    assessmentPrefix: "Einschätzung: ",

    aiSupportTitle: "KI-Unterstützung",
    aiSupportDesc:
      "Erzeugt einen Prompt, der eine KI dazu anleitet, mögliche Umsetzungswege für diesen Use Case einzuschätzen (nötige Tool-Stufe, Grenzen, Skalierbarkeit, IT-Bedarf ...). Voraussetzung: Problem, Ziel und Business Benefit oben sind bereits ausgefüllt – die werden als feste Grundlage übernommen, nicht neu erfunden. Füge den Prompt in ein beliebiges KI-Chat-Tool ein (Copilot, ChatGPT, Claude, Gemini, ...) und kopier die Antwort bei Bedarf unten zur Doku rein – ausgewertet wird sie nicht automatisch.",
    generatePromptBtn: "📋 Start-Prompt erzeugen",
    aiResponsePasteLabel: "KI-Antwort (Notiz, optional)",
    aiResponsePlaceholder: "Antwort/Zusammenfassung der KI hier zur Doku einfügen (optional)",

    toolsLabel: "Tools & Umsetzungsoptionen",
    toolsPlaceholder: "z.B. konkrete Tools/Frameworks, die für die Umsetzung sinnvoll sind",
    considerationsLabel: "Wichtige Gedanken vorab",
    considerationsPlaceholder: "z.B. Datenschutz, Datenquelle, Kosten",
    startPromptLabel: "Start-Prompt fürs Projekt",
    startPromptPlaceholder: "Per Klick auf \"Start-Prompt erzeugen\" befüllt, oder hier selbst eintragen",
    copyStartPromptBtn: "Start-Prompt kopieren",
    kickoffPromptRequiresFieldsMsg: "Bitte zuerst Problem, Ziel und Business Benefit ausfüllen.",
    kickoffPromptGeneratedMsg: "Start-Prompt erzeugt",

    saveBtn: "Speichern",
    savingBtn: "Speichere...",
    savedMsg: "Gespeichert",
    deleteIdeaConfirm: "Diese Idee wirklich löschen?",
    ideaDeletedMsg: "Idee gelöscht",
    copiedMsg: "In Zwischenablage kopiert",
    copyFailedMsg: "Kopieren nicht möglich, bitte manuell markieren",
    newProcessLabel: "Neuen Prozess dokumentieren",
    processPlaceholder: "z.B. Angebote erstellen, Rechnungsprüfung, Kundenonboarding...",
    saveProcessBtn: "Prozess speichern",
    processSavedMsg: "Prozess gespeichert",
    emptyProcesses: "Noch keine Prozesse erfasst. Trag oben den ersten Prozess deines Bereichs ein!",
    loadingProcesses: "Lade Prozesse...",

    processNameLabel: "Prozessname",
    processStatusLabel: "Bearbeitungsstatus",
    processStatus_open: "In Arbeit",
    processStatus_reviewed: "Fertig beschrieben",
    parentProcessLabel: "Übergeordneter Prozess",
    noneTopLevelOption: "— Keiner (Top-Level-Prozess) —",
    aiPotentialTitle: "AI-Potenzial",
    aiPotentialLabel: "AI-Potenzial",
    realizedPotentialLabel: "Bereits realisiert",
    openPotentialLabel: "Offenes Potenzial",
    notesLabel: "Notizen / Begründung",
    notesPlaceholder: "Warum viel/wenig Potenzial? Erste Ansätze?",
    subProcessesTitle: "Teilprozesse",
    emptySubProcesses: "Noch keine Teilprozesse zugeordnet.",
    addSubProcessBtn: "+ Neuen Teilprozess anlegen",
    linkedUseCasesTitle: "Zugehörige Use Cases",
    emptyLinkedIdeas: "Noch keine Idee für diesen Prozess.",
    addIdeaBtn: "+ Neue Idee für diesen Prozess",
    newIdeaPrompt: "Kurznotiz für die neue Idee:",
    newSubProcessPrompt: "Name des neuen Teilprozesses:",
    deleteProcessConfirm:
      "Diesen Prozess wirklich löschen? Verknüpfte Ideen bleiben erhalten, verlieren aber die Zuordnung.",
    processDeletedMsg: "Prozess gelöscht",
    subProcessSavedMsg: "Teilprozess gespeichert",
    duplicateProcessBtn: "🗐 Duplizieren",
    duplicateNameSuffix: " (Kopie)",
    processDuplicatedMsg: "Prozess dupliziert – Schritte und Dokumente wurden mit übernommen",

    processStepsTitle: "Prozessschritte",
    processStepsDesc: "Baue den Ablauf als Kette von Schritten auf – für einen visuellen Überblick wie bei einem Flowchart.",
    stepType_start: "Start",
    stepType_step: "Schritt",
    stepType_decision: "Entscheidung",
    stepType_end: "Ende",
    newStepPlaceholder: "Neuer Schritt, z.B. Rechnung prüfen",
    newStepDescPlaceholder: "Notiz zum Schritt (optional)",
    addStepBtn: "+ Schritt hinzufügen",
    editStepBtn: "Bearbeiten",
    deleteStepBtn: "Löschen",
    deleteStepConfirm: "Diesen Schritt wirklich löschen?",
    editStepTitlePrompt: "Titel des Schritts:",
    editStepDescPrompt: "Notiz zum Schritt (optional):",
    emptyProcessSteps: "Noch keine Schritte erfasst.",
    stepSavedMsg: "Schritt gespeichert",
    stepDeletedMsg: "Schritt gelöscht",
    stepAiPotentialNotePlaceholder: "Kurze Notiz zum AI-Potenzial dieses Schritts",
    stepNoLinkedProcessOption: "— Kein Detail-Prozess —",
    stepNumberPlaceholder: "Nr. (z.B. 2.1)",
    stepIdeaFlagsLabel: "AI Support durch:",

    processResourcesTitle: "Dokumente & Links",
    processResourcesDesc:
      "Links zu Dokumenten (z.B. SharePoint, Teams, OneDrive) oder Webseiten, die zu diesem Prozess gehören. Kein Datei-Upload – einfach die URL eintragen.",
    resourceKind_link: "Link",
    resourceKind_document: "Dokument",
    newResourceLabelPlaceholder: "Titel",
    newResourceUrlPlaceholder: "https://...",
    addResourceBtn: "+ Hinzufügen",
    emptyProcessResources: "Noch keine Dokumente/Links hinterlegt.",
    deleteResourceConfirm: "Diesen Eintrag wirklich löschen?",
    invalidUrlMsg: "Bitte eine gültige URL beginnend mit http:// oder https:// eingeben.",
    resourceSavedMsg: "Eintrag gespeichert",
    resourceDeletedMsg: "Eintrag gelöscht",

    createUserTitle: "Neuen User anlegen",
    createUserDesc: "Legt das Konto direkt an (kein Mailversand nötig). Freigabe und Kostenstellen-Zugriff bleiben danach bewusst ein separater Schritt weiter unten.",
    newUserPasswordLabel: "Start-Passwort",
    newUserPasswordPlaceholder: "Mind. 6 Zeichen",
    generatePasswordBtn: "🎲 Generieren",
    createUserBtn: "Konto anlegen",
    createUserValidationMsg: "Bitte E-Mail und ein Passwort mit mind. 6 Zeichen angeben.",
    userCreatedMsgPrefix: "Konto angelegt: ",
    createUserErrorPrefix: "Fehler beim Anlegen: ",
    prepareRegistrationMailBtn: "✉️ Info-Mail vorbereiten",
    registrationMailValidationMsg: "Bitte zuerst E-Mail und Passwort ausfüllen.",
    resetPasswordBtn: "🔑 Passwort zurücksetzen",
    resetPasswordConfirmPrefix: "Neues Passwort für ",
    resetPasswordConfirmSuffix: " setzen? Die Person kann sich damit ab sofort nicht mehr mit dem alten Passwort einloggen.",
    passwordResetMsgPrefix: "Neues Passwort gesetzt für ",
    resetPasswordErrorPrefix: "Fehler beim Zurücksetzen: ",
    passwordResetMailSubject: "Neues Passwort für die App „Process- and AI-Usecases Management“",
    passwordResetMailBody: "Hallo,\n\ndein Passwort wurde zurückgesetzt.\n\nE-Mail: {email}\nNeues Passwort: {password}\n(Bitte gleich nach der Anmeldung unter „Einstellungen“ ein eigenes Passwort setzen.)\n\nViele Grüße",
    registrationMailSubject: "Zugang zur App „Process- and AI-Usecases Management“",
    registrationMailBody: "Hallo,\n\nDir wurde ein Zugang zu der App „Process- and AI-Usecases Management“ eingerichtet.\n\nMit folgenden Credentials kannst du dich einloggen:\n\nE-Mail: {email}\nStart-Passwort: {password}\n(Bitte gleich nach der ersten Anmeldung ändern.)\n\nDie Grundidee dieser App ist es, eure Ideen rund um das Thema AI und Prozessverbesserung auf eine sehr einfache Art und Weise aufzunehmen. Im Bereich \"Prozesse\" könnt ihr die grundlegenden, wiederkehrenden Abläufe eurer täglichen Arbeit beschreiben (die Verwendung dieser Funktion ist optional und kann sich hilfreich beim Identifizieren von Optimierungspotenzial auswirken). Der eigentliche Kernbereich ist der Tab \"Ideen\". Hier könnt ihr auf eine sehr einfache und schnelle Art und Weise alle Ideen, die euch zu welchen KI-Einsatzmöglichkeiten auch immer gerade durch den Kopf schießen, aufnehmen und später in Ruhe weiter ausfeilen. Falls ihr eure Prozesse dokumentiert habt, könnt ihr hier AI-Cases an den jeweiligen Steps verlinken, so dass sich im Ergebnis eine Art AI-/Prozess-Landkarte ergibt.\n\nHier gelangt ihr zur App: {appUrl}\n\nEine detaillierte Anleitung findet ihr hier: {guideUrl}\n\nÜbrigens: Die Nutzung der App ist optional, nicht verpflichtend und ersetzt nicht die Meldung der AI-Cases im Rahmen der AI-Ambassador Organisation (die App kann euch aber auch hierbei unterstützen, indem sie euch z.B. den Input für eure usecases-Liste auf einen Klick copy-paste-ready liefert).\n\nBitte beachtet, dass sich die App gerade noch im Aufbau befindet. Etwaige Bugs bitte gern berichten. Außerdem kann sich Funktionalität hier und da noch verändern.\n\nAnsonsten viel Spaß damit und melde dich gern bei Fragen.\n\nViele Grüße,\nDavid",
    impersonateBtn: "🔑 Testen",
    impersonatePopupBlockedMsg: "Popup-Blocker verhindert den Test-Tab – bitte für diese Seite erlauben.",
    impersonateErrorPrefix: "Fehler beim Test-Login: ",
    impersonationBannerPrefix: "🧪 Test-Login als ",
    impersonationBannerCloseBtn: "Tab schließen",

    pendingApprovalTitlePrefix: "Wartet auf Freigabe (",
    noPendingMsg: "Aktuell wartet niemand auf Freigabe.",
    approveBtn: "Freigeben",
    rejectBtn: "Ablehnen",
    rejectConfirmMsg: "Diese Registrierung ablehnen? Die Person verschwindet dauerhaft aus dieser Liste und bleibt ohne Zugriff.",
    rejectedMsg: "Abgelehnt",
    approvedMembersTitlePrefix: "Freigegebene Mitglieder (",
    adminBadge: "Admin",
    approvedMsg: "Freigegeben",

    userStatsTitle: "Nutzerstatistiken",
    userStatsLastLoginPrefix: "Zuletzt aktiv: ",
    userStatsLoginCountPrefix: "App-Aufrufe: ",
    userStatsNeverLoggedIn: "Noch nie genutzt",

    kostenstellenTitle: "Kostenstellen & Zugriffsrechte",
    newKostenstelleLabel: "Neue Kostenstelle anlegen",
    kostenstelleCodePlaceholder: "Code, z.B. 050010 CO",
    kostenstelleNamePlaceholder: "Name, z.B. Treasury",
    addKostenstelleBtn: "+ Kostenstelle anlegen",
    kostenstelleSavedMsg: "Kostenstelle angelegt",
    accessSavedMsg: "Zugriff aktualisiert",
    accessNoneOption: "Kein Zugriff",
    accessReadOption: "Nur Lesen",
    accessWriteOption: "Lesen & Schreiben",
    emptyKostenstellen: "Noch keine Kostenstellen angelegt.",
    noApprovedForAccessMsg: "Noch keine freigegebenen Kolleg:innen zum Zuweisen.",
    allTeamsScope: "Alle Teams (ganze Kostenstelle)",
    accessFilterPlaceholder: "Nach E-Mail filtern…",
    addUserSelectPlaceholder: "Person auswählen…",
    addUserToScopeBtn: "+ Hinzufügen",
    noGrantsForScopeMsg: "Noch niemand mit Zugriff.",
    coveredByAllTeamsMsg: "{n} Person(en) haben hier automatisch Zugriff über „Alle Teams“.",
    translatedReadonlyTitle: "Übersetzte Ansicht – zum Bearbeiten auf Deutsch (DE) umschalten.",
    themeToggleTitle: "Hell-/Dunkelmodus umschalten",
    teamsManagementTitle: "Teams verwalten",
    emptyTeamsForKostenstelle: "Noch keine Teams für diese Kostenstelle angelegt.",
    renameTeamBtn: "Umbenennen",
    deleteTeamBtn: "Löschen",
    newTeamNamePlaceholder: "Neues Team, z.B. Data Science",
    addTeamBtn: "+ Team anlegen",
    noKostenstellenAccessMsg: "Du hast noch keinen Zugriff auf eine Kostenstelle.",
    teamSavedMsg: "Team gespeichert",
    renameTeamPrompt: "Neuer Name für dieses Team:",
    deleteTeamConfirm: "Team wirklich löschen? Ideen/Prozesse mit diesem Team verlieren dann ihre Team-Zuordnung.",
    teamDeletedMsg: "Team gelöscht",
    unsavedChangesConfirm: "Es gibt ungespeicherte Änderungen. Diese Seite trotzdem verlassen und die Änderungen verwerfen?",

    dashFilterAllDept: "Alle Kostenstellen",
    dashFilterAllTeam: "Alle Teams",

    dashMatrixTitle: "Nutzen × Aufwand",
    dashMatrixEmpty: "Noch keine bewertbaren Use Cases in dieser Auswahl.",
    dashMatrixDiscardedHint: "{n} verworfene Idee(n) sind hier ausgeblendet.",
    dashMatrixCellLabel: "Use Case(s) in dieser Zelle:",
    dashAxisCaption: "→ Aufwand (1–5) · ↑ Nutzen (1–5)",

    dashTreeTitle: "Einheiten, Prozesse & Use Cases",
    dashTreeEmpty: "Noch keine Prozesse in dieser Auswahl.",

    dashStatusTitle: "Status je Team",
    dashStatusEmpty: "Noch keine Ideen in dieser Auswahl.",

    dashHeatmapTitle: "AI-Potenzial der Prozesse",
    dashHeatmapEmpty: "Noch keine Prozesse in dieser Auswahl.",

    dashRankingTitle: "Top Quick-Wins",
    dashRankingEmpty: "Keine offenen Use Cases in dieser Auswahl.",
    dashShowMore: "Mehr anzeigen",
    dashShowLess: "Weniger anzeigen",

    dashTimelineTitle: "Erfassungsverlauf",
    dashTimelineEmpty: "Noch keine Daten für einen Verlauf.",

    feedbackTitle: "App-Feedback",
    feedbackDesc: "Wie gefällt dir die App? Bewerte die folgenden Punkte und hinterlass uns gerne zusätzliches Feedback.",
    feedbackRatingUsability: "Benutzerfreundlichkeit",
    feedbackRatingDesign: "Design",
    feedbackRatingFeatures: "Funktionsumfang",
    feedbackRatingPerformance: "Geschwindigkeit",
    feedbackCommentLabel: "Freitext (optional)",
    feedbackCommentPlaceholder: "Was läuft gut, was können wir verbessern?",
    sendFeedbackBtn: "Feedback senden",
    feedbackSentMsg: "Danke für dein Feedback!",
    feedbackAdminTitle: "App-Feedback",
    feedbackResponseCountMsg: "{n} Rückmeldung(en) insgesamt.",
    feedbackCommentsTitle: "Freitext-Kommentare",
    emptyFeedback: "Noch kein Feedback vorhanden.",

    loadErrorPrefix: "Fehler beim Laden: ",
    saveErrorPrefix: "Fehler beim Speichern: ",
    deleteErrorPrefix: "Fehler beim Löschen: ",
    profileLoadErrorPrefix: "Fehler beim Laden des Profils: ",
    approveErrorPrefix: "Fehler beim Freigeben: ",
    rejectErrorPrefix: "Fehler beim Ablehnen: ",
  },
  en: {
    appName: "Process & AI Use Case Management",
    tagline:
      "Document your team's processes, screen them for AI potential, and capture AI use cases in seconds - including scoring and AI-assisted elaboration.",
    login: "Log in",
    requestAccessTab: "Request access",
    emailLabel: "Email address",
    emailPlaceholder: "you@email.com",
    passwordPlaceholder: "Password",
    loggingIn: "Logging in...",
    forgotPassword: "Forgot password?",
    requestAccessDesc:
      "For security reasons there's no open self-registration anymore. Just send me your name, the email address you'd like to use, and the cost center(s) and team(s) you need access to - I'll set up an account and send you a starting password.",
    requestAccessMailBtn: "📧 Open email to admin",
    requestAccessTeamsNote: "A quick Teams message works just as well.",
    errorPrefix: "Error: ",
    forgotPasswordContactMsg: "Please contact d.goos@house-of-communication.com - your password will be reset manually.",
    setNewPasswordTitle: "Set a new password",
    setNewPasswordDesc: "Choose a new password for your account.",
    newPasswordPlaceholder: "New password",
    savePassword: "Save password",
    passwordSavedMsg: "Password saved, you're logged in.",
    changePasswordTitle: "Change password",
    changePasswordDesc: "Set your own password any time - e.g. after a temporary one from the admin.",
    passwordChangedMsg: "Password changed",

    pendingTitle: "Waiting for approval",
    pendingDesc:
      "is confirmed, but still needs to be approved by an admin before you can see ideas and processes. Reach out to d.goos@house-of-communication.com.",
    checkStatus: "Check status",
    logout: "Log out",
    profileErrorTitle: "Profile not found",
    profileErrorDesc:
      "There was a problem loading your account profile. Please reload, or reach out to d.goos@house-of-communication.com.",

    startTab: "Start",
    ideasTab: "Ideas",
    processesTab: "Processes",
    dashboardTab: "Analytics",
    dashboardHeaderTitle: "Analytics",
    logoutBtn: "Log out",
    ideasHeaderTitle: "Ideas",
    processesHeaderTitle: "Processes",

    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    greetingNight: "Good night",
    aiPotentialAvgLabel: "Avg. AI potential in your area",
    realizedPotentialAvgLabel: "Avg. already realized",
    statOpenIdeasLabel: "Open ideas",
    statInProgressLabel: "In progress",
    statProcessesLabel: "Processes documented",
    quickAccessTitle: "Quick access",
    manageMoreTitle: "Manage & more",
    recentlyEditedTitle: "Recently edited",
    emptyRecentlyEdited: "Nothing edited yet.",
    utilGuideLabel: "Guide",
    utilTeamsLabel: "Teams",
    utilExportLabel: "Export",
    utilPermissionsLabel: "Access",
    utilSettingsLabel: "Settings",
    utilFeedbackLabel: "Feedback",
    adminOnlyTag: "Admin",
    brandFooterCaption: "A tool by",

    guideIntroEyebrow: "Quick guide",
    guideIntroLede:
      "Document your processes, check them for AI potential, and capture AI use cases in seconds — including scoring and AI-assisted elaboration.",
    guideAccessEyebrow: "Access",
    guideAccessH2: "How to get access",
    guideAccessDesc: "Your access is set up for you personally — a one-time effort, about a minute.",
    guideStep1Title: "Request access",
    guideStep1Desc:
      "Send the admin a short message: name, desired company email address, cost center(s) and team(s). Fastest via the „Request access” tab on the app's login screen — it opens a pre-filled email directly. A short Teams message works just as well. Contact:",
    guideStep2Title: "Get your credentials",
    guideStep2Desc: "The admin creates your account and sends you the email address and a starting password directly.",
    guideStep3Title: "Log in & get started",
    guideStep3Desc: "Open the app, log in with your email and starting password. Set your own password right away under „Settings”.",
    guidePendingTitle: "Says „Waiting for approval”?",
    guidePendingDesc:
      "Then your account exists, but approval and cost-center access aren't fully set up by the admin yet. Just ask — it's usually quick.",
    guideForgotTitle: "Forgot your password?",
    guideForgotDesc: "Contact the admin (see contact info below) or via Teams — they'll set you a new password.",

    guideTourEyebrow: "Tour",
    guideTourH2: "What happens in each tab",
    guideTourDesc: "The app has four main tabs, named and ordered here exactly as in the app.",
    guideStartF1Name: "AI-potential ring & metrics",
    guideStartF1Desc:
      "Average AI potential of your documented processes, plus open ideas, ideas in progress, and the number of documented processes — at a glance.",
    guideStartF2Name: "Quick access",
    guideStartF2Desc: "Direct tiles to Processes, Ideas and Analytics, plus „Manage & more” with Guide, Teams, Export and Settings.",
    guideStartF3Name: "Recently edited",
    guideStartF3Desc: "Your three most recently edited ideas and processes, so you can pick up right where you left off.",
    guideProcF1Name: "Document processes",
    guideProcF1Desc:
      "Capture recurring workflows in your area — e.g. creating quotes, invoice checking, customer onboarding. Optional, but helpful for spotting optimization potential.",
    guideProcF2Name: "AI potential & sub-processes",
    guideProcF2Desc: "Rate and justify each process's AI potential, and break larger workflows into sub-processes.",
    guideProcF3Name: "Process steps as a flowchart",
    guideProcF3Desc: "Build the flow as a chain of Start / Step / Decision / End, and mark per step where AI could help.",
    guideProcF4Name: "Documents, links & use cases",
    guideProcF4Desc:
      "Store SharePoint/Teams/OneDrive links (URLs only, no upload) and link ideas to the process — building an AI/process map step by step.",
    guideIdeaF1Name: "Capture in seconds",
    guideIdeaF1Desc:
      "Type a quick note the moment something occurs to you — on the way to a meeting or right at your desk. Filterable by cost center, team and use-case owner.",
    guideIdeaF2Name: "Score instead of guess",
    guideIdeaF2Desc:
      "Rate impact, feasibility, effort and risk — the app automatically classifies it: Quick Win, big project, nice to have, better postponed, needs review, barely feasible, or high risk.",
    guideIdeaF3Name: "Elaborate with AI",
    guideIdeaF3Desc:
      "Generate a starting prompt from Problem, Goal and Business Benefit, paste it into any AI tool (Copilot, ChatGPT, Claude, Gemini …), and optionally copy the answer back into the documentation — no API key needed.",
    guideIdeaF4Name: "Stage chains",
    guideIdeaF4Desc:
      "Does one idea build on another (e.g. GC12 → GC13 → GC14)? Link them here so it's visible everywhere which stage is currently being worked on.",
    guideIdeaF5Name: "Catalog fields & export",
    guideIdeaF5Desc:
      "Once an idea is ready: fill in the extra „For the Ambassador list” fields and use the Export tab to copy it, ready to paste, into the central AI Ambassadors use-case collection.",
    guideDashF1Name: "Impact × effort matrix",
    guideDashF1Desc: "All scored ideas positioned at a glance — Quick Wins top left.",
    guideDashF2Name: "Units, processes & use cases",
    guideDashF2Desc: "Tree view: which processes and ideas belong to which cost center/team.",
    guideDashF3Name: "Status per team & AI-potential heatmap",
    guideDashF3Desc: "How far along teams are with their ideas, and where processes have the most AI potential.",
    guideDashF4Name: "Top quick wins & history",
    guideDashF4Desc:
      "Ranking of the most promising open ideas, plus the capture history over time — all filterable by cost center and team.",

    guideFirstEyebrow: "Getting started",
    guideFirstH2: "Step by step, field by field",
    guideFirstDesc:
      "Not sure where to start or what a field means? Here is truly every step and every field, in exactly the order they appear in the app.",

    guideFirstProcTitle: "Document a process",
    guideFirstProc1: "Open the „Processes” tab.",
    guideFirstProc2: "At the top under „Document new process”, type the name — e.g. „Invoice checking” or „Create quotes”.",
    guideFirstProc3: "Select cost center and team — both are required, you can't save without them.",
    guideFirstProc4:
      "Tap „Save process” — the process appears immediately in the list below. Tap it to open it — from here it continues in four tiles.",
    guideFirstProc5:
      "First tile: „Process name” can be corrected here any time. „Parent process” is only needed if this process is actually a sub-step of a bigger workflow — otherwise leave it on „None (top-level process)”. Below that, „Sub-processes”: use „+ Create new sub-process” (asks for a name) to create child processes that automatically link back here. At the bottom, „Related use cases”: use „+ New idea for this process” (asks for a short note) to create a new, directly linked idea — to link an existing idea instead, do that later on the idea itself via „Related process”.",
    guideFirstProc6:
      "Second tile „AI potential”: set the slider from 1 (low) to 5 (high) — the app immediately shows an automatic classification above it. Below that, „Notes/reasoning”: why there's more or less potential, initial approaches.",
    guideFirstProc7:
      "Third tile „Process steps”: build the flow as a chain. Type a title at the bottom (e.g. „Check invoice”), choose a type (Start / Step / Decision / End), „+ Add step”. Each step can then be edited individually: give it a number (e.g. „2.1”), link it to a sub-process (for a detailed flow behind this step), move it with ▲/▼, edit title and note with ✏️, delete with 🗑. Each step also has its own AI-potential slider plus a note field, and — once use cases are linked to the process — checkboxes under „AI support from:” to mark exactly which idea applies at this step.",
    guideFirstProc8:
      "Fourth tile „Documents & links”: type a title, choose a kind (Link or Document), enter the URL, „+ Add” — addresses only, no file upload. Meant for links to SharePoint, Teams or OneDrive.",

    guideFirstIdeaTitle: "Capture an idea / use case",
    guideFirstIdea1: "Open the „Ideas” tab.",
    guideFirstIdea2: "At the top under „Capture new idea”, one sentence is enough — e.g. „Automatic summary of customer emails via AI”.",
    guideFirstIdea3: "Select cost center and team — required here too.",
    guideFirstIdea4:
      "Tap „Save idea” — done, it's immediately in the list. Tap it to open it — everything else is completely optional and can be filled in later at any time.",
    guideFirstIdea5:
      "First tile: „Short note” is the title you typed at the top — correctable here. Leave „Catalog ID” empty until the case has officially been given a GC number in the central list (see Export below). „Use-case owner/contact” is the name of the responsible person, if that's not you. „Status” (Planned/PoC, In progress, Integrated, Discarded) and „Cost center/team” can be changed here any time. „Tags” are free text, comma-separated, e.g. „Sales, Automation”.",
    guideFirstIdea6:
      "Second tile (Description): „Problem” — what's currently difficult/time-consuming; „Goal” — what should the solution actually achieve; „Business Benefit” — what benefit results (time, quality, cost, risk); „Quantified benefit” as a number, e.g. „20 hrs/year saved”; „Qualitative benefit”, e.g. „better basis for decisions”.",
    guideFirstIdea7:
      "Third tile „Scoring”: four sliders from 1–5 — impact, feasibility, effort, risk. The banner above shows the resulting classification live: Quick Win, big project, nice to have, better postponed, needs review, barely feasible, or high risk.",
    guideFirstIdea8:
      "Fourth tile „Solution approach”: „AI role” (dropdown, e.g. what kind of AI use); „Tools & implementation options” — concrete tools/frameworks; „Systems” — platforms involved, deliberately separate from tools; „Input (data source)” — where does the data come from; „Output (data output)” — what does the use case deliver; „Key considerations upfront” — e.g. data privacy, cost, risks.",
    guideFirstIdea9:
      "Fifth tile „For the Ambassador list”: „Kind of KPI”, „List priority” (auto-set and locked for some statuses), „Comment”, „Skill level” (e.g. „Skill 2 - Ambassador”). These fields aren't needed for daily use, but for a complete entry in the central list.",
    guideFirstIdea10:
      "Expandable „AI support” section: „Generate starting prompt” needs Problem, Goal and Business Benefit filled in first. Paste the generated text into any AI tool (Copilot, ChatGPT, Claude, Gemini …) and optionally copy the answer back under „AI response (note)” — it isn't evaluated automatically.",
    guideFirstIdea11:
      "„Stage chain” tile: „Related process” links the idea to a process. Set „Previous stage” if this idea is the further development of another one (e.g. GC12 → GC13). „+ Create next stage” creates the next stage directly, with cost center, team and process carried over automatically.",
    guideFirstIdea12:
      "„Other processes” tile: link additional processes if the idea is relevant elsewhere beyond the „Related process” set above. Don't forget „Save” at the very bottom — free-text fields are only saved then.",

    guideFirstExportNewTitle: "Export a new case to the Ambassador list",
    guideFirstExportNew1:
      "Go to the „Export” tile (under „Manage & more”). At the top are all ideas without a Catalog ID — i.e. all the ones not yet in the central list.",
    guideFirstExportNew2:
      "Before copying, briefly check the idea's „Solution approach” and „For the Ambassador list” fields (AI role, Systems, Input, Output, Kind of KPI, Benefit, Comment, Priority, Skill level) — optional for daily use, but relevant for a complete case in the list.",
    guideFirstExportNew3:
      "Tap „📋 Tab-separated (Excel row)” on the idea — or „📋 Copy” for a readable text version, e.g. to post it into a chat with Claude instead, if you want help classifying it.",
    guideFirstExportNew4:
      "Append a new row in the Ambassador Excel list and paste it there (Ctrl+V). Leave „ID Nr” empty — enter the next free GC number there yourself. Brand/Agency are already pre-filled with „Shared Service”/„Group Controlling”. Drag the translation formula columns („#CONNECT!”) down afterward from the row above.",
    guideFirstExportNew5:
      "Enter the Catalog ID assigned there (e.g. „GC30”) back in the app on this idea under „Catalog ID” and save. The idea then disappears from this list and appears below under updates from now on.",

    guideFirstExportUpdateTitle: "Update an already-exported case",
    guideFirstExportUpdate1:
      "Once an idea has a Catalog ID, it automatically appears in the lower „Update already synced cases” area (sorted by Catalog ID) — no extra step needed.",
    guideFirstExportUpdate2:
      "Useful once you've further edited such an idea in the app (e.g. changed the scoring, added text) and want the central list's status to catch up — the app doesn't sync anything on its own.",
    guideFirstExportUpdate3:
      "Tap „📋 Update row (Excel)” on the idea (or „📋 All update rows” to copy several cases at once).",
    guideFirstExportUpdate4:
      "Unlike the new-export row, this row has the Catalog ID first, so it's clear which row is affected, plus four auto-filled columns on the far right: change status („changed”), changed by (your email), change date (today). „What was changed” stays empty, optionally fill it in yourself.",
    guideFirstExportUpdate5:
      "Important: don't paste this row as a new row — paste it directly onto the existing row with the matching ID Nr in the list (select the row, Ctrl+V) — this overwrites the old row entirely with the current state from the app.",

    guideMoreEyebrow: "Manage & more",
    guideMoreH2: "The rest of quick access",
    guideMoreDesc: "Reachable via the „Manage & more” tile on the start page.",
    guideMgmtExportD: "Bridge to the central AI Ambassadors use-case collection — pure copy & paste, nothing runs automatically or syncs.",
    guideMgmtTeamsD: "With full write access to a cost center you can create, rename or delete its teams here.",
    guideMgmtSettingsD: "Set your own password. Language (DE/EN) and light/dark mode can be switched top-right on every screen.",
    guideMgmtAccessD: "Visible to admins only: create and approve new accounts, and manage cost-center/team access per person.",

    guideGoodEyebrow: "Good to know",
    guideGoodH2: "Three things upfront",
    guideGood1Title: "Rights are tiered",
    guideGood1Desc:
      "Access is granted per cost center and team (read-only or read & write) — depending on your grant you'll see or edit more or less.",
    guideGood2Title: "Voluntary, not a replacement",
    guideGood2Desc:
      "Using this is voluntary and doesn't replace the official reporting within the AI Ambassador organization — but the export gives you the input ready to paste for that.",
    guideGood3Title: "Still evolving",
    guideGood3Desc: "Features may still change. Bugs and ideas for the app itself are welcome directly to the admin.",

    guideDeviceEyebrow: "Extra tip",
    guideDeviceH2: "Set up on your own device",
    guideDeviceDesc: "No app store, no IT request needed — afterward the app starts up like any other, with its own icon.",
    guideDevice1Name: "Laptop · Chrome / Edge",
    guideDevice1Li1: "Click the install icon on the right of the address bar",
    guideDevice1Li2: "or menu ⋮ → „Install app”",
    guideDevice2Name: "Laptop · Safari (Mac)",
    guideDevice2Li1: "Menu „File” → „Add to Dock”",
    guideDevice2Li2: "from macOS Sonoma — otherwise save as a bookmark",
    guideDevice3Name: "iPhone · Safari",
    guideDevice3Li1: "Tap the share icon (square with an arrow)",
    guideDevice3Li2: "Choose „Add to Home Screen”",
    guideDevice4Name: "Android · Chrome",
    guideDevice4Li1: "Open menu ⋮",
    guideDevice4Li2: "Choose „Install app”",

    guideFooter1: "Questions or access? Send the admin a short message (currently",
    guideFooter1Suffix: ") or via Teams.",
    guideFooter2: "All data stays within the team — visible only to approved colleagues with a company email address.",

    newIdeaLabel: "Capture a new idea",
    ideaPlaceholder: "e.g. Automatic summary of customer emails via AI...",
    saveIdea: "Save idea",
    ideaSavedMsg: "Idea saved",
    filterAll: "All",
    filterAllKostenstellenOption: "All cost centers",
    filterAllTeamsOption: "All teams",
    filterAllOwnersOption: "All use case owners",
    emptyIdeas: "No ideas yet. Add your first one above!",
    loadingIdeas: "Loading ideas...",

    status_planned: "Planned / PoC",
    status_in_progress: "In progress",
    status_done: "Integrated",
    status_discarded: "Discarded",

    priority_quickWin: "Quick win",
    priority_bigProject: "Big project",
    priority_niceToHave: "Nice to have",
    priority_postpone: "Better postpone",
    priority_review: "Review",
    priority_hardToImplement: "Hard to implement",
    priority_highRisk: "High risk",

    ai_high: "High AI potential",
    ai_low: "Low AI potential",
    ai_medium: "Medium AI potential",

    backBtn: "← Back",
    deleteBtn: "Delete",
    quickNoteLabel: "Quick note",
    statusLabel: "Status",
    relatedProcessLabel: "Related process",
    noneOption: "— None —",
    additionalProcessesLabel: "Additional processes",
    additionalProcessesDesc:
      "On top of the process assigned above (which drives the stage chain), this use case can also show up as linked to other processes.",
    emptyAdditionalProcesses: "No additional processes linked yet.",
    addProcessBtn: "+ Add",
    processLinkedMsg: "Process linked",
    processUnlinkedMsg: "Link removed",
    stageChainTitle: "Stage chain",
    stageChainDesc:
      "Is this use case the first step, or a follow-up on another one (e.g. GC12 → GC13 → GC14)? Link it here so everyone can see which stage is currently being worked on.",
    previousStageLabel: "Previous stage",
    noneFirstStageOption: "— None (first stage) —",
    stageChainPositionLabel: "Position in the stage chain",
    stagePrefix: "Stage ",
    followUpStagesTitle: "Follow-up stages",
    emptyFollowUpStages: "No follow-up stage yet.",
    addFollowUpStageBtn: "+ Add follow-up stage",
    newFollowUpStagePrompt: "Quick note for the new follow-up stage:",
    followUpStageSavedMsg: "Follow-up stage saved",
    lastSavedTitle: "Last saved",
    tagsLabel: "Tags (comma-separated)",
    tagsPlaceholder: "e.g. Sales, Automation",
    descriptionPlaceholder: "What's the problem, what should the solution achieve?",
    problemLabel: "Problem",
    problemPlaceholder: "What problem should be solved? What's currently hard/slow/error-prone?",
    goalLabel: "Goal",
    goalPlaceholder: "What should the solution actually achieve?",
    businessBenefitLabel: "Business Benefit",
    businessBenefitPlaceholder: "What concrete benefit (time, quality, cost, risk) does this create?",
    departmentLabel: "Cost center",
    teamLabel: "Team",
    selectPlaceholderOption: "— Please select —",
    departmentTeamRequiredMsg: "Please select cost center and team.",
    readOnlyNotice: "Read-only access to this cost center - changes here can't be saved.",
    listFieldsHint:
      "Fields with a colored left border are also part of the central AI Ambassadors Usecase Collection (🔄 Export) - all other fields only exist here in the app.",
    solutionApproachTitle: "Solution approach",
    listDetailsTitle: "For the Ambassador list",
    aiRoleLabel: "AI role",
    systemeLabel: "Systems",
    systemePlaceholder: "Systems/platforms involved (own column in the list, separate from AI solution)",
    inputSourceLabel: "Input (data source)",
    inputSourcePlaceholder: "Where does the data/input come from?",
    outputResultLabel: "Output (result)",
    outputResultPlaceholder: "What does the use case deliver as a result?",
    kpiKindLabel: "Kind of KPI",
    quantifiedBenefitLabel: "Quantified benefit",
    quantifiedBenefitPlaceholder: "e.g. 20 hrs/year saved",
    qualitativeBenefitLabel: "Qualitative benefit",
    qualitativeBenefitPlaceholder: "e.g. better basis for decisions",
    commentLabel: "Comment",
    listPriorityLabel: "Priority (catalog)",
    skillLevelLabel: "Skill level (catalog)",
    skillLevelPlaceholder: "e.g. Skill 2 - Ambassador (only filled in sporadically in the list)",
    catalogIdLabel: "Catalog ID",
    catalogIdPlaceholder: "e.g. GC29 (must be unique)",
    ownerNameLabel: "Use case owner / contact",
    ownerNamePlaceholder: "Name of the responsible person",

    exportTitle: "Copy new ideas into the AI Ambassadors Usecase Collection",
    exportIntro:
      "This lists every idea that doesn't have a catalog ID yet - i.e. isn't in the central AI Ambassadors Usecase Collection yet. Important: this is plain copy & paste, nothing here writes or syncs anything automatically. Copy one idea (or all of them) and paste it yourself as a new row into the Usecase Collection (easiest with the tab-separated option below), or post the text into the chat with Claude instead if you'd like help sorting it out. Enter the catalog ID assigned there (e.g. GC30) back on the idea afterwards, then it disappears from this list and shows up under the updates section below instead.",
    exportFieldsNote:
      "Check before copying: the idea has an expandable \"Additional catalog fields\" section (AI role, systems, input, output, kind of KPI, quantified/qualitative benefit, comment, priority, skill level). Those are optional for everyday use - but for a complete case in the Usecase Collection they're exactly the fields that matter, so fill them in before copying.",
    exportEmpty: "Every idea already has a catalog ID - nothing to copy.",
    copyOneBtn: "📋 Copy",
    copyAllBtn: "📋 Copy all",
    copyTsvOneBtn: "📋 Tab-separated (Excel row)",
    copyTsvAllBtn: "📋 All as Excel rows",
    exportTsvNote:
      "Plain copy & paste: paste the Excel row(s) starting at a new row in the AI Ambassadors Usecase Collection (Ctrl+V) - none of this happens automatically. ID Nr stays blank - fill in the next free GC number from the Collection there. Brand/Agency default to \"Shared Service\"/\"Group Controlling\". Afterwards drag the translation formula columns (\"#CONNECT!\") down from the row above.",

    updateExportTitle: "Update already-synced cases",
    updateExportIntro:
      "This lists every idea that already has a catalog ID - i.e. was already copied into the Usecase Collection before. If you kept editing one of them in the app, copy an up-to-date Excel row here and use it to overwrite the existing row with that ID Nr in the Collection (Ctrl+V directly onto the existing row, not as a new row!). Also plain copy & paste, nothing runs automatically.",
    updateExportFieldsNote:
      "The row additionally fills in Änderungsstatus (\"geändert\"), Geändert von (your email) and Änderungsdatum (today) - \"Was wurde geändert\" stays blank for you to fill in yourself, nobody currently maintains that column in the list.",
    updateExportEmpty: "No ideas with a catalog ID yet - nothing to update.",
    copyUpdateTsvOneBtn: "📋 Update row (Excel)",
    copyUpdateTsvAllBtn: "📋 All update rows",

    evaluationTitle: "Scoring",
    impactLabel: "Impact",
    feasibilityLabel: "Feasibility",
    effortLabel: "Effort",
    riskLabel: "Risk",
    assessmentPrefix: "Assessment: ",

    aiSupportTitle: "AI support",
    aiSupportDesc:
      "Generates a prompt that guides an AI to assess possible implementation paths for this use case (tool tier needed, limits, scalability, IT involvement ...). Requires problem, goal and business benefit above to already be filled in - those are taken as a fixed given, not reinvented. Paste the prompt into any AI chat tool (Copilot, ChatGPT, Claude, Gemini, ...) and optionally paste the reply back below for documentation - it isn't evaluated automatically.",
    generatePromptBtn: "📋 Generate starter prompt",
    aiResponsePasteLabel: "AI reply (optional note)",
    aiResponsePlaceholder: "Paste the AI's reply/summary here for documentation (optional)",

    toolsLabel: "Tools & implementation options",
    toolsPlaceholder: "e.g. concrete tools/frameworks that make sense for the implementation",
    considerationsLabel: "Key considerations upfront",
    considerationsPlaceholder: "e.g. Privacy, data sources, cost",
    startPromptLabel: "Starter prompt for the project",
    startPromptPlaceholder: "Filled in by clicking \"Generate starter prompt\", or write it yourself",
    copyStartPromptBtn: "Copy starter prompt",
    kickoffPromptRequiresFieldsMsg: "Please fill in problem, goal and business benefit first.",
    kickoffPromptGeneratedMsg: "Starter prompt generated",

    saveBtn: "Save",
    savingBtn: "Saving...",
    savedMsg: "Saved",
    deleteIdeaConfirm: "Really delete this idea?",
    ideaDeletedMsg: "Idea deleted",
    copiedMsg: "Copied to clipboard",
    copyFailedMsg: "Couldn't copy, please select manually",
    newProcessLabel: "Document a new process",
    processPlaceholder: "e.g. Creating quotes, invoice review, customer onboarding...",
    saveProcessBtn: "Save process",
    processSavedMsg: "Process saved",
    emptyProcesses: "No processes yet. Add the first process of your area above!",
    loadingProcesses: "Loading processes...",

    processNameLabel: "Process name",
    processStatusLabel: "Progress status",
    processStatus_open: "In progress",
    processStatus_reviewed: "Fully described",
    parentProcessLabel: "Parent process",
    noneTopLevelOption: "— None (top-level process) —",
    aiPotentialTitle: "AI potential",
    aiPotentialLabel: "AI potential",
    realizedPotentialLabel: "Already realized",
    openPotentialLabel: "Open potential",
    notesLabel: "Notes / rationale",
    notesPlaceholder: "Why much/little potential? Initial approaches?",
    subProcessesTitle: "Sub-processes",
    emptySubProcesses: "No sub-processes assigned yet.",
    addSubProcessBtn: "+ Add new sub-process",
    linkedUseCasesTitle: "Related use cases",
    emptyLinkedIdeas: "No idea for this process yet.",
    addIdeaBtn: "+ Add new idea for this process",
    newIdeaPrompt: "Quick note for the new idea:",
    newSubProcessPrompt: "Name of the new sub-process:",
    deleteProcessConfirm: "Really delete this process? Linked ideas stay, but lose their assignment.",
    processDeletedMsg: "Process deleted",
    subProcessSavedMsg: "Sub-process saved",
    duplicateProcessBtn: "🗐 Duplicate",
    duplicateNameSuffix: " (Copy)",
    processDuplicatedMsg: "Process duplicated – steps and documents were carried over",

    processStepsTitle: "Process steps",
    processStepsDesc: "Build the workflow as a chain of steps - for a visual overview like a flowchart.",
    stepType_start: "Start",
    stepType_step: "Step",
    stepType_decision: "Decision",
    stepType_end: "End",
    newStepPlaceholder: "New step, e.g. Review invoice",
    newStepDescPlaceholder: "Note for this step (optional)",
    addStepBtn: "+ Add step",
    editStepBtn: "Edit",
    deleteStepBtn: "Delete",
    deleteStepConfirm: "Really delete this step?",
    editStepTitlePrompt: "Step title:",
    editStepDescPrompt: "Note for this step (optional):",
    emptyProcessSteps: "No steps yet.",
    stepSavedMsg: "Step saved",
    stepDeletedMsg: "Step deleted",
    stepAiPotentialNotePlaceholder: "Short note on this step's AI potential",
    stepNoLinkedProcessOption: "— No detail process —",
    stepNumberPlaceholder: "No. (e.g. 2.1)",
    stepIdeaFlagsLabel: "AI support from:",

    processResourcesTitle: "Documents & links",
    processResourcesDesc:
      "Links to documents (e.g. SharePoint, Teams, OneDrive) or websites related to this process. No file upload - just paste the URL.",
    resourceKind_link: "Link",
    resourceKind_document: "Document",
    newResourceLabelPlaceholder: "Title",
    newResourceUrlPlaceholder: "https://...",
    addResourceBtn: "+ Add",
    emptyProcessResources: "No documents/links yet.",
    deleteResourceConfirm: "Really delete this entry?",
    invalidUrlMsg: "Please enter a valid URL starting with http:// or https://.",
    resourceSavedMsg: "Entry saved",
    resourceDeletedMsg: "Entry deleted",

    createUserTitle: "Create new user",
    createUserDesc: "Creates the account directly (no email needed). Approval and cost center access stay a deliberately separate step further down.",
    newUserPasswordLabel: "Starting password",
    newUserPasswordPlaceholder: "At least 6 characters",
    generatePasswordBtn: "🎲 Generate",
    createUserBtn: "Create account",
    createUserValidationMsg: "Please enter an email and a password with at least 6 characters.",
    userCreatedMsgPrefix: "Account created: ",
    createUserErrorPrefix: "Error creating account: ",
    prepareRegistrationMailBtn: "✉️ Prepare info email",
    registrationMailValidationMsg: "Please fill in email and password first.",
    resetPasswordBtn: "🔑 Reset password",
    resetPasswordConfirmPrefix: "Set a new password for ",
    resetPasswordConfirmSuffix: "? They won't be able to log in with the old password anymore after this.",
    passwordResetMsgPrefix: "New password set for ",
    resetPasswordErrorPrefix: "Error resetting password: ",
    passwordResetMailSubject: "New password for the \"Process- and AI-Usecases Management\" app",
    passwordResetMailBody: "Hi,\n\nyour password has been reset.\n\nEmail: {email}\nNew password: {password}\n(Please set your own password under \"Settings\" right after logging in.)\n\nBest regards",
    registrationMailSubject: "Access to the \"Process- and AI-Usecases Management\" app",
    registrationMailBody: "Hi,\n\nYou've been given access to the \"Process- and AI-Usecases Management\" app.\n\nYou can log in with these credentials:\n\nEmail: {email}\nStarting password: {password}\n(Please change it right after your first login.)\n\nThe basic idea behind this app is to capture your ideas around AI and process improvement in a very simple way. In the \"Processes\" tab you can describe the basic, recurring workflows of your daily work (using this feature is optional and can help identify potential for improvement). The actual core area is the \"Ideas\" tab. Here you can quickly and easily capture any idea for a possible AI use case that comes to mind, and refine it later at your own pace. If you've documented your processes, you can link AI cases to the relevant steps there, so you end up with a kind of AI/process map.\n\nHere's the app: {appUrl}\n\nA detailed guide is available here: {guideUrl}\n\nBy the way: using the app is optional, not mandatory, and doesn't replace reporting AI cases as part of the AI Ambassador organization (the app can actually support you there too, e.g. by giving you the input for your use case list ready to copy-paste with one click).\n\nPlease note that the app is still under construction. Feel free to report any bugs. Some functionality may also still change here and there.\n\nOtherwise, have fun with it and feel free to reach out with any questions.\n\nBest regards,\nDavid",
    impersonateBtn: "🔑 Test login",
    impersonatePopupBlockedMsg: "A popup blocker prevented the test tab - please allow popups for this site.",
    impersonateErrorPrefix: "Error starting test login: ",
    impersonationBannerPrefix: "🧪 Testing as ",
    impersonationBannerCloseBtn: "Close tab",

    pendingApprovalTitlePrefix: "Waiting for approval (",
    noPendingMsg: "No one is currently waiting for approval.",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    rejectConfirmMsg: "Reject this registration? The person disappears from this list permanently and stays without access.",
    rejectedMsg: "Rejected",
    approvedMembersTitlePrefix: "Approved members (",
    adminBadge: "Admin",
    approvedMsg: "Approved",

    userStatsTitle: "User statistics",
    userStatsLastLoginPrefix: "Last active: ",
    userStatsLoginCountPrefix: "App opens: ",
    userStatsNeverLoggedIn: "Never used",

    kostenstellenTitle: "Cost centers & access",
    newKostenstelleLabel: "Add a new cost center",
    kostenstelleCodePlaceholder: "Code, e.g. 050010 CO",
    kostenstelleNamePlaceholder: "Name, e.g. Treasury",
    addKostenstelleBtn: "+ Add cost center",
    kostenstelleSavedMsg: "Cost center added",
    accessSavedMsg: "Access updated",
    accessNoneOption: "No access",
    accessReadOption: "Read only",
    accessWriteOption: "Read & write",
    emptyKostenstellen: "No cost centers set up yet.",
    noApprovedForAccessMsg: "No approved colleagues to assign yet.",
    allTeamsScope: "All teams (whole cost center)",
    accessFilterPlaceholder: "Filter by email…",
    addUserSelectPlaceholder: "Select person…",
    addUserToScopeBtn: "+ Add",
    noGrantsForScopeMsg: "No one has access here yet.",
    coveredByAllTeamsMsg: "{n} people already have access here via \"All teams\".",
    translatedReadonlyTitle: "Translated view – switch to German (DE) to edit.",
    themeToggleTitle: "Toggle light/dark mode",
    teamsManagementTitle: "Manage teams",
    emptyTeamsForKostenstelle: "No teams set up for this cost center yet.",
    renameTeamBtn: "Rename",
    deleteTeamBtn: "Delete",
    newTeamNamePlaceholder: "New team, e.g. Data Science",
    addTeamBtn: "+ Add team",
    noKostenstellenAccessMsg: "You don't have access to any cost center yet.",
    teamSavedMsg: "Team saved",
    renameTeamPrompt: "New name for this team:",
    deleteTeamConfirm: "Really delete this team? Ideas/processes with this team will lose their team assignment.",
    teamDeletedMsg: "Team deleted",
    unsavedChangesConfirm: "You have unsaved changes. Leave this page anyway and discard them?",

    dashFilterAllDept: "All cost centers",
    dashFilterAllTeam: "All teams",

    dashMatrixTitle: "Impact × effort",
    dashMatrixEmpty: "No assessable use cases in this selection yet.",
    dashMatrixDiscardedHint: "{n} discarded idea(s) are hidden here.",
    dashMatrixCellLabel: "Use case(s) in this cell:",
    dashAxisCaption: "→ Effort (1–5) · ↑ Impact (1–5)",

    dashTreeTitle: "Units, processes & use cases",
    dashTreeEmpty: "No processes in this selection yet.",

    dashStatusTitle: "Status by team",
    dashStatusEmpty: "No ideas in this selection yet.",

    dashHeatmapTitle: "AI potential of the processes",
    dashHeatmapEmpty: "No processes in this selection yet.",

    dashRankingTitle: "Top quick wins",
    dashRankingEmpty: "No open use cases in this selection.",
    dashShowMore: "Show more",
    dashShowLess: "Show less",

    dashTimelineTitle: "Collection progress over time",
    dashTimelineEmpty: "No data for a timeline yet.",

    feedbackTitle: "App feedback",
    feedbackDesc: "How do you like the app? Rate the points below and feel free to leave us additional feedback.",
    feedbackRatingUsability: "Usability",
    feedbackRatingDesign: "Design",
    feedbackRatingFeatures: "Feature set",
    feedbackRatingPerformance: "Speed",
    feedbackCommentLabel: "Free text (optional)",
    feedbackCommentPlaceholder: "What works well, what could we improve?",
    sendFeedbackBtn: "Send feedback",
    feedbackSentMsg: "Thanks for your feedback!",
    feedbackAdminTitle: "App feedback",
    feedbackResponseCountMsg: "{n} response(s) in total.",
    feedbackCommentsTitle: "Free-text comments",
    emptyFeedback: "No feedback yet.",

    loadErrorPrefix: "Error loading: ",
    saveErrorPrefix: "Error saving: ",
    deleteErrorPrefix: "Error deleting: ",
    profileLoadErrorPrefix: "Error loading profile: ",
    approveErrorPrefix: "Error approving: ",
    rejectErrorPrefix: "Error rejecting: ",
  },
};

const STATUS_ORDER = ["planned", "in_progress", "done", "discarded"];

// Kostenstelle (das Pflichtfeld "department" bei ideas/processes) kommt
// aus der Tabelle "kostenstellen", Team aus der Tabelle "teams" (siehe
// kostenstellenCache/teamsCache/myGrants) - beide mit individuellem
// Zugriffslevel pro Person. Teams gehören zu genau einer Kostenstelle
// (nicht global) und werden über die Verwaltungsoberfläche gepflegt, wer
// Vollzugriff auf die jeweilige Kostenstelle hat.

// Zusätzliche, optionale Katalog-Felder für den Abgleich mit dem
// bestehenden Excel-Use-Case-Katalog. Werte bewusst nicht übersetzt
// (unabhängig von der UI-Sprache), damit Import/Export mit der Liste
// exakt passt.
const AI_ROLE_OPTIONS = ["Automatisieren", "Ergänzen", "Ersetzen", "Intelligenter Assistenzpartner"];
const KPI_KIND_OPTIONS = ["Quantity", "Quality", "Hybrid"];
// Bei den Status "done" (Integrated) und "discarded" (Verworfen) wird
// list_priority automatisch gesetzt und ist nicht frei wählbar (siehe
// listPriorityOptionsHtml/schema.sql-Check-Constraint). Bei allen anderen
// Status ist nur High/Medium/Low wählbar, Default "Low".
const LIST_PRIORITY_FORCED_BY_STATUS = { done: "in using", discarded: "ungültig" };
const LIST_PRIORITY_FREE_OPTIONS = ["High", "Medium", "Low"];
const LIST_PRIORITY_DEFAULT = "Low";

// Freitext-Felder mit optionaler "_en"-Übersetzungsspalte (vom Admin auf
// Zuruf im Chat gepflegt, siehe README "Zweisprachige Inhalte").
const TRANSLATABLE_IDEA_FIELDS = [
  "quick_note",
  "problem",
  "goal",
  "business_benefit",
  "considerations",
  "qualitative_benefit",
  "comment",
];
const TRANSLATABLE_PROCESS_FIELDS = ["name", "notes"];

let currentUser = null;
let currentProfile = null;
let ideasCache = [];
let processesCache = [];
let profilesCache = [];
let kostenstellenCache = [];
// Welche Kostenstellen-Karten im Admin-Zugriffsbereich eingeklappt sind.
// Startet leer und wird beim ersten renderAdmin()-Lauf mit allen Codes
// gefüllt (siehe kostenstellenCollapseInitialized) - so ist beim ersten
// Öffnen alles eingeklappt, spätere Auf-/Zuklapp-Klicks des Admins bleiben
// aber über Re-Renders hinweg erhalten.
let collapsedKostenstellen = new Set();
let kostenstellenCollapseInitialized = false;
let teamsCache = [];
let myGrants = [];
let accessCache = [];
let activeFilter = "all";
let activeDeptFilter = "";
let activeTeamFilter = "";
let activeOwnerFilter = "";
let passwordRecoveryMode = false;
let authMode = "login";

const $app = document.getElementById("app");

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

// Manche Freitext-Felder (siehe TRANSLATABLE_IDEA_FIELDS/TRANSLATABLE_PROCESS_FIELDS)
// haben eine "_en"-Spalte für eine vom Admin gepflegte Übersetzung (auf
// Zuruf im Chat übersetzt und per SQL eingetragen, siehe README). Ist die
// UI-Sprache Englisch und eine Übersetzung vorhanden, wird sie angezeigt;
// sonst automatisch das Original, damit nie ein Feld leer wirkt.
function trValue(obj, field) {
  if (currentLang === "en" && obj[`${field}_en`]) return obj[`${field}_en`];
  return obj[field] || "";
}

// Ein Feld, das gerade die (vom Admin gepflegte) Übersetzung zeigt, wird
// nicht bearbeitbar - sonst würde ein Speichern versehentlich die
// englische Anzeige in die deutsche Originalspalte zurückschreiben. Zum
// Bearbeiten einfach auf Deutsch (DE) umschalten.
function isTranslatedReadonly(obj, field) {
  return currentLang === "en" && !!obj[`${field}_en`];
}

function trReadonlyAttr(obj, field) {
  return isTranslatedReadonly(obj, field) ? ` readonly title="${escapeHtml(t("translatedReadonlyTitle"))}"` : "";
}

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(currentLang === "en" ? "en-GB" : "de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

// Dauerhafter Hinweis-Balken für Test-Tabs aus "Als User anmelden" (siehe
// impersonateUser/js/supabaseClient.js) - läuft bei jedem render() erneut,
// weil dieser Tab sonst leicht mit einer normalen Session verwechselt werden
// könnte.
function updateImpersonationBanner() {
  let el = document.getElementById("impersonation-banner");
  if (!window.isImpersonationTab || !currentUser) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("div");
    el.id = "impersonation-banner";
    document.body.prepend(el);
  }
  el.innerHTML = `
    <span>${t("impersonationBannerPrefix")}${escapeHtml(currentUser.email)}</span>
    <button id="impersonation-close-btn" type="button">${t("impersonationBannerCloseBtn")}</button>
  `;
  const closeBtn = document.getElementById("impersonation-close-btn");
  closeBtn.addEventListener("click", () => window.close());
}

function priorityInfo(idea) {
  const impact = idea.impact || 3;
  const effort = idea.effort || 3;
  const feasibility = idea.feasibility || 3;
  const risk = idea.risk || 3;
  // Machbarkeit/Risiko wirken als Vorabprüfung vor der eigentlichen
  // Impact/Effort-Matrix: kaum machbare oder riskante Ideen sollen nicht als
  // "Quick Win" erscheinen, egal wie gut Impact/Effort sonst aussehen.
  if (feasibility <= 2) return { label: t("priority_hardToImplement"), color: "#ef4444", icon: "🚧" };
  if (risk >= 4) return { label: t("priority_highRisk"), color: "#f97316", icon: "⚠️" };
  if (impact >= 4 && effort <= 2) return { label: t("priority_quickWin"), color: "#22c55e", icon: "🚀" };
  if (impact >= 4 && effort >= 4) return { label: t("priority_bigProject"), color: "#8b5cf6", icon: "🏗️" };
  if (impact <= 2 && effort <= 2) return { label: t("priority_niceToHave"), color: "#93c5fd", icon: "✨" };
  if (impact <= 2 && effort >= 4) return { label: t("priority_postpone"), color: "#9aa1af", icon: "⏳" };
  return { label: t("priority_review"), color: "#fcd34d", icon: "🔍" };
}

function ideaScore(idea) {
  return (idea.impact || 3) - (idea.effort || 3) + (idea.feasibility || 3) - (idea.risk || 3);
}

function aiPotentialInfo(value) {
  const v = value || 3;
  if (v >= 4) return { label: t("ai_high"), color: "#22c55e" };
  if (v <= 2) return { label: t("ai_low"), color: "#9aa1af" };
  return { label: t("ai_medium"), color: "#fcd34d" };
}

// Bearbeitungsstatus eines Prozesses (Spalte "status" in processes, siehe
// schema.sql): "reviewed" = fertig beschrieben, alles andere (Default
// "open") = noch in Arbeit. Icon statt reinem Farbpunkt, damit es sich in
// der Kachel eindeutig von der AI-Potenzial-Bewertung unterscheidet.
function processStatusInfo(status) {
  if (status === "reviewed") {
    return { icon: "✅", label: t("processStatus_reviewed"), className: "reviewed" };
  }
  return { icon: "🚧", label: t("processStatus_open"), className: "open" };
}

// Zweigeteilter Balken: realisierter Anteil (fest eingefärbt) + offener
// Anteil in der AI-Potenzial-Farbe, damit auf einen Blick sichtbar wird,
// wo Effizienz schon gehoben wurde und wo noch Potenzial frei liegt.
function potentialBarHtml(aiPotential, realizedPct) {
  const realized = Math.min(100, Math.max(0, realizedPct || 0));
  const open = 100 - realized;
  const openColor = aiPotentialInfo(aiPotential).color;
  return `
    <div class="potential-bar" title="${escapeHtml(t("realizedPotentialLabel"))}: ${realized}%">
      ${realized ? `<div class="potential-bar-realized" style="width:${realized}%;"></div>` : ""}
      ${open ? `<div class="potential-bar-open" style="width:${open}%; background:${openColor};"></div>` : ""}
    </div>
  `;
}

function feedbackAvgRow(label, avg) {
  const pct = Math.max(0, Math.min(100, (avg / 5) * 100));
  return `
    <div class="feedback-avg-row">
      <div class="feedback-avg-label">${escapeHtml(label)}</div>
      <div class="potential-bar"><div class="potential-bar-realized" style="width:${pct}%;"></div></div>
      <div class="feedback-avg-value">${avg.toFixed(1)}/5</div>
    </div>
  `;
}

function langToggleButton() {
  const nextLang = currentLang === "de" ? "en" : "de";
  return `<button class="icon-btn" id="lang-btn" data-next-lang="${nextLang}">${nextLang.toUpperCase()}</button>`;
}

function bindLangToggle() {
  const btn = document.getElementById("lang-btn");
  if (btn) {
    btn.addEventListener("click", () => setLang(btn.dataset.nextLang));
  }
}

function helmetIcon(variant) {
  return `<svg class="theme-switch-icon theme-switch-icon--${variant}" viewBox="0 0 64 72" aria-hidden="true">
    <rect class="helmet-shell" x="10" y="12" width="44" height="44" rx="13"/>
    <line class="helmet-shell-line" x1="32" y1="4" x2="32" y2="12"/>
    <circle class="helmet-glow" cx="32" cy="3" r="2.5"/>
    <circle class="helmet-glow" cx="22" cy="30" r="4"/>
    <circle class="helmet-glow" cx="42" cy="30" r="4"/>
    <rect class="helmet-shell" x="25.2" y="47.2" width="2.4" height="6.4" rx="1.2"/>
    <rect class="helmet-shell" x="30.8" y="47.2" width="2.4" height="6.4" rx="1.2"/>
    <rect class="helmet-shell" x="36.4" y="47.2" width="2.4" height="6.4" rx="1.2"/>
  </svg>`;
}

function themeToggleButton() {
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  return `<button class="icon-btn theme-switch theme-switch--${currentTheme}" id="theme-btn" data-next-theme="${nextTheme}" title="${t("themeToggleTitle")}" role="switch" aria-checked="${currentTheme === "dark"}">
    <span class="theme-switch-track">
      <span class="theme-switch-thumb"></span>
      ${helmetIcon("light")}
      ${helmetIcon("dark")}
    </span>
  </button>`;
}

function bindThemeToggle() {
  const btn = document.getElementById("theme-btn");
  if (btn) {
    btn.addEventListener("click", () => setTheme(btn.dataset.nextTheme));
  }
}

// ---------- Routing ----------

// Warnung vor Datenverlust: Formulare (Ideen/Prozesse anlegen oder
// bearbeiten) melden sich hier per watchUnsavedChanges() an. Vor jedem
// Verlassen der Seite - egal ob per Hash-Navigation innerhalb der App,
// Browser-Zurück oder Tab schließen/neu laden - wird gewarnt, falls dabei
// noch nicht gespeicherte Eingaben verloren gehen würden.
let unsavedChangesGuard = null;
let unsavedChangesReset = null;

function watchUnsavedChanges(container) {
  if (!container) {
    unsavedChangesGuard = null;
    unsavedChangesReset = null;
    return;
  }
  let dirty = false;
  const markDirty = () => {
    dirty = true;
  };
  container.addEventListener("input", markDirty);
  container.addEventListener("change", markDirty);
  unsavedChangesGuard = () => dirty;
  unsavedChangesReset = () => {
    dirty = false;
  };
}

function clearUnsavedChanges() {
  unsavedChangesGuard = null;
  unsavedChangesReset = null;
}

function confirmLeaveIfDirty() {
  if (!unsavedChangesGuard || !unsavedChangesGuard()) return true;
  return confirm(t("unsavedChangesConfirm"));
}

function guardedLogout() {
  if (confirmLeaveIfDirty()) logout();
}

// Tab schließen/neu laden/andere URL eingeben - der Router oben bekommt
// das nicht mit, deshalb zusätzlich der native Browser-Hinweis.
window.addEventListener("beforeunload", (e) => {
  if (unsavedChangesGuard && unsavedChangesGuard()) {
    e.preventDefault();
    e.returnValue = "";
  }
});

function currentRoute() {
  const hash = window.location.hash;
  let m = hash.match(/^#\/idea\/([^/]+)$/);
  if (m) return { view: "idea-detail", id: m[1] };
  m = hash.match(/^#\/process\/([^/]+)$/);
  if (m) return { view: "process-detail", id: m[1] };
  if (hash === "#/ideas") return { view: "idea-list" };
  if (hash === "#/processes") return { view: "process-list" };
  if (hash === "#/dashboard") return { view: "dashboard" };
  if (hash === "#/settings") return { view: "settings" };
  if (hash === "#/guide") return { view: "guide" };
  if (hash === "#/admin") return { view: "admin" };
  if (hash === "#/export") return { view: "export" };
  if (hash === "#/teams") return { view: "teams" };
  if (hash === "#/feedback") return { view: "feedback" };
  return { view: "start" };
}

let lastRenderedHash = window.location.hash;
let suppressNextHashchange = false;

window.addEventListener("hashchange", () => {
  if (suppressNextHashchange) {
    suppressNextHashchange = false;
    return;
  }
  if (!confirmLeaveIfDirty()) {
    // Navigation abgebrochen: Hash zurücksetzen, ohne dass das dadurch
    // erneut ausgelöste hashchange-Event die Ansicht neu rendert (die
    // aktuelle, ungespeicherte Eingabe soll ja genau erhalten bleiben).
    suppressNextHashchange = true;
    window.location.hash = lastRenderedHash;
    return;
  }
  clearUnsavedChanges();
  render();
});

// ---------- Auth ----------

async function loadOwnProfile() {
  const { data, error } = await sb.from("profiles").select("*").eq("id", currentUser.id).single();
  if (error) {
    toast(t("profileLoadErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function loadAllProfiles() {
  const { data, error } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function approveUser(id) {
  const { error } = await sb.from("profiles").update({ is_approved: true }).eq("id", id);
  if (error) {
    toast(t("approveErrorPrefix") + error.message);
    return false;
  }
  return true;
}

async function rejectUser(id) {
  const { error } = await sb.from("profiles").update({ is_rejected: true }).eq("id", id);
  if (error) {
    toast(t("rejectErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// Sieht die Domain-Sperre in restrict_signup_domain() (schema.sql) und ohne
// verwechselbare Zeichen (I/l/1/O/0), damit ein Start-Passwort auch beim
// Vorlesen/Abtippen über den verifizierten Kanal (siehe README) keine Fehler
// provoziert.
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!?#%";
  const bytes = new Uint32Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

// Kontoanlage läuft über eine Edge Function (supabase/functions/admin-users),
// weil dafür der service_role-Key nötig ist - der darf niemals im Browser
// landen. Die Function prüft selbst erneut, dass die aufrufende Person Admin
// ist (siehe dortige Kommentare), bevor sie etwas anlegt.
async function createUserViaAdmin(email, password) {
  const { data, error } = await sb.functions.invoke("admin-users", {
    body: { action: "create", email, password },
  });
  if (error) return { ok: false, message: error.message };
  if (data?.error) return { ok: false, message: data.error };
  return { ok: true, id: data.id };
}

// Setzt das Passwort einer bestehenden Person direkt über die Edge Function
// neu (service_role-only, siehe createUserViaAdmin) - für den Fall, dass
// jemand sein Passwort vergessen hat und es aktuell keinen
// Self-Service-Reset gibt (siehe requestAccessDesc/forgotPasswordContactMsg).
async function resetUserPasswordViaAdmin(userId, password) {
  const { data, error } = await sb.functions.invoke("admin-users", {
    body: { action: "reset_password", userId, password },
  });
  if (error) return { ok: false, message: error.message };
  if (data?.error) return { ok: false, message: data.error };
  return { ok: true };
}

// "Als User anmelden": öffnet einen neuen Tab, der sich per Magic-Link-OTP
// (aus derselben Edge Function, ebenfalls service_role-only) als die
// angegebene Person einloggt - ohne ihr Passwort zu kennen oder zu ändern.
// Der neue Tab läuft dauerhaft über einen eigenen, sessionStorage-basierten
// Supabase-Client (siehe js/supabaseClient.js), damit diese Test-Session nie
// mit der eigenen Admin-Session in anderen Tabs kollidiert.
async function impersonateUser(email) {
  const win = window.open("", "_blank");
  if (!win) {
    toast(t("impersonatePopupBlockedMsg"));
    return;
  }
  const { data, error } = await sb.functions.invoke("admin-users", {
    body: { action: "impersonate", email },
  });
  if (error || data?.error) {
    win.close();
    toast(t("impersonateErrorPrefix") + (data?.error || error?.message || ""));
    return;
  }
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("impersonate", "1");
  url.searchParams.set("email", data.email);
  url.searchParams.set("otp", data.otp);
  win.location.href = url.toString();
}

// ---------- Data: Kostenstellen & Zugriffsrechte ----------

async function loadKostenstellen() {
  const { data, error } = await sb.from("kostenstellen").select("*").order("code");
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

// Teams gehören zu genau einer Kostenstelle (siehe supabase/schema.sql) -
// eine flache, kostenstellen-übergreifende Cache-Liste, aus der überall
// nach kostenstelle_code gefiltert wird.
async function loadTeams() {
  const { data, error } = await sb.from("teams").select("*").order("name");
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createTeam(kostenstelleCode, name) {
  const { data, error } = await sb
    .from("teams")
    .insert({ kostenstelle_code: kostenstelleCode, name })
    .select("*")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function renameTeam(id, name) {
  const { data, error } = await sb.from("teams").update({ name }).eq("id", id).select("*").single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteTeam(id) {
  const { error } = await sb.from("teams").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

async function loadMyGrants() {
  if (currentProfile.is_admin) return [];
  const { data, error } = await sb
    .from("kostenstelle_access")
    .select("kostenstelle_code, team_id, access_level")
    .eq("user_id", currentUser.id);
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

// Kostenstellen, für die die aktuelle Person irgendein Team schreiben darf.
function writableCodes() {
  if (currentProfile.is_admin) return kostenstellenCache.map((k) => k.code);
  return Array.from(new Set(myGrants.filter((g) => g.access_level === "write").map((g) => g.kostenstelle_code)));
}

// Team-Objekte ({id, kostenstelle_code, name}), für die die aktuelle
// Person schreiben darf - ohne Kostenstelle über alle schreibbaren
// Kostenstellen hinweg (team_id null bei einem Grant deckt alle Teams
// dieser Kostenstelle ab).
function writableTeamsForCode(code) {
  const scoped = code ? teamsCache.filter((tm) => tm.kostenstelle_code === code) : teamsCache;
  if (currentProfile.is_admin) return scoped.slice();
  return scoped.filter((tm) => {
    const grants = myGrants.filter((g) => g.kostenstelle_code === tm.kostenstelle_code && g.access_level === "write");
    return grants.some((g) => g.team_id === null || g.team_id === tm.id);
  });
}

// Team ist nur dann ein Pflichtfeld, wenn die gewaehlte Kostenstelle
// ueberhaupt Teams hat (Dropdown hat dann eine echte Auswahl) - Bereiche
// ohne Team-Gliederung (leere Teamliste) duerfen ohne Team gespeichert
// werden.
function teamSelectionRequired(department) {
  return writableTeamsForCode(department).length > 0;
}

// Kostenstellen, die die aktuelle Person überhaupt sehen darf (lesend oder
// schreibend) - für Filter-Dropdowns, nicht nur zum Anlegen/Bearbeiten.
function readableCodes() {
  if (currentProfile.is_admin) return kostenstellenCache.map((k) => k.code);
  return Array.from(new Set(myGrants.map((g) => g.kostenstelle_code)));
}

// Team-Objekte, die für eine Kostenstelle (oder, ohne Kostenstelle, über
// alle lesbaren Kostenstellen hinweg) für die aktuelle Person sichtbar sind.
function readableTeamsForCode(code) {
  const scoped = code ? teamsCache.filter((tm) => tm.kostenstelle_code === code) : teamsCache;
  if (currentProfile.is_admin) return scoped.slice();
  return scoped.filter((tm) => {
    const grants = myGrants.filter((g) => g.kostenstelle_code === tm.kostenstelle_code);
    return grants.some((g) => g.team_id === null || g.team_id === tm.id);
  });
}

function canWriteCombo(code, teamId) {
  if (currentProfile.is_admin) return true;
  return myGrants.some(
    (g) => g.kostenstelle_code === code && g.access_level === "write" && (g.team_id === null || g.team_id === teamId)
  );
}

// Wer Vollzugriff (Schreiben, alle Teams) auf eine Kostenstelle hat, darf
// deren Teams anlegen/umbenennen/löschen - spiegelt can_manage_teams() in
// supabase/schema.sql (die RLS-Policy ist die eigentliche Absicherung,
// das hier steuert nur, ob die Verwaltungs-UI angezeigt wird).
function canManageTeams(code) {
  if (currentProfile.is_admin) return true;
  return myGrants.some((g) => g.kostenstelle_code === code && g.team_id === null && g.access_level === "write");
}

async function loadAllAccess() {
  const { data, error } = await sb.from("kostenstelle_access").select("*");
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createKostenstelle(code, name) {
  const { data, error } = await sb.from("kostenstellen").insert({ code, name }).select("*").single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

// team_id ist nullable (Vollzugriff), Postgrest ".eq()" matcht NULL nicht
// - deshalb hier ".is()" für den Vollzugriff-Fall. Da team_id nicht Teil
// eines Primary Keys sein kann (siehe schema.sql), gibt es keinen
// verlässlichen "onConflict"-Ziel für ein upsert - stattdessen explizit
// erst löschen, dann (falls ein Level gewählt wurde) neu anlegen.
async function setKostenstelleAccess(userId, code, teamId, level) {
  let del = sb.from("kostenstelle_access").delete().eq("user_id", userId).eq("kostenstelle_code", code);
  del = teamId ? del.eq("team_id", teamId) : del.is("team_id", null);
  const { error: delError } = await del;
  if (delError) {
    toast(t("saveErrorPrefix") + delError.message);
    return false;
  }
  if (!level) return true;
  // Grants wirken additiv (siehe canWriteCombo/readableTeamsForCode): eine
  // Einzel-Team-Regel kann einen bestehenden Vollzugriff nie einschränken,
  // sondern höchstens verdecken. Wird hier ein Vollzugriff (team_id null)
  // gesetzt, werden deshalb vorhandene Einzel-Team-Regeln derselben Person
  // an dieser Kostenstelle mit entfernt statt als wirkungslose Karteileichen
  // stehen zu bleiben.
  if (!teamId) {
    const { error: cascadeError } = await sb
      .from("kostenstelle_access")
      .delete()
      .eq("user_id", userId)
      .eq("kostenstelle_code", code)
      .not("team_id", "is", null);
    if (cascadeError) {
      toast(t("saveErrorPrefix") + cascadeError.message);
      return false;
    }
  }
  const { error } = await sb
    .from("kostenstelle_access")
    .insert({ user_id: userId, kostenstelle_code: code, team_id: teamId || null, access_level: level });
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// Räumt Einzel-Team-Regeln auf, die schon vor der obigen Cascade-Logik
// entstanden sind (z.B. weil zuerst ein einzelnes Team freigeschaltet und
// erst danach Vollzugriff vergeben wurde) - sie waren immer schon wirkungslos
// (siehe canWriteCombo/readableTeamsForCode), standen aber unangetastet in
// der DB und sahen in der Verwaltung wie ein aktiver, abweichender Wert aus.
// Wird bei jedem Öffnen der Admin-Seite einmal ausgeführt.
async function cleanupRedundantTeamGrants() {
  const blanketKeys = new Set(
    accessCache.filter((a) => a.team_id === null).map((a) => `${a.user_id}|${a.kostenstelle_code}`)
  );
  const staleIds = accessCache
    .filter((a) => a.team_id !== null && blanketKeys.has(`${a.user_id}|${a.kostenstelle_code}`))
    .map((a) => a.id);
  if (!staleIds.length) return;
  const { error } = await sb.from("kostenstelle_access").delete().in("id", staleIds);
  if (!error) accessCache = accessCache.filter((a) => !staleIds.includes(a.id));
}

// Zweite Hälfte des "Als User anmelden"-Flows (siehe impersonateUser): der
// neue Tab landet hier mit email/otp in der URL, tauscht sie einmalig gegen
// eine Session für diese Person ein und entfernt sie sofort wieder aus der
// Adresszeile/History. Läuft in diesem Tab über den sessionStorage-Client
// aus js/supabaseClient.js, betrifft also nie die Admin-Session in anderen
// Tabs.
async function consumeImpersonationLink() {
  const params = new URLSearchParams(window.location.search);
  const otp = params.get("otp");
  const email = params.get("email");
  if (!otp || !email) return;
  history.replaceState(null, "", window.location.pathname + window.location.hash);
  // "magiclink" ist der historische Typ für per admin.generateLink erzeugte
  // OTPs, manche supabase-js-Versionen erwarten stattdessen "email" - beide
  // versuchen, statt sich auf eine bestimmte Version festzulegen.
  let { error } = await sb.auth.verifyOtp({ email, token: otp, type: "magiclink" });
  if (error) {
    ({ error } = await sb.auth.verifyOtp({ email, token: otp, type: "email" }));
  }
}

async function init() {
  await consumeImpersonationLink();
  const { data } = await sb.auth.getSession();
  currentUser = data.session ? data.session.user : null;
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") passwordRecoveryMode = true;
    currentUser = session ? session.user : null;
    currentProfile = null;
    // Für die Nutzungsstatistik zählt jedes tatsächliche Öffnen der App mit
    // gültiger Session, nicht nur ein frischer Login: "INITIAL_SESSION"
    // deckt den Normalfall ab (App/PWA erneut geöffnet, Seite neu geladen),
    // "SIGNED_IN" den frischen Login. "TOKEN_REFRESHED" bleibt bewusst
    // aussen vor - das ist nur eine automatische Erneuerung im Hintergrund
    // derselben, bereits laufenden Sitzung, kein neuer App-Aufruf.
    if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session) recordLoginEvent();
    render();
  });
  render();
}

async function recordLoginEvent() {
  if (!currentUser) return;
  await sb.from("login_events").insert({ user_id: currentUser.id });
}

async function loadLoginEvents() {
  const { data, error } = await sb.from("login_events").select("user_id, created_at");
  if (error) return [];
  return data || [];
}

async function loadAppFeedback() {
  const { data, error } = await sb
    .from("app_feedback")
    .select("id, user_id, created_at, rating_usability, rating_design, rating_features, rating_performance, comment")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

async function signInWithPassword(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return error;
}

async function logout() {
  await sb.auth.signOut();
  window.location.hash = "";
}

// ---------- Data: Ideas ----------

// "processes!process_id" statt nur "processes": seit es mit idea_processes
// (siehe schema.sql) einen zweiten (n:m-)Pfad von ideas zu processes gibt,
// meldet PostgREST bei einem unqualifizierten Embed einen Ambiguitätsfehler
// ("more than one relationship was found") - der Spaltenname legt die
// bestehende process_id-Beziehung eindeutig fest.
const IDEA_SELECT =
  "*, processes!process_id(id, name, name_en), parent:parent_idea_id(id, quick_note, quick_note_en, catalog_id, status)";

// Weitere Prozesse (idea_processes, siehe schema.sql) bewusst NICHT Teil von
// IDEA_SELECT: das ist eine separate, zusätzliche Verknüpfung obendrauf -
// wäre sie Teil des embeds, würde ein noch nicht ausgeführtes Schema-Update
// (Tabelle fehlt) die komplette Ideen-Abfrage scheitern lassen statt nur
// diese eine Zusatzfunktion. Bei einem Fehler hier bleibt "extra_processes"
// einfach leer, der Rest der App funktioniert unverändert weiter.
async function loadIdeaExtraProcessesMap() {
  const { data, error } = await sb.from("idea_processes").select("idea_id, process:process_id(id, name, name_en)");
  if (error) return {};
  const map = {};
  (data || []).forEach((row) => {
    if (!row.process) return;
    (map[row.idea_id] ??= []).push({ process: row.process });
  });
  return map;
}

async function loadIdeas() {
  const { data, error } = await sb
    .from("ideas")
    .select(IDEA_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  const ideas = data || [];
  const extraMap = await loadIdeaExtraProcessesMap();
  ideas.forEach((idea) => {
    idea.extra_processes = extraMap[idea.id] || [];
  });
  return ideas;
}

async function createIdea(quickNote, department, teamId, processId, parentIdeaId) {
  const payload = { quick_note: quickNote, department, team_id: teamId, created_by: currentUser.id };
  if (processId) payload.process_id = processId;
  if (parentIdeaId) payload.parent_idea_id = parentIdeaId;
  const { data, error } = await sb.from("ideas").insert(payload).select(IDEA_SELECT).single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  data.extra_processes = [];
  return data;
}

async function updateIdea(id, patch) {
  const { data, error } = await sb
    .from("ideas")
    .update(patch)
    .eq("id", id)
    .select(IDEA_SELECT)
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteIdea(id) {
  const { error } = await sb.from("ideas").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// Weitere Prozesse (n:m, zusätzlich zum Stufenketten-Prozess "process_id",
// siehe schema.sql).
async function addIdeaProcess(ideaId, processId) {
  const { error } = await sb.from("idea_processes").insert({ idea_id: ideaId, process_id: processId });
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return false;
  }
  return true;
}

async function removeIdeaProcess(ideaId, processId) {
  const { error } = await sb.from("idea_processes").delete().eq("idea_id", ideaId).eq("process_id", processId);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// Start-Prompt fürs Projekt: nimmt Kurznotiz + das bereits vom Menschen
// geschriebene Problem/Ziel/Business Benefit als feste Grundlage (die KI
// soll diese NICHT neu erfinden - sonst zirkulärer Bezug, siehe Diskussion
// im Chat) und bittet ausschließlich um eine Einschätzung möglicher
// Umsetzungswege. Bewusst als Freitext-Prompt zum Einfügen in ein
// beliebiges KI-Chat-Tool, nicht als strukturierte JSON-Antwort - die App
// wertet die Antwort nicht mehr automatisch aus (siehe f-ai-plan-notes).
const KICKOFF_PROMPT_INSTRUCTIONS = {
  de: `Ich möchte diesen internen AI-Use-Case realistisch einschätzen und die Umsetzung planen. Bitte hilf mir dabei und gehe auf Folgendes ein:

- Welche konkreten Lösungsansätze/Architekturen kommen realistisch in Frage?
- Welche "Tool-Stufe" ist dafür nötig: reicht ein einfacher KI-Chat, ein Cowork-artiges No-Code-Setup, oder braucht es einen echten Coding-Assistenten bzw. Entwicklung?
- In welchen Ausprägungen ist eine Umsetzung denkbar (z.B. schlanker erster Schritt vs. vollständige Lösung)?
- Wo liegen die Grenzen bzw. Risiken dieses Ansatzes?
- Ist das im Alleingang umsetzbar, oder braucht es IT bzw. weitere Spezialist:innen?
- Wie sieht es mit der Skalierbarkeit aus?

Fasse deine Antwort am Ende in einem kompakten Abschnitt "Projektaufbau-Zusammenfassung" zusammen, den ich unverändert in mein Tracking-Tool zurückkopieren kann.`,
  en: `I want to realistically assess this internal AI use case and plan its implementation. Please help me with that and address the following:

- What concrete solution approaches/architectures are realistically possible?
- What "tool tier" is needed: is a simple AI chat enough, a Cowork-like no-code setup, or does it need a real coding assistant / development?
- What forms of implementation are conceivable (e.g. a lean first step vs. a full solution)?
- Where are the limits or risks of this approach?
- Can this be done solo, or does it need IT or other specialists?
- What about scalability?

End your answer with a compact "Project setup summary" section that I can copy back into my tracking tool unchanged.`,
};

function kickoffPromptContext(fields) {
  const labels =
    currentLang === "en"
      ? { note: "Quick note", problem: "Problem", goal: "Goal", benefit: "Business benefit" }
      : { note: "Kurznotiz", problem: "Problem", goal: "Ziel", benefit: "Business Benefit" };
  return [
    `${labels.note}: ${fields.quick_note}`,
    `${labels.problem}: ${fields.problem}`,
    `${labels.goal}: ${fields.goal}`,
    `${labels.benefit}: ${fields.business_benefit}`,
  ].join("\n\n");
}

function buildKickoffPrompt(fields) {
  return `${kickoffPromptContext(fields)}\n\n---\n\n${KICKOFF_PROMPT_INSTRUCTIONS[currentLang]}`;
}

// ---------- Data: Processes ----------

async function loadProcesses() {
  const { data, error } = await sb
    .from("processes")
    .select("*, parent:parent_process_id(id, name, name_en)")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createProcess(name, department, teamId, parentProcessId) {
  const siblings = processesCache.filter((p) => p.parent_process_id === (parentProcessId || null));
  const nextPosition = siblings.length ? Math.max(...siblings.map((p) => p.position || 0)) + 1 : 0;
  const payload = { name, department, team_id: teamId, created_by: currentUser.id, position: nextPosition };
  if (parentProcessId) payload.parent_process_id = parentProcessId;
  const { data, error } = await sb
    .from("processes")
    .insert(payload)
    .select("*, parent:parent_process_id(id, name, name_en)")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function updateProcess(id, patch) {
  const { data, error } = await sb
    .from("processes")
    .update(patch)
    .eq("id", id)
    .select("*, parent:parent_process_id(id, name, name_en)")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteProcess(id) {
  const { error } = await sb.from("processes").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// Prozess duplizieren: für stark ähnliche Prozesse, die man nicht jedes Mal
// von Grund auf neu aufsetzen will. Kopiert den Prozess selbst sowie seine
// Schritte und Dokumente/Links 1:1 (als neue, unabhängige Kopien - keine
// Referenz auf die Originale). Bewusst NICHT mitkopiert: der Freigabe-Status
// (die Kopie startet als "offen") und der realisierte Anteil des
// AI-Potenzials auf Prozess- und Schrittebene (das ist Fortschritt am
// Original, nicht an der neuen Kopie). Ebenfalls nicht mitkopiert: die
// Verlinkung eines Schritts auf einen Detailprozess (linked_process_id) -
// die verwies auf einen Teilprozess des Originals und würde bei der Kopie
// nur verwirren - sowie die pro Schritt geflaggten Use Cases, da die
// Kopie erstmal kein eigenes, geprüftes AI-Support-Mapping hat.
async function duplicateProcess(id) {
  const original = processesCache.find((p) => p.id === id);
  if (!original) return null;
  const [steps, resources] = await Promise.all([loadProcessSteps(id), loadProcessResources(id)]);

  const siblings = processesCache.filter((p) => p.parent_process_id === (original.parent_process_id || null));
  const nextPosition = siblings.length ? Math.max(...siblings.map((p) => p.position || 0)) + 1 : 0;

  const { data: newProc, error } = await sb
    .from("processes")
    .insert({
      name: original.name + t("duplicateNameSuffix"),
      name_en: original.name_en ? original.name_en + t("duplicateNameSuffix") : "",
      department: original.department,
      team_id: original.team_id,
      description: original.description,
      description_en: original.description_en,
      ai_potential: original.ai_potential,
      notes: original.notes,
      notes_en: original.notes_en,
      status: "open",
      realized_potential: 0,
      parent_process_id: original.parent_process_id,
      created_by: currentUser.id,
      position: nextPosition,
    })
    .select("*, parent:parent_process_id(id, name, name_en)")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }

  if (steps.length) {
    const { error: stepsError } = await sb.from("process_steps").insert(
      steps.map((s) => ({
        process_id: newProc.id,
        position: s.position,
        step_type: s.step_type,
        title: s.title,
        description: s.description,
        ai_potential: s.ai_potential,
        ai_potential_note: s.ai_potential_note,
        step_number: s.step_number,
      }))
    );
    if (stepsError) toast(t("saveErrorPrefix") + stepsError.message);
  }

  if (resources.length) {
    const { error: resError } = await sb.from("process_resources").insert(
      resources.map((r) => ({ process_id: newProc.id, kind: r.kind, label: r.label, url: r.url }))
    );
    if (resError) toast(t("saveErrorPrefix") + resError.message);
  }

  return newProc;
}

// Prozessschritte: geordnete Kette statt freiem Diagramm (siehe Diskussion
// im Chat) - "position" bestimmt die Reihenfolge, Auf/Ab tauscht die
// position zweier benachbarter Schritte.
const PROCESS_STEP_TYPES = ["start", "step", "decision", "end"];

const PROCESS_STEP_TYPE_STYLE = {
  start: { icon: "▶️", color: "#22c55e" },
  step: { icon: "🔷", color: "#0ea5e9" },
  decision: { icon: "🔶", color: "#f59e0b" },
  end: { icon: "⏹️", color: "#ef4444" },
};

function stepTypeIcon(type) {
  return (PROCESS_STEP_TYPE_STYLE[type] || PROCESS_STEP_TYPE_STYLE.step).icon;
}

function stepTypeColor(type) {
  return (PROCESS_STEP_TYPE_STYLE[type] || PROCESS_STEP_TYPE_STYLE.step).color;
}

async function loadProcessSteps(processId) {
  const { data, error } = await sb
    .from("process_steps")
    .select("*")
    .eq("process_id", processId)
    .order("position", { ascending: true });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createProcessStep(processId, position, stepType, title, description) {
  const { data, error } = await sb
    .from("process_steps")
    .insert({ process_id: processId, position, step_type: stepType, title, description: description || null })
    .select("*")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function updateProcessStep(id, patch) {
  const { data, error } = await sb.from("process_steps").update(patch).eq("id", id).select("*").single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteProcessStep(id) {
  const { error } = await sb.from("process_steps").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

async function loadProcessStepIdeas(stepIds) {
  if (!stepIds.length) return [];
  const results = await Promise.all(
    stepIds.map((id) => sb.from("process_step_ideas").select("*").eq("step_id", id))
  );
  const rows = [];
  for (const { data, error } of results) {
    if (error) {
      toast(t("loadErrorPrefix") + error.message);
      continue;
    }
    if (data) rows.push(...data);
  }
  return rows;
}

async function setStepIdeaFlag(stepId, ideaId, flagged) {
  if (flagged) {
    const { error } = await sb.from("process_step_ideas").insert({ step_id: stepId, idea_id: ideaId });
    if (error) {
      toast(t("saveErrorPrefix") + error.message);
      return false;
    }
    return true;
  }
  const { error } = await sb.from("process_step_ideas").delete().eq("step_id", stepId).eq("idea_id", ideaId);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// Dokumente & Links: reine URL-Liste (z.B. Link zu einer Datei in
// SharePoint/Teams/OneDrive oder eine Webseite) statt echtem Datei-Upload
// - braucht deshalb keinen eigenen Storage-Bucket (siehe Diskussion im Chat).
const PROCESS_RESOURCE_KINDS = ["link", "document"];

async function loadProcessResources(processId) {
  const { data, error } = await sb
    .from("process_resources")
    .select("*")
    .eq("process_id", processId)
    .order("created_at", { ascending: true });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createProcessResource(processId, kind, label, url) {
  const { data, error } = await sb
    .from("process_resources")
    .insert({ process_id: processId, kind, label, url })
    .select("*")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteProcessResource(id) {
  const { error } = await sb.from("process_resources").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// ---------- Shared UI ----------

function tabBar(active) {
  return `
    <div class="tabbar">
      <button data-tab="start" class="${active === "start" ? "active" : ""}">${t("startTab")}</button>
      <button data-tab="processes" class="${active === "processes" ? "active" : ""}">${t("processesTab")}</button>
      <button data-tab="ideas" class="${active === "ideas" ? "active" : ""}">${t("ideasTab")}</button>
      <button data-tab="dashboard" class="${active === "dashboard" ? "active" : ""}">${t("dashboardTab")}</button>
    </div>
  `;
}

const TAB_HASHES = { start: "", processes: "#/processes", ideas: "#/ideas", dashboard: "#/dashboard" };

function bindTabBar() {
  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = TAB_HASHES[btn.dataset.tab] ?? "";
    });
  });
}

function selectOptionsFrom(values, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("selectPlaceholderOption")}</option>`];
  values.forEach((v) => {
    options.push(`<option value="${escapeHtml(v)}" ${v === selectedValue ? "selected" : ""}>${escapeHtml(v)}</option>`);
  });
  return options.join("");
}

// Priorität (Liste) hängt vom Status ab (siehe LIST_PRIORITY_FORCED_BY_STATUS):
// bei "done"/"discarded" gibt es nur den erzwungenen Wert, sonst nur
// High/Medium/Low mit "Low" als Default.
function listPriorityOptionsHtml(status, currentValue) {
  const forced = LIST_PRIORITY_FORCED_BY_STATUS[status];
  if (forced) {
    return `<option value="${forced}" selected>${forced}</option>`;
  }
  const value = LIST_PRIORITY_FREE_OPTIONS.includes(currentValue) ? currentValue : LIST_PRIORITY_DEFAULT;
  return LIST_PRIORITY_FREE_OPTIONS.map(
    (v) => `<option value="${v}" ${v === value ? "selected" : ""}>${v}</option>`
  ).join("");
}

function teamName(teamId) {
  const tm = teamsCache.find((x) => x.id === teamId);
  return tm ? tm.name : "";
}

function kostenstelleOptionsFrom(codes, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("selectPlaceholderOption")}</option>`];
  codes.forEach((code) => {
    const k = kostenstellenCache.find((x) => x.code === code);
    const label = k && k.name ? `${code} – ${k.name}` : code;
    options.push(`<option value="${escapeHtml(code)}" ${code === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`);
  });
  return options.join("");
}

// Team-Objekte ({id, kostenstelle_code, name}) als <option>-Liste - wie
// selectOptionsFrom, aber der Options-Wert ist die Team-ID, nicht der Name.
function teamOptionsFrom(teams, selectedId) {
  const options = [`<option value="" ${selectedId ? "" : "selected"}>${t("selectPlaceholderOption")}</option>`];
  teams.forEach((tm) => {
    options.push(`<option value="${tm.id}" ${tm.id === selectedId ? "selected" : ""}>${escapeHtml(tm.name)}</option>`);
  });
  return options.join("");
}

function departmentTeamFields(department, teamId, idPrefix) {
  const codes = new Set(writableCodes());
  if (department) codes.add(department);
  const teams = department ? writableTeamsForCode(department).slice() : [];
  if (teamId && !teams.some((tm) => tm.id === teamId)) {
    const existing = teamsCache.find((tm) => tm.id === teamId);
    if (existing) teams.push(existing);
  }
  return `
    <div class="row">
      <select class="field" id="${idPrefix}-department" style="flex:1;">
        ${kostenstelleOptionsFrom(Array.from(codes), department)}
      </select>
      <select class="field" id="${idPrefix}-team" style="flex:1;">
        ${teamOptionsFrom(teams, teamId)}
      </select>
    </div>
  `;
}

// Gleiches Prinzip wie kostenstelleOptionsFrom/teamOptionsFrom, aber für
// Filter statt Pflichtfelder: erste Option heißt "Alle ..." statt einem
// leeren Platzhalter, weil bei Filtern "kein Filter" der sinnvolle Standard
// ist (nicht "bitte auswählen").
function kostenstelleFilterOptionsFrom(codes, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("filterAllKostenstellenOption")}</option>`];
  codes.forEach((code) => {
    const k = kostenstellenCache.find((x) => x.code === code);
    const label = k && k.name ? `${code} – ${k.name}` : code;
    options.push(`<option value="${escapeHtml(code)}" ${code === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`);
  });
  return options.join("");
}

function teamFilterOptionsFrom(teams, selectedId) {
  const options = [`<option value="" ${selectedId ? "" : "selected"}>${t("filterAllTeamsOption")}</option>`];
  teams.forEach((tm) => {
    options.push(`<option value="${tm.id}" ${tm.id === selectedId ? "selected" : ""}>${escapeHtml(tm.name)}</option>`);
  });
  return options.join("");
}

function deptTeamFilterRow(idPrefix, activeDept, activeTeamId) {
  const codes = readableCodes();
  const teams = activeDept ? readableTeamsForCode(activeDept) : [];
  return `
    <div class="filter-select-row">
      <select class="filter-select" id="${idPrefix}-dept-filter">
        ${kostenstelleFilterOptionsFrom(codes, activeDept)}
      </select>
      <select class="filter-select" id="${idPrefix}-team-filter">
        ${teamFilterOptionsFrom(teams, activeTeamId)}
      </select>
    </div>
  `;
}

// Usecase-Geber ist Freitext (kein fester Kostenstellen-/Team-Katalog),
// daher werden die Filter-Optionen aus den tatsächlich vergebenen Namen in
// ideasCache abgeleitet statt aus einer festen Liste.
function distinctOwnerNames() {
  return Array.from(new Set(ideasCache.map((i) => (i.owner_name || "").trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "de")
  );
}

function ownerFilterOptionsFrom(owners, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("filterAllOwnersOption")}</option>`];
  owners.forEach((owner) => {
    options.push(`<option value="${escapeHtml(owner)}" ${owner === selectedValue ? "selected" : ""}>${escapeHtml(owner)}</option>`);
  });
  return options.join("");
}

// Wie deptTeamFilterRow, aber nur für die Ideenliste: dort kommt noch der
// Usecase-Geber-Filter dazu (Prozesse haben kein owner_name-Feld).
function ideaFilterRow(activeDept, activeTeamId, activeOwner) {
  const codes = readableCodes();
  const teams = activeDept ? readableTeamsForCode(activeDept) : [];
  return `
    <div class="filter-select-row">
      <select class="filter-select" id="ideafilter-dept-filter">
        ${kostenstelleFilterOptionsFrom(codes, activeDept)}
      </select>
      <select class="filter-select" id="ideafilter-team-filter">
        ${teamFilterOptionsFrom(teams, activeTeamId)}
      </select>
      <select class="filter-select" id="ideafilter-owner-filter">
        ${ownerFilterOptionsFrom(distinctOwnerNames(), activeOwner)}
      </select>
    </div>
  `;
}

// Team-Dropdown ist von der gewählten Kostenstelle abhängig (jede
// Kostenstelle hat ihre eigene Teamliste) - bei jedem Wechsel der
// Kostenstelle die Team-Optionen neu berechnen.
function bindDepartmentTeamFields(idPrefix) {
  const deptSel = document.getElementById(`${idPrefix}-department`);
  const teamSel = document.getElementById(`${idPrefix}-team`);
  if (!deptSel || !teamSel) return;
  deptSel.addEventListener("change", () => {
    const currentTeamId = teamSel.value;
    const teams = writableTeamsForCode(deptSel.value);
    teamSel.innerHTML = teamOptionsFrom(teams, teams.some((tm) => tm.id === currentTeamId) ? currentTeamId : "");
  });
}

function readDepartmentTeam(idPrefix) {
  return {
    department: document.getElementById(`${idPrefix}-department`).value,
    teamId: document.getElementById(`${idPrefix}-team`).value || null,
  };
}

// ---------- Views ----------

// Kein offenes Self-Signup mehr (Sicherheitslücke: niemand prüfte, ob die
// registrierende Person wirklich Zugriff auf die angegebene Mailadresse
// hat). Stattdessen: Zugang per Mail/Teams beim Admin anfragen, der die
// Person über einen ihm bekannten, vertrauten Kanal identifiziert und das
// Konto danach selbst über die Supabase-Admin-API anlegt (siehe README).
function accessRequestMailto() {
  const subject = currentLang === "en" ? "Access to the Process- & AI-Usecase App" : "Zugang zur Process- & AI-Usecase App";
  const body =
    currentLang === "en"
      ? "Hi,\n\nI'd like access to the app.\n\nName: \nEmail address (for access): \nCost center(s): \nTeam(s): \n\nThanks!"
      : "Hallo,\n\nich hätte gern Zugang zur App.\n\nName: \nE-Mail-Adresse (für den Zugang): \nKostenstelle(n): \nTeam(s): \n\nDanke!";
  return "mailto:d.goos@house-of-communication.com" + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

function renderLogin() {
  const isRequest = authMode === "request";
  $app.innerHTML = `
    <div class="login-wrap">
      <div class="login-lang-toggle">${langToggleButton()}${themeToggleButton()}</div>
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("appName")}</h1>
      <p>${t("tagline")}</p>
      <div class="tabbar" style="max-width:320px;">
        <button data-mode="login" class="${!isRequest ? "active" : ""}">${t("login")}</button>
        <button data-mode="request" class="${isRequest ? "active" : ""}">${t("requestAccessTab")}</button>
      </div>
      ${
        isRequest
          ? `
        <div class="card" style="text-align:left; max-width:320px;">
          <p style="margin:0 0 12px; font-size:13.5px; color:var(--text); line-height:1.55;">${t("requestAccessDesc")}</p>
          <a class="btn-primary" style="display:block; text-align:center; text-decoration:none;" href="${accessRequestMailto()}">${t("requestAccessMailBtn")}</a>
          <p style="margin:12px 0 0; font-size:12.5px; color:var(--text-dim);">${t("requestAccessTeamsNote")}</p>
        </div>
      `
          : `
        <form id="auth-form" style="width:100%; max-width:320px;">
          <input type="email" id="auth-email" placeholder="${t("emailPlaceholder")}" required autocomplete="email" />
          <input type="password" id="auth-password" placeholder="${t("passwordPlaceholder")}" required minlength="6" autocomplete="current-password" />
          <button type="submit" class="btn-primary" style="width:100%;">${t("login")}</button>
        </form>
        <button class="btn-ghost" id="forgot-btn" style="margin-top:10px;">${t("forgotPassword")}</button>
      `
      }
      <p id="login-msg" style="margin-top:14px; font-size:13px;"></p>
      <div class="copyright" style="margin-top:28px;">© ${new Date().getFullYear()} Serviceplan Group SE &amp; Co. KG</div>
    </div>
  `;

  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      authMode = btn.dataset.mode;
      renderLogin();
    });
  });

  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value;
      const btn = e.target.querySelector("button");
      const msg = document.getElementById("login-msg");
      btn.disabled = true;
      btn.textContent = t("loggingIn");
      const error = await signInWithPassword(email, password);
      btn.disabled = false;
      btn.textContent = t("login");
      if (error) {
        msg.textContent = t("errorPrefix") + error.message;
        msg.style.color = "#ef4444";
      }
      // Bei erfolgreichem Login übernimmt onAuthStateChange das Weiterleiten in die App.
    });
  }

  const forgotBtn = document.getElementById("forgot-btn");
  if (forgotBtn) {
    // Bewusst kein supabase.auth.resetPasswordForEmail() hier: ohne eigenen
    // SMTP-Dienst (siehe README, "Optional für später") verschickt Supabase
    // Auth-Mails nur zuverlässig an Mitglieder der eigenen Supabase-Org, nicht
    // an beliebige Kolleg:innen - der Button würde Self-Service versprechen,
    // der bei den meisten nie ankommt. Sobald SMTP + Redirect-URLs (README
    // Schritt 4) eingerichtet sind, hier resetPasswordForEmail(email) mit
    // redirectTo auf die eigene Origin aufrufen; renderSetNewPassword() und
    // das PASSWORD_RECOVERY-Handling weiter unten sind dafür bereits fertig.
    forgotBtn.addEventListener("click", () => {
      const msg = document.getElementById("login-msg");
      msg.textContent = t("forgotPasswordContactMsg");
      msg.style.color = "";
    });
  }
}

function renderSetNewPassword() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("setNewPasswordTitle")}</h1>
      <p>${t("setNewPasswordDesc")}</p>
      <form id="new-password-form" style="width:100%; max-width:320px;">
        <input type="password" id="new-password" placeholder="${t("newPasswordPlaceholder")}" required minlength="6" autocomplete="new-password" />
        <button type="submit" class="btn-primary" style="width:100%;">${t("savePassword")}</button>
      </form>
      <p id="reset-msg" style="margin-top:14px; font-size:13px;"></p>
    </div>
  `;

  document.getElementById("new-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value;
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    const { error } = await sb.auth.updateUser({ password });
    btn.disabled = false;
    const msg = document.getElementById("reset-msg");
    if (error) {
      msg.textContent = t("errorPrefix") + error.message;
      msg.style.color = "#ef4444";
      return;
    }
    passwordRecoveryMode = false;
    toast(t("passwordSavedMsg"));
    window.location.hash = "";
    render();
  });
}

function filterChips() {
  const filters = [
    { key: "all", label: t("filterAll") },
    ...STATUS_ORDER.map((s) => ({ key: s, label: t(`status_${s}`) })),
  ];
  return `
    <div class="filters">
      ${filters
        .map(
          (f) =>
            `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}</button>`
        )
        .join("")}
    </div>
  `;
}

// ---------- Stufenkette: Ideen, die als Weiterentwicklung eines anderen
// Use Cases verknüpft sind (z.B. GC12 -> GC13 -> GC14) ----------

function ideaAncestorChain(idea) {
  const byId = new Map(ideasCache.map((i) => [i.id, i]));
  const chain = [];
  let cur = idea;
  const seen = new Set([idea.id]);
  while (cur.parent_idea_id && byId.has(cur.parent_idea_id)) {
    const p = byId.get(cur.parent_idea_id);
    if (seen.has(p.id)) break;
    chain.unshift(p);
    seen.add(p.id);
    cur = p;
  }
  return chain;
}

function ideaFollowUpStages(idea) {
  return ideasCache.filter((i) => i.parent_idea_id === idea.id);
}

// Ein Use Case gilt als mit einem Prozess verknüpft, wenn er entweder dessen
// Stufenketten-Prozess ist (process_id) oder zusätzlich verknüpft wurde
// (extra_processes, siehe idea_processes in schema.sql).
function ideaLinksProcess(idea, processId) {
  return idea.process_id === processId || (idea.extra_processes || []).some((ep) => ep.process && ep.process.id === processId);
}

function ideaDescendantIds(idea) {
  const result = new Set();
  let frontier = [idea.id];
  while (frontier.length) {
    const next = [];
    ideasCache
      .filter((i) => frontier.includes(i.parent_idea_id) && !result.has(i.id))
      .forEach((child) => {
        result.add(child.id);
        next.push(child.id);
      });
    frontier = next;
  }
  return result;
}

function ideaStageNumber(idea) {
  return ideaAncestorChain(idea).length + 1;
}

function ideaLabel(idea) {
  const note = trValue(idea, "quick_note");
  return idea.catalog_id ? `${idea.catalog_id} – ${note}` : note;
}

function parentIdeaOptions(idea) {
  const excludeIds = new Set([idea.id, ...ideaDescendantIds(idea)]);
  const options = [`<option value="">${t("noneFirstStageOption")}</option>`];
  ideasCache
    .filter((i) => !excludeIds.has(i.id))
    .forEach((i) => {
      options.push(
        `<option value="${i.id}" ${i.id === idea.parent_idea_id ? "selected" : ""}>${escapeHtml(ideaLabel(i))}</option>`
      );
    });
  return options.join("");
}

function stageChainHtml(idea) {
  const ancestors = ideaAncestorChain(idea);
  const followUps = ideaFollowUpStages(idea);
  if (ancestors.length === 0 && followUps.length === 0) return "";
  const chain = [...ancestors, idea];
  return `
    <label class="field-label" style="margin-top:0;">${t("stageChainPositionLabel")}</label>
    <div class="stage-chain">
      ${chain
        .map((node, idx) => {
          const classes = ["stage-chip"];
          if (node.id === idea.id) classes.push("current");
          if (node.status === "in_progress") classes.push("active");
          const label = `${t("stagePrefix")}${idx + 1}: ${escapeHtml(ideaLabel(node))}`;
          return node.id === idea.id
            ? `<span class="${classes.join(" ")}">${label}</span>`
            : `<a class="${classes.join(" ")}" href="#/idea/${node.id}">${label}</a>`;
        })
        .join('<span class="stage-arrow">→</span>')}
    </div>
  `;
}

function ideaCard(idea) {
  const p = priorityInfo(idea);
  const tags = (idea.tags || "")
    .split(",")
    .map((t2) => t2.trim())
    .filter(Boolean);
  const isChained = idea.parent_idea_id || ideaFollowUpStages(idea).length > 0;
  return `
    <div class="idea-item" data-id="${idea.id}" data-type="idea">
      <div class="idea-title">${idea.catalog_id ? `<span class="badge">🏷 ${escapeHtml(idea.catalog_id)}</span> ` : ""}${escapeHtml(trValue(idea, "quick_note"))}</div>
      <div class="idea-meta">
        <span class="badge status-${idea.status}">${t(`status_${idea.status}`)}</span>
        <span class="badge"><span class="priority-dot" style="background:${p.color}"></span> ${p.label}</span>
        ${isChained ? `<span class="badge">🔗 ${t("stagePrefix")}${ideaStageNumber(idea)}</span>` : ""}
        ${idea.owner_name ? `<span class="badge">👤 ${escapeHtml(idea.owner_name)}</span>` : ""}
        ${idea.team_id ? `<span class="badge">${escapeHtml(teamName(idea.team_id))}</span>` : ""}
        ${idea.processes ? `<span class="badge">⚙ ${escapeHtml(trValue(idea.processes, "name"))}</span>` : ""}
        ${tags.map((tag) => `<span class="badge">#${escapeHtml(tag)}</span>`).join("")}
        <span class="badge" title="${t("lastSavedTitle")}">🕒 ${formatDateTime(idea.updated_at)}</span>
      </div>
    </div>
  `;
}

async function renderList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("ideasHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
      </div>
    </header>
    <main class="wide-main">
      ${tabBar("ideas")}
      <div class="card capture-box">
        <label class="field-label" style="margin-top:0;">${t("newIdeaLabel")}</label>
        <textarea id="quick-note" placeholder="${t("ideaPlaceholder")}"></textarea>
        ${departmentTeamFields("", "", "capture")}
        <div class="row">
          <button class="btn-primary" id="save-capture">${t("saveIdea")}</button>
        </div>
      </div>
      ${filterChips()}
      ${ideaFilterRow(activeDeptFilter, activeTeamFilter, activeOwnerFilter)}
      <div class="idea-list" id="idea-list">
        <div class="empty-state">${t("loadingIdeas")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindLangToggle();
  bindThemeToggle();
  bindDepartmentTeamFields("capture");
  watchUnsavedChanges(document.querySelector(".capture-box"));

  document.getElementById("ideafilter-dept-filter").addEventListener("change", (e) => {
    activeDeptFilter = e.target.value;
    const teams = activeDeptFilter ? readableTeamsForCode(activeDeptFilter) : [];
    if (!teams.some((tm) => tm.id === activeTeamFilter)) activeTeamFilter = "";
    document.getElementById("ideafilter-team-filter").innerHTML = teamFilterOptionsFrom(teams, activeTeamFilter);
    renderIdeaList();
  });
  document.getElementById("ideafilter-team-filter").addEventListener("change", (e) => {
    activeTeamFilter = e.target.value;
    renderIdeaList();
  });
  document.getElementById("ideafilter-owner-filter").addEventListener("change", (e) => {
    activeOwnerFilter = e.target.value;
    renderIdeaList();
  });
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);

  document.getElementById("save-capture").addEventListener("click", async () => {
    const ta = document.getElementById("quick-note");
    const text = ta.value.trim();
    const { department, teamId } = readDepartmentTeam("capture");
    if (!text) return;
    if (!department || (!teamId && teamSelectionRequired(department))) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-capture");
    btn.disabled = true;
    const idea = await createIdea(text, department, teamId);
    btn.disabled = false;
    if (idea) {
      ta.value = "";
      toast(t("ideaSavedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      ideasCache = await loadIdeas();
      renderIdeaList();
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === activeFilter));
      renderIdeaList();
    });
  });

  ideasCache = await loadIdeas();
  // Die Usecase-Geber-Optionen hängen von den geladenen Ideen ab, standen
  // beim ersten Rendern der Filterzeile oben also noch nicht fest.
  document.getElementById("ideafilter-owner-filter").innerHTML = ownerFilterOptionsFrom(
    distinctOwnerNames(),
    activeOwnerFilter
  );
  renderIdeaList();
}

let expandedIdeaIds = new Set();

// Eine Idee ist "Kopf" ihrer Stufenkette, wenn keine andere Idee sie als
// vorherige Stufe (parent_idea_id) referenziert - also die jeweils
// neueste Entwicklungsstufe. Nur Köpfe erscheinen oben in der Liste, die
// Vorstufen hängen als ein-/ausklappbare Kinder darunter.
function ideaIsChainHead(idea) {
  return !ideasCache.some((i) => i.parent_idea_id === idea.id);
}

function ideaChainNodeHtml(idea) {
  const parent = idea.parent_idea_id ? ideasCache.find((i) => i.id === idea.parent_idea_id) : null;
  const isExpanded = expandedIdeaIds.has(idea.id);
  return `
    <div class="tree-node">
      <div class="tree-row">
        ${
          parent
            ? `<button class="tree-toggle" data-toggle-idea="${idea.id}">${isExpanded ? "▾" : "▸"}</button>`
            : `<span class="tree-toggle-spacer"></span>`
        }
        <div class="tree-row-content">${ideaCard(idea)}</div>
      </div>
      ${parent && isExpanded ? `<div class="tree-children">${ideaChainNodeHtml(parent)}</div>` : ""}
    </div>
  `;
}

function renderIdeaList() {
  const listEl = document.getElementById("idea-list");
  if (!listEl) return;
  const heads = ideasCache.filter(ideaIsChainHead);
  const filtered = heads.filter(
    (i) =>
      (activeFilter === "all" || i.status === activeFilter) &&
      (!activeDeptFilter || i.department === activeDeptFilter) &&
      (!activeTeamFilter || i.team_id === activeTeamFilter) &&
      (!activeOwnerFilter || i.owner_name === activeOwnerFilter)
  );
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${t("emptyIdeas")}</div>`;
  } else {
    listEl.innerHTML = filtered.map(ideaChainNodeHtml).join("");
    listEl.querySelectorAll(".idea-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/idea/${el.dataset.id}`;
      });
    });
    listEl.querySelectorAll("[data-toggle-idea]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.toggleIdea;
        if (expandedIdeaIds.has(id)) expandedIdeaIds.delete(id);
        else expandedIdeaIds.add(id);
        renderIdeaList();
      });
    });
  }
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === activeFilter);
  });
}

function sliderRow(name, label, value) {
  return `
    <div class="slider-row">
      <label>${label}</label>
      <input type="range" min="1" max="5" step="1" value="${value || 3}" data-field="${name}" />
      <span class="val">${value || 3}</span>
    </div>
  `;
}

function percentSliderRow(name, label, value) {
  const v = value || 0;
  return `
    <div class="slider-row">
      <label>${label}</label>
      <input type="range" min="0" max="100" step="5" value="${v}" data-field="${name}" />
      <span class="val">${v}%</span>
    </div>
  `;
}

function processOptions(selectedId) {
  const options = [`<option value="">${t("noneOption")}</option>`];
  processesCache.forEach((p) => {
    options.push(`<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${escapeHtml(trValue(p, "name"))}</option>`);
  });
  return options.join("");
}

function parentProcessOptions(excludeId, selectedId) {
  const options = [`<option value="">${t("noneTopLevelOption")}</option>`];
  processesCache
    .filter((p) => p.id !== excludeId)
    .forEach((p) => {
      options.push(`<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${escapeHtml(trValue(p, "name"))}</option>`);
    });
  return options.join("");
}

async function renderDetail(id) {
  let idea = ideasCache.find((i) => i.id === id);
  if (!idea) {
    ideasCache = await loadIdeas();
    idea = ideasCache.find((i) => i.id === id);
  }
  if (!idea) {
    window.location.hash = "#/ideas";
    return;
  }
  if (processesCache.length === 0) {
    processesCache = await loadProcesses();
  }
  const canWrite = canWriteCombo(idea.department, idea.team_id);

  let extraProcesses = (idea.extra_processes || []).map((ep) => ep.process).filter(Boolean);

  function extraProcessOptions() {
    const excludeIds = new Set([idea.process_id, ...extraProcesses.map((p) => p.id)].filter(Boolean));
    const options = processesCache.filter((p) => !excludeIds.has(p.id));
    if (!options.length) return `<option value="">${t("noneOption")}</option>`;
    return options.map((p) => `<option value="${p.id}">${escapeHtml(trValue(p, "name"))}</option>`).join("");
  }

  function renderExtraProcessesListHtml() {
    if (!extraProcesses.length) {
      return `<div class="empty-state" style="padding:16px 4px;">${t("emptyAdditionalProcesses")}</div>`;
    }
    return extraProcesses
      .map((p) => {
        const del = canWrite
          ? `<button class="icon-btn" data-extra-process-remove="${p.id}" title="${t("deleteStepBtn")}">🗑</button>`
          : "";
        return `
          <div class="resource-item">
            <a href="#/process/${p.id}">⚙ ${escapeHtml(trValue(p, "name"))}</a>
            ${del}
          </div>
        `;
      })
      .join("");
  }

  function bindExtraProcessesListEvents() {
    document.querySelectorAll("[data-extra-process-remove]").forEach((btn) => {
      btn.addEventListener("click", () => removeExtraProcess(btn.dataset.extraProcessRemove));
    });
  }

  function refreshExtraProcessesUi() {
    document.getElementById("extra-processes-list").innerHTML = renderExtraProcessesListHtml();
    bindExtraProcessesListEvents();
    const select = document.getElementById("new-extra-process");
    if (select) select.innerHTML = extraProcessOptions();
  }

  async function removeExtraProcess(processId) {
    const ok = await removeIdeaProcess(idea.id, processId);
    if (ok) {
      extraProcesses = extraProcesses.filter((p) => p.id !== processId);
      idea.extra_processes = extraProcesses.map((p) => ({ process: p }));
      toast(t("processUnlinkedMsg"));
      refreshExtraProcessesUi();
    }
  }

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      <button class="icon-btn" id="delete-btn">${t("deleteBtn")}</button>
    </header>
    <main class="wide-main">
      ${
        canWrite
          ? ""
          : `<div style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">🔒 ${t("readOnlyNotice")}</div>`
      }
      <div style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">${t("listFieldsHint")}</div>
      <div class="card">
        <label class="field-label">${t("quickNoteLabel")}</label>
        <textarea class="field list-field" id="f-quick-note"${trReadonlyAttr(idea, "quick_note")}>${escapeHtml(trValue(idea, "quick_note"))}</textarea>

        <label class="field-label">${t("catalogIdLabel")}</label>
        <input class="field list-field" id="f-catalog-id" value="${escapeHtml(idea.catalog_id || "")}" placeholder="${t("catalogIdPlaceholder")}" />

        <label class="field-label">${t("ownerNameLabel")}</label>
        <input class="field" id="f-owner-name" value="${escapeHtml(idea.owner_name || "")}" placeholder="${t("ownerNamePlaceholder")}" />

        <label class="field-label">${t("statusLabel")}</label>
        <select class="field" id="f-status">
          ${STATUS_ORDER.map(
            (s) => `<option value="${s}" ${s === idea.status ? "selected" : ""}>${t(`status_${s}`)}</option>`
          ).join("")}
        </select>

        <label class="field-label">${t("departmentLabel")} / ${t("teamLabel")}</label>
        ${departmentTeamFields(idea.department, idea.team_id, "detail")}

        <label class="field-label">${t("tagsLabel")}</label>
        <input class="field list-field" id="f-tags" value="${escapeHtml(idea.tags || "")}" placeholder="${t("tagsPlaceholder")}" />
      </div>

      <div class="card">
        <label class="field-label" style="margin-top:0;">${t("problemLabel")}</label>
        <textarea class="field list-field" id="f-problem" placeholder="${t("problemPlaceholder")}"${trReadonlyAttr(idea, "problem")}>${escapeHtml(trValue(idea, "problem"))}</textarea>

        <label class="field-label">${t("goalLabel")}</label>
        <textarea class="field list-field" id="f-goal" placeholder="${t("goalPlaceholder")}"${trReadonlyAttr(idea, "goal")}>${escapeHtml(trValue(idea, "goal"))}</textarea>

        <label class="field-label">${t("businessBenefitLabel")}</label>
        <textarea class="field list-field" id="f-business-benefit" placeholder="${t("businessBenefitPlaceholder")}"${trReadonlyAttr(idea, "business_benefit")}>${escapeHtml(trValue(idea, "business_benefit"))}</textarea>

        <label class="field-label">${t("quantifiedBenefitLabel")}</label>
        <textarea class="field list-field" id="f-quantified-benefit" placeholder="${t("quantifiedBenefitPlaceholder")}">${escapeHtml(idea.quantified_benefit || "")}</textarea>

        <label class="field-label">${t("qualitativeBenefitLabel")}</label>
        <textarea class="field list-field" id="f-qualitative-benefit" placeholder="${t("qualitativeBenefitPlaceholder")}"${trReadonlyAttr(idea, "qualitative_benefit")}>${escapeHtml(trValue(idea, "qualitative_benefit"))}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("evaluationTitle")}</div>
        <div id="priority-banner" class="priority-banner"></div>
        ${sliderRow("impact", t("impactLabel"), idea.impact)}
        ${sliderRow("feasibility", t("feasibilityLabel"), idea.feasibility)}
        ${sliderRow("effort", t("effortLabel"), idea.effort)}
        ${sliderRow("risk", t("riskLabel"), idea.risk)}
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("solutionApproachTitle")}</div>
        <label class="field-label" style="margin-top:0;">${t("aiRoleLabel")}</label>
        <select class="field list-field" id="f-ai-role">
          ${selectOptionsFrom(AI_ROLE_OPTIONS, idea.ai_role)}
        </select>

        <label class="field-label">${t("toolsLabel")}</label>
        <textarea class="field list-field" id="f-tools" placeholder="${t("toolsPlaceholder")}">${escapeHtml(idea.tools || "")}</textarea>

        <label class="field-label">${t("systemeLabel")}</label>
        <textarea class="field list-field" id="f-systeme" placeholder="${t("systemePlaceholder")}">${escapeHtml(idea.systeme || "")}</textarea>

        <label class="field-label">${t("inputSourceLabel")}</label>
        <textarea class="field list-field" id="f-input-source" placeholder="${t("inputSourcePlaceholder")}">${escapeHtml(idea.input_source || "")}</textarea>

        <label class="field-label">${t("outputResultLabel")}</label>
        <textarea class="field list-field" id="f-output-result" placeholder="${t("outputResultPlaceholder")}">${escapeHtml(idea.output_result || "")}</textarea>

        <label class="field-label">${t("considerationsLabel")}</label>
        <textarea class="field list-field" id="f-considerations" placeholder="${t("considerationsPlaceholder")}"${trReadonlyAttr(idea, "considerations")}>${escapeHtml(trValue(idea, "considerations"))}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("listDetailsTitle")}</div>
        <label class="field-label" style="margin-top:0;">${t("kpiKindLabel")}</label>
        <select class="field list-field" id="f-kpi-kind">
          ${selectOptionsFrom(KPI_KIND_OPTIONS, idea.kpi_kind)}
        </select>

        <label class="field-label">${t("listPriorityLabel")}</label>
        <select class="field list-field" id="f-list-priority" ${LIST_PRIORITY_FORCED_BY_STATUS[idea.status] ? "disabled" : ""}>
          ${listPriorityOptionsHtml(idea.status, idea.list_priority)}
        </select>

        <label class="field-label">${t("commentLabel")}</label>
        <textarea class="field list-field" id="f-comment"${trReadonlyAttr(idea, "comment")}>${escapeHtml(trValue(idea, "comment"))}</textarea>

        <label class="field-label">${t("skillLevelLabel")}</label>
        <input class="field list-field" id="f-skill-level" value="${escapeHtml(idea.skill_level || "")}" placeholder="${t("skillLevelPlaceholder")}" />
      </div>

      <details class="card">
        <summary style="cursor:pointer; font-size:14px; font-weight:600; color:var(--text);">${t("aiSupportTitle")}</summary>
        <p style="font-size:13.5px; color:var(--text-dim); margin:10px 0 12px; line-height:1.5;">
          ${t("aiSupportDesc")}
        </p>
        <button class="btn-secondary" id="generate-prompt-btn" style="width:100%;">${t("generatePromptBtn")}</button>

        <label class="field-label">${t("startPromptLabel")}</label>
        <textarea class="field" id="f-initial-prompt" placeholder="${t("startPromptPlaceholder")}">${escapeHtml(idea.initial_prompt || "")}</textarea>
        <div class="row">
          <button class="btn-secondary" id="copy-prompt-btn" style="width:100%;">${t("copyStartPromptBtn")}</button>
        </div>

        <label class="field-label">${t("aiResponsePasteLabel")}</label>
        <textarea class="field" id="f-ai-plan-notes" placeholder="${t("aiResponsePlaceholder")}">${escapeHtml(idea.ai_plan_notes || "")}</textarea>
      </details>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("stageChainTitle")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">${t("stageChainDesc")}</p>

        <label class="field-label" style="margin-top:0;">${t("relatedProcessLabel")}</label>
        <select class="field" id="f-process">
          ${processOptions(idea.process_id)}
        </select>

        <label class="field-label">${t("previousStageLabel")}</label>
        <select class="field" id="f-parent-idea">
          ${parentIdeaOptions(idea)}
        </select>

        ${stageChainHtml(idea)}

        <label class="field-label" style="margin-top:0;">${t("followUpStagesTitle")}</label>
        <div id="follow-up-stages">
          ${
            ideaFollowUpStages(idea).length
              ? ideaFollowUpStages(idea)
                  .map(
                    (i) =>
                      `<a class="link-item" href="#/idea/${i.id}">${escapeHtml(ideaLabel(i))} <span class="badge status-${i.status}">${t(`status_${i.status}`)}</span></a>`
                  )
                  .join("")
              : `<div class="empty-state" style="padding:16px 4px;">${t("emptyFollowUpStages")}</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-followup-btn" style="width:100%;">${t("addFollowUpStageBtn")}</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("additionalProcessesLabel")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">${t("additionalProcessesDesc")}</p>
        <div id="extra-processes-list">${renderExtraProcessesListHtml()}</div>
        ${
          canWrite
            ? `
          <div class="row" style="margin-top:12px;">
            <select class="field" id="new-extra-process" style="flex:2;">
              ${extraProcessOptions()}
            </select>
            <button class="btn-secondary" id="add-extra-process-btn" style="flex:1;">${t("addProcessBtn")}</button>
          </div>
        `
            : ""
        }
      </div>

      <div class="row">
        <button class="btn-primary" id="save-detail-btn">${t("saveBtn")}</button>
      </div>
    </main>
  `;

  bindDepartmentTeamFields("detail");
  bindExtraProcessesListEvents();

  document.getElementById("f-status").addEventListener("change", (e) => {
    const listPrioritySelect = document.getElementById("f-list-priority");
    listPrioritySelect.innerHTML = listPriorityOptionsHtml(e.target.value, listPrioritySelect.value);
    listPrioritySelect.disabled = Boolean(LIST_PRIORITY_FORCED_BY_STATUS[e.target.value]);
  });

  if (!canWrite) {
    document.querySelectorAll("main input, main textarea, main select, main button").forEach((el) => {
      el.disabled = true;
    });
  } else {
    watchUnsavedChanges(document.querySelector("main"));

    document.getElementById("add-extra-process-btn").addEventListener("click", async () => {
      const select = document.getElementById("new-extra-process");
      const processId = select.value;
      if (!processId) return;
      const ok = await addIdeaProcess(idea.id, processId);
      if (ok) {
        const proc = processesCache.find((p) => p.id === processId);
        if (proc) extraProcesses.push(proc);
        idea.extra_processes = extraProcesses.map((p) => ({ process: p }));
        toast(t("processLinkedMsg"));
        refreshExtraProcessesUi();
      }
    });
  }

  function updatePriorityBanner() {
    const impact = Number(document.querySelector('[data-field="impact"]').value);
    const effort = Number(document.querySelector('[data-field="effort"]').value);
    const feasibility = Number(document.querySelector('[data-field="feasibility"]').value);
    const risk = Number(document.querySelector('[data-field="risk"]').value);
    const p = priorityInfo({ impact, effort, feasibility, risk });
    document.getElementById("priority-banner").innerHTML =
      `<span class="priority-dot" style="background:${p.color}"></span> ${p.icon} ${t("assessmentPrefix")}<strong>${p.label}</strong>`;
  }

  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener("input", () => {
      slider.nextElementSibling.textContent = slider.value;
      updatePriorityBanner();
    });
  });
  updatePriorityBanner();

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "#/ideas";
  });

  document.getElementById("delete-btn").addEventListener("click", async () => {
    if (!confirm(t("deleteIdeaConfirm"))) return;
    const ok = await deleteIdea(idea.id);
    if (ok) {
      toast(t("ideaDeletedMsg"));
      clearUnsavedChanges();
      window.location.hash = "#/ideas";
    }
  });

  document.getElementById("copy-prompt-btn").addEventListener("click", async () => {
    const text = document.getElementById("f-initial-prompt").value;
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedMsg"));
    } catch {
      toast(t("copyFailedMsg"));
    }
  });

  document.getElementById("add-followup-btn").addEventListener("click", async () => {
    const text = prompt(t("newFollowUpStagePrompt"));
    if (!text || !text.trim()) return;
    const followUp = await createIdea(text.trim(), idea.department, idea.team_id, idea.process_id, idea.id);
    if (followUp) {
      toast(t("followUpStageSavedMsg"));
      ideasCache = await loadIdeas();
      window.location.hash = `#/idea/${followUp.id}`;
    }
  });

  const TRANSLATABLE_IDEA_FIELD_INPUT_IDS = {
    quick_note: "f-quick-note",
    problem: "f-problem",
    goal: "f-goal",
    business_benefit: "f-business-benefit",
    considerations: "f-considerations",
    qualitative_benefit: "f-qualitative-benefit",
    comment: "f-comment",
  };

  function collectPatch() {
    const { department, teamId } = readDepartmentTeam("detail");
    const patch = {
      status: document.getElementById("f-status").value,
      process_id: document.getElementById("f-process").value || null,
      parent_idea_id: document.getElementById("f-parent-idea").value || null,
      department,
      team_id: teamId,
      tags: document.getElementById("f-tags").value.trim(),
      impact: Number(document.querySelector('[data-field="impact"]').value),
      feasibility: Number(document.querySelector('[data-field="feasibility"]').value),
      effort: Number(document.querySelector('[data-field="effort"]').value),
      risk: Number(document.querySelector('[data-field="risk"]').value),
      tools: document.getElementById("f-tools").value.trim(),
      initial_prompt: document.getElementById("f-initial-prompt").value.trim(),
      ai_role: document.getElementById("f-ai-role").value,
      systeme: document.getElementById("f-systeme").value.trim(),
      input_source: document.getElementById("f-input-source").value.trim(),
      output_result: document.getElementById("f-output-result").value.trim(),
      kpi_kind: document.getElementById("f-kpi-kind").value,
      quantified_benefit: document.getElementById("f-quantified-benefit").value.trim(),
      list_priority: document.getElementById("f-list-priority").value,
      skill_level: document.getElementById("f-skill-level").value.trim(),
      catalog_id: document.getElementById("f-catalog-id").value.trim() || null,
      owner_name: document.getElementById("f-owner-name").value.trim(),
      ai_plan_notes: document.getElementById("f-ai-plan-notes").value.trim(),
    };
    // Felder, die aktuell die (vom Admin gepflegte) Übersetzung anzeigen,
    // werden nicht mitgespeichert - sonst würde die englische Anzeige das
    // deutsche Original überschreiben (siehe isTranslatedReadonly).
    TRANSLATABLE_IDEA_FIELDS.forEach((field) => {
      if (!isTranslatedReadonly(idea, field)) {
        patch[field] = document.getElementById(TRANSLATABLE_IDEA_FIELD_INPUT_IDS[field]).value.trim();
      }
    });
    return patch;
  }

  document.getElementById("save-detail-btn").addEventListener("click", async () => {
    const { department, teamId } = readDepartmentTeam("detail");
    if (!department || (!teamId && teamSelectionRequired(department))) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-detail-btn");
    btn.disabled = true;
    btn.textContent = t("savingBtn");
    const updated = await updateIdea(idea.id, collectPatch());
    btn.disabled = false;
    btn.textContent = t("saveBtn");
    if (updated) {
      updated.extra_processes = idea.extra_processes || [];
      const idx = ideasCache.findIndex((i) => i.id === idea.id);
      if (idx >= 0) ideasCache[idx] = updated;
      toast(t("savedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
    }
  });

  document.getElementById("generate-prompt-btn").addEventListener("click", () => {
    const quickNote = document.getElementById("f-quick-note").value.trim();
    const problem = document.getElementById("f-problem").value.trim();
    const goal = document.getElementById("f-goal").value.trim();
    const businessBenefit = document.getElementById("f-business-benefit").value.trim();
    if (!problem || !goal || !businessBenefit) {
      toast(t("kickoffPromptRequiresFieldsMsg"));
      return;
    }
    const promptField = document.getElementById("f-initial-prompt");
    promptField.value = buildKickoffPrompt({ quick_note: quickNote, problem, goal, business_benefit: businessBenefit });
    promptField.dispatchEvent(new Event("input", { bubbles: true }));
    toast(t("kickoffPromptGeneratedMsg"));
  });
}

// ---------- Views: Processes ----------

function processCard(proc) {
  const ai = aiPotentialInfo(proc.ai_potential);
  const statusInfo = processStatusInfo(proc.status);
  return `
    <div class="idea-item" data-id="${proc.id}" data-type="process">
      <div class="idea-title">
        <span class="process-status-icon" title="${escapeHtml(statusInfo.label)}" aria-label="${escapeHtml(statusInfo.label)}">${statusInfo.icon}</span>
        ${escapeHtml(trValue(proc, "name"))}
      </div>
      <div class="idea-meta">
        <span class="badge"><span class="priority-dot" style="background:${ai.color}"></span> ${ai.label}</span>
        <span class="badge">${proc.realized_potential || 0}% ${escapeHtml(t("realizedPotentialLabel"))}</span>
        ${proc.team_id ? `<span class="badge">${escapeHtml(teamName(proc.team_id))}</span>` : ""}
        ${proc.parent ? `<span class="badge">↳ ${escapeHtml(trValue(proc.parent, "name"))}</span>` : ""}
        ${proc.updated_at ? `<span class="badge" title="${t("lastSavedTitle")}">🕒 ${formatDateTime(proc.updated_at)}</span>` : ""}
      </div>
      ${potentialBarHtml(proc.ai_potential, proc.realized_potential)}
    </div>
  `;
}

let activeProcessDeptFilter = "";
let activeProcessTeamFilter = "";

async function renderProcessList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("processesHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
      </div>
    </header>
    <main class="wide-main">
      ${tabBar("processes")}
      <div class="card capture-box">
        <label class="field-label" style="margin-top:0;">${t("newProcessLabel")}</label>
        <textarea id="process-name" placeholder="${t("processPlaceholder")}"></textarea>
        ${departmentTeamFields("", "", "pcapture")}
        <div class="row">
          <button class="btn-primary" id="save-process">${t("saveProcessBtn")}</button>
        </div>
      </div>
      ${deptTeamFilterRow("processfilter", activeProcessDeptFilter, activeProcessTeamFilter)}
      <div class="idea-list" id="process-list">
        <div class="empty-state">${t("loadingProcesses")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindLangToggle();
  bindThemeToggle();
  bindDepartmentTeamFields("pcapture");
  watchUnsavedChanges(document.querySelector(".capture-box"));

  document.getElementById("processfilter-dept-filter").addEventListener("change", (e) => {
    activeProcessDeptFilter = e.target.value;
    const teams = activeProcessDeptFilter ? readableTeamsForCode(activeProcessDeptFilter) : [];
    if (!teams.some((tm) => tm.id === activeProcessTeamFilter)) activeProcessTeamFilter = "";
    document.getElementById("processfilter-team-filter").innerHTML = teamFilterOptionsFrom(teams, activeProcessTeamFilter);
    renderProcessListItems();
  });
  document.getElementById("processfilter-team-filter").addEventListener("change", (e) => {
    activeProcessTeamFilter = e.target.value;
    renderProcessListItems();
  });
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);

  document.getElementById("save-process").addEventListener("click", async () => {
    const ta = document.getElementById("process-name");
    const text = ta.value.trim();
    const { department, teamId } = readDepartmentTeam("pcapture");
    if (!text) return;
    if (!department || (!teamId && teamSelectionRequired(department))) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-process");
    btn.disabled = true;
    const proc = await createProcess(text, department, teamId);
    btn.disabled = false;
    if (proc) {
      ta.value = "";
      toast(t("processSavedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      processesCache = await loadProcesses();
      renderProcessListItems();
    }
  });


  processesCache = await loadProcesses();
  renderProcessListItems();
}

let expandedProcessIds = new Set();

// Geschwister-Gruppe eines Prozesses innerhalb der aktuellen Filterung -
// dieselbe Regel wie beim Aufbau von "roots"/"children" unten, damit Auf/Ab
// immer exakt mit dem sichtbaren Baum übereinstimmt.
function processSiblingGroup(proc, filteredIds) {
  if (proc.parent_process_id && filteredIds.has(proc.parent_process_id)) {
    return processesCache.filter((p) => p.parent_process_id === proc.parent_process_id && filteredIds.has(p.id));
  }
  return processesCache.filter((p) => filteredIds.has(p.id) && (!p.parent_process_id || !filteredIds.has(p.parent_process_id)));
}

async function moveProcess(id, direction, filteredIds) {
  const proc = processesCache.find((p) => p.id === id);
  if (!proc) return;
  const siblings = processSiblingGroup(proc, filteredIds);
  const idx = siblings.findIndex((p) => p.id === id);
  const otherIdx = idx + direction;
  if (idx < 0 || otherIdx < 0 || otherIdx >= siblings.length) return;
  const a = siblings[idx];
  const b = siblings[otherIdx];
  if (!canWriteCombo(a.department, a.team_id) || !canWriteCombo(b.department, b.team_id)) return;
  await Promise.all([
    updateProcess(a.id, { position: b.position }),
    updateProcess(b.id, { position: a.position }),
  ]);
  processesCache = await loadProcesses();
  renderProcessListItems();
}

function processTreeNodeHtml(proc, filteredIds, siblings) {
  const children = processesCache.filter((p) => p.parent_process_id === proc.id && filteredIds.has(p.id));
  const hasChildren = children.length > 0;
  const isExpanded = expandedProcessIds.has(proc.id);
  const idx = siblings.indexOf(proc);
  const isFirst = idx <= 0;
  const isLast = idx === siblings.length - 1;
  return `
    <div class="tree-node">
      <div class="tree-row">
        ${
          hasChildren
            ? `<button class="tree-toggle" data-toggle-process="${proc.id}">${isExpanded ? "▾" : "▸"}</button>`
            : `<span class="tree-toggle-spacer"></span>`
        }
        <div class="tree-row-content">${processCard(proc)}</div>
        ${
          canWriteCombo(proc.department, proc.team_id)
            ? `
          <div class="tree-move-btns">
            <button class="icon-btn" data-process-up="${proc.id}" ${isFirst ? "disabled" : ""}>▲</button>
            <button class="icon-btn" data-process-down="${proc.id}" ${isLast ? "disabled" : ""}>▼</button>
          </div>`
            : ""
        }
      </div>
      ${
        hasChildren && isExpanded
          ? `<div class="tree-children">${children.map((c) => processTreeNodeHtml(c, filteredIds, children)).join("")}</div>`
          : ""
      }
    </div>
  `;
}

function renderProcessListItems() {
  const listEl = document.getElementById("process-list");
  if (!listEl) return;
  const filtered = processesCache.filter(
    (p) =>
      (!activeProcessDeptFilter || p.department === activeProcessDeptFilter) &&
      (!activeProcessTeamFilter || p.team_id === activeProcessTeamFilter)
  );
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${t("emptyProcesses")}</div>`;
  } else {
    const filteredIds = new Set(filtered.map((p) => p.id));
    const roots = filtered.filter((p) => !p.parent_process_id || !filteredIds.has(p.parent_process_id));
    listEl.innerHTML = roots.map((p) => processTreeNodeHtml(p, filteredIds, roots)).join("");
    listEl.querySelectorAll(".idea-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/process/${el.dataset.id}`;
      });
    });
    listEl.querySelectorAll("[data-toggle-process]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.toggleProcess;
        if (expandedProcessIds.has(id)) expandedProcessIds.delete(id);
        else expandedProcessIds.add(id);
        renderProcessListItems();
      });
    });
    listEl.querySelectorAll("[data-process-up]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        moveProcess(btn.dataset.processUp, -1, filteredIds);
      });
    });
    listEl.querySelectorAll("[data-process-down]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        moveProcess(btn.dataset.processDown, 1, filteredIds);
      });
    });
  }
}

async function renderProcessDetail(id) {
  let proc = processesCache.find((p) => p.id === id);
  if (!proc) {
    processesCache = await loadProcesses();
    proc = processesCache.find((p) => p.id === id);
  }
  if (!proc) {
    window.location.hash = "#/processes";
    return;
  }

  const linkedIdeas = (ideasCache.length ? ideasCache : (ideasCache = await loadIdeas())).filter((i) =>
    ideaLinksProcess(i, proc.id)
  );

  let subProcesses = processesCache.filter((p) => p.parent_process_id === proc.id);
  const canWrite = canWriteCombo(proc.department, proc.team_id);
  let processSteps = await loadProcessSteps(proc.id);
  let processResources = await loadProcessResources(proc.id);
  let processStepIdeas = await loadProcessStepIdeas(processSteps.map((s) => s.id));

  function renderSubProcessesHtml() {
    if (!subProcesses.length) {
      return `<div class="empty-state" style="padding:16px 4px;">${t("emptySubProcesses")}</div>`;
    }
    return subProcesses
      .map((p, idx) => {
        const moveButtons = canWrite
          ? `
            <button class="icon-btn" data-subprocess-up="${p.id}" ${idx === 0 ? "disabled" : ""}>▲</button>
            <button class="icon-btn" data-subprocess-down="${p.id}" ${idx === subProcesses.length - 1 ? "disabled" : ""}>▼</button>`
          : "";
        return `
          <div style="display:flex; align-items:center; gap:6px;">
            <a class="link-item" style="flex:1; margin-bottom:0;" href="#/process/${p.id}">${escapeHtml(trValue(p, "name"))}</a>
            ${moveButtons}
          </div>`;
      })
      .join("");
  }

  function bindSubProcessesEvents() {
    document.querySelectorAll("[data-subprocess-up]").forEach((btn) => {
      btn.addEventListener("click", () => moveSubProcess(btn.dataset.subprocessUp, -1));
    });
    document.querySelectorAll("[data-subprocess-down]").forEach((btn) => {
      btn.addEventListener("click", () => moveSubProcess(btn.dataset.subprocessDown, 1));
    });
  }

  async function refreshSubProcesses() {
    processesCache = await loadProcesses();
    subProcesses = processesCache.filter((p) => p.parent_process_id === proc.id);
    document.getElementById("sub-processes").innerHTML = renderSubProcessesHtml();
    bindSubProcessesEvents();
  }

  async function moveSubProcess(id, direction) {
    const idx = subProcesses.findIndex((p) => p.id === id);
    const otherIdx = idx + direction;
    if (idx < 0 || otherIdx < 0 || otherIdx >= subProcesses.length) return;
    const a = subProcesses[idx];
    const b = subProcesses[otherIdx];
    await Promise.all([
      updateProcess(a.id, { position: b.position }),
      updateProcess(b.id, { position: a.position }),
    ]);
    if (unsavedChangesReset) unsavedChangesReset();
    await refreshSubProcesses();
  }

  function renderStepsListHtml() {
    if (!processSteps.length) {
      return `<div class="empty-state" style="padding:16px 4px;">${t("emptyProcessSteps")}</div>`;
    }
    return processSteps
      .map((step, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === processSteps.length - 1;
        const controls = canWrite
          ? `
            <div class="row" style="margin-top:8px; gap:6px;">
              <input class="field" data-step-number="${step.id}" value="${escapeHtml(step.step_number || "")}" placeholder="${t("stepNumberPlaceholder")}" style="flex:0 0 90px;" />
              <select class="field" data-step-linked-process="${step.id}" style="flex:1;">
                <option value="">${t("stepNoLinkedProcessOption")}</option>
                ${subProcesses
                  .map((p) => `<option value="${p.id}" ${p.id === step.linked_process_id ? "selected" : ""}>${escapeHtml(p.name)}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="row" style="margin-top:8px; align-items:center; gap:6px;">
              <select class="field" data-step-type="${step.id}" style="flex:1;">
                ${PROCESS_STEP_TYPES.map(
                  (ty) => `<option value="${ty}" ${ty === step.step_type ? "selected" : ""}>${t(`stepType_${ty}`)}</option>`
                ).join("")}
              </select>
              <button class="icon-btn" data-step-up="${step.id}" ${isFirst ? "disabled" : ""}>▲</button>
              <button class="icon-btn" data-step-down="${step.id}" ${isLast ? "disabled" : ""}>▼</button>
              <button class="icon-btn" data-step-edit="${step.id}" title="${t("editStepBtn")}">✏️</button>
              <button class="icon-btn" data-step-delete="${step.id}" title="${t("deleteStepBtn")}">🗑</button>
            </div>`
          : "";
        const ai = aiPotentialInfo(step.ai_potential);
        const titleHtml = step.linked_process_id
          ? `<a href="#/process/${step.linked_process_id}">${escapeHtml(step.title)} ↗</a>`
          : escapeHtml(step.title);
        const stepNumberBadge = step.step_number
          ? `<span style="font-weight:600; color:var(--text-dim); margin-right:6px;">${escapeHtml(step.step_number)}</span>`
          : "";
        const ideaFlagsHtml = linkedIdeas.length
          ? `
            <div style="margin-top:8px;">
              <div style="font-size:12px; color:var(--text-dim); margin-bottom:4px;">${t("stepIdeaFlagsLabel")}</div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${linkedIdeas
                  .map((idea) => {
                    const checked = processStepIdeas.some((psi) => psi.step_id === step.id && psi.idea_id === idea.id);
                    return `
                      <label style="display:flex; align-items:center; gap:6px; font-size:13px;">
                        <input type="checkbox" data-step-idea-flag="${step.id}" data-idea-id="${idea.id}" ${checked ? "checked" : ""} ${canWrite ? "" : "disabled"} />
                        ${escapeHtml(trValue(idea, "quick_note"))}
                      </label>`;
                  })
                  .join("")}
              </div>
            </div>`
          : "";
        return `
          <div class="process-step" style="border-left-color:${stepTypeColor(step.step_type)};">
            <div>${stepNumberBadge}${stepTypeIcon(step.step_type)} <strong>${titleHtml}</strong></div>
            ${
              step.description
                ? `<div style="font-size:12.5px; color:var(--text-dim); margin-top:4px; white-space:pre-wrap;">${escapeHtml(step.description)}</div>`
                : ""
            }
            <div class="priority-banner" data-step-ai-badge="${step.id}" style="margin-top:8px; margin-bottom:0; padding:8px 10px; font-size:12.5px;">
              <span class="priority-dot" style="background:${ai.color}"></span> ${ai.label}
            </div>
            <div class="slider-row" style="margin-top:6px; margin-bottom:6px;">
              <label>${t("aiPotentialLabel")}</label>
              <input type="range" min="1" max="5" step="1" value="${step.ai_potential || 3}" data-step-ai-potential="${step.id}" />
              <span class="val" data-step-ai-potential-val="${step.id}">${step.ai_potential || 3}</span>
            </div>
            <div class="slider-row" style="margin-bottom:6px;">
              <label>${t("realizedPotentialLabel")}</label>
              <input type="range" min="0" max="100" step="5" value="${step.realized_potential || 0}" data-step-realized-potential="${step.id}" />
              <span class="val" data-step-realized-potential-val="${step.id}">${step.realized_potential || 0}%</span>
            </div>
            <div data-step-potential-bar="${step.id}">${potentialBarHtml(step.ai_potential, step.realized_potential)}</div>
            <textarea class="field" data-step-ai-note="${step.id}" placeholder="${t("stepAiPotentialNotePlaceholder")}" style="font-size:12.5px; min-height:44px; padding:8px 10px;">${escapeHtml(step.ai_potential_note || "")}</textarea>
            ${ideaFlagsHtml}
            ${controls}
          </div>
          ${isLast ? "" : `<div class="process-step-arrow">↓</div>`}
        `;
      })
      .join("");
  }

  function bindStepsListEvents() {
    document.querySelectorAll("[data-step-linked-process]").forEach((sel) => {
      sel.addEventListener("change", async () => {
        sel.disabled = true;
        const updated = await updateProcessStep(sel.dataset.stepLinkedProcess, { linked_process_id: sel.value || null });
        sel.disabled = false;
        if (updated) {
          toast(t("stepSavedMsg"));
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        }
      });
    });
    document.querySelectorAll("[data-step-type]").forEach((sel) => {
      sel.addEventListener("change", async () => {
        sel.disabled = true;
        const updated = await updateProcessStep(sel.dataset.stepType, { step_type: sel.value });
        sel.disabled = false;
        if (updated) {
          toast(t("stepSavedMsg"));
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        }
      });
    });
    document.querySelectorAll("[data-step-up]").forEach((btn) => {
      btn.addEventListener("click", () => moveStep(btn.dataset.stepUp, -1));
    });
    document.querySelectorAll("[data-step-down]").forEach((btn) => {
      btn.addEventListener("click", () => moveStep(btn.dataset.stepDown, 1));
    });
    document.querySelectorAll("[data-step-edit]").forEach((btn) => {
      btn.addEventListener("click", () => editStep(btn.dataset.stepEdit));
    });
    document.querySelectorAll("[data-step-delete]").forEach((btn) => {
      btn.addEventListener("click", () => removeStep(btn.dataset.stepDelete));
    });
    function currentStepRealizedPotential(id) {
      const slider = document.querySelector(`[data-step-realized-potential="${id}"]`);
      return slider ? Number(slider.value) : 0;
    }
    function refreshStepPotentialBar(id, aiVal) {
      const barEl = document.querySelector(`[data-step-potential-bar="${id}"]`);
      if (barEl) barEl.innerHTML = potentialBarHtml(aiVal, currentStepRealizedPotential(id));
    }
    document.querySelectorAll("[data-step-ai-potential]").forEach((slider) => {
      const id = slider.dataset.stepAiPotential;
      slider.addEventListener("input", () => {
        const val = Number(slider.value);
        const valEl = document.querySelector(`[data-step-ai-potential-val="${id}"]`);
        if (valEl) valEl.textContent = val;
        const badgeEl = document.querySelector(`[data-step-ai-badge="${id}"]`);
        if (badgeEl) {
          const info = aiPotentialInfo(val);
          badgeEl.innerHTML = `<span class="priority-dot" style="background:${info.color}"></span> ${info.label}`;
        }
        refreshStepPotentialBar(id, val);
      });
      slider.addEventListener("change", async () => {
        const updated = await updateProcessStep(id, { ai_potential: Number(slider.value) });
        if (updated) {
          toast(t("stepSavedMsg"));
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        }
      });
    });
    document.querySelectorAll("[data-step-realized-potential]").forEach((slider) => {
      const id = slider.dataset.stepRealizedPotential;
      slider.addEventListener("input", () => {
        const val = Number(slider.value);
        const valEl = document.querySelector(`[data-step-realized-potential-val="${id}"]`);
        if (valEl) valEl.textContent = `${val}%`;
        const aiSlider = document.querySelector(`[data-step-ai-potential="${id}"]`);
        refreshStepPotentialBar(id, aiSlider ? Number(aiSlider.value) : 3);
      });
      slider.addEventListener("change", async () => {
        const updated = await updateProcessStep(id, { realized_potential: Number(slider.value) });
        if (updated) {
          toast(t("stepSavedMsg"));
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        }
      });
    });
    document.querySelectorAll("[data-step-ai-note]").forEach((input) => {
      input.addEventListener("blur", async () => {
        if (input.value === input.defaultValue) return;
        const updated = await updateProcessStep(input.dataset.stepAiNote, { ai_potential_note: input.value.trim() });
        if (updated) {
          toast(t("stepSavedMsg"));
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        }
      });
    });
    document.querySelectorAll("[data-step-number]").forEach((input) => {
      input.addEventListener("blur", async () => {
        if (input.value === input.defaultValue) return;
        const updated = await updateProcessStep(input.dataset.stepNumber, { step_number: input.value.trim() });
        if (updated) {
          toast(t("stepSavedMsg"));
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        }
      });
    });
    document.querySelectorAll("[data-step-idea-flag]").forEach((checkbox) => {
      checkbox.addEventListener("change", async () => {
        checkbox.disabled = true;
        const ok = await setStepIdeaFlag(checkbox.dataset.stepIdeaFlag, checkbox.dataset.ideaId, checkbox.checked);
        checkbox.disabled = false;
        if (ok) {
          if (unsavedChangesReset) unsavedChangesReset();
          await refreshSteps();
        } else {
          checkbox.checked = !checkbox.checked;
        }
      });
    });
  }

  async function refreshSteps() {
    processSteps = await loadProcessSteps(proc.id);
    processStepIdeas = await loadProcessStepIdeas(processSteps.map((s) => s.id));
    document.getElementById("process-steps-list").innerHTML = renderStepsListHtml();
    bindStepsListEvents();
  }

  async function moveStep(id, direction) {
    const idx = processSteps.findIndex((s) => s.id === id);
    const otherIdx = idx + direction;
    if (idx < 0 || otherIdx < 0 || otherIdx >= processSteps.length) return;
    const a = processSteps[idx];
    const b = processSteps[otherIdx];
    await Promise.all([
      updateProcessStep(a.id, { position: b.position }),
      updateProcessStep(b.id, { position: a.position }),
    ]);
    if (unsavedChangesReset) unsavedChangesReset();
    await refreshSteps();
  }

  async function editStep(id) {
    const step = processSteps.find((s) => s.id === id);
    if (!step) return;
    const newTitle = prompt(t("editStepTitlePrompt"), step.title);
    if (newTitle === null || !newTitle.trim()) return;
    const newDesc = prompt(t("editStepDescPrompt"), step.description || "");
    if (newDesc === null) return;
    const updated = await updateProcessStep(id, { title: newTitle.trim(), description: newDesc.trim() });
    if (updated) {
      toast(t("stepSavedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      await refreshSteps();
    }
  }

  async function removeStep(id) {
    if (!confirm(t("deleteStepConfirm"))) return;
    const ok = await deleteProcessStep(id);
    if (ok) {
      toast(t("stepDeletedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      await refreshSteps();
    }
  }

  function renderResourcesListHtml() {
    if (!processResources.length) {
      return `<div class="empty-state" style="padding:16px 4px;">${t("emptyProcessResources")}</div>`;
    }
    return processResources
      .map((r) => {
        const icon = r.kind === "document" ? "📄" : "🔗";
        const del = canWrite
          ? `<button class="icon-btn" data-resource-delete="${r.id}" title="${t("deleteStepBtn")}">🗑</button>`
          : "";
        return `
          <div class="resource-item">
            <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${icon} ${escapeHtml(r.label || r.url)}</a>
            ${del}
          </div>
        `;
      })
      .join("");
  }

  function bindResourcesListEvents() {
    document.querySelectorAll("[data-resource-delete]").forEach((btn) => {
      btn.addEventListener("click", () => removeResource(btn.dataset.resourceDelete));
    });
  }

  async function refreshResources() {
    processResources = await loadProcessResources(proc.id);
    document.getElementById("process-resources-list").innerHTML = renderResourcesListHtml();
    bindResourcesListEvents();
  }

  async function removeResource(id) {
    if (!confirm(t("deleteResourceConfirm"))) return;
    const ok = await deleteProcessResource(id);
    if (ok) {
      toast(t("resourceDeletedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      await refreshResources();
    }
  }

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${canWrite ? `<button class="icon-btn" id="duplicate-process-btn">${t("duplicateProcessBtn")}</button>` : ""}
      <button class="icon-btn" id="delete-btn">${t("deleteBtn")}</button>
    </header>
    <main class="wide-main">
      ${
        canWrite
          ? ""
          : `<div style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">🔒 ${t("readOnlyNotice")}</div>`
      }
      <div class="card">
        <label class="field-label">${t("processNameLabel")}</label>
        <textarea class="field" id="f-name"${trReadonlyAttr(proc, "name")}>${escapeHtml(trValue(proc, "name"))}</textarea>

        <label class="field-label">${t("processStatusLabel")}</label>
        <select class="field" id="f-process-status">
          <option value="open" ${proc.status === "reviewed" ? "" : "selected"}>${t("processStatus_open")}</option>
          <option value="reviewed" ${proc.status === "reviewed" ? "selected" : ""}>${t("processStatus_reviewed")}</option>
        </select>

        <label class="field-label">${t("departmentLabel")} / ${t("teamLabel")}</label>
        ${departmentTeamFields(proc.department, proc.team_id, "pdetail")}

        <label class="field-label">${t("parentProcessLabel")}</label>
        <select class="field" id="f-parent-process">
          ${parentProcessOptions(proc.id, proc.parent_process_id)}
        </select>

        <div class="section-title" style="margin:20px 0 10px;">${t("subProcessesTitle")}</div>
        <div id="sub-processes">${renderSubProcessesHtml()}</div>
        <div class="row">
          <button class="btn-secondary" id="add-subprocess-btn" style="width:100%;">${t("addSubProcessBtn")}</button>
        </div>

        <div class="section-title" style="margin:20px 0 10px;">${t("linkedUseCasesTitle")}</div>
        <div id="linked-ideas">
          ${
            linkedIdeas.length
              ? linkedIdeas.map((i) => `<a class="link-item" href="#/idea/${i.id}">${escapeHtml(trValue(i, "quick_note"))}</a>`).join("")
              : `<div class="empty-state" style="padding:16px 4px;">${t("emptyLinkedIdeas")}</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-idea-btn" style="width:100%;">${t("addIdeaBtn")}</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("aiPotentialTitle")}</div>
        <div id="ai-potential-banner" class="priority-banner"></div>
        ${sliderRow("ai_potential", t("aiPotentialLabel"), proc.ai_potential)}
        ${percentSliderRow("realized_potential", t("realizedPotentialLabel"), proc.realized_potential)}
        <div id="ai-potential-bar">${potentialBarHtml(proc.ai_potential, proc.realized_potential)}</div>
        <label class="field-label">${t("notesLabel")}</label>
        <textarea class="field" id="f-notes" placeholder="${t("notesPlaceholder")}"${trReadonlyAttr(proc, "notes")}>${escapeHtml(trValue(proc, "notes"))}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("processStepsTitle")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">${t("processStepsDesc")}</p>
        <div id="process-steps-list">${renderStepsListHtml()}</div>
        ${
          canWrite
            ? `
          <div class="row" style="margin-top:12px;">
            <input class="field" id="new-step-title" placeholder="${t("newStepPlaceholder")}" style="flex:2;" />
            <select class="field" id="new-step-type" style="flex:1;">
              ${PROCESS_STEP_TYPES.map((ty) => `<option value="${ty}" ${ty === "step" ? "selected" : ""}>${t(`stepType_${ty}`)}</option>`).join("")}
            </select>
          </div>
          <input class="field" id="new-step-desc" placeholder="${t("newStepDescPlaceholder")}" style="margin-top:8px;" />
          <div class="row">
            <button class="btn-secondary" id="add-step-btn" style="width:100%;">${t("addStepBtn")}</button>
          </div>
        `
            : ""
        }
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("processResourcesTitle")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">${t("processResourcesDesc")}</p>
        <div id="process-resources-list">${renderResourcesListHtml()}</div>
        ${
          canWrite
            ? `
          <div class="row" style="margin-top:12px;">
            <input class="field" id="new-resource-label" placeholder="${t("newResourceLabelPlaceholder")}" style="flex:1;" />
            <select class="field" id="new-resource-kind" style="flex:1;">
              ${PROCESS_RESOURCE_KINDS.map((k) => `<option value="${k}" ${k === "link" ? "selected" : ""}>${t(`resourceKind_${k}`)}</option>`).join("")}
            </select>
          </div>
          <input class="field" id="new-resource-url" placeholder="${t("newResourceUrlPlaceholder")}" style="margin-top:8px;" />
          <div class="row">
            <button class="btn-secondary" id="add-resource-btn" style="width:100%;">${t("addResourceBtn")}</button>
          </div>
        `
            : ""
        }
      </div>

      <div class="row">
        <button class="btn-primary" id="save-process-detail-btn">${t("saveBtn")}</button>
      </div>
    </main>
  `;

  bindDepartmentTeamFields("pdetail");
  bindStepsListEvents();
  bindResourcesListEvents();
  bindSubProcessesEvents();

  if (!canWrite) {
    document.querySelectorAll("main input, main textarea, main select, main button").forEach((el) => {
      el.disabled = true;
    });
  } else {
    watchUnsavedChanges(document.querySelector("main"));

    document.getElementById("add-step-btn").addEventListener("click", async () => {
      const input = document.getElementById("new-step-title");
      const title = input.value.trim();
      if (!title) return;
      const type = document.getElementById("new-step-type").value;
      const descInput = document.getElementById("new-step-desc");
      const description = descInput.value.trim();
      const nextPosition = processSteps.length ? Math.max(...processSteps.map((s) => s.position)) + 1 : 0;
      const created = await createProcessStep(proc.id, nextPosition, type, title, description);
      if (created) {
        input.value = "";
        descInput.value = "";
        toast(t("stepSavedMsg"));
        if (unsavedChangesReset) unsavedChangesReset();
        await refreshSteps();
      }
    });

    document.getElementById("add-resource-btn").addEventListener("click", async () => {
      const labelInput = document.getElementById("new-resource-label");
      const urlInput = document.getElementById("new-resource-url");
      const label = labelInput.value.trim();
      const url = urlInput.value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) {
        toast(t("invalidUrlMsg"));
        return;
      }
      const kind = document.getElementById("new-resource-kind").value;
      const created = await createProcessResource(proc.id, kind, label || url, url);
      if (created) {
        labelInput.value = "";
        urlInput.value = "";
        toast(t("resourceSavedMsg"));
        if (unsavedChangesReset) unsavedChangesReset();
        await refreshResources();
      }
    });
  }

  function updateAiBanner() {
    const val = Number(document.querySelector('[data-field="ai_potential"]').value);
    const realized = Number(document.querySelector('[data-field="realized_potential"]').value);
    const ai = aiPotentialInfo(val);
    document.getElementById("ai-potential-banner").innerHTML =
      `<span class="priority-dot" style="background:${ai.color}"></span> ${t("assessmentPrefix")}<strong>${ai.label}</strong>`;
    document.getElementById("ai-potential-bar").innerHTML = potentialBarHtml(val, realized);
  }

  document.querySelectorAll("input[data-field]").forEach((slider) => {
    slider.addEventListener("input", () => {
      slider.nextElementSibling.textContent = slider.dataset.field === "realized_potential" ? `${slider.value}%` : slider.value;
      updateAiBanner();
    });
  });
  updateAiBanner();

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "#/processes";
  });

  document.getElementById("delete-btn").addEventListener("click", async () => {
    if (!confirm(t("deleteProcessConfirm"))) return;
    const ok = await deleteProcess(proc.id);
    if (ok) {
      toast(t("processDeletedMsg"));
      clearUnsavedChanges();
      window.location.hash = "#/processes";
    }
  });

  if (document.getElementById("duplicate-process-btn")) {
    document.getElementById("duplicate-process-btn").addEventListener("click", async () => {
      const btn = document.getElementById("duplicate-process-btn");
      btn.disabled = true;
      const created = await duplicateProcess(proc.id);
      btn.disabled = false;
      if (created) {
        toast(t("processDuplicatedMsg"));
        processesCache = await loadProcesses();
        clearUnsavedChanges();
        window.location.hash = `#/process/${created.id}`;
      }
    });
  }

  document.getElementById("add-idea-btn").addEventListener("click", async () => {
    const text = prompt(t("newIdeaPrompt"));
    if (!text || !text.trim()) return;
    const idea = await createIdea(text.trim(), proc.department, proc.team_id, proc.id);
    if (idea) {
      toast(t("ideaSavedMsg"));
      ideasCache = await loadIdeas();
      window.location.hash = `#/idea/${idea.id}`;
    }
  });

  document.getElementById("add-subprocess-btn").addEventListener("click", async () => {
    const text = prompt(t("newSubProcessPrompt"));
    if (!text || !text.trim()) return;
    const sub = await createProcess(text.trim(), proc.department, proc.team_id, proc.id);
    if (sub) {
      toast(t("subProcessSavedMsg"));
      processesCache = await loadProcesses();
      window.location.hash = `#/process/${sub.id}`;
    }
  });

  document.getElementById("save-process-detail-btn").addEventListener("click", async () => {
    const { department, teamId } = readDepartmentTeam("pdetail");
    if (!department || (!teamId && teamSelectionRequired(department))) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-process-detail-btn");
    btn.disabled = true;
    btn.textContent = t("savingBtn");
    const patch = {
      department,
      team_id: teamId,
      parent_process_id: document.getElementById("f-parent-process").value || null,
      status: document.getElementById("f-process-status").value,
      ai_potential: Number(document.querySelector('[data-field="ai_potential"]').value),
      realized_potential: Number(document.querySelector('[data-field="realized_potential"]').value),
    };
    // Felder, die aktuell die (vom Admin gepflegte) Übersetzung anzeigen,
    // werden nicht mitgespeichert - sonst würde die englische Anzeige das
    // deutsche Original überschreiben (siehe isTranslatedReadonly).
    const processFieldInputIds = { name: "f-name", notes: "f-notes" };
    TRANSLATABLE_PROCESS_FIELDS.forEach((field) => {
      if (!isTranslatedReadonly(proc, field)) {
        patch[field] = document.getElementById(processFieldInputIds[field]).value.trim();
      }
    });
    const updated = await updateProcess(proc.id, patch);
    btn.disabled = false;
    btn.textContent = t("saveBtn");
    if (updated) {
      const idx = processesCache.findIndex((p) => p.id === proc.id);
      if (idx >= 0) processesCache[idx] = updated;
      toast(t("savedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
    }
  });
}

// ---------- View: Settings ----------

function renderSettings() {
  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("changePasswordTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">
          ${t("changePasswordDesc")}
        </p>
        <input class="field" id="f-new-password" type="password" placeholder="${t("newPasswordPlaceholder")}" minlength="6" autocomplete="new-password" />
        <div class="row">
          <button class="btn-primary" id="save-password-btn">${t("savePassword")}</button>
        </div>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  bindLangToggle();
  bindThemeToggle();

  document.getElementById("save-password-btn").addEventListener("click", async () => {
    const input = document.getElementById("f-new-password");
    const newPassword = input.value;
    if (!newPassword || newPassword.length < 6) return;
    const btn = document.getElementById("save-password-btn");
    btn.disabled = true;
    const { error } = await sb.auth.updateUser({ password: newPassword });
    btn.disabled = false;
    if (error) {
      toast(t("errorPrefix") + error.message);
    } else {
      input.value = "";
      toast(t("passwordChangedMsg"));
    }
  });
}

// ---------- View: Feedback ----------

function renderFeedback() {
  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("feedbackTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">
          ${t("feedbackDesc")}
        </p>
        ${sliderRow("usability", t("feedbackRatingUsability"), 3)}
        ${sliderRow("design", t("feedbackRatingDesign"), 3)}
        ${sliderRow("features", t("feedbackRatingFeatures"), 3)}
        ${sliderRow("performance", t("feedbackRatingPerformance"), 3)}
        <label class="field-label">${t("feedbackCommentLabel")}</label>
        <textarea class="field" id="f-feedback-comment" placeholder="${t("feedbackCommentPlaceholder")}"></textarea>
        <div class="row">
          <button class="btn-primary" id="send-feedback-btn">${t("sendFeedbackBtn")}</button>
        </div>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener("input", () => {
      slider.nextElementSibling.textContent = slider.value;
    });
  });

  document.getElementById("send-feedback-btn").addEventListener("click", async () => {
    const btn = document.getElementById("send-feedback-btn");
    btn.disabled = true;
    const { error } = await sb.from("app_feedback").insert({
      user_id: currentUser.id,
      rating_usability: Number(document.querySelector('[data-field="usability"]').value),
      rating_design: Number(document.querySelector('[data-field="design"]').value),
      rating_features: Number(document.querySelector('[data-field="features"]').value),
      rating_performance: Number(document.querySelector('[data-field="performance"]').value),
      comment: document.getElementById("f-feedback-comment").value.trim(),
    });
    btn.disabled = false;
    if (error) {
      toast(t("saveErrorPrefix") + error.message);
      return;
    }
    toast(t("feedbackSentMsg"));
    window.location.hash = "";
  });
}

// ---------- View: Anleitung (Guide) ----------

const GUIDE_TOUR_PANELS = {
  start: [
    ["📈", "guideStartF1Name", "guideStartF1Desc"],
    ["🧭", "guideStartF2Name", "guideStartF2Desc"],
    ["🕘", "guideStartF3Name", "guideStartF3Desc"],
  ],
  processes: [
    ["🗂️", "guideProcF1Name", "guideProcF1Desc"],
    ["🧬", "guideProcF2Name", "guideProcF2Desc"],
    ["🔀", "guideProcF3Name", "guideProcF3Desc"],
    ["🔗", "guideProcF4Name", "guideProcF4Desc"],
  ],
  ideas: [
    ["⚡", "guideIdeaF1Name", "guideIdeaF1Desc"],
    ["🎯", "guideIdeaF2Name", "guideIdeaF2Desc"],
    ["🤖", "guideIdeaF3Name", "guideIdeaF3Desc"],
    ["🔢", "guideIdeaF4Name", "guideIdeaF4Desc"],
    ["🔄", "guideIdeaF5Name", "guideIdeaF5Desc"],
  ],
  dashboard: [
    ["🧮", "guideDashF1Name", "guideDashF1Desc"],
    ["🌳", "guideDashF2Name", "guideDashF2Desc"],
    ["🚦", "guideDashF3Name", "guideDashF3Desc"],
    ["🏆", "guideDashF4Name", "guideDashF4Desc"],
  ],
};

function guideTourPanelHtml(panelKey) {
  return GUIDE_TOUR_PANELS[panelKey]
    .map(
      ([icon, nameKey, descKey]) => `
      <div class="guide-feature">
        <div class="mark">${icon}</div>
        <div><div class="name">${t(nameKey)}</div><p class="desc">${t(descKey)}</p></div>
      </div>`
    )
    .join("");
}

function guideStepHtml(num, titleKey, descKey, suffixHtml) {
  return `
    <div class="guide-step">
      <div class="num">${num}</div>
      <div class="body"><strong style="color:var(--text); display:block; margin-bottom:2px;">${t(titleKey)}</strong>${t(descKey)}${suffixHtml || ""}</div>
    </div>
  `;
}

function guideSubstepHtml(num, descKey) {
  return `
    <div class="guide-step">
      <div class="num">${num}</div>
      <div class="body">${t(descKey)}</div>
    </div>
  `;
}

function guideSubstepsBlockHtml(letter, titleKey, descKeys) {
  return `
    <div class="guide-substep-label"><span class="n">${letter}</span>${t(titleKey)}</div>
    ${descKeys.map((descKey, i) => guideSubstepHtml(i + 1, descKey)).join("")}
  `;
}

function renderGuide() {
  const adminEmail = "d.goos@house-of-communication.com";
  const mailLink = `<a href="mailto:${adminEmail}">${adminEmail}</a>`;
  const tourTabLabels = {
    start: t("startTab"),
    processes: t("processesTab"),
    ideas: t("ideasTab"),
    dashboard: t("dashboardTab"),
  };

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 4px;">${t("guideIntroEyebrow")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); line-height:1.55; margin:0;">${t("guideIntroLede")}</p>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 4px;">${t("guideAccessEyebrow")}</div>
        <div class="guide-h2">${t("guideAccessH2")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 14px;">${t("guideAccessDesc")}</p>
        ${guideStepHtml(1, "guideStep1Title", "guideStep1Desc", ` ${mailLink}`)}
        ${guideStepHtml(2, "guideStep2Title", "guideStep2Desc")}
        ${guideStepHtml(3, "guideStep3Title", "guideStep3Desc")}
        <div class="guide-callout"><div><strong>${t("guidePendingTitle")}</strong>${t("guidePendingDesc")}</div></div>
        <div class="guide-callout"><div><strong>${t("guideForgotTitle")}</strong>${t("guideForgotDesc")}</div></div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 4px;">${t("guideTourEyebrow")}</div>
        <div class="guide-h2">${t("guideTourH2")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 14px;">${t("guideTourDesc")}</p>
        <div class="guide-tabs" id="guide-tour-tabs">
          ${Object.keys(tourTabLabels)
            .map((k) => `<button data-guide-tab="${k}" class="${k === "start" ? "active" : ""}">${tourTabLabels[k]}</button>`)
            .join("")}
        </div>
        <div id="guide-tour-panel">${guideTourPanelHtml("start")}</div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 4px;">${t("guideFirstEyebrow")}</div>
        <div class="guide-h2">${t("guideFirstH2")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 14px;">${t("guideFirstDesc")}</p>
        ${guideSubstepsBlockHtml("A", "guideFirstProcTitle", [
          "guideFirstProc1",
          "guideFirstProc2",
          "guideFirstProc3",
          "guideFirstProc4",
          "guideFirstProc5",
          "guideFirstProc6",
          "guideFirstProc7",
          "guideFirstProc8",
        ])}
        ${guideSubstepsBlockHtml("B", "guideFirstIdeaTitle", [
          "guideFirstIdea1",
          "guideFirstIdea2",
          "guideFirstIdea3",
          "guideFirstIdea4",
          "guideFirstIdea5",
          "guideFirstIdea6",
          "guideFirstIdea7",
          "guideFirstIdea8",
          "guideFirstIdea9",
          "guideFirstIdea10",
          "guideFirstIdea11",
          "guideFirstIdea12",
        ])}
        ${guideSubstepsBlockHtml("C", "guideFirstExportNewTitle", [
          "guideFirstExportNew1",
          "guideFirstExportNew2",
          "guideFirstExportNew3",
          "guideFirstExportNew4",
          "guideFirstExportNew5",
        ])}
        ${guideSubstepsBlockHtml("D", "guideFirstExportUpdateTitle", [
          "guideFirstExportUpdate1",
          "guideFirstExportUpdate2",
          "guideFirstExportUpdate3",
          "guideFirstExportUpdate4",
          "guideFirstExportUpdate5",
        ])}
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 4px;">${t("guideMoreEyebrow")}</div>
        <div class="guide-h2">${t("guideMoreH2")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 14px;">${t("guideMoreDesc")}</p>
        <div class="guide-mgmt-grid">
          <div class="guide-mgmt-tile"><div class="ic">🔄</div><div class="t">${t("utilExportLabel")}</div><p class="d">${t("guideMgmtExportD")}</p></div>
          <div class="guide-mgmt-tile"><div class="ic">🧩</div><div class="t">${t("utilTeamsLabel")}</div><p class="d">${t("guideMgmtTeamsD")}</p></div>
          <div class="guide-mgmt-tile"><div class="ic">⚙️</div><div class="t">${t("utilSettingsLabel")}</div><p class="d">${t("guideMgmtSettingsD")}</p></div>
          <div class="guide-mgmt-tile"><span class="admin-tag" style="position:absolute; top:10px; right:10px;">${t("adminOnlyTag")}</span><div class="ic">🛡️</div><div class="t">${t("utilPermissionsLabel")}</div><p class="d">${t("guideMgmtAccessD")}</p></div>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 8px;">${t("guideGoodEyebrow")}</div>
        <div class="guide-h2" style="margin-bottom:10px;">${t("guideGoodH2")}</div>
        <div class="guide-callout" style="margin-top:0;"><div><strong>${t("guideGood1Title")}</strong>${t("guideGood1Desc")}</div></div>
        <div class="guide-callout"><div><strong>${t("guideGood2Title")}</strong>${t("guideGood2Desc")}</div></div>
        <div class="guide-callout"><div><strong>${t("guideGood3Title")}</strong>${t("guideGood3Desc")}</div></div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 4px;">${t("guideDeviceEyebrow")}</div>
        <div class="guide-h2">${t("guideDeviceH2")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 14px;">${t("guideDeviceDesc")}</p>
        <div class="guide-device-grid">
          <div class="guide-device-card"><div class="head">💻 ${t("guideDevice1Name")}</div><ol><li>${t("guideDevice1Li1")}</li><li>${t("guideDevice1Li2")}</li></ol></div>
          <div class="guide-device-card"><div class="head">💻 ${t("guideDevice2Name")}</div><ol><li>${t("guideDevice2Li1")}</li><li>${t("guideDevice2Li2")}</li></ol></div>
          <div class="guide-device-card"><div class="head">📱 ${t("guideDevice3Name")}</div><ol><li>${t("guideDevice3Li1")}</li><li>${t("guideDevice3Li2")}</li></ol></div>
          <div class="guide-device-card"><div class="head">📱 ${t("guideDevice4Name")}</div><ol><li>${t("guideDevice4Li1")}</li><li>${t("guideDevice4Li2")}</li></ol></div>
        </div>
      </div>

      <div class="card">
        <p style="font-size:12.5px; color:var(--text-dim); margin:0 0 8px; line-height:1.5;">${t("guideFooter1")} ${mailLink}${t("guideFooter1Suffix")}</p>
        <p style="font-size:12px; color:var(--text-dim); margin:0; line-height:1.5;">${t("guideFooter2")}</p>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });
  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll("[data-guide-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-guide-tab]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("guide-tour-panel").innerHTML = guideTourPanelHtml(btn.dataset.guideTab);
    });
  });
}

function renderPendingApproval() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("pendingTitle")}</h1>
      <p>${escapeHtml(currentUser.email)} ${t("pendingDesc")}</p>
      <div class="row" style="width:100%; max-width:320px;">
        <button class="btn-secondary" id="recheck-btn" style="width:100%;">${t("checkStatus")}</button>
      </div>
      <button class="btn-ghost" id="pending-logout-btn" style="margin-top:14px;">${t("logout")}</button>
    </div>
  `;
  document.getElementById("recheck-btn").addEventListener("click", async () => {
    currentProfile = null;
    await render();
  });
  document.getElementById("pending-logout-btn").addEventListener("click", guardedLogout);
}

function renderProfileError() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("profileErrorTitle")}</h1>
      <p>${t("profileErrorDesc")}</p>
      <button class="btn-ghost" id="error-logout-btn">${t("logout")}</button>
    </div>
  `;
  document.getElementById("error-logout-btn").addEventListener("click", guardedLogout);
}

// ---------- View: Export (App -> Excel-Katalog Sync) ----------

function buildExportBlock(idea) {
  const section = (label, value) => (value ? `\n${label}:\n${value}\n` : "");
  return [
    `### ${idea.quick_note}`,
    `Status: ${idea.status}`,
    `Abteilung: ${idea.department}`,
    `Team: ${teamName(idea.team_id)}`,
    idea.owner_name ? `Usecase-Geber: ${idea.owner_name}` : "",
    idea.tags ? `Tags/Bucket: ${idea.tags}` : "",
    idea.ai_role ? `KI-Rolle: ${idea.ai_role}` : "",
    idea.kpi_kind ? `Kind of KPI: ${idea.kpi_kind}` : "",
    idea.list_priority ? `Priorität (Liste): ${idea.list_priority}` : "",
    idea.skill_level ? `Skill Level: ${idea.skill_level}` : "",
    section("Problem", idea.problem),
    section("Ziel", idea.goal),
    section("Business Benefit", idea.business_benefit),
    section("Tools (KI-Lösung)", idea.tools),
    section("Systeme", idea.systeme),
    section("Wichtige Gedanken vorab / Risiken", idea.considerations),
    section("Input", idea.input_source),
    section("Output", idea.output_result),
    section("Quantifizierter Nutzen", idea.quantified_benefit),
    section("Qualitativer Nutzen", idea.qualitative_benefit),
    section("Kommentar", idea.comment),
    section("Start-Prompt", idea.initial_prompt),
    section("KI-Antwort (Notiz)", idea.ai_plan_notes),
  ]
    .filter(Boolean)
    .join("\n");
}

// Exakte Spaltenreihenfolge des Excel-Katalogs (46 Spalten, A:AT). Leere
// Positionen sind Formel- ("#CONNECT!"-Übersetzung) oder Leerspalten, die
// beim Einfügen nicht überschrieben werden sollen. Brand/Agency sind für
// diesen Katalog (Group Controlling) fix. ID Nr bleibt bei buildExportRow
// (neuer Case) leer, weil die nächste freie GC-Nummer nur im Blick auf die
// aktuelle Live-Liste bestimmt werden kann; buildUpdateRow (bereits
// synchronisierter Case, siehe unten) schreibt sie dagegen mit.
function tsvField(value) {
  const v = (value || "").toString();
  return /[\t\n"]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function baseExportCols(idea) {
  const cols = new Array(46).fill("");
  cols[1] = "Shared Service"; // Brand
  cols[2] = "Group Controlling"; // Agency
  cols[3] = idea.owner_name || ""; // Bucket NEW (Usecase-Geber statt Tags)
  cols[4] = idea.quick_note || ""; // Use Case Name
  cols[6] = idea.problem || ""; // Problem Description
  cols[8] = idea.goal || ""; // Ziel
  cols[10] = idea.business_benefit || ""; // Business Benefit
  cols[12] = idea.ai_role || ""; // KI Rolle
  cols[14] = idea.tools || ""; // KI Lösung
  cols[16] = idea.systeme || ""; // Systeme
  cols[18] = idea.input_source || ""; // Input (Datenquelle)
  cols[20] = idea.output_result || ""; // Output (Datenausgabe)
  cols[22] = idea.considerations || ""; // Risks
  cols[24] = idea.list_priority || ""; // Priority
  cols[25] = idea.comment || ""; // Comment
  cols[31] = idea.kpi_kind || ""; // Kind of KPI
  cols[32] = idea.quantified_benefit || ""; // Description if Quantity
  cols[33] = idea.qualitative_benefit || ""; // Description if Quality
  cols[41] = idea.skill_level || ""; // Skill Level
  return cols;
}

function buildExportRow(idea) {
  // Neuer Case ohne Katalog-ID: ID Nr bleibt leer, die nächste freie
  // GC-Nummer bestimmt sich erst beim Einfügen aus der Live-Liste.
  return baseExportCols(idea).map(tsvField).join("\t");
}

function formatDateOnly(iso) {
  if (!iso) return "";
  // Der Katalog ist immer auf Deutsch (siehe README "Zweisprachige
  // Inhalte") - hier bewusst unabhängig vom Sprachschalter der App.
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function buildUpdateRow(idea) {
  // Update-Zeile für einen bereits synchronisierten Case (hat schon eine
  // Katalog-ID): anders als bei buildExportRow wird ID Nr mitgeschrieben
  // (zur Kontrolle vor dem Überschreiben der bestehenden Zeile), und die
  // vier rechten Änderungsspalten werden zur Laufzeit befüllt - "Was wurde
  // geändert" bleibt bewusst leer (siehe Kommentar in supabase/schema.sql,
  // die Spalte wird in der Liste ohnehin von niemandem gepflegt).
  const cols = baseExportCols(idea);
  cols[0] = idea.catalog_id || ""; // ID Nr
  cols[42] = "geändert"; // Änderungsstatus
  cols[43] = (currentUser && currentUser.email) || ""; // Geändert von
  cols[44] = formatDateOnly(idea.updated_at); // Änderungsdatum
  cols[45] = ""; // Was wurde geändert
  return cols.map(tsvField).join("\t");
}

async function renderExportSync() {
  ideasCache = await loadIdeas();
  const list = ideasCache.filter((i) => !i.catalog_id);
  const updateList = ideasCache
    .filter((i) => i.catalog_id)
    .sort((a, b) => a.catalog_id.localeCompare(b.catalog_id));

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("exportTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">${t("exportIntro")}</p>
        <p style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">${t("exportFieldsNote")}</p>
        ${
          list.length
            ? `<p style="font-size:12.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">${t("exportTsvNote")}</p>
               <div class="row">
                 <button class="btn-primary" id="copy-all-btn" style="width:100%;">${t("copyAllBtn")} (${list.length})</button>
               </div>
               <div class="row">
                 <button class="btn-secondary" id="copy-all-tsv-btn" style="width:100%;">${t("copyTsvAllBtn")} (${list.length})</button>
               </div>`
            : ""
        }
      </div>
      <div class="idea-list" id="export-list">
        ${
          list.length
            ? list
                .map(
                  (idea) => `
                <div class="idea-item" style="cursor:default;">
                  <div class="idea-title">${escapeHtml(idea.quick_note)}</div>
                  <div class="idea-meta">
                    <span class="badge status-${idea.status}">${t(`status_${idea.status}`)}</span>
                    ${idea.team_id ? `<span class="badge">${escapeHtml(teamName(idea.team_id))}</span>` : ""}
                  </div>
                  <div class="row" style="margin-top:10px;">
                    <button class="btn-secondary" data-copy-one="${idea.id}" style="width:100%;">${t("copyOneBtn")}</button>
                  </div>
                  <div class="row" style="margin-top:6px;">
                    <button class="btn-secondary" data-copy-tsv-one="${idea.id}" style="width:100%;">${t("copyTsvOneBtn")}</button>
                  </div>
                </div>
              `
                )
                .join("")
            : `<div class="empty-state">${t("exportEmpty")}</div>`
        }
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("updateExportTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">${t("updateExportIntro")}</p>
        <p style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">${t("updateExportFieldsNote")}</p>
        ${
          updateList.length
            ? `<div class="row">
                 <button class="btn-secondary" id="copy-all-update-tsv-btn" style="width:100%;">${t("copyUpdateTsvAllBtn")} (${updateList.length})</button>
               </div>`
            : ""
        }
      </div>
      <div class="idea-list" id="update-export-list">
        ${
          updateList.length
            ? updateList
                .map(
                  (idea) => `
                <div class="idea-item" style="cursor:default;">
                  <div class="idea-title">${escapeHtml(idea.catalog_id)} · ${escapeHtml(idea.quick_note)}</div>
                  <div class="idea-meta">
                    <span class="badge status-${idea.status}">${t(`status_${idea.status}`)}</span>
                    ${idea.team_id ? `<span class="badge">${escapeHtml(teamName(idea.team_id))}</span>` : ""}
                  </div>
                  <div class="row" style="margin-top:10px;">
                    <button class="btn-secondary" data-copy-update-tsv-one="${idea.id}" style="width:100%;">${t("copyUpdateTsvOneBtn")}</button>
                  </div>
                </div>
              `
                )
                .join("")
            : `<div class="empty-state">${t("updateExportEmpty")}</div>`
        }
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });
  bindLangToggle();
  bindThemeToggle();

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedMsg"));
    } catch {
      toast(t("copyFailedMsg"));
    }
  }

  document.querySelectorAll("[data-copy-one]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idea = list.find((i) => i.id === btn.dataset.copyOne);
      copyText(buildExportBlock(idea));
    });
  });

  document.querySelectorAll("[data-copy-tsv-one]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idea = list.find((i) => i.id === btn.dataset.copyTsvOne);
      copyText(buildExportRow(idea));
    });
  });

  const copyAllBtn = document.getElementById("copy-all-btn");
  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", () => {
      copyText(list.map(buildExportBlock).join("\n\n---\n\n"));
    });
  }

  const copyAllTsvBtn = document.getElementById("copy-all-tsv-btn");
  if (copyAllTsvBtn) {
    copyAllTsvBtn.addEventListener("click", () => {
      copyText(list.map(buildExportRow).join("\n"));
    });
  }

  document.querySelectorAll("[data-copy-update-tsv-one]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idea = updateList.find((i) => i.id === btn.dataset.copyUpdateTsvOne);
      copyText(buildUpdateRow(idea));
    });
  });

  const copyAllUpdateTsvBtn = document.getElementById("copy-all-update-tsv-btn");
  if (copyAllUpdateTsvBtn) {
    copyAllUpdateTsvBtn.addEventListener("click", () => {
      copyText(updateList.map(buildUpdateRow).join("\n"));
    });
  }
}

function accessLevelOptions(selected) {
  const opts = [
    { value: "", label: t("accessNoneOption") },
    { value: "read", label: t("accessReadOption") },
    { value: "write", label: t("accessWriteOption") },
  ];
  return opts
    .map((o) => `<option value="${o.value}" ${o.value === (selected || "") ? "selected" : ""}>${o.label}</option>`)
    .join("");
}

function registrationMailto(email, password) {
  const appUrl = "https://davgoos-serviceplan.github.io/Claude/index.html";
  const guideUrl = "https://davgoos-serviceplan.github.io/Claude/index.html#/guide";
  const body = t("registrationMailBody")
    .replaceAll("{email}", email)
    .replaceAll("{password}", password)
    .replaceAll("{appUrl}", appUrl)
    .replaceAll("{guideUrl}", guideUrl);
  return "mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent(t("registrationMailSubject")) + "&body=" + encodeURIComponent(body);
}

function passwordResetMailto(email, password) {
  const body = t("passwordResetMailBody").replaceAll("{email}", email).replaceAll("{password}", password);
  return "mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent(t("passwordResetMailSubject")) + "&body=" + encodeURIComponent(body);
}

// Zeigt für eine Kostenstelle/Scope-Kombination ("Alle Teams" oder ein
// einzelnes Team) nur die Personen an, die dort tatsächlich einen Grant
// haben, statt - wie zuvor - jede freigegebene Person aufzulisten (das
// wurde bei vielen Usern x Kostenstellen x Teams schnell unübersichtlich).
// Neue Personen kommen über das "+ Hinzufügen"-Dropdown dazu, das nur noch
// die für diesen Scope relevanten (noch nicht zugewiesenen) Personen zeigt.
// Bei Team-Scopes werden Personen mit Vollzugriff ("Alle Teams") gar nicht
// erst gelistet - ihr Zugriff kommt automatisch von dort (siehe
// setKostenstelleAccess), eine eigene Zeile hier wäre nur verwirrend.
function renderAccessScope(k, scope, nonAdminApproved, blanketUserIds) {
  const isBlanket = scope.id === "";
  const grants = accessCache.filter(
    (a) => a.kostenstelle_code === k.code && (isBlanket ? a.team_id === null : a.team_id === scope.id)
  );
  const rows = isBlanket ? grants : grants.filter((g) => !blanketUserIds.has(g.user_id));
  const alreadyIds = new Set(rows.map((g) => g.user_id));
  const addable = nonAdminApproved.filter((u) => !alreadyIds.has(u.id) && !(!isBlanket && blanketUserIds.has(u.id)));
  const coveredCount = isBlanket ? 0 : nonAdminApproved.filter((u) => blanketUserIds.has(u.id)).length;

  return `
    <div style="margin-bottom:14px;">
      <div style="font-size:12px; color:var(--text-dim); margin-bottom:6px;">${escapeHtml(scope.label)}</div>
      ${
        rows.length
          ? rows
              .map((g) => {
                const u = nonAdminApproved.find((x) => x.id === g.user_id);
                if (!u) return "";
                return `
              <div class="row" data-access-row-email="${escapeHtml(u.email.toLowerCase())}" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:13.5px;">${escapeHtml(u.email)}</span>
                <select class="field" data-access-user="${u.id}" data-access-ks="${escapeHtml(k.code)}" data-access-team="${escapeHtml(scope.id)}" style="max-width:220px; flex:none;">
                  ${accessLevelOptions(g.access_level)}
                </select>
              </div>
            `;
              })
              .join("")
          : `<div class="empty-state" style="padding:8px 4px; font-size:12.5px;">${t("noGrantsForScopeMsg")}</div>`
      }
      ${
        coveredCount
          ? `<div style="font-size:11.5px; color:var(--text-dim); margin:2px 0 8px;">${t("coveredByAllTeamsMsg").replace("{n}", coveredCount)}</div>`
          : ""
      }
      ${
        addable.length
          ? `
        <div class="row" data-add-ks="${escapeHtml(k.code)}" data-add-team="${escapeHtml(scope.id)}" style="display:flex; gap:6px; margin-top:4px;">
          <select class="field" data-add-user-select style="flex:1;">
            <option value="">${t("addUserSelectPlaceholder")}</option>
            ${addable.map((u) => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}
          </select>
          <select class="field" data-add-level-select style="max-width:150px; flex:none;">
            <option value="read">${t("accessReadOption")}</option>
            <option value="write">${t("accessWriteOption")}</option>
          </select>
          <button class="btn-secondary" data-add-access-btn style="flex:none;">${t("addUserToScopeBtn")}</button>
        </div>
      `
          : ""
      }
    </div>
  `;
}

async function renderAdmin() {
  profilesCache = await loadAllProfiles();
  const pending = profilesCache.filter((p) => !p.is_approved && !p.is_rejected);
  const approved = profilesCache.filter((p) => p.is_approved);
  const nonAdminApproved = approved.filter((p) => !p.is_admin);
  if (kostenstellenCache.length === 0) kostenstellenCache = await loadKostenstellen();
  teamsCache = await loadTeams();
  accessCache = await loadAllAccess();
  await cleanupRedundantTeamGrants();
  if (!kostenstellenCollapseInitialized) {
    kostenstellenCache.forEach((k) => collapsedKostenstellen.add(k.code));
    kostenstellenCollapseInitialized = true;
  }

  // Nutzerstatistik: pro Person Login-Anzahl + letzter Login aus den
  // rohen login_events zusammenfassen, statt das serverseitig zu
  // aggregieren - bei dieser Datenmenge (kleines Team) unproblematisch.
  const loginEvents = await loadLoginEvents();
  const loginStatsByUser = {};
  loginEvents.forEach((e) => {
    const stats = (loginStatsByUser[e.user_id] ??= { count: 0, last: null });
    stats.count++;
    if (!stats.last || new Date(e.created_at) > new Date(stats.last)) stats.last = e.created_at;
  });
  const userStatsRows = approved
    .slice()
    .sort((a, b) => new Date((loginStatsByUser[b.id] || {}).last || 0) - new Date((loginStatsByUser[a.id] || {}).last || 0));

  // App-Feedback: Durchschnitt je Kategorie (nur Kategorien mit Angabe
  // fließen ein, aktuell aber ohnehin Pflichtfelder) plus Liste der
  // nicht-leeren Freitext-Kommentare, neueste zuerst.
  const feedbackRows = await loadAppFeedback();
  const profileEmailById = {};
  profilesCache.forEach((p) => (profileEmailById[p.id] = p.email));
  const feedbackAvgOf = (key) =>
    feedbackRows.length ? feedbackRows.reduce((sum, r) => sum + r[key], 0) / feedbackRows.length : 0;
  const feedbackComments = feedbackRows.filter((r) => r.comment && r.comment.trim());

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="section-title" style="margin:0 4px 8px;">${t("createUserTitle")}</div>
      <div class="card" style="margin-bottom:20px;">
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">${t("createUserDesc")}</p>
        <label class="field-label" style="margin-top:0;">${t("emailLabel")}</label>
        <input class="field" id="new-user-email" type="email" placeholder="${t("emailPlaceholder")}" autocomplete="off" />

        <label class="field-label">${t("newUserPasswordLabel")}</label>
        <div class="row">
          <input class="field" id="new-user-password" type="text" placeholder="${t("newUserPasswordPlaceholder")}" autocomplete="off" style="flex:1;" />
          <button class="btn-secondary" id="gen-password-btn" style="flex:none;">${t("generatePasswordBtn")}</button>
        </div>

        <div class="row" style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn-primary" id="create-user-btn" style="flex:1;">${t("createUserBtn")}</button>
          <button class="btn-secondary" id="prepare-mail-btn" style="flex:none;">${t("prepareRegistrationMailBtn")}</button>
        </div>
      </div>

      <div class="section-title" style="margin:0 4px 8px;">${t("pendingApprovalTitlePrefix")}${pending.length})</div>
      <div class="idea-list" style="margin-bottom:20px;">
        ${
          pending.length
            ? pending
                .map(
                  (p) => `
              <div class="idea-item">
                <div class="idea-title">${escapeHtml(p.email)}</div>
                <div class="idea-meta">
                  <button class="btn-secondary" data-impersonate="${escapeHtml(p.email)}" style="padding:8px 14px; font-size:13px;">${t("impersonateBtn")}</button>
                  <button class="btn-primary" data-approve="${p.id}" style="padding:8px 14px; font-size:13px;">${t("approveBtn")}</button>
                  <button class="btn-danger" data-reject="${p.id}" style="padding:8px 14px; font-size:13px;">${t("rejectBtn")}</button>
                </div>
              </div>
            `
                )
                .join("")
            : `<div class="empty-state">${t("noPendingMsg")}</div>`
        }
      </div>

      <div class="section-title" style="margin:0 4px 8px;">${t("approvedMembersTitlePrefix")}${approved.length})</div>
      <div class="idea-list">
        ${approved
          .map(
            (p) => `
            <div class="idea-item">
              <div class="idea-title">${escapeHtml(p.email)}</div>
              <div class="idea-meta">
                ${p.is_admin ? `<span class="badge">${t("adminBadge")}</span>` : ""}
                <button class="btn-secondary" data-impersonate="${escapeHtml(p.email)}" style="padding:8px 14px; font-size:13px;">${t("impersonateBtn")}</button>
                <button class="btn-secondary" data-reset-password="${p.id}" data-reset-email="${escapeHtml(p.email)}" style="padding:8px 14px; font-size:13px;">${t("resetPasswordBtn")}</button>
              </div>
            </div>
          `
          )
          .join("")}
      </div>

      <div class="section-title" style="margin:24px 4px 8px;">${t("userStatsTitle")}</div>
      <div class="idea-list" style="margin-bottom:20px;">
        ${
          userStatsRows.length
            ? userStatsRows
                .map((p) => {
                  const stats = loginStatsByUser[p.id];
                  return `
              <div class="idea-item">
                <div class="idea-title">${escapeHtml(p.email)}</div>
                <div class="idea-meta">
                  ${
                    stats
                      ? `<span class="badge">${t("userStatsLastLoginPrefix")}${formatDateTime(stats.last)}</span>
                         <span class="badge">${t("userStatsLoginCountPrefix")}${stats.count}</span>`
                      : `<span class="badge">${t("userStatsNeverLoggedIn")}</span>`
                  }
                </div>
              </div>
            `;
                })
                .join("")
            : `<div class="empty-state">${t("noApprovedForAccessMsg")}</div>`
        }
      </div>

      <div class="section-title" style="margin:24px 4px 8px;">${t("feedbackAdminTitle")}</div>
      <div class="card" style="margin-bottom:20px;">
        ${
          feedbackRows.length
            ? `
              ${feedbackAvgRow(t("feedbackRatingUsability"), feedbackAvgOf("rating_usability"))}
              ${feedbackAvgRow(t("feedbackRatingDesign"), feedbackAvgOf("rating_design"))}
              ${feedbackAvgRow(t("feedbackRatingFeatures"), feedbackAvgOf("rating_features"))}
              ${feedbackAvgRow(t("feedbackRatingPerformance"), feedbackAvgOf("rating_performance"))}
              <p style="font-size:12.5px; color:var(--text-dim); margin:10px 0 0;">${t("feedbackResponseCountMsg").replace("{n}", feedbackRows.length)}</p>
            `
            : `<div class="empty-state">${t("emptyFeedback")}</div>`
        }
      </div>

      ${
        feedbackComments.length
          ? `
            <div class="section-title" style="margin:0 4px 8px;">${t("feedbackCommentsTitle")}</div>
            <div class="idea-list" style="margin-bottom:20px;">
              ${feedbackComments
                .map(
                  (r) => `
                <div class="idea-item">
                  <div class="idea-title">${escapeHtml(r.comment)}</div>
                  <div class="idea-meta">
                    <span class="badge">👤 ${escapeHtml(profileEmailById[r.user_id] || "?")}</span>
                    <span class="badge">🕒 ${formatDateTime(r.created_at)}</span>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
          : ""
      }

      <div class="section-title" style="margin:24px 4px 8px;">${t("kostenstellenTitle")}</div>
      <div class="card">
        <label class="field-label" style="margin-top:0;">${t("newKostenstelleLabel")}</label>
        <div class="row">
          <input class="field" id="new-ks-code" placeholder="${t("kostenstelleCodePlaceholder")}" style="flex:1;" />
          <input class="field" id="new-ks-name" placeholder="${t("kostenstelleNamePlaceholder")}" style="flex:1;" />
        </div>
        <div class="row">
          <button class="btn-primary" id="add-ks-btn" style="width:100%;">${t("addKostenstelleBtn")}</button>
        </div>
      </div>

      ${
        nonAdminApproved.length && kostenstellenCache.length
          ? `<div class="row" style="margin:16px 4px 4px;"><input class="field" id="access-user-filter" placeholder="${t("accessFilterPlaceholder")}" autocomplete="off" /></div>`
          : ""
      }

      ${
        kostenstellenCache.length
          ? kostenstellenCache
              .map((k) => {
                const blanketUserIds = new Set(
                  accessCache.filter((a) => a.kostenstelle_code === k.code && a.team_id === null).map((a) => a.user_id)
                );
                const isCollapsed = collapsedKostenstellen.has(k.code);
                return `
            <div class="card" data-ks-card="${escapeHtml(k.code)}">
              <button type="button" class="ks-toggle-header" data-toggle-ks="${escapeHtml(k.code)}" aria-expanded="${!isCollapsed}">
                <span class="tree-toggle" aria-hidden="true">${isCollapsed ? "▸" : "▾"}</span>
                <span class="section-title" style="margin:0;">${escapeHtml(k.code)}${k.name ? ` – ${escapeHtml(k.name)}` : ""}</span>
              </button>
              <div data-ks-body style="display:${isCollapsed ? "none" : "block"}; margin-top:10px;">
                ${
                  nonAdminApproved.length
                    ? [{ id: "", label: t("allTeamsScope") }, ...teamsCache.filter((tm) => tm.kostenstelle_code === k.code).map((tm) => ({ id: tm.id, label: tm.name }))]
                        .map((scope) => renderAccessScope(k, scope, nonAdminApproved, blanketUserIds))
                        .join("")
                    : `<div class="empty-state" style="padding:12px 4px;">${t("noApprovedForAccessMsg")}</div>`
                }
              </div>
            </div>
          `;
              })
              .join("")
          : `<div class="empty-state">${t("emptyKostenstellen")}</div>`
      }
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  bindLangToggle();
  bindThemeToggle();

  document.getElementById("gen-password-btn").addEventListener("click", () => {
    document.getElementById("new-user-password").value = generatePassword();
  });

  document.getElementById("create-user-btn").addEventListener("click", async () => {
    const emailInput = document.getElementById("new-user-email");
    const passwordInput = document.getElementById("new-user-password");
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    if (!email || password.length < 6) {
      toast(t("createUserValidationMsg"));
      return;
    }
    const btn = document.getElementById("create-user-btn");
    btn.disabled = true;
    const result = await createUserViaAdmin(email, password);
    btn.disabled = false;
    if (result.ok) {
      toast(t("userCreatedMsgPrefix") + email);
      await renderAdmin();
      // Felder nach dem Neu-Rendern wieder befüllen, statt sie leer zu
      // lassen - so bleiben E-Mail und Start-Passwort für den
      // "Info-Mail vorbereiten"-Button (und zum Kopieren) verfügbar.
      const emailInputAfter = document.getElementById("new-user-email");
      const passwordInputAfter = document.getElementById("new-user-password");
      if (emailInputAfter && passwordInputAfter) {
        emailInputAfter.value = email;
        passwordInputAfter.value = password;
      }
    } else {
      toast(t("createUserErrorPrefix") + result.message);
    }
  });

  document.getElementById("prepare-mail-btn").addEventListener("click", () => {
    const email = document.getElementById("new-user-email").value.trim().toLowerCase();
    const password = document.getElementById("new-user-password").value;
    if (!email || !password) {
      toast(t("registrationMailValidationMsg"));
      return;
    }
    window.location.href = registrationMailto(email, password);
  });

  document.querySelectorAll("[data-impersonate]").forEach((btn) => {
    btn.addEventListener("click", () => impersonateUser(btn.dataset.impersonate));
  });

  document.querySelectorAll("[data-reset-password]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = btn.dataset.resetPassword;
      const email = btn.dataset.resetEmail;
      if (!window.confirm(t("resetPasswordConfirmPrefix") + email + t("resetPasswordConfirmSuffix"))) return;
      const password = generatePassword();
      btn.disabled = true;
      const result = await resetUserPasswordViaAdmin(userId, password);
      btn.disabled = false;
      if (result.ok) {
        toast(t("passwordResetMsgPrefix") + email);
        window.location.href = passwordResetMailto(email, password);
      } else {
        toast(t("resetPasswordErrorPrefix") + result.message);
      }
    });
  });

  document.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const ok = await approveUser(btn.dataset.approve);
      if (ok) {
        toast(t("approvedMsg"));
        await renderAdmin();
      } else {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-reject]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!window.confirm(t("rejectConfirmMsg"))) return;
      btn.disabled = true;
      const ok = await rejectUser(btn.dataset.reject);
      if (ok) {
        toast(t("rejectedMsg"));
        await renderAdmin();
      } else {
        btn.disabled = false;
      }
    });
  });

  document.getElementById("add-ks-btn").addEventListener("click", async () => {
    const codeInput = document.getElementById("new-ks-code");
    const nameInput = document.getElementById("new-ks-name");
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    if (!code) return;
    const btn = document.getElementById("add-ks-btn");
    btn.disabled = true;
    const created = await createKostenstelle(code, name);
    btn.disabled = false;
    if (created) {
      toast(t("kostenstelleSavedMsg"));
      kostenstellenCache = [];
      await renderAdmin();
    }
  });

  // Jede Zugriffsänderung kann Zeilen zwischen "hat Zugriff" und "im
  // Hinzufügen-Dropdown" verschieben (siehe renderAccessScope) - deshalb
  // hier ein vollständiges Re-Render statt nur den Cache neu zu laden. Der
  // Filterwert wird dabei mitgenommen, damit er nicht bei jeder Änderung
  // verloren geht.
  async function refreshAdminAccess() {
    const filterVal = document.getElementById("access-user-filter")?.value || "";
    await renderAdmin();
    const filterInputAfter = document.getElementById("access-user-filter");
    if (filterInputAfter && filterVal) {
      filterInputAfter.value = filterVal;
      filterInputAfter.dispatchEvent(new Event("input"));
    }
  }

  document.querySelectorAll("[data-access-user]").forEach((sel) => {
    sel.addEventListener("change", async () => {
      const userId = sel.dataset.accessUser;
      const code = sel.dataset.accessKs;
      const teamId = sel.dataset.accessTeam || null;
      const level = sel.value || null;
      sel.disabled = true;
      const ok = await setKostenstelleAccess(userId, code, teamId, level);
      if (ok) {
        toast(t("accessSavedMsg"));
        await refreshAdminAccess();
      } else {
        sel.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-add-access-btn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const wrap = btn.closest("[data-add-ks]");
      const code = wrap.dataset.addKs;
      const teamId = wrap.dataset.addTeam || null;
      const userSelect = wrap.querySelector("[data-add-user-select]");
      const levelSelect = wrap.querySelector("[data-add-level-select]");
      const userId = userSelect.value;
      if (!userId) return;
      btn.disabled = true;
      const ok = await setKostenstelleAccess(userId, code, teamId, levelSelect.value);
      if (ok) {
        toast(t("accessSavedMsg"));
        await refreshAdminAccess();
      } else {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-toggle-ks]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.toggleKs;
      const card = btn.closest("[data-ks-card]");
      const body = card?.querySelector("[data-ks-body]");
      const nowCollapsed = !collapsedKostenstellen.has(code);
      if (nowCollapsed) collapsedKostenstellen.add(code);
      else collapsedKostenstellen.delete(code);
      if (body) body.style.display = nowCollapsed ? "none" : "block";
      btn.setAttribute("aria-expanded", String(!nowCollapsed));
      const icon = btn.querySelector(".tree-toggle");
      if (icon) icon.textContent = nowCollapsed ? "▸" : "▾";
    });
  });

  // Beim Filtern nach E-Mail sollen eingeklappte Kostenstellen mit
  // Treffern automatisch aufklappen, sonst sieht man die gefilterten
  // Zeilen ja gar nicht - und Kostenstellen ganz ohne Treffer werden
  // komplett ausgeblendet statt nur die einzelnen Zeilen.
  const accessFilterInput = document.getElementById("access-user-filter");
  if (accessFilterInput) {
    accessFilterInput.addEventListener("input", () => {
      const q = accessFilterInput.value.trim().toLowerCase();
      document.querySelectorAll("[data-ks-card]").forEach((card) => {
        const code = card.dataset.ksCard;
        const rows = card.querySelectorAll("[data-access-row-email]");
        let anyMatch = false;
        rows.forEach((row) => {
          const match = row.dataset.accessRowEmail.includes(q);
          row.style.display = match ? "flex" : "none";
          if (match) anyMatch = true;
        });
        const body = card.querySelector("[data-ks-body]");
        const toggleBtn = card.querySelector("[data-toggle-ks]");
        const icon = toggleBtn?.querySelector(".tree-toggle");
        if (q) {
          card.style.display = anyMatch ? "" : "none";
          if (body) body.style.display = "block";
          toggleBtn?.setAttribute("aria-expanded", "true");
          if (icon) icon.textContent = "▾";
        } else {
          card.style.display = "";
          const isCollapsed = collapsedKostenstellen.has(code);
          if (body) body.style.display = isCollapsed ? "none" : "block";
          toggleBtn?.setAttribute("aria-expanded", String(!isCollapsed));
          if (icon) icon.textContent = isCollapsed ? "▸" : "▾";
        }
      });
    });
  }
}

// ---------- View: Teams verwalten ----------
// Anders als die Kostenstellen selbst (nur der Admin legt sie an) dürfen
// Teams auch von Personen mit Vollzugriff (Schreiben, alle Teams) auf die
// jeweilige Kostenstelle verwaltet werden, siehe can_manage_teams() in
// supabase/schema.sql. Diese Ansicht ist deshalb bewusst nicht
// admin-gated - jede freigegebene Person sieht die Teams ihrer
// Kostenstellen, Bearbeiten-Kontrollen erscheinen nur, wo canManageTeams()
// zutrifft (die RLS-Policy ist die eigentliche Absicherung dahinter).
async function renderTeamsManagement() {
  if (kostenstellenCache.length === 0) kostenstellenCache = await loadKostenstellen();
  teamsCache = await loadTeams();
  const codes = readableCodes();
  const visible = currentProfile.is_admin ? kostenstellenCache : kostenstellenCache.filter((k) => codes.includes(k.code));

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="section-title" style="margin:0 4px 8px;">${t("teamsManagementTitle")}</div>
      ${
        visible.length
          ? visible
              .map((k) => {
                const canManage = canManageTeams(k.code);
                const kTeams = teamsCache.filter((tm) => tm.kostenstelle_code === k.code);
                return `
            <div class="card">
              <div class="section-title" style="margin:0 0 10px;">${escapeHtml(k.code)}${k.name ? ` – ${escapeHtml(k.name)}` : ""}</div>
              ${
                kTeams.length
                  ? kTeams
                      .map(
                        (tm) => `
                    <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <span style="font-size:13.5px;">${escapeHtml(tm.name)}</span>
                      ${
                        canManage
                          ? `
                        <div class="row" style="gap:6px; flex:0 0 auto;">
                          <button class="btn-secondary" data-rename-team="${tm.id}" style="padding:6px 10px; font-size:12.5px;">${t("renameTeamBtn")}</button>
                          <button class="btn-danger" data-delete-team="${tm.id}" style="padding:6px 10px; font-size:12.5px;">${t("deleteTeamBtn")}</button>
                        </div>
                      `
                          : ""
                      }
                    </div>
                  `
                      )
                      .join("")
                  : `<div class="empty-state" style="padding:12px 4px;">${t("emptyTeamsForKostenstelle")}</div>`
              }
              ${
                canManage
                  ? `
                <div class="row" style="margin-top:10px;">
                  <input class="field" data-new-team-input="${escapeHtml(k.code)}" placeholder="${t("newTeamNamePlaceholder")}" style="flex:1;" />
                  <button class="btn-primary" data-add-team="${escapeHtml(k.code)}" style="flex:0 0 auto;">${t("addTeamBtn")}</button>
                </div>
              `
                  : ""
              }
            </div>
          `;
              })
              .join("")
          : `<div class="empty-state">${t("noKostenstellenAccessMsg")}</div>`
      }
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });
  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll("[data-add-team]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = btn.dataset.addTeam;
      const input = document.querySelector(`[data-new-team-input="${code}"]`);
      const name = input.value.trim();
      if (!name) return;
      btn.disabled = true;
      const created = await createTeam(code, name);
      btn.disabled = false;
      if (created) {
        toast(t("teamSavedMsg"));
        await renderTeamsManagement();
      }
    });
  });

  document.querySelectorAll("[data-rename-team]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.renameTeam;
      const current = teamsCache.find((tm) => tm.id === id);
      const name = prompt(t("renameTeamPrompt"), current ? current.name : "");
      if (!name || !name.trim()) return;
      btn.disabled = true;
      const updated = await renameTeam(id, name.trim());
      btn.disabled = false;
      if (updated) {
        toast(t("teamSavedMsg"));
        await renderTeamsManagement();
      }
    });
  });

  document.querySelectorAll("[data-delete-team]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!window.confirm(t("deleteTeamConfirm"))) return;
      const id = btn.dataset.deleteTeam;
      btn.disabled = true;
      const ok = await deleteTeam(id);
      btn.disabled = false;
      if (ok) {
        toast(t("teamDeletedMsg"));
        await renderTeamsManagement();
      }
    });
  });
}

// ---------- View: Dashboard (Auswertungen) ----------

let dashDept = "all";
let dashTeam = "all";
let dashSelectedCell = null;
let dashExpandedTreeIds = new Set();
let dashRankingShowAll = false;

function groupByKey(arr, key) {
  const map = {};
  arr.forEach((item) => {
    const k = item[key] || "—";
    (map[k] = map[k] || []).push(item);
  });
  return map;
}

function dashboardDepartments() {
  const set = new Set();
  ideasCache.forEach((i) => i.department && set.add(i.department));
  processesCache.forEach((p) => p.department && set.add(p.department));
  return Array.from(set).sort();
}

function dashboardTeamsForDept(dept) {
  const ids = new Set();
  ideasCache.forEach((i) => {
    if (dept === "all" || i.department === dept) i.team_id && ids.add(i.team_id);
  });
  processesCache.forEach((p) => {
    if (dept === "all" || p.department === dept) p.team_id && ids.add(p.team_id);
  });
  return Array.from(ids)
    .map((id) => teamsCache.find((tm) => tm.id === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function dashboardFilteredIdeas() {
  return ideasCache.filter(
    (i) => (dashDept === "all" || i.department === dashDept) && (dashTeam === "all" || i.team_id === dashTeam)
  );
}

function dashboardFilteredProcesses() {
  return processesCache.filter(
    (p) => (dashDept === "all" || p.department === dashDept) && (dashTeam === "all" || p.team_id === dashTeam)
  );
}

function dashCard(title, bodyHtml) {
  return `<div class="card"><div class="section-title" style="margin:0 0 10px;">${title}</div>${bodyHtml}</div>`;
}

function dashLegendHtml(items) {
  return `<div class="dash-legend">${items
    .map((it) => `<span class="dash-legend-item"><span class="dash-legend-dot" style="background:${it.color}"></span>${it.label}</span>`)
    .join("")}</div>`;
}

function priorityZoneLegendHtml() {
  const zones = [
    { impact: 5, effort: 1 },
    { impact: 5, effort: 5 },
    { impact: 1, effort: 1 },
    { impact: 1, effort: 5 },
    { impact: 3, effort: 3 },
  ];
  return dashLegendHtml(zones.map((z) => priorityInfo(z)));
}

function statusLegendHtml(statuses = STATUS_ORDER) {
  return dashLegendHtml(statuses.map((s) => ({ color: `var(--status-${s})`, label: t(`status_${s}`) })));
}

function majorityStatus(ideasInCell) {
  const counts = {};
  ideasInCell.forEach((i) => {
    counts[i.status] = (counts[i.status] || 0) + 1;
  });
  let best = STATUS_ORDER[0];
  let bestCount = -1;
  STATUS_ORDER.forEach((s) => {
    if ((counts[s] || 0) > bestCount) {
      bestCount = counts[s] || 0;
      best = s;
    }
  });
  return best;
}

function dashboardFiltersHtml() {
  const depts = dashboardDepartments();
  const teams = dashboardTeamsForDept(dashDept);
  return `
    <div class="row dash-filters">
      <select class="field" id="dash-dept" style="flex:1;">
        <option value="all" ${dashDept === "all" ? "selected" : ""}>${t("dashFilterAllDept")}</option>
        ${depts.map((d) => `<option value="${escapeHtml(d)}" ${d === dashDept ? "selected" : ""}>${escapeHtml(d)}</option>`).join("")}
      </select>
      <select class="field" id="dash-team" style="flex:1;">
        <option value="all" ${dashTeam === "all" ? "selected" : ""}>${t("dashFilterAllTeam")}</option>
        ${teams.map((tm) => `<option value="${tm.id}" ${tm.id === dashTeam ? "selected" : ""}>${escapeHtml(tm.name)}</option>`).join("")}
      </select>
    </div>
  `;
}

function bindDashboardFilters() {
  document.getElementById("dash-dept").addEventListener("change", (e) => {
    dashDept = e.target.value;
    dashTeam = "all";
    renderDashboardBody();
  });
  document.getElementById("dash-team").addEventListener("change", (e) => {
    dashTeam = e.target.value;
    renderDashboardBody();
  });
}

function dashboardMatrixSection(ideas) {
  const active = ideas.filter((i) => i.status !== "discarded");
  const discardedCount = ideas.length - active.length;
  if (active.length === 0) {
    return dashCard(t("dashMatrixTitle"), `<div class="empty-state">${t("dashMatrixEmpty")}</div>`);
  }

  const CELL = 50;
  const PAD_L = 22;
  const PAD_T = 8;
  const PAD_B = 8;
  const PAD_R = 8;
  const plot = CELL * 5;
  const W = PAD_L + plot + PAD_R;
  const H = PAD_T + plot + PAD_B;

  const cellsHtml = [];
  const bubblesHtml = [];
  for (let impact = 1; impact <= 5; impact++) {
    for (let effort = 1; effort <= 5; effort++) {
      const x = PAD_L + (effort - 1) * CELL;
      const y = PAD_T + (5 - impact) * CELL;
      const zoneColor = priorityInfo({ impact, effort }).color;
      cellsHtml.push(
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="${zoneColor}" fill-opacity="0.14" stroke="var(--border)" stroke-width="0.5" />`
      );
      const cellIdeas = active.filter((i) => (i.impact || 3) === impact && (i.effort || 3) === effort);
      if (cellIdeas.length > 0) {
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        const r = Math.min(21, 9 + Math.sqrt(cellIdeas.length) * 5);
        const majority = majorityStatus(cellIdeas);
        const isSelected = dashSelectedCell === `${effort}-${impact}`;
        bubblesHtml.push(`
          <g class="dash-matrix-bubble" data-effort="${effort}" data-impact="${impact}">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--status-${majority})" stroke="${isSelected ? "var(--text)" : "var(--surface)"}" stroke-width="${isSelected ? 3 : 2}" />
            <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="#fff">${cellIdeas.length}</text>
          </g>
        `);
      }
    }
  }

  const axisImpact = [1, 2, 3, 4, 5]
    .map((v) => `<text x="${PAD_L - 6}" y="${PAD_T + (5 - v) * CELL + CELL / 2 + 4}" text-anchor="end" font-size="10" fill="var(--text-dim)">${v}</text>`)
    .join("");
  const axisEffort = [1, 2, 3, 4, 5]
    .map((v) => `<text x="${PAD_L + (v - 1) * CELL + CELL / 2}" y="${H - 2}" text-anchor="middle" font-size="10" fill="var(--text-dim)">${v}</text>`)
    .join("");

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" class="dash-matrix-svg">
      ${cellsHtml.join("")}
      ${bubblesHtml.join("")}
      ${axisImpact}
      ${axisEffort}
    </svg>
    <div class="dash-axis-caption">${t("dashAxisCaption")}</div>
  `;

  let detail = "";
  if (dashSelectedCell) {
    const [selEffort, selImpact] = dashSelectedCell.split("-").map(Number);
    const selected = active.filter((i) => (i.effort || 3) === selEffort && (i.impact || 3) === selImpact);
    detail = `
      <div class="dash-matrix-detail">
        <div class="dash-matrix-detail-head">
          <span>${selected.length} ${t("dashMatrixCellLabel")}</span>
          <button class="btn-ghost" id="dash-matrix-close">✕</button>
        </div>
        ${selected
          .map(
            (i) =>
              `<a class="link-item" href="#/idea/${i.id}">${i.catalog_id ? `<span class="badge">🏷 ${escapeHtml(i.catalog_id)}</span> ` : ""}${escapeHtml(trValue(i, "quick_note"))}</a>`
          )
          .join("")}
      </div>
    `;
  }

  return dashCard(
    t("dashMatrixTitle"),
    priorityZoneLegendHtml() +
      svg +
      statusLegendHtml(STATUS_ORDER.filter((s) => s !== "discarded")) +
      (discardedCount > 0 ? `<div class="dash-hint">${t("dashMatrixDiscardedHint").replace("{n}", discardedCount)}</div>` : "") +
      detail
  );
}

function bindDashboardMatrix() {
  document.querySelectorAll(".dash-matrix-bubble").forEach((el) => {
    el.addEventListener("click", () => {
      const key = `${el.dataset.effort}-${el.dataset.impact}`;
      dashSelectedCell = dashSelectedCell === key ? null : key;
      renderDashboardBody();
    });
  });
  const closeBtn = document.getElementById("dash-matrix-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      dashSelectedCell = null;
      renderDashboardBody();
    });
  }
}

function dashIdeaLeafHtml(idea) {
  return `
    <div class="tree-node">
      <div class="tree-row">
        <span class="tree-toggle-spacer"></span>
        <div class="tree-row-content">
          <a class="link-item dash-tree-leaf" href="#/idea/${idea.id}">
            <span class="dash-legend-dot" style="background:var(--status-${idea.status})"></span>
            ${idea.catalog_id ? `<span class="badge">🏷 ${escapeHtml(idea.catalog_id)}</span> ` : ""}${escapeHtml(trValue(idea, "quick_note"))}
          </a>
        </div>
      </div>
    </div>
  `;
}

function dashProcessNodeHtml(proc, teamProcesses, ideas) {
  const children = teamProcesses.filter((p) => p.parent_process_id === proc.id);
  const linkedIdeas = ideas.filter((i) => ideaLinksProcess(i, proc.id));
  const hasChildren = children.length > 0 || linkedIdeas.length > 0;
  const key = `p-${proc.id}`;
  const isExpanded = dashExpandedTreeIds.has(key);
  const ai = aiPotentialInfo(proc.ai_potential);
  const statusInfo = processStatusInfo(proc.status);
  return `
    <div class="tree-node">
      <div class="tree-row">
        ${
          hasChildren
            ? `<button class="tree-toggle" data-dash-toggle="${key}">${isExpanded ? "▾" : "▸"}</button>`
            : `<span class="tree-toggle-spacer"></span>`
        }
        <div class="tree-row-content">
          <a class="link-item dash-tree-process" href="#/process/${proc.id}">
            <span class="priority-dot" style="background:${ai.color}"></span>
            <span class="process-status-icon" title="${escapeHtml(statusInfo.label)}" aria-label="${escapeHtml(statusInfo.label)}">${statusInfo.icon}</span>
            ${escapeHtml(trValue(proc, "name"))}
            <span class="badge">${linkedIdeas.length} 💡</span>
          </a>
        </div>
      </div>
      ${
        hasChildren && isExpanded
          ? `<div class="tree-children">
              ${children.map((c) => dashProcessNodeHtml(c, teamProcesses, ideas)).join("")}
              ${linkedIdeas.map((i) => dashIdeaLeafHtml(i)).join("")}
            </div>`
          : ""
      }
    </div>
  `;
}

function dashboardTreeSection(ideas, processes) {
  if (processes.length === 0) {
    return dashCard(t("dashTreeTitle"), `<div class="empty-state">${t("dashTreeEmpty")}</div>`);
  }
  const byDept = groupByKey(processes, "department");
  const body = Object.keys(byDept)
    .sort()
    .map((dept) => {
      const deptProcesses = byDept[dept];
      const byTeam = groupByKey(deptProcesses, "team_id");
      const teamsHtml = Object.keys(byTeam)
        .map((team) => ({ key: team, label: team === "—" ? "—" : teamName(team) }))
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ key: team, label }) => {
          const teamProcesses = byTeam[team];
          const idsInTeam = new Set(teamProcesses.map((p) => p.id));
          const roots = teamProcesses.filter((p) => !p.parent_process_id || !idsInTeam.has(p.parent_process_id));
          return `
            <div class="dash-tree-team">
              <div class="dash-tree-team-title">${escapeHtml(label)}</div>
              ${roots.map((p) => dashProcessNodeHtml(p, teamProcesses, ideas)).join("")}
            </div>
          `;
        })
        .join("");
      return `
        <div class="dash-tree-dept">
          <div class="dash-tree-dept-title">${escapeHtml(dept)}</div>
          ${teamsHtml}
        </div>
      `;
    })
    .join("");
  return dashCard(t("dashTreeTitle"), body);
}

function bindDashboardTree() {
  document.querySelectorAll("[data-dash-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const key = btn.dataset.dashToggle;
      if (dashExpandedTreeIds.has(key)) dashExpandedTreeIds.delete(key);
      else dashExpandedTreeIds.add(key);
      renderDashboardBody();
    });
  });
}

function dashboardStatusSection(ideas) {
  if (ideas.length === 0) {
    return dashCard(t("dashStatusTitle"), `<div class="empty-state">${t("dashStatusEmpty")}</div>`);
  }
  const byTeam = groupByKey(ideas, "team_id");
  const rows = Object.keys(byTeam)
    .map((team) => ({ key: team, label: team === "—" ? "—" : teamName(team) }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(({ key: team, label }) => {
      const teamIdeas = byTeam[team];
      const total = teamIdeas.length;
      const segments = STATUS_ORDER.map((s) => {
        const count = teamIdeas.filter((i) => i.status === s).length;
        if (count === 0) return "";
        const pct = (count / total) * 100;
        return `<div class="dash-bar-seg" style="width:${pct}%; background:var(--status-${s});" title="${escapeHtml(t(`status_${s}`))}: ${count}"></div>`;
      }).join("");
      return `
        <div class="dash-bar-row">
          <div class="dash-bar-label">${escapeHtml(label)} <span class="dash-bar-total">(${total})</span></div>
          <div class="dash-bar-track">${segments}</div>
        </div>
      `;
    })
    .join("");
  return dashCard(t("dashStatusTitle"), statusLegendHtml() + rows);
}

function dashboardHeatmapSection(processes) {
  if (processes.length === 0) {
    return dashCard(t("dashHeatmapTitle"), `<div class="empty-state">${t("dashHeatmapEmpty")}</div>`);
  }
  const sorted = [...processes].sort((a, b) => (b.ai_potential || 3) - (a.ai_potential || 3));
  const tiles = sorted
    .map((p) => {
      const level = Math.min(5, Math.max(1, p.ai_potential || 3));
      return `
        <a class="dash-heat-tile heat-${level}" href="#/process/${p.id}">
          <span class="dash-heat-name">${escapeHtml(trValue(p, "name"))}</span>
          <div class="dash-heat-bottom">
            <span class="dash-heat-value">${level}</span>
            ${potentialBarHtml(p.ai_potential, p.realized_potential)}
          </div>
        </a>
      `;
    })
    .join("");
  const legend = dashLegendHtml([
    { color: "#38bdf8", label: t("realizedPotentialLabel") },
    { color: aiPotentialInfo(3).color, label: t("openPotentialLabel") },
  ]);
  return dashCard(t("dashHeatmapTitle"), `${legend}<div class="dash-heat-grid">${tiles}</div>`);
}

function dashMeter(label, value) {
  const v = value || 3;
  return `
    <span class="dash-meter" title="${escapeHtml(label)}: ${v}/5">
      <span class="dash-meter-label">${escapeHtml(label)}</span>
      <span class="dash-meter-track"><span class="dash-meter-fill" style="width:${v * 20}%"></span></span>
    </span>
  `;
}

function dashboardRankingSection(ideas) {
  const active = ideas.filter((i) => i.status !== "done" && i.status !== "discarded");
  if (active.length === 0) {
    return dashCard(t("dashRankingTitle"), `<div class="empty-state">${t("dashRankingEmpty")}</div>`);
  }
  const ranked = [...active].sort((a, b) => {
    return ideaScore(b) - ideaScore(a) || (b.impact || 3) - (a.impact || 3);
  });
  const shown = dashRankingShowAll ? ranked : ranked.slice(0, 8);
  const rows = shown
    .map(
      (idea, idx) => `
        <a class="dash-rank-row" href="#/idea/${idea.id}">
          <span class="dash-rank-num">${idx + 1}</span>
          <span class="dash-rank-body">
            <span class="dash-rank-title">${idea.catalog_id ? `<span class="badge">🏷 ${escapeHtml(idea.catalog_id)}</span> ` : ""}${escapeHtml(trValue(idea, "quick_note"))}</span>
            <span class="dash-rank-meters">
              ${dashMeter(t("impactLabel"), idea.impact)}
              ${dashMeter(t("effortLabel"), idea.effort)}
              ${dashMeter(t("feasibilityLabel"), idea.feasibility)}
              ${dashMeter(t("riskLabel"), idea.risk)}
            </span>
          </span>
        </a>
      `
    )
    .join("");
  const toggle =
    ranked.length > 8
      ? `<button class="btn-ghost" id="dash-rank-toggle">${dashRankingShowAll ? t("dashShowLess") : t("dashShowMore")}</button>`
      : "";
  return dashCard(t("dashRankingTitle"), rows + toggle);
}

function bindDashboardRanking() {
  const btn = document.getElementById("dash-rank-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      dashRankingShowAll = !dashRankingShowAll;
      renderDashboardBody();
    });
  }
}

function dashFormatDay(dayStr) {
  return new Date(`${dayStr}T00:00:00`).toLocaleDateString(currentLang === "en" ? "en-GB" : "de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function dashboardTimelineSection(ideas, processes) {
  if (ideas.length === 0 && processes.length === 0) {
    return dashCard(t("dashTimelineTitle"), `<div class="empty-state">${t("dashTimelineEmpty")}</div>`);
  }
  const dayKey = (iso) => iso.slice(0, 10);
  const ideaDays = ideas.map((i) => dayKey(i.created_at)).sort();
  const procDays = processes.map((p) => dayKey(p.created_at)).sort();
  const allDays = Array.from(new Set([...ideaDays, ...procDays])).sort();

  function cumulative(sortedDays) {
    let idx = 0;
    return allDays.map((d) => {
      while (idx < sortedDays.length && sortedDays[idx] <= d) idx++;
      return idx;
    });
  }
  const ideaCum = cumulative(ideaDays);
  const procCum = cumulative(procDays);
  const maxVal = Math.max(1, ideaCum[ideaCum.length - 1] || 0, procCum[procCum.length - 1] || 0);

  const W = 300;
  const H = 140;
  const PAD_L = 26;
  const PAD_T = 10;
  const PAD_B = 10;
  const PAD_R = 6;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const stepX = allDays.length > 1 ? plotW / (allDays.length - 1) : 0;

  function pathFor(cum) {
    return cum
      .map((v, idx) => {
        const x = PAD_L + idx * stepX;
        const y = PAD_T + plotH - (v / maxVal) * plotH;
        return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="dash-timeline-svg">
      <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + plotH}" stroke="var(--border)" stroke-width="1" />
      <line x1="${PAD_L}" y1="${PAD_T + plotH}" x2="${PAD_L + plotW}" y2="${PAD_T + plotH}" stroke="var(--border)" stroke-width="1" />
      <path d="${pathFor(ideaCum)}" fill="none" stroke="var(--accent)" stroke-width="2" />
      <path d="${pathFor(procCum)}" fill="none" stroke="var(--accent-2)" stroke-width="2" />
      <text x="2" y="${PAD_T + 4}" font-size="9" fill="var(--text-dim)">${maxVal}</text>
      <text x="${PAD_L}" y="${H - 1}" font-size="9" fill="var(--text-dim)">${escapeHtml(dashFormatDay(allDays[0]))}</text>
      <text x="${PAD_L + plotW}" y="${H - 1}" font-size="9" fill="var(--text-dim)" text-anchor="end">${escapeHtml(dashFormatDay(allDays[allDays.length - 1]))}</text>
    </svg>
  `;

  const legend = `
    <div class="dash-legend">
      <span class="dash-legend-item"><span class="dash-legend-dot" style="background:var(--accent)"></span>${t("ideasTab")}</span>
      <span class="dash-legend-item"><span class="dash-legend-dot" style="background:var(--accent-2)"></span>${t("processesTab")}</span>
    </div>
  `;

  return dashCard(t("dashTimelineTitle"), svg + legend);
}

function renderDashboardBody() {
  const el = document.getElementById("dash-body");
  if (!el) return;
  const ideas = dashboardFilteredIdeas();
  const processes = dashboardFilteredProcesses();
  el.innerHTML = `
    ${dashboardFiltersHtml()}
    ${dashboardMatrixSection(ideas)}
    ${dashboardTreeSection(ideas, processes)}
    ${dashboardStatusSection(ideas)}
    ${dashboardHeatmapSection(processes)}
    ${dashboardRankingSection(ideas)}
    ${dashboardTimelineSection(ideas, processes)}
  `;
  bindDashboardFilters();
  bindDashboardMatrix();
  bindDashboardTree();
  bindDashboardRanking();
}

async function renderDashboard() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("dashboardHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
      </div>
    </header>
    <main class="wide-main">
      ${tabBar("dashboard")}
      <div id="dash-body">
        <div class="empty-state">${t("loadingIdeas")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindLangToggle();
  bindThemeToggle();
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);

  ideasCache = await loadIdeas();
  processesCache = await loadProcesses();
  renderDashboardBody();
}

// ---------- Start (Startseite/Cockpit) ----------

// Eine von vier Tageszeiten - bestimmt sowohl Begrüßungstext/-icon als auch
// Verlauf + Himmelsgrafik des Hero-Headers (siehe heroSkyIllustration).
// Bewusst unabhängig vom Hell-/Dunkelmodus-Schalter: der regelt nur den Rest
// der App (Karten, Text, Flächen), die Himmelsfarbe folgt allein der Uhrzeit.
function dayPart() {
  const h = new Date().getHours();
  if (h >= 22 || h < 5) return "night";
  if (h < 10) return "morning";
  if (h < 17) return "day";
  return "evening";
}

function greetingText() {
  return { morning: t("greetingMorning"), day: t("greetingAfternoon"), evening: t("greetingEvening"), night: t("greetingNight") }[
    dayPart()
  ];
}

// Icon + Glow-Farbe je Tageszeit, passend zur Begrüßung (siehe greetingText).
function greetingIcon() {
  return {
    morning: { emoji: "🌅", cls: "icon-morning" },
    day: { emoji: "☀️", cls: "icon-day" },
    evening: { emoji: "🌇", cls: "icon-evening" },
    night: { emoji: "🌙", cls: "icon-night" },
  }[dayPart()];
}

// Breite Hintergrundgrafik für den Start-Header: Sonne/Mond/Wolken/Sterne
// über derselben stilisierten Bürozeile am Horizont, je Tageszeit anders
// (siehe dayPart). viewBox bewusst sehr breit (400x200) und zentriert auf
// die Sonne/den Mond, damit "preserveAspectRatio=slice" auf sehr schmalen
// (Handy) wie sehr breiten (Desktop) Headern nur die Ränder abschneidet,
// statt das Hauptmotiv zu verlieren.
function heroSkylineRects() {
  const heights = [26, 44, 18, 34, 16, 30, 20, 40, 16, 28, 22, 38, 16, 32, 20, 42, 16, 26, 22, 34];
  const w = 400 / heights.length;
  return heights
    .map((h, i) => {
      const bw = w * 0.7;
      const x = i * w + w * 0.15;
      return `<rect x="${x.toFixed(1)}" y="${200 - h}" width="${bw.toFixed(1)}" height="${h}"/>`;
    })
    .join("");
}

function heroWindowRects(positions) {
  return positions.map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="4" fill="#ffd77a" fill-opacity="0.85"/>`).join("");
}

function heroSkyIllustration(part) {
  const skyline = (color, opacity) => `<g fill="${color}" fill-opacity="${opacity}">${heroSkylineRects()}</g>`;
  const sun = (cx, cy, r, glow) => `
    <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="${glow}" fill-opacity="0.3" class="hero-sky-bob"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffe19b" class="hero-sky-bob"/>
  `;
  const rays = (cx, cy, r, count, len) =>
    `<g stroke="#fff4de" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" class="hero-sky-bob">${Array.from(
      { length: count },
      (_, i) => {
        const a = (Math.PI * 2 * i) / count;
        const x1 = cx + Math.cos(a) * (r + 6);
        const y1 = cy + Math.sin(a) * (r + 6);
        const x2 = cx + Math.cos(a) * (r + 6 + len);
        const y2 = cy + Math.sin(a) * (r + 6 + len);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      }
    ).join("")}</g>`;
  const cloud = (cx, cy, rx, ry, opacity) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" fill-opacity="${opacity}" class="hero-sky-drift"/>`;
  const stars = (positions) =>
    `<g fill="#e7ebff">${positions
      .map(([x, y, r], i) => `<circle class="hero-sky-twinkle" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(i % 5) * 0.5}s"/>`)
      .join("")}</g>`;

  if (part === "morning") {
    return `
      <line x1="0" y1="176" x2="400" y2="176" stroke="#fff" stroke-opacity="0.16"/>
      ${rays(250, 148, 30, 6, 16)}
      ${sun(250, 148, 30, "#ffb46b")}
      ${cloud(70, 120, 46, 13, 0.22)}
      ${cloud(130, 140, 34, 10, 0.16)}
      ${skyline("#4a2c22", 0.5)}
    `;
  }
  if (part === "day") {
    return `
      <line x1="0" y1="176" x2="400" y2="176" stroke="#fff" stroke-opacity="0.2"/>
      ${rays(250, 112, 24, 8, 16)}
      <circle cx="250" cy="112" r="24" fill="#fff6d8" class="hero-sky-bob"/>
      ${cloud(70, 108, 42, 14, 0.85)}
      ${cloud(130, 128, 30, 11, 0.7)}
      ${cloud(330, 140, 44, 14, 0.6)}
      ${skyline("#0d3b63", 0.28)}
    `;
  }
  if (part === "evening") {
    return `
      <line x1="0" y1="176" x2="400" y2="176" stroke="#fff" stroke-opacity="0.14"/>
      ${sun(250, 176, 40, "#ff7a59")}
      <path d="M60 90 q10 -8 20 0 q10 -8 20 0" fill="none" stroke="#2a1240" stroke-opacity="0.45" stroke-width="2" class="hero-sky-drift"/>
      <path d="M300 70 q10 -8 20 0 q10 -8 20 0" fill="none" stroke="#2a1240" stroke-opacity="0.35" stroke-width="2" class="hero-sky-drift"/>
      ${skyline("#241033", 0.65)}
      ${heroWindowRects([
        [36, 140],
        [96, 152],
        [151, 146],
        [230, 154],
        [286, 142],
        [345, 150],
      ])}
    `;
  }
  return `
    <line x1="0" y1="176" x2="400" y2="176" stroke="#fff" stroke-opacity="0.08"/>
    ${stars([
      [24, 34, 1.6],
      [66, 58, 1.2],
      [104, 30, 1.6],
      [150, 50, 1.2],
      [190, 28, 1.6],
      [40, 78, 1.2],
      [130, 74, 1.6],
      [16, 96, 1.2],
      [80, 96, 1.6],
      [172, 90, 1.2],
      [286, 40, 1.6],
      [326, 62, 1.2],
      [356, 32, 1.6],
      [366, 84, 1.2],
      [244, 88, 1.6],
    ])}
    <g class="hero-sky-bob">
      <circle cx="250" cy="112" r="26" fill="#eef1ff"/>
      <circle cx="261" cy="104" r="24" fill="#0b0f2e"/>
    </g>
    ${skyline("#05071a", 1)}
    ${heroWindowRects([
      [20, 142],
      [56, 130],
      [96, 152],
      [151, 146],
      [210, 138],
      [286, 142],
      [326, 154],
      [366, 150],
    ])}
  `;
}

function longDateText() {
  return new Date().toLocaleDateString(currentLang === "en" ? "en-GB" : "de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function aiPotentialAverage() {
  if (!processesCache.length) return 0;
  return processesCache.reduce((sum, p) => sum + (p.ai_potential || 3), 0) / processesCache.length;
}

function realizedPotentialAverage() {
  if (!processesCache.length) return 0;
  return processesCache.reduce((sum, p) => sum + (p.realized_potential || 0), 0) / processesCache.length;
}

// Chevron-Logo + Funken aus icons/icon.svg als Inline-SVG, damit die drei
// Segmente einzeln animiert werden können (siehe .logo-mark in style.css).
function appLogoMark(animated) {
  return `
    <svg class="logo-mark${animated ? " animated" : ""}" width="22" height="22" viewBox="0 0 512 512">
      <g fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round">
        <path class="chev chev1" d="M120,166 L176,166 L212,256 L176,346 L120,346"/>
        <path class="chev chev2" d="M212,166 L268,166 L304,256 L268,346 L212,346" opacity="0.75"/>
        <path class="chev chev3" d="M304,166 L360,166 L392,256 L360,346 L304,346" opacity="0.5"/>
      </g>
      <path class="spark" fill="#ffd166" d="M388,96 L400,132 L436,144 L400,156 L388,192 L376,156 L340,144 L376,132 Z"/>
    </svg>
  `;
}

function startRingSvg(pct) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const target = c * (1 - Math.min(1, Math.max(0, pct)));
  return `
    <svg width="64" height="64" viewBox="0 0 64 64" style="--ring-target:${target.toFixed(1)}">
      <circle class="ring-track" cx="32" cy="32" r="${r}" style="stroke-dasharray:${c.toFixed(1)}"></circle>
      <circle class="ring-fill" cx="32" cy="32" r="${r}" style="stroke-dasharray:${c.toFixed(1)}"></circle>
    </svg>
  `;
}

function startStatTile(count, label, delay) {
  return `
    <div class="stat-tile fade-up" style="animation-delay:${delay}s">
      <div class="num" data-count="${count}">0</div>
      <div class="lbl">${label}</div>
    </div>
  `;
}

function animateStartCounts() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("#app [data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    if (reduce) {
      el.textContent = target;
      return;
    }
    const start = performance.now();
    const dur = 700;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    setTimeout(() => requestAnimationFrame(tick), 480);
  });
}

async function renderStart() {
  if (ideasCache.length === 0) ideasCache = await loadIdeas();
  if (processesCache.length === 0) processesCache = await loadProcesses();

  const openIdeas = ideasCache.filter((i) => i.status !== "done" && i.status !== "discarded").length;
  const inProgress = ideasCache.filter((i) => i.status === "in_progress").length;
  const recent = [
    ...ideasCache.map((idea) => ({ kind: "idea", item: idea })),
    ...processesCache.map((proc) => ({ kind: "process", item: proc })),
  ]
    .sort((a, b) => new Date(b.item.updated_at) - new Date(a.item.updated_at))
    .slice(0, 3);
  const avgAi = aiPotentialAverage();
  const avgRealized = realizedPotentialAverage();
  const isAdmin = currentProfile && currentProfile.is_admin;

  $app.innerHTML = `
    <header class="topbar hero" data-daypart="${dayPart()}">
      <svg class="hero-sky" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        ${heroSkyIllustration(dayPart())}
      </svg>
      <div class="hero-inner">
        <div class="hero-top">
          <div class="brand-lockup">
            <div class="hoc-chip"><img src="icons/hoc-mark.png" alt="House of Communication" /></div>
            <div class="brand-div"></div>
            ${appLogoMark(true)}
            <span class="app-name">${escapeHtml(t("appName"))}</span>
          </div>
        </div>

        <div class="greet-row">
          <div class="greet-line">
            <div class="greet">${greetingText()}<span class="greet-icon ${greetingIcon().cls}">${greetingIcon().emoji}</span></div>
            <div class="hero-actions">
              <div class="hero-actions-group">${langToggleButton()}${themeToggleButton()}</div>
              <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
            </div>
          </div>
          <div class="sub">${longDateText()}</div>
        </div>

        <div class="ring-row">
          <div class="ring-wrap">
            ${startRingSvg(avgAi / 5)}
            <div>
              <div class="ring-value">${avgAi.toFixed(1).replace(".", currentLang === "en" ? "." : ",")} / 5</div>
              <div class="ring-label">${t("aiPotentialAvgLabel")}</div>
            </div>
          </div>
          <div class="ring-wrap">
            ${startRingSvg(avgRealized / 100)}
            <div>
              <div class="ring-value">${Math.round(avgRealized)}%</div>
              <div class="ring-label">${t("realizedPotentialAvgLabel")}</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="stat-row">
      ${startStatTile(openIdeas, t("statOpenIdeasLabel"), 0.05)}
      ${startStatTile(inProgress, t("statInProgressLabel"), 0.12)}
      ${startStatTile(processesCache.length, t("statProcessesLabel"), 0.19)}
    </div>

    <main class="wide-main">
      ${tabBar("start")}

      <div class="section-title">${t("quickAccessTitle")}</div>
      <div class="tile-grid action-row">
        <div class="tile fade-up" data-hash="#/processes" style="animation-delay:.26s"><span class="ic">⚙️</span><span class="lbl">${t("processesTab")}</span></div>
        <div class="tile fade-up" data-hash="#/ideas" style="animation-delay:.32s"><span class="ic">💡</span><span class="lbl">${t("ideasTab")}</span></div>
        <div class="tile fade-up" data-hash="#/dashboard" style="animation-delay:.38s"><span class="ic">📊</span><span class="lbl">${t("dashboardTab")}</span></div>
      </div>

      <div class="section-title" style="margin-top:20px;">${t("manageMoreTitle")}</div>
      <div class="tile-grid util-row">
        <div class="tile fade-up" data-hash="#/guide" style="animation-delay:.46s"><span class="ic">📋</span><span class="lbl">${t("utilGuideLabel")}</span></div>
        <div class="tile fade-up" data-hash="#/teams" style="animation-delay:.5s"><span class="ic">🧩</span><span class="lbl">${t("utilTeamsLabel")}</span></div>
        <div class="tile fade-up" data-hash="#/export" style="animation-delay:.54s"><span class="ic">🔄</span><span class="lbl">${t("utilExportLabel")}</span></div>
        ${
          isAdmin
            ? `<div class="tile fade-up" data-hash="#/admin" style="animation-delay:.58s"><span class="admin-tag">${t("adminOnlyTag")}</span><span class="ic">🛡️</span><span class="lbl">${t("utilPermissionsLabel")}</span></div>`
            : ""
        }
        <div class="tile fade-up" data-hash="#/settings" style="animation-delay:.62s"><span class="ic">⚙️</span><span class="lbl">${t("utilSettingsLabel")}</span></div>
        <div class="tile fade-up" data-hash="#/feedback" style="animation-delay:.66s"><span class="ic">⭐</span><span class="lbl">${t("utilFeedbackLabel")}</span></div>
      </div>

      <div class="section-title" style="margin-top:20px;">${t("recentlyEditedTitle")}</div>
      <div id="start-recent">
        ${
          recent.length
            ? recent.map((r) => (r.kind === "process" ? processCard(r.item) : ideaCard(r.item))).join("")
            : `<div class="empty-state">${t("emptyRecentlyEdited")}</div>`
        }
      </div>

      <div class="brand-footer">
        <div class="caption">${t("brandFooterCaption")}</div>
        <div class="plate"><img src="icons/hoc-logo.png" alt="Serviceplan Group – House of Communication" /></div>
        <div class="copyright">© ${new Date().getFullYear()} Serviceplan Group SE &amp; Co. KG</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindLangToggle();
  bindThemeToggle();
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);

  document.querySelectorAll("[data-hash]").forEach((el) => {
    el.addEventListener("click", () => {
      window.location.hash = el.dataset.hash;
    });
  });
  document.querySelectorAll("[data-href]").forEach((el) => {
    el.addEventListener("click", () => {
      window.open(el.dataset.href, "_blank", "noopener");
    });
  });
  document.querySelectorAll("#start-recent .idea-item").forEach((el) => {
    el.addEventListener("click", () => {
      window.location.hash = el.dataset.type === "process" ? `#/process/${el.dataset.id}` : `#/idea/${el.dataset.id}`;
    });
  });

  animateStartCounts();
}

async function render() {
  lastRenderedHash = window.location.hash;
  updateImpersonationBanner();
  if (passwordRecoveryMode) {
    renderSetNewPassword();
    return;
  }
  if (!currentUser) {
    renderLogin();
    return;
  }
  if (!currentProfile) {
    currentProfile = await loadOwnProfile();
  }
  if (!currentProfile) {
    renderProfileError();
    return;
  }
  if (!currentProfile.is_approved) {
    renderPendingApproval();
    return;
  }
  if (kostenstellenCache.length === 0) {
    kostenstellenCache = await loadKostenstellen();
    teamsCache = await loadTeams();
    myGrants = await loadMyGrants();
  }
  const route = currentRoute();
  if (route.view === "idea-detail") {
    await renderDetail(route.id);
  } else if (route.view === "process-list") {
    await renderProcessList();
  } else if (route.view === "process-detail") {
    await renderProcessDetail(route.id);
  } else if (route.view === "dashboard") {
    await renderDashboard();
  } else if (route.view === "settings") {
    renderSettings();
  } else if (route.view === "guide") {
    renderGuide();
  } else if (route.view === "admin" && currentProfile.is_admin) {
    await renderAdmin();
  } else if (route.view === "export") {
    await renderExportSync();
  } else if (route.view === "teams") {
    await renderTeamsManagement();
  } else if (route.view === "feedback") {
    renderFeedback();
  } else if (route.view === "idea-list") {
    await renderList();
  } else {
    await renderStart();
  }
}

init();
