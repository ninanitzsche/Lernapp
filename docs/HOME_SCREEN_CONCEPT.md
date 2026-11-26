# Home-Screen-Konzept – Smartphone-first

> **Status:** UX-Spezifikation freigegeben; erster React/CSS-Prototyp implementiert, visuelle Abnahme und Produktionsassets weiterhin offen  
> **Gültig für:** Phase 2 · Mathematik / Nico / Schlangenwelt  
> **Arbeitsbranch:** `design/phase2-visual-foundation`  
> **Leitdokumente:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md) · [PHASE2_ASSETPLAN.md](./PHASE2_ASSETPLAN.md) · [REWARD_SYSTEM.md](./REWARD_SYSTEM.md)

## 1. Ziel und Geltungsbereich

Dieses Dokument übersetzt das abgeschlossene Home-Interview vom 26.11.2026 in eine konkrete Smartphone-Komposition. Es ist eine visuelle und UX-Spezifikation, keine Produktionsfreigabe und keine Änderung der Spiellogik.

Die bestehende Home-Funktionalität bleibt erhalten: Runde starten bzw. pausierte Runde fortsetzen, Themen/Buch, Album, Shop, Relikte (nur wenn freigeschaltet), „Wie geht das?“ und „Für Erwachsene“.

**Technische Leitlinie:** Die einfachste robuste Lösung hat Vorrang. Ein responsives CSS-Grid/Flex-Layout mit wenigen klaren Ebenen genügt. Keine komplexe freie Positionierung, keine künstliche 3D-Parallaxe und keine zusätzliche Scroll- oder Animationslogik nur für die Inszenierung.

## 2. Visuelle Hierarchie

Die Aufmerksamkeit folgt dieser Reihenfolge:

1. **Nico** – größte Figur und emotionaler Mittelpunkt.
2. **Hauptaktion** – „Runde starten“ bzw. der vorhandene Fortsetzen-Text; direkt unter Nicos Plattform.
3. **Lernfelder** – drei bis fünf aktuell relevante Themen, als kleine Gruppen von Holzschildern entlang des Weges.
4. **Sekundäre Weltzugänge** – Themenübersicht, Album, Shop und gegebenenfalls Relikte als erkennbare, anklickbare Objekte.
5. **Hilfszugänge** – „Wie geht das?“ und „Für Erwachsene“ klein und ruhig am unteren Rand.

Nico und Hauptaktion erhalten die stärkste visuelle Gewichtung. Sekundäre Objekte konkurrieren nicht mit ihnen.

## 3. Smartphone-Komposition

Die Home-Ansicht wird zuerst für ein schmales Smartphone im Hochformat gestaltet. Die folgenden Bereiche sind eine inhaltliche Reihenfolge und keine pixelgenauen festen Koordinaten:

### A. Oberer Weltbereich – Orientierung und Atmosphäre

- Die Szene beginnt unmittelbar in Nicos vertrautem, gemütlichem Lebensraum.
- Der Hintergrund öffnet sich nach oben/hinten in eine geheimnisvolle, leuchtende Abenteuerlandschaft.
- Die Umgebung ist eindeutig schlangenspezifisch: kräftige Wurzeln, Höhlen, Äste, geschützte Nischen, Moos, Farne, Ranken, Pilze, Wasser und gezielte Kristallakzente.
- Mittlere Naturdichte: dekorative Details rahmen die Inhalte, freie Flächen bleiben für echte UI verfügbar.
- Keine fest eingebrannten Texte, Sterne, Buttons oder interaktiven Zustände im Hintergrundbild.

### B. Nico-Plattform – emotionaler Mittelpunkt

- Nicos aktuelle Entwicklungsstufe sitzt/ruht groß und gut sichtbar auf einer natürlichen, moosbewachsenen Wurzel- oder Steinplattform.
- Nico blickt neugierig in die Abenteuerwelt; die Pose wirkt ruhig und zugewandt, nicht wie eine Kampf- oder Aktionspose.
- Die Plattform ist Teil der Umgebung. Nico bleibt ein separates Charakterasset mit transparentem Hintergrund.
- Für die Darstellung wird die zur Laufzeit ermittelte Entwicklungsstufe verwendet. Die aktuelle Datei `child-standard.webp` ist nur eine vorhandene Arbeitsreferenz, keine pauschale Festlegung für alle Kinder und keine finale Produktionsfreigabe.
- Das Charakterasset wird nicht in das Hintergrundbild eingebrannt.

