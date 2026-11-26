# Design-Roadmap – Luminous Fantasy Adventure

> **Projekt:** Nico's Snake App  
> **Arbeitsbranch:** `design/phase2-visual-foundation` (Phase-2-Arbeit ausschließlich hier; `main` bleibt unangetastet)  
> **Designreferenz:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)  
> **Archiv (obsolet):** [PHASE0_INVENTAR.md](./archive/PHASE0_INVENTAR.md)  
> **Phase-2-Arbeitsplan:** [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md)  
> **Bestehende Funktionen:** [FEATURES.md](../FEATURES.md)

## Ziel

Die bestehende Lernapp erhält eine konsistente visuelle Identität im Stil **Luminous Fantasy Adventure**. Die vorhandene Lernlogik, Belohnungen, Shop- und Terrarium-Mechaniken, Navigation und Speicherung bleiben erhalten.

## Gerätepriorität

- Primär: Smartphone im Hochformat.
- Sekundär: Tablet und Desktop responsiv unterstützen.
- Alle neuen Layoutentscheidungen zuerst am schmalen Smartphone-Viewport prüfen.

## Technische Priorität

- Bei gleichwertigen Lösungswegen wird grundsätzlich zuerst die technisch einfachste, robuste und wartbare Umsetzung gewählt – projektweit und in allen Phasen.
- Zusätzliche Komplexität (z. B. aufwendige Layoutlogik, Sonderfälle, Animationen oder neue Abhängigkeiten) wird nur eingeführt, wenn sie einen klaren, notwendigen Mehrwert bietet.
- Die einfache Lösung muss weiterhin die festgelegten UX-, Design-, Zugänglichkeits- und Responsivitätsanforderungen erfüllen; technische Einfachheit ist kein Grund, diese zu unterschreiten.

## Status-Legende

Es gelten die Statusbegriffe aus [README.md](./README.md): **Entworfen**, **Implementiert**, **Verifiziert**, **Offen**, **Blockiert**.

- [x] Verifiziert: erledigt und belegt.
- [ ] Offen, oder nur implementiert und noch nicht verifiziert. Der genaue Stand steht im Text der Zeile.
- **Offen (begonnen)** – wird gerade umgesetzt.
- **Blockiert** – benötigt eine Entscheidung oder Voraussetzung.

## Phase 0 – Projektgrundlage

**Ziel:** Bestehende Funktionen, Assets und technische Ausgangslage kennen, bevor visuell verändert wird.

- [x] Arbeitsbranch angelegt.
- [x] App-Ansichten, Komponenten, Styling und Assets inventarisiert.
- [x] Bestehende Funktionen in `FEATURES.md` als Schutzreferenz erfasst.
- [x] Visuelle Leitidee und Gerätepriorität dokumentiert.
- [x] Original-Logo und Transparenz technisch sowie visuell geprüft.
- [x] Logo-Verwendung für Splash freigegeben: Original unverändert auf dunklem Hintergrund.
- [x] Schriftwahl freigegeben: Atkinson Hyperlegible Next 400/700 und Nunito 800.
- [x] Erste visuelle Sichtung der bereitgestellten Screenshots (Home, Splash, Aufgabenansicht, Pause-Dialog, Shop).
- [x] Smartphone-Hochformat vom Projektinhaber lokal geprüft und als funktionierend bestätigt.
- [x] Lokaler Produktionsbuild auf dem Mac vom Projektinhaber erfolgreich ausgeführt und bestätigt.

**Phase-0-Ergebnis: ABGESCHLOSSEN.** Projektinventar, Funktionsschutz, visuelle Ausgangssichtung und verbindliche Designentscheidungen liegen vor. Der Projektinhaber hat die Smartphone-Darstellung im Hochformat lokal geprüft und als funktionierend bestätigt sowie den erfolgreichen lokalen Produktionsbuild auf dem Mac gemeldet. Die damalige Testsuite und Typprüfung (`tsc -b`) waren zusätzlich in der Linux-Sandbox erfolgreich; die historische Testanzahl wird hier nicht fortgeschrieben. Die mobile Prüfung und der lokale Build sind Nutzerbestätigungen, keine von ChatGPT unabhängig ausgeführten Tests.

