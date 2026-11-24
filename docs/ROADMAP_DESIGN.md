# Design-Roadmap – Luminous Fantasy Adventure

> **Projekt:** Nico's Snake App  
> **Arbeitsbranch:** design/luminous-fantasy-adventure  
> **Status:** Phase 0 dokumentiert (Build-Verifikation eingeschränkt). Designsystem dokumentiert, erste Umsetzung am Splash vorhanden, vollständige Umsetzung offen  
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
- [x] Aktuelle Screens und Komponenten im Branch erneut inventarisieren (siehe [PHASE0_INVENTAR.md](./PHASE0_INVENTAR.md))
- [x] Vorhandene Logo-Datei im Repository lokalisiert: public/images/logo.webp
- [x] Transparenzfähigkeit und Bildränder des vorhandenen Logos prüfen: technisch gemessen (kein Alpha-Kanal, Hintergrund uneinheitlich) und visuell an einer Vorschau betrachtet. Details in PHASE0_INVENTAR.md, Abschnitt 5.
- [ ] **Zurückgestellt (Entscheidung 2026-11-24):** Transparente PNG- und/oder WebP-Variante des Logos. Es existiert **keine saubere Variante**. Das einfache Testverfahren wirkte in einer betrachteten Vorschau unsauber. Wird separat und später entschieden. Für den Splash gilt Weg 3 (Original auf dunklem Hintergrund), siehe Entscheidungstabelle.
- [x] Bestehende Design-Tokens, CSS und UI-Komponenten erfassen
- [x] Ausgangszustand von Tests und Build dokumentieren, mit Einschränkung beim Build. Tests 144 von 144 und Typprüfung grün (Sandbox). Build: **Artefakte vorhanden, Konsolenausgabe nicht verifiziert.** Die `dist/`-Artefakte (Zeitstempel 2026-11-24 10:34) sind ein Indiz, aber kein vollständiger Nachweis eines erfolgreichen Builds. Zur vollständigen Verifikation fehlt die Konsolenausgabe von `npm run build` (Exit-Code, Warnungen). Beobachtung: `dist/` ist 78 MB groß, weil `public/images/` ungefiltert kopiert wird (PHASE0_INVENTAR.md, Abschnitt 6).

**Abnahmekriterium:** Es gibt eine nachvollziehbare Übersicht über die vorhandenen UI-Bausteine und Assets, bevor diese verändert werden. Die Logo-Variante ist visuell geprüft und für den vorgesehenen Einsatz geeignet.

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
- [ ] Vorhandene Datei public/images/logo.webp als Originalquelle verwenden
- [ ] Geprüfte transparente Logo-Variante bereitstellen, sofern die Hintergrundfreistellung qualitativ sauber gelingt
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
| Logo-Quelle | public/images/logo.webp im Branch vorhanden | Gefunden |
| Transparente Logo-Variante | Es existiert keine saubere Variante. Wird separat und später entschieden. Optionen: Matting-Verfahren, oder Quelldatei mit Transparenz neu exportieren | Zurückgestellt, wichtig laut Projektinhaber |
| Logo im Splash | Weg 3: Original unverändert mit eingebranntem dunklem Hintergrund auf dunklem Splash, keine Transparenz nötig | Freigegeben (2026-11-24) |
| Primärgerät | Smartphone | Festgelegt |
| Primäre Ausrichtung | Hochformat (Portrait) | Festgelegt |
| Weitere Geräte | Tablet/Desktop responsiv unterstützen | Festgelegt |
| Schlange | Baby bis legendäre erwachsene Form | Festgelegt |
| Aufgabenansicht | Hell und besonders gut lesbar | Festgelegt |
| Terrarium | Reichhaltigste Fantasy-Ansicht | Festgelegt |
| Schrift | Atkinson Hyperlegible Next (2025) Regular 400 und Bold 700 für Aufgaben, Zahlen und Fließtext. Nunito ExtraBold 800 für Überschriften und Belohnungstitel. Lokal ausliefern, keine externen Requests, OFL-Lizenzdateien mitführen. "Next" vom Projektinhaber bestätigt. Siehe PHASE0_INVENTAR.md, Abschnitt 9 | Freigegeben durch Projektinhaber (2026-11-24). Noch nicht implementiert. Zeichensatz (Umlaute, ß) vor Einbindung zu prüfen |
| Splash-Verhalten | Kurzer Auftritt, überspringbar bzw. nicht blockierend | Vorschlag |

## Änderungsprotokoll
| Datum | Änderung |
|---|---|
| 2026-11-24 | Roadmap und Designsystem initial angelegt; Arbeitsbranch erstellt |
| 2026-11-24 | Smartphone als Primärgerät und Hochformat festgelegt |
| 2026-11-24 | Vorhandenes Logo unter public/images/logo.webp gefunden; transparente Ableitung als Prüfaufgabe dokumentiert |
| 2026-11-24 | Phase 0: Inventar von Ansichten, Komponenten, CSS und Assets erstellt. Logo hat keinen Alpha-Kanal, keine saubere transparente Variante vorhanden. Tests 144/144 und Typprüfung grün. Build: Artefakte vorhanden, Konsolenausgabe nicht verifiziert. Sichtprüfung offen |
| 2026-11-24 | Korrekturen nach Review: Status in DESIGN_SYSTEM.md differenziert (Designsystem dokumentiert, erste Umsetzung am Splash seit `c8d10e2`, vollständige Umsetzung offen). Logo-Prüfung in technische Analyse und visuelle Betrachtung getrennt. Konflikt Futter-Schwellen (FEATURES.md 0/60/150/300/500 gegen config.ts 0/30/90/200/350, Änderung durch `10686bd`) dokumentiert, keine Logikänderung |
| 2026-11-24 | Entscheidungen: Logo im Splash Weg 3 freigegeben. Schriftempfehlung (Atkinson Hyperlegible 400/700, Nunito 800, lokal, OFL) als Designentscheidung zur Freigabe dokumentiert, nicht implementiert |
| 2026-11-24 | Klarstellung und Freigabe Schrift: Atkinson Hyperlegible Next ist vom Projektinhaber zusammen mit Nunito freigegeben. Offizielles Google Fonts README ergänzt: Next enthält zusätzliche Zeichen, verbesserte Glyphen und verbessertes Kerning; sechs aufrechte und kursive Gewichte; Version 2.001 vom 20.11.2024; SIL OFL 1.1. Umlaute und ß in den konkret eingebundenen Dateien vor Implementierung weiterhin prüfen |

## Pflege-Regeln
1. Vor jeder größeren Arbeit den aktuellen Status dieser Roadmap prüfen.
2. Aufgaben nur nach tatsächlicher Umsetzung und Prüfung abhaken.
3. Neue Erkenntnisse, Entscheidungen und Blocker direkt hier dokumentieren.
4. Änderungen an der Designrichtung zuerst in DESIGN_SYSTEM.md festhalten.
5. Änderungen an vorhandenen Funktionen zusätzlich mit FEATURES.md abgleichen.
6. Bestehende Lernlogik und Spielstände bei visuellen Arbeiten schützen.