### C. Hauptaktion – direkt unter Nico

- Der echte UI-Button „Runde starten“ sitzt unmittelbar unter der Plattform.
- Wenn eine Runde pausiert ist, bleibt der vorhandene Fortsetzen-Zustand und dessen dynamische Beschriftung erhalten.
- Der Button muss als primäre Aktion sofort erkennbar, mit dem Daumen erreichbar und mindestens so groß wie das bestehende Touch-Target-Token sein.
- Button, Beschriftung, Fokuszustand und Interaktion bleiben React/CSS; keine Bildgrafik.

### D. Lernpfad – drei bis fünf Themen

- Drei bis fünf Lernfeld-Schilder werden in kleinen Gruppen entlang eines sichtbaren Weges angeordnet.
- Auf schmalen Viewports dürfen die Schilder in ein einfaches responsives Raster umbrechen. Die Reihenfolge folgt der individuellen Lernpriorität; keine fest für alle Kinder gleiche Themenliste.
- Es erscheinen nur aktuell verfügbare bzw. freigeschaltete Lernfelder. Gesperrte Felder werden nicht als graue Vorschau gezeigt.
- Jedes Schild ist ein echtes Bedienelement und startet beim Antippen direkt die nächste passende Runde dieses Lernfelds; kein zusätzlicher Vorschau-Zwischenschritt.
- Direkt unter jedem Schild stehen genau fünf Kompetenzsterne in einer horizontalen Reihe: verdiente Sterne gold, offene Sterne dezente Umrisse.
- Sterne zeigen nachgewiesene Kompetenz, nicht Übungsmenge. Es gibt keine globale Home-Fortschrittsanzeige. Nicos Futter und Wachstum bleiben davon getrennt.
- Die vollständige Übersicht bleibt über einen gut erkennbaren Zugang „Alle Themen“ erreichbar.

### E. Sekundäre Weltobjekte

Sekundäre Bereiche erscheinen als passende Objekte in der Welt und nicht als zusätzliche untere Icon-Leiste:

| Bereich | Visuelle Metapher | Sichtbarkeit / Verhalten |
|---|---|---|
| Alle Themen | gut lesbares Weg- oder Themenportal / markanter Wegweiser | dauerhaft auffindbarer Zugang zur vollständigen Themenübersicht |
| Album | geöffnetes, sammelbares Buch oder Buchstation | öffnet das bestehende Album |
| Shop | Truhe oder kleiner Marktstand | öffnet den bestehenden Shop; vorhandene Münzanzeige bleibt verständlich |
| Relikte | geheimnisvolle Relikttür / Portal | nur anzeigen, wenn `reliktBereichSichtbar(state)` wahr ist; erst nach Themenabschluss gemäß bestehender Spiellogik |

Die Objekte werden je nach Bedeutung unterschiedlich stark hervorgehoben. Sie müssen als klickbare UI-Elemente umgesetzt werden; reine Dekoration darf nicht wie ein Button aussehen. Objektgrafik und Interaktionsfläche bleiben getrennt.

### F. Hilfszugänge

- „Wie geht das?“ und „Für Erwachsene“ bleiben als ruhige, gut lesbare Textlinks verfügbar.
- Sie dürfen optisch zurücktreten, aber nicht in dekorativen Objekten versteckt werden.
- Ein fälliger Sicherungshinweis bleibt am Erwachsenen-Zugang erkennbar.

## 4. Responsive Verhalten

- **Smartphone Hochformat:** vertikale Komposition in der oben beschriebenen Reihenfolge; Lernschilder in einem einfachen Raster, sekundäre Objekte in einer kompakten, gut erreichbaren Anordnung.
- **Breiteres Smartphone:** mehr Luft und gegebenenfalls vier bis fünf Lernschilder gleichzeitig, ohne Nico oder den Startbutton zu verkleinern.
- **Tablet/Desktop:** dieselben Inhaltsgruppen dürfen in Spalten bzw. breiteren Grid-Flächen angeordnet werden. Es entsteht keine zweite, abweichende Informationsarchitektur.
- Keine wichtige Aktion darf ausschließlich durch Hover erreichbar sein.
- Die existierenden 48-px-Touch-Targets aus Phase 1 sind einzuhalten.

