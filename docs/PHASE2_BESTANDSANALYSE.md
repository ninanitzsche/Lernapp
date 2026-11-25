# Phase 2 – Bestandsanalyse der Bildassets

> Stand: 24.11.2026  
> Branch: `design/luminous-fantasy-adventure`  
> Geprüfter Commit: `260514d66dfc13e9f57e00e7eb60a8a6bd9e4db4`  
> Umfang: visuelle Prüfung der produktiv verwendeten Charakter- und Shop-WebP-Dateien, Abgleich mit Code und Inventar des gesamten Bildbestands.

## 1. Ergebnis in Kürze

Der Bestand ist umfangreich und enthält eine brauchbare Basis. Eine komplette Neuerstellung wäre unnötig. Die fünf Entwicklungsstufen sind bereits als WebP-Standardbilder vorhanden; Baby, Kleinkind, Kind und Teenager besitzen zusätzlich je vier Ausdrucks-/Aktionsvarianten. Der erwachsenen Schlange fehlt eine solche Variantenreihe.

Die größte gestalterische Lücke ist nicht die Anzahl der Assets, sondern die **fehlende visuelle Einheitlichkeit**:
- Die jungen Nico-Stufen sind niedliche, plastische 3D-Figuren und grundsätzlich eine gute Ausgangsbasis.
- Die erwachsene Standardfigur ist freundlich und hochwertig, entspricht aber nicht eindeutig der im verbindlichen Designsystem als Key Visual festgelegten erwachsenen/legendären Logoform.
- Die Terrarium-Hintergründe zeigen derzeit eher ein schlichtes Glasbecken als die definierte Luminous-Fantasy-Schlangenwelt.
- Viele Shop-Objekte wirken im Vergleich zu Nico wie weich gemalte 2D-/Illustrationsassets statt wie Objekte derselben 3D-Spielwelt.

**Empfehlung:** Vorhandene Nico-Figuren und passende Einzelmotive bewahren. Zuerst die kanonische Charakterreferenz – besonders für die erwachsene Form – festlegen. Danach Hintergründe und Shop-Objekte gezielt vereinheitlichen, nicht pauschal ersetzen.

## 2. Inventar

Im geprüften Repository-Baum liegen:
- **175 Bilddateien** unter `public/images/` mit zusammen rund **62,2 MB**.
- Davon **169 Dateien** unter `public/images/snake/` mit zusammen rund **61,0 MB**.
- `public/images/snake/app/` enthält 66 produktionsnahe WebP-Dateien (rund 1,97 MB): 21 Charakterbilder und 45 Shop-/Terrariumassets.
- `public/images/snake/Shop/` enthält 45 ältere PNG-Quellen (rund 11,85 MB).
- `public/images/snake/opt/` enthält optimierte PNG-/WebP-Varianten der fünf Stufen.
- `public/images/snake/transparent/` enthält fünf große PNG-Dateien der fünf Stufen.
- Weitere historische/Arbeitsdateien liegen in `baby/`, `babychild/`, `child/`, `teen/` und `adult/`.

Die Dateigrößen stammen aus dem Git-Baum. Pixelmaße, Alpha-Kanal, sichtbare Randtransparenz und tatsächliche Renderqualität auf Zielgeräten sind noch nicht technisch vermessen.

## 3. Nico – Entwicklungsstufen

Die Laufzeit lädt die Bilder über `src/ui/Snake.tsx` aus `public/images/snake/app/`. Die Stufenreihenfolge ist in `src/logic/config.ts` festgelegt.