## Phase 1 – Designsystem und UI-Grundlagen

**Ziel:** Wiederverwendbare visuelle Regeln und Komponenten schaffen.

**Status: Implementiert, vom Projektinhaber abgenommen (25.11.2026), mit bekannten Einschränkungen.** Siehe Abnahme am Ende dieser Phase.

- [ ] Semantische Farb-, Flächen-, Schatten-, Radius-, Abstands- und Typografie-Tokens definieren. Stand: implementiert. Vom Projektinhaber vorerst akzeptiert (25.11.2026), nicht technisch bereinigt; bleibt als bekannte Einschränkung offen. Die Kernpalette ist semantisch benannt. Viele migrierte Werte heißen aber nur nach ihrem Wert (z. B. `--color-detail-6c8a7c`, `--effect-detail-rgba-255-185-46-7`) und sind keine semantischen Tokens. Das Namensschema birgt ein Kollisionsrisiko (Alpha .7 und .07 enden beide auf `-7`).
- [x] Die zentralen Legacy-Variablen auf die freigegebenen semantischen Tokens abbilden.
- [x] Fest eingetragene Farb- und Effektwerte in den Screens zentralisieren; Abstände auf das Tokenraster migrieren und automatisiert gegen Rückfälle absichern.
- [x] Atkinson Hyperlegible Next 400/700 und Nunito variabel lokal als WOFF2 für Latin und Latin Extended einbinden.
- [x] Typografische Rollen für Titel, Aufgaben, Fließtext, unterstützende Texte und Bedienelemente tatsächlich anwenden.
- [x] Button-Zustände für Default, Pressed, Disabled und Focus zentral vereinheitlichen.
- [x] Gemeinsame Oberflächenregeln auf Karten, Panels, Dialoge, Info-Flächen, Badges und Fortschrittsanzeigen anwenden.
- [x] Abstandstokens in den zentralen Layouts und Komponenten verwenden.
- [x] Mobile-first CSS-Regeln, 48-px-Touch-Ziele und schmale Viewports absichern. Stand: implementiert; vom Projektinhaber als in Ordnung gemeldet (25.11.2026), keine unabhängige technische Messung. `.knopf.preis`, `.knopf.vorlesen-klein` und `.info summary` wurden von 44 px auf `--touch-target` (48 px) angehoben. Der automatisierte Test prüft nur, dass das Token existiert, nicht die Größe aller Elemente. Die praktische Touch-Prüfung hat der Projektinhaber als in Ordnung gemeldet.
- [x] Globale Reduced-motion-Absicherung ergänzen.
- [x] Automatisierte Design-System-Regressionstests für Token-Referenzen, lokale Fonts und Bedienregeln ergänzen.
- [x] Code- und automatisierte Design-System-Abnahme abschließen (GitHub Actions: Tests, TypeScript-Prüfung und Produktionsbuild erfolgreich; Vercel Preview `READY`).
- [ ] Schwierigkeitsfarben als eigene Tokens (`--color-task-light`, `--color-task-medium`, `--color-task-difficult`, dazu `--color-task-difficult-on-dark` für dunkle Flächen) anlegen und im Schuppenband verwenden. Stand (25.11.2026): implementiert; Tests und TypeScript-Prüfung erfolgreich, Kontrast berechnet (`#6b4bd1` auf Deep Forest nur 1,68:1, deshalb die hellere Variante `#b9a4ff` mit 4,65:1). Nicht visuell verifiziert nach der Umstellung. `--lime`, `--amber` und `--lila` blieben unverändert.
- [ ] Leere Schuppen auf Creme (Themenkarte) mit dunklem Umriss lesbar machen. Stand (25.11.2026): implementiert, nicht visuell verifiziert.
- [ ] Manuelle Sichtprüfung der tatsächlichen Glyphen, Aufgabenansichten und Komponenten auf Smartphone, Tablet und Desktop durchführen. Smartphone: vom Projektinhaber gemeldet (25.11.2026), nicht von Claude unabhängig geprüft. Tablet und Desktop: offen, bewusst in die übergreifende Qualitätssicherung in Phase 5 verschoben.

