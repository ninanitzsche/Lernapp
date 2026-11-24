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

- [x] Erste semantische Farb-, Flächen-, Schatten-, Radius-, Abstands- und Typografie-Tokens in `src/index.css` definieren.
- [x] Legacy-Farbvariablen zentral auf die freigegebenen semantischen Tokens abbilden; verbleibende Einzelwerte komponentenweise weiter migrieren und visuell prüfen.
- [x] Freigegebene Schriften lokal einbinden (variable TTF-Dateien, lokal gehostet, OFL-Lizenzen); Glyphenprüfung in der App offen.
- [x] Typografische Rollen für Seitentitel, Abschnittstitel, Aufgaben, Fließtext und unterstützende Texte in CSS definieren und auf zentrale Komponenten anwenden.
- [x] Vorhandene Button-Zustände für Disabled und Focus vereinheitlichen; Primary/Secondary/Tertiary visuell weiter prüfen.
- [ ] Karten, Panels, Dialoge, Badges und Fortschrittsanzeigen vollständig vereinheitlichen (gemeinsame Oberflächenregeln begonnen).
- [x] Zentrale Abstände, Rundungen, Konturen und Schatten als gemeinsame Tokens/Oberflächenregeln ergänzen; screenweise Migration offen.
- [ ] Mobile-first Raster, responsive Abstände und Touch-Zielgrößen vollständig festlegen (erste schmale Viewport-Regeln ergänzt).
- [x] Globale Reduced-motion-Absicherung ergänzen; vorhandene spezifische Animationseinstellungen bleiben erhalten.

**Zwischenstand:** Semantische Tokens, typografische Rollen, lokal gehostete variable TTF-Schriften inklusive OFL-Lizenzen sowie gemeinsame Oberflächen- und Touch-Regeln sind implementiert. Die vereinbarte WOFF2-Auslieferung ist noch offen; aktuell werden TTF-Dateien genutzt. Glyphen, Ziffern, Screens und Viewports müssen in der laufenden App visuell geprüft werden. Vollständige Migration verbleibender Einzelwerte und Regressionstests bleiben offen.

**Abnahmekriterium:** Die wichtigsten UI-Bausteine folgen einem konsistenten Token- und Komponentensystem und funktionieren im Smartphone-Hochformat.

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
- [ ] Tests und Typprüfung ausführen.
- [ ] Produktionsbuild erfolgreich ausführen.
- [ ] Bestehende Spielstände und Lernabläufe auf Regressionen prüfen.
- [ ] Finale Screenshots dokumentieren.
- [ ] Roadmap und Funktionsübersicht aktualisieren.

**Abnahmekriterium:** Die App ist visuell konsistent, auf dem Smartphone gut bedienbar, auf größeren Geräten responsiv und ohne bekannte Regressionen.

## Aktuelle Entscheidungen

| Thema | Gültige Entscheidung |
|---|---|
| Designstil | Luminous Fantasy Adventure |
| Logo | Original unverändert; Splash auf dunklem Hintergrund |
| Transparente Logo-Variante | Zurückgestellt; keine unsaubere Freistellung |
| Farben | Toxic Lime, Emerald Green, Deep Forest, Warm Gold, Amber Orange, Midnight Blue, Warm Cream |
| Typografie | Atkinson Hyperlegible Next 400/700 für Aufgaben und Text; Nunito 800 für Überschriften |
| Schriftbereitstellung | Lokal gehostete variable TTF-Dateien mit OFL-Lizenzen (WOFF2-Optimierung offen) |
| Geräte | Smartphone Hochformat zuerst; Tablet/Desktop responsiv |
| Lernen | Helle, ruhige und kontrastreiche Aufgabenflächen |
| Terrarium | Reichhaltigste Fantasy-Ansicht |
| Bildproduktion | Einzelne, eigens erstellte 3D-Assets; keine generierten UI-Screenshots |
| Zuständigkeit Assets | ChatGPT: Art Direction und Bildassets; Claude Code: technische Integration |
| Funktionsumfang | Bestehende Funktionen und Mechaniken bleiben erhalten |

## Pflege

Diese Datei zeigt nur den aktuellen Stand und die noch offenen Arbeitsschritte. Abgeschlossene Zwischenstände und frühere Formulierungen gehören in die Git-Historie, nicht in ein fortlaufendes Änderungsprotokoll. Aufgaben werden erst nach Umsetzung und tatsächlicher Prüfung abgehakt.