| Stufe | Vorhandener Standard | Varianten | Bewertung |
|---|---|---:|---|
| Baby | `baby-standard.webp` | 5 gesamt | Behalten. Sehr klare Baby-Proportionen, große Augen, kompakter Körper und freundlicher Ausdruck. Gute visuelle Ausgangsfigur. |
| Kleinkind | `smallChild-standard.webp` | 5 gesamt | Behalten. Gut erkennbare Weiterentwicklung: etwas längerer Hals, weniger übergroßer Kopf, weiterhin kompakte Ringform. |
| Kind | `child-standard.webp` | 5 gesamt | Grundsätzlich behalten, aber Übergang prüfen. Deutlich längerer Hals und offener Mund; die bernsteinfarbenen Augen unterscheiden sich von den grünen Augen der jüngeren Stufen. |
| Teenager | `teen-standard.webp` | 5 gesamt | Als Entwicklungsstufe brauchbar. Deutlich schlankere, längliche Silhouette. Die vorhandenen vier zusätzlichen Varianten werden aktuell im Code nicht genutzt. |
| Erwachsen | `adult-standard.webp` | 1 gesamt | Überarbeiten/abgleichen. Reife, schlanke Figur, aber die konkrete Kopf-, Augen- und Silhouettenform weicht vom Logo-Key-Visual ab. Keine zusätzlichen Gesichtsausdrücke vorhanden. |

### Code-Abgleich

- `STAGES` definiert die fünf Stufen Baby, Kleinkind, Kind, Teenager und Erwachsen.
- `bildUrl()` in `Snake.tsx` lädt die WebP-Dateien nach Stufenschlüssel und Stimmung.
- `MIT_GESICHTERN` enthält derzeit nur `baby`, `smallChild` und `child`.
- Für Teenager existieren zwar `eating`, `happy`, `surprised` und `tired`, sie werden durch diese Auswahl aber nicht verwendet; Teenager erhält derzeit nur das Standardbild.
- Für Erwachsene gibt es im App-Ordner ausschließlich `adult-standard.webp`. Reaktionen werden dort über Emoji/Overlays ergänzt.

Das ist eine konkrete, später leicht zu behebende Lücke: Teenager-Varianten entweder bewusst aktivieren und visuell prüfen oder aus dem Variantenbestand entfernen – nicht neu generieren, bevor sie verglichen wurden. Für die erwachsene Form sollte zuerst die Logo-Referenz geklärt werden.

### Visuelle Kontinuität

Positiv:
- Gemeinsame grün-gelbe Farbwelt, sichtbare Schuppenstruktur, große ausdrucksstarke Augen und plastische 3D-Anmutung.
- Die Entwicklung von kompakt/gerollt zu lang/schlank ist verständlich.
- Baby bis Teenager wirken wie eine zusammengehörige Figur.

Offen:
- Augenfarbe und Gesichtsform verändern sich zwischen Kleinkind und Kind spürbar.
- Der Sprung vom Teenager zum Erwachsenen ist stilistisch und charakterlich größer als die vorherigen Übergänge.
- Die erwachsene Form muss sich stärker am unveränderten Logo orientieren, wenn das Logo laut Designsystem tatsächlich die höchste Entwicklungsstufe definiert.

## 4. Terrarium und Umgebungen

Produktiv vorhanden sind zwei Hintergrundmotive:
- `terrarium1.webp`: dunkleres, grünes Glasbecken mit Bodenbewuchs. Gute ruhige Fläche, aber wenig räumliche Fantasy-Tiefe und keine deutliche biolumineszente Identität.
- `terrarium2.webp`: helles, warmes Becken mit Pflanzen an den Rändern. Bietet eine große freie Mitte, wirkt aber eher wie ein dekoratives Zimmer-/Pflanzenterrarium und nicht wie die definierte geheimnisvolle Schlangenwelt.

Beide Hintergründe sind als funktionale Ausgangsbasis interessant, erfüllen die Art Direction aber nur teilweise. Es fehlen insbesondere Wurzelarchitektur, Höhlen-/Nestcharakter, Kristalladern, gezielte giftgrüne Lichtquellen und eine stärkere räumliche Staffelung. UI-Flächen müssen weiterhin ruhig und lesbar bleiben.

## 5. Shop- und Terrariumobjekte

Es existieren 45 WebP-Dateien unter `public/images/snake/app/shop/`: 44 Shop-Gegenstände laut Katalog und der Standardhintergrund `terrarium1.webp`. Die Motive decken bereits viele sinnvolle Kategorien ab:
- Pflanzen: Monstera, Alocasia, Venusfliegenfallen, Zimmerpflanze.
- Strukturen: Äste, Wurzeln, Ranken, Brücken, Höhlen, Stämme.
- Wasser und Boden: Wasserfall, Brunnen, Wassernapf, Steinweg, Steinhaufen.
- Magische Elemente: Kristalle, Geode, Runenast, Leuchtpilzast, Zauberast, Goldast.

