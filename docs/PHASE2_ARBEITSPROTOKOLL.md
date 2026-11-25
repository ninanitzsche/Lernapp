# Phase 2 – autonomes Arbeitsprotokoll

> **Branch:** `design/luminous-fantasy-adventure`
> **Stand:** 24.11.2026
> **Ziel:** Luminous-Fantasy-Assetbasis für Nicos Schlangenwelt aufbauen, ohne bestehende Spiellogik zu verändern.

## Arbeitsmodus

Phase 2 wird paketweise bis zu den definierten Abnahme-Gates bearbeitet. Visuelle Konzepte werden nicht als Produktionsdateien ausgegeben. Bestehende Dateien, Pfade und Laufzeitlogik bleiben erhalten, bis Ersatzassets geprüft und ausdrücklich freigegeben sind.

## Erledigt

- Bestandsanalyse mit 175 Bilddateien, 169 Schlangenwelt-Dateien, Charaktervarianten und Shop-Bestand dokumentiert.
- Fünf Entwicklungsstufen anhand vorhandener App-Bilder und des Logos verglichen.
- Ersten einzelnen Baby-Nico-Kandidaten als WebP mit echtem Alpha-Kanal erstellt, auf Motiv zugeschnitten und technisch geprüft (1328 × 1317 px, ca. 230 KB). Der Kandidat ist noch nicht freigegeben oder in die App integriert.
- Kanonische Nico-Referenz und siebenstufige Emotionsmatrix angelegt.
- Entwicklungsbogen präzisiert: frühe Stufen niedlich, spätere Stufen zunehmend wild, kraftvoll und legendär.
- Schlangen-Anatomie festgelegt: durchgehender Schlangenkörper, keine Beine, Flossen oder Flügel.
- Mehrere weitere Art-Direction-Konzepttafeln zu Charakterentwicklung, Emotionen, Terrarium, Dekoration, Shop und Belohnungen erstellt und in einem Konzeptpaket gebündelt; sie sind keine Laufzeitassets.
- Asset-Katalog und Produktions-Gates für Charaktere, Emotionen, Terrarium, Shop, Belohnungen und Integration angelegt.

## Aktueller Befund zu den jüngsten Charakterkonzepten

Die jüngsten Bildgenerierungen sind Konzepttafeln bzw. Einzelstudien mit eingebettetem Hintergrund. Die dargestellten Schachbrettmuster sind teilweise Bestandteil der Bildpixel und dürfen nicht als echter Alpha-Kanal interpretiert werden. Beschriftete Tafeln und Mehrfachkompositionen sind ebenfalls keine verwendbaren Charakterdateien.

Daher wurden diese Bilder nicht in `public/images` abgelegt und keine Laufzeitreferenzen geändert. Vor der Produktion der fünf neutralen Einzelassets sind saubere Einzelrenderings mit echtem transparentem Hintergrund erforderlich. Für die erwachsene/legendäre Stufe bleibt das vorhandene Logo die maßgebliche Identitätsreferenz.

## Nächste Schritte in Reihenfolge

1. Vier weitere neutrale Nico-Einzelassets für Kleinkind, Kind, Teenager und Erwachsen/Legendär erstellen; danach alle fünf visuell vergleichen und freigeben.
2. Nach Freigabe die sieben Emotionen aus diesen Basen ableiten.
3. Vorhandene Terrarium-Hintergründe und 44 Shop-Objekte vollständig visuell katalogisieren.
4. Eine schlangenspezifische Terrarium-Szene mit separaten Layern und ruhigen UI-Flächen definieren.
5. Fehlende Pflanzen-, Wurzel-, Kristall-, Nest- und Belohnungsobjekte ergänzen.
6. Asset-Katalog vervollständigen und erst danach Integration/Viewport-Checks durchführen.

## Schutz bestehender Produktfunktionen

Bis zur visuellen und technischen Freigabe gibt es keine Änderungen an Lernlogik, Fortschrittsgrenzen, Entwicklungslogik, Belohnungslogik, Shop, Speicherung oder Navigation. Keine historischen Quellen werden gelöscht, umbenannt oder überschrieben.

## Offene Qualitäts-Gates

- [ ] Fünf neutrale Nico-Einzelassets freigegeben (Baby-Kandidat technisch vorbereitet; vier Stufen offen)
- [ ] 35 Emotionsassets freigegeben
- [ ] Terrarium-Hintergrund und modulare Layer freigegeben
- [ ] Shop-/Terrarium-Objekte visuell geprüft und vereinheitlicht
- [ ] Belohnungs- und Wissensalbum-Assets erstellt
- [ ] Asset-Katalog mit technischen Daten vervollständigt
- [ ] Integration und Viewport-Prüfung abgeschlossen