**Umsetzung (Code):** Die bestehenden TSX-Komponenten und ihre Spiel-/Lernlogik bleiben unangetastet. Die Stylesheet-Ebene nutzt nun die zuvor definierten Abstands-, Typografie-, Oberflächen- und Zustands-Tokens auch in den vorhandenen Komponenten. Zusätzlich wurden 74 bisher direkt eingetragene Farb-/Effektwerte in zentrale Farb- und Effekt-Tokens überführt sowie 185 Abstandsangaben auf das Abstandsraster migriert. Die Token-Definitionen bleiben in `:root` zentral wartbar. Info-Flächen und Münz-Chips sind in dieselbe Oberflächenfamilie integriert. Die Dialoge, Karten, Antwortflächen, Buttons und Fortschrittsanzeigen teilen zentrale Material- und Bedienregeln. Die Font-Dateien werden weiterhin lokal geladen; Vite verwendet jetzt relative Asset-Pfade, damit Fonts und weitere öffentliche Assets auch bei Deployments unter einem Projekt-Unterpfad erreichbar bleiben.

**Automatisierte Prüfung:** Ein neuer Test prüft eindeutige Root-Tokens, auflösbare CSS-Variablen, Vorhandensein und WOFF2-Signaturen aller sechs lokalen Schriftdateien sowie Fokus-, Touch- und Reduced-motion-Regeln. Ein zusätzlicher Regressionstest verhindert neue fest eingetragene Farben außerhalb der Token-Definitionen und neue Pixel-Einzelwerte in Abstandsdeklarationen. Der Test ergänzt die bestehenden Spieltests. Der GitHub-Actions-Lauf nach diesem Commit ist der Nachweis für Tests und Produktionsbuild; eine tatsächliche Browser-/Viewport-Sichtprüfung wird dadurch nicht ersetzt.

**Status Phase 1: Implementiert, vom Projektinhaber abgenommen (25.11.2026), mit bekannten Einschränkungen.** Code und automatisierte Prüfung (Tests, TypeScript-Prüfung, Produktionsbuild) sind belegt, die Tokens, Komponenten und lokalen Assets funktionieren auch unter Projekt-Unterpfaden. Der Projektinhaber hat gemeldet (nicht von Claude unabhängig geprüft): lokaler Produktionsbuild auf dem Mac erfolgreich, Smartphone-Sichtprüfung und Touch-Bedienung in Ordnung. Bekannte Einschränkungen: Viele Tokens sind nur nach ihrem Wert benannt (Kollisionsrisiko, vom Projektinhaber vorerst akzeptiert), und die Sichtprüfung auf Tablet und Desktop steht noch aus (Phase 5). Die Abnahme der Schwierigkeitsfarben und der leeren Schuppen auf Creme nach der Umstellung vom 25.11.2026 ist ebenfalls offen.

## Phase 2 – Charaktere und Assets

**Status: Offen (begonnen).** Asset-Inventar und Produktions-/Freigabeablauf sind in [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) dokumentiert. Frühe Konzepttafeln für Terrarium, Spielobjekte und Belohnung sind als historische Exploration im [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) zusammengefasst. Die verbindliche Richtung wird schlangenspezifisch mit der Nico-Referenz weiterentwickelt; Konzepttafeln sind keine Produktionsassets.

**Ziel:** Nico und die Spielwelt konsistent und wiederverwendbar gestalten.

