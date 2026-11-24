# Design-Roadmap – Luminous Fantasy Adventure

> **Projekt:** Nico's Snake App  
> **Arbeitsbranch:** design/luminous-fantasy-adventure  
> **Status:** Planung angelegt – Umsetzung noch nicht begonnen  
> **Designreferenz:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)  
> **Feature-Inventar:** [../FEATURES.md](../FEATURES.md)

Diese Roadmap ist das lebende Arbeitsprotokoll für den visuellen Relaunch. Sie wird bei jeder abgeschlossenen Etappe aktualisiert. Aufgaben werden erst dann auf „Erledigt“ gesetzt, wenn die Änderung im Branch umgesetzt und überprüft wurde.

## Ziel
Die bestehende Lernapp erhält eine konsistente visuelle Identität im Stil **Luminous Fantasy Adventure**: stylized 3D Fantasy, biolumineszentes Giftgrün, hochwertige Game-UI und eine nachvollziehbare Charakterentwicklung von der niedlichen Baby-Schlange bis zur legendären Schlange aus dem Logo.

Der Relaunch soll die vorhandene Lernlogik, Shop-Mechanik, Terrarium-Funktionen und Speicherung bewahren.

## Verbindliche Geräteentscheidung

- **Primärgerät:** Smartphone
- **Ausrichtung:** Hochformat (Portrait)
- **Layoutstrategie:** Mobile-first. Die Smartphone-Oberfläche ist die Referenz; Tablet und Desktop sollen weiterhin responsiv und benutzbar bleiben, sind aber nicht die primäre Designfläche.
- **Konsequenz:** Navigation, Hauptaktionen, Touch-Ziele, Aufgabenflächen und Bildkompositionen werden zuerst für schmale Hochformat-Viewports gestaltet und anschließend sinnvoll erweitert.

## Status-Legende
- [ ] Offen
- [x] Erledigt
- **In Arbeit** – wird aktiv umgesetzt
- **Blockiert** – benötigt eine Entscheidung oder ein Asset

## Phase 0 – Projektgrundlage und Bestandsaufnahme
**Ziel:** Sicherstellen, dass wir auf dem aktuellen Stand aufbauen und nichts Bestehendes versehentlich verlieren.

- [x] Arbeitsbranch von main erstellt: design/luminous-fantasy-adventure
- [x] Visuelle Leitidee und Art Direction dokumentiert
- [x] Roadmap als lebendes Projektdokument angelegt
- [x] Primärgerät Smartphone festgelegt
- [x] Hochformat als primäre Ausrichtung festgelegt
- [ ] Aktuelle Screens und Komponenten im Branch erneut inventarisieren
- [ ] Vorhandene Logo-Datei und Nutzungsvarianten im Repository lokalisieren
- [ ] Original-Logo in ausreichend hoher Auflösung als Ausgangsdatei bereitstellen
- [ ] Bestehende Design-Tokens, CSS und UI-Komponenten erfassen
- [ ] Ausgangszustand von Tests und Build dokumentieren

**Abnahmekriterium:** Es gibt eine nachvollziehbare Übersicht über die vorhandenen UI-Bausteine und Assets, bevor diese verändert werden.

## Phase 1 – Designsystem
**Ziel:** Ein wiederverwendbares visuelles Fundament schaffen.

- [ ] Farb-Tokens definieren (Emerald, Toxic Lime, Gold, Midnight, Cream)
- [ ] Typografie und Schrift-Hierarchie festlegen
- [ ] Button-System (Primary, Secondary, Tertiary, Disabled)
- [ ] Karten, Panels, Badges und Fortschrittsanzeigen gestalten
- [ ] Schatten, Konturen, Glow und Rundungen vereinheitlichen
- [ ] Mobile-first Raster, responsive Abstände und Touch-Zielgrößen definieren
- [ ] Fokus-, Hover-, Active- und Disabled-Zustände festlegen
- [ ] Reduced-motion-Verhalten berücksichtigen

**Abnahmekriterium:** Die wichtigsten UI-Komponenten lassen sich aus konsistenten Tokens und wiederverwendbaren Styles aufbauen und funktionieren im Smartphone-Hochformat.

## Phase 2 – Charakter- und Asset-System
**Ziel:** Eine konsistente Schlange und eine wiederverwendbare Spielwelt schaffen.

- [ ] Vorhandenes Logo exakt als Marken-Key-Visual einbinden
- [ ] Original-Logo als transparente PNG- und/oder WebP-Variante bereitstellen, ohne Motiv, Schriftzug oder Leuchteffekte zu verändern
- [ ] Transparenz sauber vom Hintergrund trennen; Leuchteffekte und feine Konturen erhalten
- [ ] Logo-Asset in geeigneter Auflösung und Format im Repository ablegen
- [ ] Benötigte Darstellungen der fünf Entwicklungsstufen spezifizieren
- [ ] Baby-, Kleinkind-, Kind-, Teenager- und Erwachsenen-Design konsistent erstellen
- [ ] Transparente Charakter-Assets und passende Posen erstellen
- [ ] Hintergrundmotive für Home, Lernansicht und Terrarium definieren
- [ ] Dekoration, Kristalle und Effekte als einzelne Assets organisieren
- [ ] Asset-Größen, Dateiformate und Ladeverhalten optimieren