**Stärken:** gute thematische Breite, viele einzeln verwendbare Motive, kleine WebP-Dateien und eine bereits vorhandene Zuordnung über Shop-IDs.

**Gestalterische Schwächen:** Viele Objekte sind weich, hell und malerisch illustriert. Materialität, Schatten, Perspektive und Detailgrad passen nicht immer zu Nicos plastischer 3D-Oberfläche. Kristalle und Pflanzen wirken teilweise pastellig statt biolumineszent. Einige Objekte brauchen mehr Eigenständigkeit und eine klarere Silhouette vor dunklem Terrariumhintergrund.

**Empfehlung:** Motiv und Funktion zunächst behalten; je Objektgruppe entscheiden, ob eine gezielte Neuinterpretation nötig ist. Keine pauschale Neugenerierung aller 44 Motive.

## 6. Historische Dateien und Dubletten

Der Bestand enthält mehrere ältere Quell- und Arbeitsordner. Im Git-Baum wurden neun Gruppen byte-identischer Dateien anhand derselben Blob-SHA erkannt, darunter:
- vier identische Dateien im Ordner `adult/`;
- identische Baby-Standarddateien;
- identische Kleinkind- und Kind-Quellen;
- Kopien zwischen Stufenordnern, Root und `transparent/`.

Das ist zunächst nur ein Inventarbefund. **Nichts löschen oder verschieben:** Vor einer Bereinigung müssen alle Code-Referenzen, Dokumentationsverweise und mögliche externe Nutzungen geprüft werden. Die älteren Dateien sind als Quellen/Archiv wertvoll, auch wenn sie nicht produktiv geladen werden.

## 7. Priorisierte Maßnahmen

| Priorität | Maßnahme | Entscheidung |
|---|---|---|
| P0 | Kanonische Nico-Referenz je Stufe festlegen; erwachsene Form gegen Logo abgleichen | Vor weiterer Serienproduktion |
| P1 | Teenager-Ausdrucksvarianten visuell prüfen und Nutzung im Code entscheiden | Bestehende Assets nutzen, falls passend |
| P1 | Terrarium-Hintergrund als Luminous-Fantasy-Umgebung neu konzipieren | Gezielte Neuproduktion wahrscheinlich |
| P1 | Stilprüfung der 44 Shop-Objekte; repräsentative Gruppe auswählen | Motive behalten, Stil selektiv vereinheitlichen |
| P2 | Fehlende Erwachsenen-Ausdrücke definieren | Erst nach Freigabe der Erwachsenenreferenz |
| P2 | Pixelmaße, Alpha-Kanal, Beschnitt, Dateigröße und Zielauflösung technisch erfassen | Vor Integration neuer/überarbeiteter Assets |
| P3 | Historische Dubletten/Quellordner dokumentieren und ggf. später bereinigen | Nur nach Referenzprüfung |

## 8. Noch nicht geprüft

Diese Bestandsanalyse ist eine visuelle und codebezogene Prüfung der wichtigsten produktiven Assets, keine vollständige technische Asset-QA. Noch offen sind:
- automatisierte Erfassung von Breite/Höhe, Alpha-Kanal und Randtransparenz aller Dateien;
- Sichtprüfung sämtlicher 44 Shop-Objekte (bisher repräsentative Stichprobe);
- Sichtprüfung aller historischen Varianten und Screenshots;
- Prüfung auf tatsächliche Darstellung in kleinen und großen Viewports.

Diese Punkte werden im Asset-Katalog bzw. bei der späteren Integration nachgezogen.

## 9. Geprüfte Referenzen

- `docs/DESIGN_SYSTEM.md`
- `docs/PHASE2_ASSETPLAN.md`
- `docs/PHASE2_REFERENZENTWURF_A.md`
- `src/logic/config.ts`
- `src/ui/Snake.tsx`
- `src/ui/Terrarium.tsx`
- `src/ui/Shop.tsx`
- `src/logic/shop.ts`
- `public/images/logo.webp`
- `public/images/snake/app/`
- `public/images/snake/app/shop/`
- `public/images/snake/opt/`
- `public/images/snake/transparent/`

