# Phase 2 – Asset- und Charakterproduktion

> **Projekt:** Nico's Snake App  
> **Branch:** `design/luminous-fantasy-adventure`  
> **Verbindliche Art Direction:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)  
> **Roadmap:** [ROADMAP_DESIGN.md](./ROADMAP_DESIGN.md)  
> **Visuelle Weltenstrategie:** [VISUELLES_WELTENKONZEPT.md](./VISUELLES_WELTENKONZEPT.md)  
> **Status:** Phase 2 aktiv; Bestandsanalyse, kanonische Nico-Arbeitsreferenzen und direkter Bildvergleich dokumentiert. Die visuelle Freigabe des Charakter-/Stilpakets ist noch offen. Siehe [PHASE2_REFERENZENTWURF_A.md](./PHASE2_REFERENZENTWURF_A.md), [PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md), [PHASE2_NICO_BILDVERGLEICH.md](./PHASE2_NICO_BILDVERGLEICH.md) und [PHASE2_NICO_EMOTIONSMATRIX.md](./PHASE2_NICO_EMOTIONSMATRIX.md).

## 1. Ziel

Eine konsistente, wiederverwendbare Bildwelt für Luminous Fantasy Adventure aufbauen. In dieser Phase ausschließlich die schlangenspezifische Mathematik-Welt rund um Nico produzieren. Langfristig sind weitere eigenständige Fachwelten mit eigenen tierischen Begleitern und Lebensräumen vorgesehen; siehe VISUELLES_WELTENKONZEPT.md.

Diese Phase produziert Bildassets und verbindliche visuelle Referenzen. Sie ersetzt keine UI durch gerenderte Screenshots und verändert weder Lernlogik noch Navigation, Speicherung, Shop- oder Terrarium-Mechanik.

## 2. Verbindliche visuelle Leitplanken

- Stylized 3D Fantasy Game Art mit plastischen Formen und räumlicher Tiefe.
- Biolumineszente Fantasy: gezielte giftgrüne Lichtakzente, magische Pflanzen und Kristalle.
- Warme, hochwertige Mobile-Game-Anmutung mit Goldakzenten.
- Nico bleibt über alle Entwicklungsstufen dieselbe Figur: Gesicht, Augen, Silhouette und Farbwelt müssen verwandt bleiben.
- Die Mathematik-Umgebung muss schlangenspezifisch sein (Wurzeln, Höhlen, Nester, Äste, Schuppen, Häutung, passende Pflanzen und Requisiten), nicht bloß generische Fantasy mit Schlangenmotiven.
- Weitere Fächer erhalten langfristig eigene Tiercharaktere und Themenwelten; Phase 2 produziert dafür ausdrücklich noch keine Assets.
- Das vorhandene Logo ist die Referenz für die erwachsene/legendäre Form und bleibt unverändert.
- Einheitliche Lichtquelle, Materialqualität, Perspektive, Proportionen und Detailgrad über alle Asset-Gruppen.
- Aufgaben und interaktive UI bleiben echte responsive React-/CSS-Komponenten; keine Texte oder Buttons in Bildassets einbetten.
- Glow, Partikel und starke Effekte gezielt einsetzen, nicht flächendeckend.

## 3. Bestand – vor Neuproduktion berücksichtigen

Im Branch existiert bereits eine Bildbasis unter `public/images/`:

- `public/images/logo.webp`: bestehendes Original-Logo; unverändert lassen.
- `public/images/snake/snake-baby.png`
- `public/images/snake/snake-smallChild.png`
- `public/images/snake/snake-child.png`
- `public/images/snake/snake-teen.png`
- `public/images/snake/snake-adult.png`
- `public/images/snake/app/`: WebP-Charakterdarstellungen und Ausdrucks-/Aktionsvarianten für mehrere Entwicklungsstufen.
- Weitere Unterordner unter `public/images/snake/`, darunter `baby`, `babychild`, `child`, `teen`, `adult`, `transparent`, `Shop` und `opt`.

