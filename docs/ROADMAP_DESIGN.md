# Design-Roadmap – Luminous Fantasy Adventure

> **Projekt:** Nico's Snake App  
> **Branch:** `design/luminous-fantasy-adventure`  
> **Designreferenz:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)  
> **Ausgangslage:** [PHASE0_INVENTAR.md](./PHASE0_INVENTAR.md)  
> **Bestehende Funktionen:** [FEATURES.md](../FEATURES.md)

## Ziel

Die bestehende Lernapp erhält eine konsistente visuelle Identität im Stil **Luminous Fantasy Adventure**. Die vorhandene Lernlogik, Belohnungen, Shop- und Terrarium-Mechaniken, Navigation und Speicherung bleiben erhalten.

## Gerätepriorität

- Primär: Smartphone im Hochformat.
- Sekundär: Tablet und Desktop responsiv unterstützen.
- Alle neuen Layoutentscheidungen zuerst am schmalen Smartphone-Viewport prüfen.

## Status-Legende

- [x] Erledigt und belegt
- [ ] Offen
- **In Arbeit** – wird gerade umgesetzt
- **Blockiert** – benötigt eine Entscheidung oder Voraussetzung

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

**Phase-0-Ergebnis: ABGESCHLOSSEN.** Projektinventar, Funktionsschutz, visuelle Ausgangssichtung und verbindliche Designentscheidungen liegen vor. Der Projektinhaber hat die Smartphone-Darstellung im Hochformat lokal geprüft und als funktionierend bestätigt sowie den erfolgreichen lokalen Produktionsbuild auf dem Mac gemeldet. Tests (144/144) und Typprüfung (`tsc -b`) waren zusätzlich in der Linux-Sandbox erfolgreich. Die mobile Prüfung und der lokale Build sind Nutzerbestätigungen, keine von ChatGPT unabhängig ausgeführten Tests.

## Phase 1 – Designsystem und UI-Grundlagen

**Ziel:** Wiederverwendbare visuelle Regeln und Komponenten schaffen.

- [x] Semantische Farb-, Flächen-, Schatten-, Radius-, Abstands- und Typografie-Tokens definieren.
- [x] Die zentralen Legacy-Variablen auf die freigegebenen semantischen Tokens abbilden.
- [x] Fest eingetragene Farb- und Effektwerte in den Screens zentralisieren; Abstände auf das Tokenraster migrieren und automatisiert gegen Rückfälle absichern.
- [x] Atkinson Hyperlegible Next 400/700 und Nunito variabel lokal als WOFF2 für Latin und Latin Extended einbinden.
- [x] Typografische Rollen für Titel, Aufgaben, Fließtext, unterstützende Texte und Bedienelemente tatsächlich anwenden.
- [x] Button-Zustände für Default, Pressed, Disabled und Focus zentral vereinheitlichen.
- [x] Gemeinsame Oberflächenregeln auf Karten, Panels, Dialoge, Info-Flächen, Badges und Fortschrittsanzeigen anwenden.
- [x] Abstandstokens in den zentralen Layouts und Komponenten verwenden.
- [x] Mobile-first CSS-Regeln, 48-px-Touch-Ziele und schmale Viewports absichern.
- [x] Globale Reduced-motion-Absicherung ergänzen.
- [x] Automatisierte Design-System-Regressionstests für Token-Referenzen, lokale Fonts und Bedienregeln ergänzen.
- [ ] Sichtprüfung der tatsächlichen Glyphen, Aufgabenansichten und Komponenten auf Smartphone, Tablet und Desktop durchführen (Browser-/Geräteprüfung; nicht durch CSS-Tests ersetzbar).