- [x] Bestehendes Original-Logo im Splash unverändert verwenden (`src/App.tsx`, `public/images/logo.webp`).
- [x] Erste Art-Direction-Exploration für Terrarium, Spielobjekte und Belohnung erstellen.
- [x] Zweite neutrale Nico-Konzeptiteration als bevorzugte Richtung bestätigt und mit der kanonischen Charakterreferenz dokumentiert; späte Stufen bleiben kraftvoll/legendär und schlangengerecht.
- [x] Fünf Entwicklungsstufen als konsistente Charakterfamilie spezifizieren (visuelle Einzelasset-Freigabe und Produktion bleiben offen).
- [x] Verbindliche Nico-Visuelle-Spezifikation aus Bestandsvergleich, Entwicklungsbogen, Identitäts- und Produktionsregeln konsolidieren; Art-Direction-Freigabe gilt für die Spezifikation, nicht für einzelne Bilddateien.
- [ ] Vollständiges Stil-Referenzpaket aus Nico, Terrarium, Einzelobjekten und Belohnungen final visuell freigeben.
- [ ] Benötigte transparente Charakter-Assets und Posen festlegen.
- [ ] Einzelne 3D-Spielgrafiken mit ChatGPT erstellen; Claude Code bindet die freigegebenen Assets technisch ein.
- [x] Home-Screen-Komposition Smartphone-first als UX-/Asset-Spezifikation ausarbeiten ([HOME_SCREEN_CONCEPT.md](./HOME_SCREEN_CONCEPT.md)); erster React/CSS-Prototyp ist auf dem Phase-2-Branch implementiert. Visuelle Abnahme, finale Weltgrafiken und Viewport-Prüfung bleiben offen.
- [ ] Hintergründe für Home, Lernansicht und Terrarium definieren.
- [ ] Dekoration, Kristalle und Effekte als einzelne Assets organisieren.
- [ ] Einheitliche Lichtführung, Perspektive, Materialien und Proportionen über alle Asset-Gruppen sichern.
- [ ] Bildgrößen, Dateiformate und Ladeverhalten optimieren.

**Zurückgestellt:** Eine transparente Logo-Ableitung ist nicht Voraussetzung für den Relaunch. Sie wird nur separat erstellt, wenn eine qualitativ saubere Quelle oder Freistellung verfügbar ist. Das Original bleibt unangetastet.

**Abnahmekriterium:** Die Charakterstufen sind klar als dieselbe Schlange erkennbar und Assets funktionieren in echten UI-Kompositionen.

## Phase 3 – Bestehende Screens vereinheitlichen

**Ziel:** Die freigegebene Designsprache auf alle vorhandenen App-Bereiche übertragen, ohne Funktionen zu verändern.

- [ ] Splash / Start
- [ ] Home / Begleiter
- [ ] Aufgaben und Eingaben
- [ ] Antwort-Feedback
- [ ] Rundenabschluss und Belohnung
- [ ] Terrarium
- [ ] Shop
- [ ] Elternbereich
- [ ] Einführung und Dialoge

**Abnahmekriterium:** Die Screens wirken wie ein zusammenhängendes Produkt. Bestehende Navigation, Inhalte und Interaktionen bleiben erhalten.

## Phase 4 – Bewegung und besondere Momente

**Ziel:** Das Spielgefühl veredeln, ohne die Lernaufgabe zu stören.

- [ ] Logo-Auftritt und dezente Glow-Akzente
- [ ] Charakterbewegungen und Reaktionen
- [ ] Wachstumsübergänge zwischen Entwicklungsstufen
- [ ] Freischaltung der legendären Form
- [ ] Partikel und Glow für besondere Erfolge
- [ ] Dauer, Unterbrechbarkeit und Reduced Motion prüfen

**Abnahmekriterium:** Animationen sind kurz, flüssig, sinnvoll und beeinträchtigen weder Lesbarkeit noch Bedienung.

## Phase 5 – Qualitätssicherung