Vorhandene Assets werden nicht pauschal ersetzt oder gelöscht. Insbesondere sind Dateinamen, Formate, Transparenz, tatsächliche Verwendung im Code und Bildqualität vor jeder Migration zu prüfen. Die vorhandenen Charaktere bilden den Ausgangspunkt; neue Motive müssen sich an ihnen und am Original-Logo orientieren, nicht eine unabhängige Schlange erfinden.

## 4. Stil-Referenzpaket – erster Freigabeschritt

Vor einer größeren Asset-Serie wird ein kleines Referenzpaket erstellt und vom Projektinhaber visuell freigegeben. Es besteht aus vier Motivgruppen:

1. **Nico:** repräsentative Darstellung der bestehenden Figur; eine klare Standardpose, konsistente Gesichtsmerkmale und Material-/Lichtreferenz. Keine neue Charakteridentität.
2. **Terrarium / Umgebung:** eine repräsentative Luminous-Fantasy-Szene mit Tiefe, Pflanzen, Kristallen und ruhigen Flächen, in denen UI später lesbar platziert werden kann.
3. **Spielobjekte / Shop:** drei bis fünf zusammengehörige Einzelobjekte (z. B. Kristall, Pflanze, Futter, Dekoration) mit einheitlicher Perspektive, Beleuchtung und Maßstab.
4. **Belohnung:** eine kleine Belohnungskomposition aus Schuppe/Münze/Glow als Referenz für Material, Wertigkeit und Effektstärke.

Die Referenzen sind Konzept-/Asset-Vorlagen, keine fertigen Screens. Nach Freigabe werden benötigte Assets einzeln und mit produktionsgerechtem Zuschnitt erstellt.

## 5. Asset-Gruppen und Reihenfolge

| Reihenfolge | Gruppe | Geplieferte Inhalte | Verwendung |
|---|---|---|---|
| 1 | Charakter-Referenz | Nico-Standardpose, Silhouette, Material- und Lichtregeln | gemeinsame Figurenbasis |
| 2 | Entwicklungsstufen | Baby, Kleinkind, Kind, Teenager, Erwachsen/legendär; Abgleich und gezielte Lücken schließen | Home, Terrarium, Entwicklung |
| 3 | Umgebung | Terrarium-Hintergrund und modulare Szenenbausteine | Terrarium, später Home |
| 4 | Objekte | Pflanzen, Äste, Steine, Kristalle, Futter und Shop-Objekte | Terrarium, Shop |
| 5 | Belohnungen | Schuppen, Münzen, Freischaltungsobjekte, dezente Effekte | Feedback, Ergebnis, Album |
| 6 | Screen-Hintergründe | erst nach Referenzfreigabe: Home und Lernansicht | Phase 3 vorbereiten |

Die Lernansicht erhält nur so viel Hintergrundgrafik, wie die Lesbarkeit der Aufgabe zulässt. Reichhaltige Szenen sind primär für Terrarium und ausgewählte Home-/Belohnungsmomente vorgesehen.

## 6. Produktions- und Ablageregeln

- Jedes Asset erhält einen eindeutigen, sprechenden Dateinamen und einen dokumentierten Einsatzzweck.
- Charaktere und freigestellte Objekte benötigen transparenten Hintergrund, sofern sie in mehreren UI-Kompositionen verwendet werden.
- Umgebungen werden separat von Figuren und UI exportiert.
- Keine Texte, Zahlen, Buttons, Preise oder interaktiven Zustände in Illustrationen einbetten.
- Originale/Quellen nicht überschreiben; neue Fassungen versioniert und mit klarer Zuordnung ablegen.
- Bevorzugt WebP für fotografisch/3D-artige Rastergrafiken; PNG nur, wenn es für Transparenz oder Qualitätsanforderungen sinnvoll ist. Tatsächliche Dateigrößen und Alpha-Kanal prüfen.
- Bildabmessungen auf den konkreten UI-Einsatz abstimmen; keine unnötig großen Rohbilder in den Produktions-Build übernehmen.
- Vor dem Löschen, Umbenennen oder Verschieben bestehender Bilder sämtliche Code-Referenzen und mögliche externe Nutzungen prüfen.
- Asset-Katalog mit Dateipfad, Motiv, Entwicklungsstufe/Variante, Format, Abmessungen, Transparenz, Dateigröße, Status und Verwendung pflegen.