**Umsetzung (Code):** Die bestehenden TSX-Komponenten und ihre Spiel-/Lernlogik bleiben unangetastet. Die Stylesheet-Ebene nutzt nun die zuvor definierten Abstands-, Typografie-, Oberflächen- und Zustands-Tokens auch in den vorhandenen Komponenten. Zusätzlich wurden 74 bisher direkt eingetragene Farb-/Effektwerte in zentrale Farb- und Effekt-Tokens überführt sowie 185 Abstandsangaben auf das Abstandsraster migriert. Die Token-Definitionen bleiben in `:root` zentral wartbar. Info-Flächen und Münz-Chips sind in dieselbe Oberflächenfamilie integriert. Die Dialoge, Karten, Antwortflächen, Buttons und Fortschrittsanzeigen teilen zentrale Material- und Bedienregeln. Die Font-Dateien werden weiterhin lokal geladen; Vite verwendet jetzt relative Asset-Pfade, damit Fonts und weitere öffentliche Assets auch bei Deployments unter einem Projekt-Unterpfad erreichbar bleiben.

**Automatisierte Prüfung:** Ein neuer Test prüft eindeutige Root-Tokens, auflösbare CSS-Variablen, Vorhandensein und WOFF2-Signaturen aller sechs lokalen Schriftdateien sowie Fokus-, Touch- und Reduced-motion-Regeln. Ein zusätzlicher Regressionstest verhindert neue fest eingetragene Farben außerhalb der Token-Definitionen und neue Pixel-Einzelwerte in Abstandsdeklarationen. Der Test ergänzt die bestehenden Spieltests. Der GitHub-Actions-Lauf nach diesem Commit ist der Nachweis für Tests und Produktionsbuild; eine tatsächliche Browser-/Viewport-Sichtprüfung wird dadurch nicht ersetzt.

**Abnahmekriterium:** Die wichtigsten UI-Bausteine folgen einem konsistenten Token- und Komponentensystem, die lokalen Assets funktionieren auch unter Projekt-Unterpfaden und die Bedienregeln sind automatisiert abgesichert. Die manuelle Geräteprüfung bleibt Voraussetzung für die endgültige Phase-1-Freigabe.

## Phase 2 – Charaktere und Assets

**Ziel:** Nico und die Spielwelt konsistent und wiederverwendbar gestalten.

- [ ] Bestehendes Logo im Splash unverändert verwenden.
- [ ] Stil-Referenzpaket erstellen und freigeben (Nico, Terrarium, Shop-Objekte, Belohnung).
- [ ] Fünf Entwicklungsstufen als konsistente Charakterfamilie spezifizieren und gestalten.
- [ ] Benötigte transparente Charakter-Assets und Posen festlegen.
- [ ] Einzelne 3D-Spielgrafiken mit ChatGPT erstellen; Claude Code bindet die freigegebenen Assets technisch ein.
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
- [ ] Tests und Typprüfung nach der vollständigen Phase-1-Migration auf dem aktuellen Branch-Commit ausführen.
- [ ] Produktionsbuild nach der vollständigen Phase-1-Migration auf dem aktuellen Branch-Commit erfolgreich ausführen.
- [ ] Bestehende Spielstände und Lernabläufe auf Regressionen prüfen.
- [ ] Finale Screenshots dokumentieren.
- [ ] Roadmap und Funktionsübersicht aktualisieren.

**Aktueller Prüfhinweis:** Für den aktuellen Branch-Stand liegt kein bestätigter Test-/Build-Lauf vor. Der zuletzt abgefragte Vercel-Status meldet `failure`; die konkrete Fehlerursache ist ohne Einsicht in die Vercel-Buildlogs nicht belastbar feststellbar. Das ist kein Nachweis für einen Testfehler.\n\n**Abnahmekriterium:** Die App ist visuell konsistent, auf dem Smartphone gut bedienbar, auf größeren Geräten responsiv und ohne bekannte Regressionen.

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
| Bildproduktion | Einzelne, eigens erstellte 3D-Assets; keine generierten UI-Screenshots |
| Zuständigkeit Assets | ChatGPT: Art Direction und Bildassets; Claude Code: technische Integration |
| Funktionsumfang | Bestehende Funktionen und Mechaniken bleiben erhalten |

## Pflege

Diese Datei zeigt nur den aktuellen Stand und die noch offenen Arbeitsschritte. Abgeschlossene Zwischenstände und frühere Formulierungen gehören in die Git-Historie, nicht in ein fortlaufendes Änderungsprotokoll. Aufgaben werden erst nach Umsetzung und tatsächlicher Prüfung abgehakt.