**Abnahmekriterium:** Die fünf Stufen sind erkennbar dieselbe Schlange; Logo und Charakter-Assets funktionieren in echten UI-Kompositionen und nicht nur als Einzelbilder.

## Phase 3 – Screens überarbeiten
**Ziel:** Die neue Designsprache auf die vorhandenen App-Bereiche übertragen.

- [ ] Splash / Start: vollständiges vorhandenes Logo, dunkle Atmosphäre, kurzer Glow-Auftritt
- [ ] Home / Begleiter: aktuelle Schlange, klare Hauptaktion und Lernfortschritt
- [ ] Aufgaben: helle, kontrastreiche Lernfläche in dezenter Fantasy-Umgebung
- [ ] Antwort-Feedback: positive und humorvolle Reaktionen im neuen Stil
- [ ] Rundenabschluss und Belohnung: Futter, Sterne und Fortschritt visuell inszenieren
- [ ] Terrarium: atmosphärische Spielwelt, bestehende Platzierung erhalten
- [ ] Shop: Gegenstände, Preise, Kaufstatus und Aktionen vereinheitlichen
- [ ] Elternbereich: ruhige, lesbare Variante der Markenwelt
- [ ] Einführung und weitere Dialoge an das Designsystem anpassen

**Abnahmekriterium:** Alle zentralen Screens wirken wie ein zusammenhängendes Produkt und bestehende Interaktionen bleiben erhalten.

## Phase 4 – Animation und besondere Momente
**Ziel:** Das Spielgefühl veredeln, ohne die Lernaufgabe zu stören.

- [ ] Dezenter Logo-Auftritt mit Augen-/Glow-Akzent
- [ ] Charakterbewegungen und Reaktionen abstimmen
- [ ] Wachstumsübergänge zwischen den Entwicklungsstufen gestalten
- [ ] Erwachsenen-/Legendär-Freischaltung als besonderer Moment inszenieren
- [ ] Partikel und Glow sparsam für Erfolge einsetzen
- [ ] Animationen auf Dauer, Unterbrechbarkeit und Reduced Motion prüfen

**Abnahmekriterium:** Animationen sind flüssig, kurz, sinnvoll und beeinträchtigen weder Lesbarkeit noch Bedienung.

## Phase 5 – Qualitätssicherung und Abschluss
**Ziel:** Visuelle Qualität und funktionale Stabilität auf echten Geräten sicherstellen.

- [ ] Smartphone-Hochformat als primären Viewport prüfen
- [ ] Kleine und große Smartphone-Displays prüfen
- [ ] Tablet-Layouts als sekundäre responsive Ansichten prüfen
- [ ] Touch-Ziele und Drag-and-drop praktisch testen
- [ ] Kontrast, Lesbarkeit und Schriftgrößen überprüfen
- [ ] Tests ausführen
- [ ] Produktionsbuild ausführen
- [ ] Vorhandene Spielstände und Lernabläufe auf Regressionen prüfen
- [ ] Screenshots der finalen Ansichten dokumentieren
- [ ] Roadmap und Feature-Inventar aktualisieren

**Abnahmekriterium:** Der Relaunch ist visuell konsistent, im Smartphone-Hochformat gut bedienbar, auf größeren Geräten weiterhin nutzbar und ohne bekannte Regressionen.

## Entscheidungen und offene Fragen

| Thema | Entscheidung / Vorschlag | Status |
|---|---|---|
| Designstil | Luminous Fantasy Adventure | Festgelegt |
| Logo | Original unverändert, prominent im Splash | Festgelegt |
| Logo-Dateiformat | Transparente PNG- und/oder WebP-Variante zusätzlich zum Original | Festgelegt |
| Logo-Quelldatei | Hochauflösendes Original als Ausgangsdatei wird benötigt | Offen – Nutzerinput |
| Schlange | Baby bis legendäre erwachsene Form | Festgelegt |
| Aufgabenansicht | Hell und besonders gut lesbar | Festgelegt |
| Terrarium | Reichhaltigste Fantasy-Ansicht | Festgelegt |
| Primärgerät | Smartphone | Festgelegt |
| Primäre Ausrichtung | Hochformat (Portrait) | Festgelegt |
| Weitere Geräte | Tablet/Desktop responsiv unterstützen | Festgelegt |
| Schrift | Passende gut lesbare Schrift auswählen | Offen |
| Splash-Verhalten | Kurzer Auftritt, überspringbar bzw. nicht blockierend | Vorschlag |

## Änderungsprotokoll

| Datum | Änderung |
|---|---|
| 2026-11-24 | Roadmap und Designsystem initial angelegt; Arbeitsbranch erstellt |
| 2026-11-24 | Smartphone als Primärgerät und Hochformat festgelegt; transparente PNG/WebP-Logo-Variante als Asset-Aufgabe ergänzt |

## Pflege-Regeln
1. Vor jeder größeren Arbeit den aktuellen Status dieser Roadmap prüfen.
2. Aufgaben nur nach tatsächlicher Umsetzung und Prüfung abhaken.
3. Neue Erkenntnisse, Entscheidungen und Blocker direkt hier dokumentieren.
4. Änderungen an der Designrichtung zuerst in DESIGN_SYSTEM.md festhalten.
5. Änderungen an vorhandenen Funktionen zusätzlich mit FEATURES.md abgleichen.
6. Bestehende Lernlogik und Spielstände bei visuellen Arbeiten schützen.