## 7. Abnahmekriterien

Das Stil-Referenzpaket ist freigabefähig, wenn:

- Nico klar als dieselbe Figur wie im vorhandenen Bestand und im Logo erkennbar bleibt;
- die vier Motivgruppen sichtbar dieselbe Art Direction, Lichtführung, Perspektive und Materialwelt teilen;
- keine generierten UI-Texte oder Bedienelemente enthalten sind;
- die Motive in einer realistischen Smartphone-Komposition funktionieren;
- die Lerninhalte auf hellen, ruhigen Flächen lesbar bleiben;
- der Projektinhaber die visuelle Richtung ausdrücklich freigegeben hat.

Einzelne Assets gelten erst nach Prüfung von Transparenz, Zuschnitt, Auflösung, Dateigröße und tatsächlicher Darstellung in der App als integriert/verifiziert.

## 8. Offene Produktionsschritte

- [x] Vorhandene Charakterdateien visuell direkt vergleichen und Bestandsanalyse dokumentieren ([PHASE2_BESTANDSANALYSE.md](./PHASE2_BESTANDSANALYSE.md)).
- [x] Kanonische Arbeitsreferenzen und Kontinuitätskriterien für alle fünf Nico-Stufen dokumentieren ([PHASE2_NICO_REFERENZ.md](./PHASE2_NICO_REFERENZ.md)); die visuelle Endfreigabe bleibt offen.
- [x] Alle fünf Standardstufen, das Logo und die Teenager-Ausdrucksvarianten direkt visuell vergleichen und Befunde dokumentieren ([PHASE2_NICO_BILDVERGLEICH.md](./PHASE2_NICO_BILDVERGLEICH.md)).
- [x] Gemeinsame Charakteridentität und siebenstufige Emotionsbibliothek für alle fünf Entwicklungsstufen definieren ([PHASE2_NICO_EMOTIONSMATRIX.md](./PHASE2_NICO_EMOTIONSMATRIX.md)).
- [x] Erste visuelle Emotionskonzepte für alle fünf Stufen mit sieben Zuständen als Gesamtübersicht explorieren; die Grundrichtung wurde vom Projektinhaber positiv bestätigt. Die Übersicht bleibt Konzept, nicht Produktionsfreigabe.
- [x] Erste Art-Direction-Exploration für Terrarium, Spielobjekte und Belohnung erzeugen und dokumentieren (Referenzentwurf A; noch nicht freigegeben).
- [ ] Referenzentwurf A gemeinsam mit kanonischer Nico-Referenz prüfen und visuell freigeben.
- [x] Zweite Nico-Konzeptiteration anhand des Feedbacks prüfen: erste Übersicht als bessere Basis bestätigt; späte Stufen müssen deutlich weniger niedlich und stärker majestätisch/gefährlich werden. Schlangen-Anatomie ohne Flossen, Beine oder Flügel verbindlich festgelegt.
- [x] Zweite visuelle Konzeptübersicht der fünf neutralen Entwicklungsstufen erstellen und als bevorzugte aktuelle Richtung dokumentieren; Einzelassets und finale Freigabe bleiben offen.
- [ ] Fünf neutrale Einzelreferenzen ausarbeiten: Baby süß, Kleinkind verspielt, Kind mutiger, Teenager wild/elegant, Erwachsen/legendär imposant und logo-nah. Konzentration freundlich-nachdenklich halten.
- [ ] Kanonische Bildfassungen nach visueller Freigabe final festlegen; offene Lücken je Stufe schließen.
- [ ] Einzelassets in freigegebener Art Direction erstellen.
- [ ] Asset-Katalog und technische Übergabe für Claude Code pflegen.
- [ ] Integration, Optimierung und Viewport-Prüfung durch Claude Code / Projektinhaber begleiten.

## 9. Abgrenzung

Die spätere fachübergreifende Lernplattform und Bildungsserver-basierte Aufgabenerstellung sind nicht Gegenstand dieser Asset-Phase. Die Bildwelt soll langfristig weitere Fächer tragen können, aber Phase 2 baut zunächst die visuelle Identität und Asset-Basis des bestehenden Produkts aus.