- [ ] Smartphone-Hochformat auf kleinen und großen Displays prüfen.
- [ ] Tablet- und Desktop-Layouts prüfen.
- [ ] Touch-Ziele und Drag-and-drop praktisch testen.
- [ ] Kontrast, Lesbarkeit und Schriftgrößen kontrollieren.
- [x] Tests und Typprüfung nach der vollständigen Phase-1-Migration ausführen (GitHub Actions: Tests und TypeScript-Prüfung erfolgreich; aktueller Nachweis siehe Prüfhinweis unten).
- [x] Produktionsbuild nach der vollständigen Phase-1-Migration erfolgreich ausführen (GitHub Actions und Vercel Preview erfolgreich; aktueller Nachweis siehe Prüfhinweis unten).
- [ ] Bestehende Spielstände und Lernabläufe auf Regressionen prüfen.
- [ ] Finale Screenshots dokumentieren.
- [x] Roadmap und Funktionsübersicht nach dem Dokumentationsaudit aktualisieren (25.11.2026).

**Prüfhinweis (25.11.2026):** Für Commit `b3d714d1341ae9d3a2ea3d680c6a7d41407bcca4` sind `npm ci`, `npm test` und `npm run build` im [GitHub-Actions-Lauf 146 erfolgreich](https://github.com/ninanitzsche/Lernapp/actions/runs/45606084804). Tests, TypeScript-Prüfung und Produktionsbuild liefen erfolgreich; die Testanzahl wird hier bewusst nicht festgeschrieben. Der CI-Nachweis ersetzt keine manuelle Browser-/Viewport-Sichtprüfung. Smartphone-, Tablet- und Desktop-Sichtprüfung sowie praktische Touch-, Drag-and-drop- und Lernablaufprüfungen bleiben offen.

**Abnahmekriterium:** Die App ist visuell konsistent, auf dem Smartphone gut bedienbar, auf größeren Geräten responsiv und ohne bekannte Regressionen.

## Aktuelle Entscheidungen

| Thema | Gültige Entscheidung |
|---|---|
| Designstil | Luminous Fantasy Adventure |
| Logo | Original unverändert; Splash auf dunklem Hintergrund |
| Transparente Logo-Variante | Zurückgestellt; keine unsaubere Freistellung |
| Farben | Toxic Lime, Emerald Green, Deep Forest, Warm Gold, Amber Orange, Midnight Blue, Warm Cream |
| Typografie | Atkinson Hyperlegible Next 400/700 für Aufgaben und Text; Nunito 800 für Überschriften |
| Schriftbereitstellung | Lokal gehostete WOFF2-Dateien für Atkinson 400/700 und Nunito variabel, Latin + Latin Extended, mit OFL-Lizenzen |
| Geräte | Smartphone Hochformat zuerst; Tablet/Desktop responsiv |
| Lernen | Helle, ruhige und kontrastreiche Aufgabenflächen |
| Terrarium | Reichhaltigste Fantasy-Ansicht |
| Home | Hybrid aus Nicos gemütlichem, schlangenspezifischem Zuhause und einer sich öffnenden Abenteuerwelt (26.11.2026) |
| Git-Arbeitsweise | Phase-2-Änderungen ausschließlich auf `design/phase2-visual-foundation`; `main` bleibt unangetastet |
| Bildproduktion | Einzelne, eigens erstellte 3D-Assets; keine generierten UI-Screenshots |
| Zuständigkeit Assets | ChatGPT: Art Direction und Bildassets; Claude Code: technische Integration |
| Funktionsumfang | Bestehende Funktionen und Mechaniken bleiben erhalten |

## Pflege

Diese Datei zeigt nur den aktuellen Stand und die noch offenen Arbeitsschritte. Abgeschlossene Zwischenstände und frühere Formulierungen gehören in die Git-Historie, nicht in ein fortlaufendes Änderungsprotokoll. Aufgaben werden erst nach Umsetzung und tatsächlicher Prüfung abgehakt.