## 5. Bewegung und Ansprache

- Nico hat eine ruhige Grundpose.
- Nur gelegentliche subtile Bewegung und kontextbezogene Reaktionen; keine dauerhafte Idle-Animation, die Aufmerksamkeit bindet.
- Direkte Ansprache nur situationsbezogen, z. B. bei Rückkehr, neuem Lernabschnitt oder besonderem Erfolg.
- Reduced Motion respektieren; die Ansicht muss auch ohne Animation vollständig verständlich sein.

## 6. Asset-Aufteilung

Die Szene wird bewusst in getrennte, wiederverwendbare Teile zerlegt:

1. **Hintergrund:** schlangenspezifische Welt mit freier Ruhezone für UI; keine Texte und keine interaktiven Props.
2. **Nico:** freigestelltes, separates Charakterasset in der aktuellen Entwicklungsstufe.
3. **Plattform / Vordergrund:** separat oder als Teil des Hintergrunds, sofern sie keine dynamischen Zustände benötigt.
4. **Lernschilder:** separate, wiederverwendbare Schildgrafiken; Titel und fünf Sterne werden als echte UI gerendert.
5. **Sekundäre Weltobjekte:** einzelne Grafiken für Themenübersicht, Album, Shop und Relikte; Interaktionsflächen bleiben HTML-Buttons.
6. **Effekte:** sparsame CSS-/Motion-Akzente; keine neue Animationsabhängigkeit.

Bestehende Charakterdateien und das Logo bleiben unangetastet. Die kanonische Identität und offenen Korrekturen stehen ausschließlich in [PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md).

## 7. Umsetzungsstand und offene Punkte vor Produktionsfreigabe

Der erste Smartphone-first-Prototyp ist in `src/App.tsx` und `src/index.css` umgesetzt. Er bildet die Inhaltsreihenfolge, echten Navigationsaktionen und die getrennten Kompetenzsterne ab. Die Gestaltung verwendet vorerst vorhandene Nico-/Terrarium-Assets und CSS-Flächen; sie ist ausdrücklich noch keine finale Luminous-Fantasy-Art-Direction. Die Weltobjekte sind aktuell typografisch/emoji-basierte Platzhalter und müssen durch freigegebene Einzelgrafiken ersetzt werden. Die Lernfeldreihenfolge folgt vorerst der zentralen Liste in `src/logic/tasks.ts`, weil es noch keine eigene individuelle Home-Priorisierung gibt.

- [ ] Die konkrete Hintergrundkomposition visuell freigeben.
- [ ] Nico-Platzierung mit den freigegebenen fünf Entwicklungsstufen prüfen; die endgültigen Einzelbilder sind noch nicht alle freigegeben.
- [ ] Lernschilder, Sternanzeige und sekundäre Weltobjekte als Stilpaket abstimmen.
- [ ] Kontrast und Lesbarkeit der echten UI auf dem Hintergrund im Smartphone-Viewport prüfen.
- [ ] Einzelne Produktionsassets exportieren und im Asset-Katalog mit Maßen, Format, Transparenz, Dateigröße und Status erfassen.
- [ ] Den Prototyp nach Asset-Freigabe visuell überarbeiten und in Smartphone-, Tablet- und Desktop-Viewports prüfen; bestehende Navigation und Spiellogik unverändert erhalten.

## 8. Abnahmekriterien

- Nico ist der klare Mittelpunkt und bleibt in jeder Entwicklungsstufe dieselbe Schlange.
- Die Hauptaktion steht direkt unter Nicos Plattform und ist sofort auffindbar.
- Drei bis fünf relevante Lernfelder sind klar lesbar; jedes hat seine eigenen fünf Kompetenzsterne.
- Sekundäre Bereiche sind als echte Weltobjekte verständlich und erreichbar; Relikte erscheinen nur nach Freischaltung.
- Keine globale Kompetenzanzeige, keine gesperrten Vorschau-Schilder und keine eingebrannten UI-Elemente.
- Smartphone-Hochformat funktioniert ohne unnötige Scroll- oder Positionierungslogik.
- Tablet und Desktop nutzen dieselbe Informationsarchitektur responsiv.
- Alle bestehenden Funktionen bleiben erhalten.
