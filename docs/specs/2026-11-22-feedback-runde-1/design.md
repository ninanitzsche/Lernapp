# Design: Feedback-Runde 1

Stand: 2026-11-24. Gehört zu `requirements.md` (Anforderungen R1 bis R7, N1 bis N9) und `tasks.md`.

## 1. Gestaltungsziele aus UX-Sicht

1. Das Kind spürt beim Üben, dass etwas passiert (Futter, Halbzeit, Serie) und erkennt bedeutsame Lernfortschritte (Meilensteine) – ohne Nutzungs- oder Zeitdruck.
2. Das Kind sieht, wie schwer eine Aufgabe ist, ohne ein Wort lesen zu müssen.
3. Das Kind fühlt sich nie dumm: Es beginnt mit Erfolg, Schweres ist ein Angebot und kein Test.
4. Eltern bekommen in unter einer Minute ein ehrliches Bild, ohne dass es im Kinderbereich Druck erzeugt.

Das visuelle System bleibt das bestehende "beleuchtete Terrarium" gemäß `docs/DESIGN_SYSTEM.md` und `docs/VISUELLES_WELTENKONZEPT.md`. Neu sind nur Bausteine, die das Feedback braucht. Es gibt keine neue Schrift und keine neuen Webfonts.

## 2. Designplan nach dem Design-Skill

### 2.1 Erster Entwurf und kritische Prüfung

Der erste Entwurf hat drei Dinge getan, die für jede Lern-App gelten würden. Die Prüfung gegen die Aufgabe (Zweitklässler, Schlange, Terrarium) hat sie ersetzt:

| Erster Entwurf | Warum er zu austauschbar war | Ersatz |
|---|---|---|
| Stufen als Sterne (1 bis 3) | Sterne zeigen schon das Können je Thema. Zwei Sternsysteme verwirren, und Sterne sind bei jeder App dasselbe. | **Schuppen.** Eine Schlange hat Schuppen. Schwierigkeit = 1 bis 3 Sechsecke, die sich wie ein Schuppenband füllen. Sterne bleiben Können, Schuppen sind Anforderung. |
| Meilenstein = Popup "Level up! Glückwunsch!" mit Konfetti | Das ist die Standardfeier jeder App und sagt nichts über die Schlange. | **Häutung.** Wachsende Schlangen häuten sich. Die Häutung bleibt die schlangenspezifische Feier für die Entwicklung der Schlange. Der Abschluss eines Lernfeldes erhält davon getrennt einen thematischen Eintrag im Wissensalbum. |
| Eltern: Ampel mit grün, gelb, rot und Balkendiagrammen | Rot am Kind wirkt wie ein Urteil, und ein Diagramm ohne Aussage hilft nicht beim Handeln. | **Sätze zuerst.** Oben ein Satz "Das hilft jetzt". Je Typ ein Schuppenband (ein bis drei gefüllte Schuppen = höchste sichere Stufe) plus ein Wort. Farbe nur als Zusatz, Wort und Symbol tragen die Aussage. |

Nach dem Austausch bleibt die Frage der Prüfung "Würde ein Designer das für jedes Kinderprodukt zeichnen?" nur noch für Konfetti und Rundungen mit Ja. Beides ist hier bewusst vorhanden, weil Kinder darauf reagieren, und gehört zum bestehenden Stil.

### 2.2 Farben (bestehende Token, nur Rollen kommen dazu)

| Name | Hex | Rolle neu |
|---|---|---|
| Moos `--nacht` | `#0f2f26` | Grund aller Kinderansichten |
| Papier `--papier` | `#fff8e6` | Halbzeit-Karte, Häutungskarte, Album, Elternbereich |
| Lime `--lime` | `#9bd93c` | Schuppe Stufe 1 (leicht), "sicher" |
| Amber `--amber` | `#ffb92e` | Schuppe Stufe 2 (mittel), Münzen |
| Lila `--lila` | `#6b4bd1` | Schuppe Stufe 3 (knifflig), Knobelrunde |
| Gedämpft `--gedaempft-papier` | `#4b5d54` | Nebentext auf Papier |

Leere Schuppen sind Umriss ohne Füllung, so unterscheiden sich 1, 2 und 3 auch ohne Farbwahrnehmung (Anforderung R1.2). Kontrastpaare werden vor der Abnahme nachgerechnet (Text auf Papier und auf Lime, Amber, Lila mindestens 4,5:1).

### 2.3 Schrift

Unverändert: systemeigene runde Schrift, Gewicht 800, keine Webfonts (N8). Maßstab: Meilensteintitel `clamp(1.8rem, 6dvh, 2.6rem)`, Rückblickzeilen 1.15rem, Elterntext 1rem mit Zeilenhöhe 1.5 und Zeilenlänge unter 70 Zeichen. Alle Texte in Satzschreibung, keine Großbuchstaben-Etiketten.

### 2.4 Layout und Ausrichtung

Kinderbereich: zentriert, eine Hauptsache pro Bildschirm, ein großer Knopf unten. Elternbereich: linksbündig, wie ein Brief, mit dem Satz "Das hilft jetzt" ganz oben.

### 2.5 Wo die Gestaltung auffallen darf (eine Sache)

Die **Häutung**: Die Schlange schiebt sich aus einer halbtransparenten alten Haut, die als Papierkarte mit Rückblick zurückbleibt. Alles andere bleibt leise: Schuppen sind klein, die Halbzeit ist eine ruhige Karte, der Elternbereich ist reiner Text.

### 2.6 Bewegung

Nur Bewegung, die auf eine Handlung antwortet: Futter fliegt zur Schlange, die Schuppe füllt sich, Häutungskarte fällt ein. `prefers-reduced-motion` ersetzt jede Bewegung durch Einblenden. Die bestehende Konfetti-Funktion (`feier.ts`) bleibt, nur Serie und Häutung rufen sie auf.

## 3. Bildschirme (Drahtgitter)

Abkürzungen: ⬡ gefüllte Schuppe, ⬢ leere Schuppe.

### 3.1 Aufgabenansicht in der Runde

```
 [<- Pause]   ▁▁▂▂▃▃▃▄▄▄   (Treppe: Stufen der Aufgaben)   🪙 3
         [ Schlange ]           
  Futter: =====>        🐭 +6
  Zahlenstrahl                ⬡⬡⬢  mittel
  +-------------------------------+
  |  Wo liegt die 37?             |
  |  ...                          |
  +-------------------------------+
```

Die Treppe ersetzt die bisherigen gleichförmigen Punkte. Jede Stufe der Treppe zeigt, wie schwer die Aufgabe ist. Erledigte Treppenstufen werden gefüllt, die aktuelle pulsiert nicht (kein Dauer-Effekt).

### 3.2 Halbzeit

```
  +-----------------------------+
  |   Halbzeit!                 |
  |   [ Schlange mampft ]       |
  |   Bisher 9 Futter           |
  |   Noch 21 bis Kleinkind     |
  |   "Fünf geschafft. Der Rest |
  |    wartet schon."           |
  |  [ Weiter ]    [ Pause ]    |
  +-----------------------------+
```

Keine Münze und kein Zwang. Der Zwischenstopp ist ein Moment des Sehens ("Wie weit bin ich?") und eine bequeme Stelle für die Pause.

### 3.3 Serien-Jubel

Eine Sprechblase der Schlange über der Aufgabe, drei Sekunden, mit Konfetti. Sie blockiert nichts: Die Aufgabe ist weiter bedienbar.

### 3.4 Häutung (Meilenstein)

```
  +-------------------------------+
  |        [ Schlange schlüpft ]  |
  |   Häutung Nr. 4                |
  |   "Ich bin wieder gewachsen!"  |
  |   Ein neuer Entwicklungsschritt|
  |   🪙 +1 Münze                  |
  |        [ Weiter ]             |
  +-------------------------------+
```

Die Häutung feiert die Entwicklung der Schlange. Sie ist vom Wissensalbum für gemeisterte Lernfelder getrennt; reine Nutzungsdauer oder Übungstage sind kein Ziel.

### 3.5 Wissensalbum

Das Wissensalbum sammelt die abgeschlossenen Lernfelder. Jeder Abschluss erhält einen eigenen Eintrag mit einer besonders schönen, thematisch gestalteten Illustration der Schlange und den fünf verdienten Sternen. Das Album ist die dauerhafte Sammlung der Lernerfolge; seine Einträge bleiben erhalten, unabhängig davon, welche Auszeichnungen gerade im Terrarium platziert sind.

### 3.6 Abschluss eines Lernfeldes

Der Abschluss ist ein eigener Moment und wird nicht mit der Häutung für Schlangenwachstum verwechselt:

```
  +--------------------------------+
  |       [ besondere Schlange ]   |
  |   Zahlenstrahl gemeistert!     |
  |   ★ ★ ★ ★ ★                   |
  |   Dein Themenbild ist im       |
  |   Wissensalbum.                |
  |   [ Zahlen-Kompass erhalten ]  |
  |          [ Weiter ]            |
  +--------------------------------+
```

Das Themenbild zeigt die Schlange in einer eigens gestalteten Szene passend zum Lernfeld. Der Pokal/Orden ist ein eigener Gegenstand für die frei gestaltbare Terrarium-Sammlung und zugleich der Schlüssel zu den passenden Relikten.

### 3.7 Elternbereich (neuer oberer Teil)

```
  Bereich für Erwachsene
  Das hilft jetzt
  Nina übt am besten Nachbarzehner. Tipp: Zeigt gemeinsam an
  Alltagszahlen (Hausnummer, Seitenzahl) den Zehner davor
  und danach.

  Testbereitschaft (Schätzung aus der App, kein Testergebnis)
  Test in 2 Tagen
  Zehner und Einer    fast bereit
  Zahlbilder          bereit
  Zahlenstrahl        noch üben

  Aufgabentypen
  Zahlwörter und Zahlen   ⬡⬡⬢ mittel   fast sicher   wird besser
  ...
  Meilensteine: 10 Runden (14.12.), Kleinkind (03.12.) ...
```

Das bisherige Transparenzpapier-Table bleibt erhalten (darunter), weil es das Lernziel zuordnet.

## 4. Spielwerte (alle in `src/logic/config.ts`, Startwerte)

### 4.1 Futter je Stufe

| Stufe | richtig im 1. Versuch | richtig im 2. Versuch | falsch |
|---|---|---|---|
| 1 leicht | 2 | 1 | 0 |
| 2 mittel | 2 | 1 | 0 |
| 3 knifflig | 5 | 3 | 0 |

Stufe 1 und 2 zahlen bewusst gleich viel wie heute: Das Kind verliert nichts, und leichte Aufgaben sind kein "Betrug". Knifflig zahlt zweieinhalbmal so viel (R4.1). Der Rundenbonus ist 5 in der normalen Runde und 10 in der Knobelrunde (R4.2). Serie: +1 Futter einmal pro Runde (R3.5, R3.6).

Beispielrechnung (Mittel über viele Runden, gleich richtig, Tageslimit dreimal): normale Runde 10 Aufgaben mit 10 mal 2 = 20 plus Bonus 5 = 25 (wie bisher). Knobelrunde: 2 Aufwärmaufgaben zu 2 plus 8 kniffelige zu 5 = 44 plus Bonus 10 = 54, rund zweimal so viel wie eine normale. Bei nur 7 von 10 gleich richtig sinkt sie auf etwa 35 bis 40, bleibt aber über der normalen Runde.

### 4.2 Schwellen der Entwicklung

| Stufe | Name | bisher | neu |
|---|---|---|---|
| 1 | Baby | 0 | 0 |
| 2 | Kleinkind | 60 | 30 |
| 3 | Kind | 150 | 90 |
| 4 | Teenager | 300 | 200 |
| 5 | Erwachsen | 500 | 350 |

Bei etwa 25 Futter pro Runde: Kleinkind in der zweiten Runde des ersten Tages (R3.2), Kind nach etwa vier Runden, Teenager nach etwa acht, Erwachsen nach etwa 14 Runden. Eine Schlange, die schon höher war, bleibt höher (Schwellen sinken nur).

### 4.3 Sonstige neue Werte

```
leichtRunden: 3               // so lange nur Stufe 1 (R2.1)
rampeNormal: [1,1,1,1,2,2,2,2,2,2]
rampeKnobel: [2,2,3,3,3,3,3,3,3,3]
halbzeitNach: 5
serieAb: 3, serieFutter: 1
rundenBonus: { normal: 5, knobel: 10 }
knobelMuenzen: 2
knobelErfolg: { ersteStarkeRunde: 1, treffer: { 10: 1, 25: 2, 50: 3 } }   // Münzen; Treffer = kniffelige Aufgaben gleich richtig, insgesamt
ampel: { fenster: 10, minVersuche: 5, sicherQuote: 0.8, sicherMinMittel: 3, uebenQuote: 0.5, uebenFalschMax: 0.2 }
```

Die Münzwerte der Knobelerfolge entsprechen der Tabelle in `requirements.md` Abschnitt 8 (erste starke Knobelrunde 1, dann 10, 25, 50 Treffer mit 1, 2, 3 Münzen). Das ergibt höchstens 7 Münzen. "Starke Knobelrunde" heißt wie bisher mindestens 7 von 10 im ersten Versuch. Reine Rundenzahl und Wochenziele lösen keine Belohnung aus.

Anmerkung zur Wirtschaft: Belohnungen honorieren Lernfortschritt und freiwillige Expertenherausforderungen, nicht die reine Nutzungsmenge. Der Shop hat Dinge zu 1 bis 3 Münzen. Das sind spürbare, aber keine inflationären Zugaben. Nach dem Praxistest prüfen, ob der Shop leer gekauft wird.

## 5. Leichte Varianten der Aufgabentypen (R2.10)

Leitregel: kleinere Zahlen, keine Zehnergrenzen-Fallen, keine Terme, eine Denkhandlung, Eingabe möglichst durch Antippen. Die genauen Zahlenbereiche stehen als Konstanten im Code und werden mit Tests auf Einhaltung geprüft.

| Typ | Leicht (Stufe 1) | Mittel (Stufe 2) | Knifflig (Stufe 3) |
|---|---|---|---|
| A1 Zahlwörter | Ankreuzen, Zahlen bis 30 | wie heute | wie heutige Knobelvariante |
| A2 Stellentafel | Zahl bis 50, ein Feld offen | wie heute | wie heute (Terme, beide Felder) |
| A3 Zahlenreihen | Einerschritte vorwärts, bis 30 | wie heute | Schrittweite 2, 5, 20, vorwärts und rückwärts |
| B1 Zahlbild lesen | Zahlen bis 40 | wie heute | wie heute |
| B2 Zahlbild legen | Zahlen bis 40 | wie heute | "1 mehr als" |
| B3 Vergleichen | zwei Zahlen bis 50, kein Term | wie heute | wie heute |
| C1 Zahl auf dem Strahl | nur Zehnerzahlen, Toleranz 5 | wie heute | Toleranz 2 |
| C2 Ablesen | markierte Zehnerzahl am Strahl 0 bis 100 | wie heute | Teilstrahl |
| C3 Vorgänger, Nachfolger | Zahlen 2 bis 29, keine Zehnergrenze | wie heute | an Zehnergrenzen |
| C4 Nachbarzehner | keine Zehnerzahl, 11 bis 49 | wie heute | öfter Zehnerzahlen |

Die genauen Texte und Hinweise jeder leichten Variante werden beim Bauen an die bestehenden Generatoren angelehnt. Die Schreibweise der Zahlwörter bleibt unverändert und durch die bestehenden Tests abgesichert.

## 6. Datenmodell (additiv, Version bleibt 1)

Neue optionale Felder in `GameState`. Fehlende Felder erhalten beim Laden Standardwerte (N7).

```ts
type Stufe = 1 | 2 | 3

// Task bekommt:  stufe: Stufe          (fehlt in Altdaten: gilt als 2)
// RoundAnswer:   stufe?: Stufe         (fehlt: 2)

interface Versuch { o: Outcome; s: Stufe }

interface Rueckblick {
  runden: number          // abgeschlossene Runden insgesamt
  tage: number            // Tage mit mindestens einer Runde
  aufgaben: number        // gelöste Aufgaben insgesamt (richtig, erster oder zweiter Versuch)
  quote: number           // Anteil gleich richtig beim ersten Mal, 0 bis 1
  staerkstesThema: Topic | null
}

interface Meilenstein {
  id: string              // 'entwicklung-2', 'stern-A-2', 'thema-multiplikation', 'knobel-10' ...
  art: 'entwicklung' | 'stern' | 'thema' | 'knobel'
  datum: string           // JJJJ-MM-TT
  rueckblick: Rueckblick
  muenzen: number         // Münzen, die dieser Meilenstein gebracht hat
}

// GameState erhält:
verlauf: Record<TaskType, Versuch[]>      // letzte 10 je Typ
statistik: { bearbeitet: number; geloest: number; ersteTreffer: number; knobelTreffer: number }
meilensteine: Meilenstein[]
```

Das Münzkonto (`verdiente` in `shop.ts`) rechnet weiter `Sterne + bonusMuenzen`. Neue Münzen aus Meilensteinen werden zu `bonusMuenzen` addiert. Dadurch ändert sich `shop.ts` nicht.

## 7. Logik

Neue reine Module, jeweils mit Test zuerst:

- `stufen.ts`: `rampeFuer(knobel, position)`, `stufeFuerAufgabe(...)`, `hoechsteStufe(lernstand, abgeschlosseneRunden)`, `lernstandNach(level, outcome, stufe)` (Regeln R2.6 und R2.7). `rundenbau.ts` baut die zehn Aufgaben einer Runde.
- `belohnung.ts`: `futterFuer(outcome, stufe)`, `serieErkannt(antworten)`, `halbzeitErreicht(index, bereitsGezeigt)`.
- `meilensteine.ts`: `pruefeMeilensteine(vorher: GameState, nachher: GameState, now)` gibt neue Meilensteine mit Rückblick und Münzen zurück. `nachtragen(state)` für Altstände ohne Feier (R5.7).
- `lernstand.ts` (Elternbereich): `typEinschaetzung(verlauf)`, `trend(verlauf)`, `themaBereitschaft(...)`, `empfehlung(...)`, 

Geänderte Module: `config.ts` (Werte), `tasks.ts` (Stufe in `Task`, Generatoren nehmen eine Stufe statt `schwer`, `generateTask(type, rng, stufeOderSchwer)` bleibt rückwärtskompatibel), `game.ts` (`finishRound` nutzt Stufen und ruft die Meilensteine auf, `parseState` und `initialState` kennen die neuen Felder), `runde.ts` (Wiederholungen mit Stufe, Parser mit Standardstufe 2), `shop.ts` (unverändert).

Reihenfolge in `finishRound`: Futter und Lernstand berechnen, Verlauf aktualisieren, dann Meilensteine prüfen und deren Münzen auf `bonusMuenzen` addieren. `RoundSummary` bekommt `meilensteine: Meilenstein[]`, `knobelFutter: number`, `serienFutter: number`.

Die Serie wird in der Runde (UI) erkannt und als `serienFutter` in die `RoundAnswer`s eingerechnet (Feld `serieBonus?: boolean` an der dritten Antwort), damit die Pause-Wiederaufnahme stimmt. Die Halbzeit merkt sich `halbzeitGezeigt` im `RundenStand` (optionales Feld, fehlt in Altständen als false).

## 8. Komponenten (neu und geändert)

| Datei | Änderung |
|---|---|
| `src/ui/Schuppen.tsx` (neu) | Zeigt 0 bis 3 gefüllte Schuppen als SVG, Text für Screenreader, Größen klein und mittel |
| `src/ui/Treppe.tsx` (neu) | Fortschrittsleiste mit Stufenhöhen |
| `src/ui/Halbzeit.tsx` (neu) | Zwischenstopp-Karte |
| `src/ui/Haeutung.tsx` (neu) | Feierkarte mit Rückblick, nacheinander mehrere |
| `src/ui/Album.tsx` (neu) | "Meine Häute" |
| `src/ui/Round.tsx` | Rampe, Schuppen, Treppe, Halbzeit, Serie |
| `src/App.tsx` | Ansicht `album`, Häutungen nach dem Ergebnis, Themenkarte mit Stufe |
| `src/ui/Parent.tsx` | Neuer oberer Teil (Empfehlung, Bereitschaft, Typenliste, Verlauf) |
| `src/ui/reaktion.ts` | Neue Sprüche: `halbzeit`, `serie`, `haeutung` (mindestens je 6 Varianten) |
| `src/index.css` | Stile für die neuen Bausteine, ohne Scrollen (N3) |

## 9. Textbausteine (Auszug, lustig, nie "ey")

Halbzeit: "Fünf geschafft. Ich hab schon Hunger auf die nächsten." / "Halbzeit! Ich lege mich kurz in die Sonne." / "Mmh, das war lecker. Bereit für Teil zwei?"
Serie: "Drei hintereinander! Ich glaub, ich verschlucke mich." / "Das Futter fliegt nur so herein!" / "Dreimal Volltreffer. Du bist heiß."
Häutung: "Zeit für eine neue Haut. Die alte war mir eh zu eng." / "Raschel, raschel. Ich bin schon wieder gewachsen." / "Meine alte Haut hebe ich für dich auf."
Stufen (Kind): leicht, mittel, knifflig. Beim ersten Sehen der Schuppen erklärt die Schlange einmal: "Je mehr Schuppen, desto kniffliger. Dafür gibt's mehr Futter."
Eltern: Sachlich und freundlich, ohne Fachjargon. Beispiele stehen in `tasks.md`, Aufgabe "Empfehlungstexte".

Tipps für zu Hause je Typ (für "Das hilft jetzt", beim Bauen einmal fachlich gegenlesen): Zahlwörter (Einer vor Zehner sprechen und aufschreiben), Stellentafel (Zahlen auf Zettel in Zehner und Einer zerlegen), Zahlenreihen (laut weiterzählen, auch rückwärts), Zahlbilder (mit Münzen oder Büroklammern Zehnerbündel legen), Vergleichen (zwei Zahlen würfeln, größer oder kleiner sagen), Zahlenstrahl (Strahl mit Zehnerstrichen auf Papier zeichnen), Vorgänger und Nachfolger (Hausnummern der Nachbarn), Nachbarzehner (Zehner davor und danach an Hausnummern und Seitenzahlen).

## 10. Migration und Rückwärtsverträglichkeit

- `parseState`: neue Felder optional, Standardwerte wie in `initialState`. Eine Datei aus der alten Version lädt, die Statistik beginnt bei null.
- `nachtragen(state)` schreibt für schon erreichte Zustände Meilensteine mit `muenzen: 0` und ohne Feier ein, damit nichts nachgefeiert und keine Münze doppelt vergeben wird.
- `parseRunde`: fehlende Stufe an Aufgaben gilt als 2, fehlendes `halbzeitGezeigt` als false (N9).
- Die gesenkten Wachstumsschwellen können nur nach oben wirken (Schlange kann bei bestehendem Stand eine Stufe höher erscheinen). Das ist beabsichtigt. Eine Altschlange, die dadurch beim Öffnen wächst, bekommt keine nachträgliche Feier, aber der Meilenstein wird mit `muenzen: 0` eingetragen.

## 11. Offene Punkte

1. **Noch offen: konkrete Kompetenzdefinition je Stern.** Festgelegt sind fünf aufeinanderfolgende Sterne pro Lernfeld und ein ausgewogener Kompetenznachweis. Welche konkreten Teilkompetenzen und Nachweiskriterien die einzelnen Sterne eines Lernfeldes repräsentieren, wird noch mit der Stakeholderin abgestimmt. Bis dahin keine Schwellen oder fachlichen Bewertungsregeln erfinden.
2. **Noch offen: Testbereitschaft.** Die Kriterien und Berechnung der Testbereitschaft im Elternbereich sind noch nicht freigegeben. Keine bestehenden Diskussionswerte als Produktregel implementieren.
3. Die konkreten Münzwerte und Wachstumsschwellen sind Startwerte und können nach Praxiserfahrung angepasst werden.
4. Das Symbol der Schuppe und die Häutung-Animation brauchen eine eigene Zeichnung. Falls später eigene Bilder entstehen, bleibt die Schnittstelle gleich.
5. Der Vite-Build und die visuelle Prüfung laufen nur auf dem Mac der Projektinhaberin. Layout für kleine Höhen (N3) muss dort geprüft werden.

## 12. Verbindliche Entscheidungen aus dem Stakeholder-Interview

Diese Entscheidungen ergänzen die bestehende Feedback-Spezifikation. Sie beschreiben das gewünschte Produktverhalten, nicht die technische Umsetzung der Aufgabenlogik.

### 12.1 Sterne und Kompetenz

- Sterne stehen für **nachgewiesene Kompetenz**, nicht für Fleiß, Zeit oder bloßes Ausprobieren.
- Jedes Lernfeld hat **fünf Sterne**.
- Die Sterne werden zwingend in Reihenfolge verdient. Ein höherer Stern setzt alle vorherigen Sterne voraus.
- Anspruchsvollere Aufgaben dürfen jederzeit ausprobiert werden. Sie überspringen jedoch keinen Stern.
- Ein ausgewogener Kompetenznachweis ist gewünscht: Das Kind soll eine Fähigkeit zuverlässig bei unterschiedlichen Aufgabenstellungen und über mehrere Übungsrunden hinweg zeigen. Es ist keine Mindestanzahl an Spieltagen vorgesehen.
- Fehler während des Lernens nehmen bereits verdiente Sterne nicht weg.
- Die genaue Zuordnung der fünf Sterne zu Teilkompetenzen und die fachlichen Nachweiskriterien je Lernfeld bleiben offen, bis sie mit der Stakeholderin abgestimmt sind.

### 12.2 Hilfe und Belohnung

- Ein **Denkimpuls** ist ausdrücklich erwünscht. Die Aufgabe darf weiterhin zum Kompetenznachweis beitragen. Für diese Aufgabe erhält das Kind eine Münze weniger für das Terrarium.
- Die bestehenden Funktionen „Hilfe anzeigen“ und „bei falscher Antwort die richtige Lösung anzeigen“ bleiben erhalten.
- Eine angezeigte Lösung ist kein selbstständiger Kompetenznachweis. Das Kind kann die Kompetenz später bei einer vergleichbaren Aufgabe selbstständig zeigen.
- Die vorhandene Aufgaben-, Wiederholungs-, Hilfs- und Auswertungslogik bleibt in der Verantwortung von Claude Code. Dieses Interview gibt keine Erlaubnis, sie neu zu erfinden oder unabhängig von der bestehenden Implementierung zu verändern. UX-Anforderungen werden als gewünschtes Verhalten formuliert; technische Umsetzung und fachliche Details prüft Claude Code anhand des Repositories.

### 12.3 Lernfortschritt sichtbar machen

- Die Fortschrittsdarstellung kombiniert **Schlange und Wissensalbum**.
- Das Kind sieht klar, welche Kompetenz als Nächstes ansteht, ergänzt durch eine sichtbare Fortschrittsanzeige.
- Fortschrittsanzeigen müssen auf tatsächlich verfügbaren Lerninformationen beruhen. Keine scheinpräzisen Prozentwerte oder Fortschrittsstände erfinden.
- Die Schlange macht Entwicklung emotional sichtbar; das Wissensalbum bewahrt die Lernerfolge dauerhaft.

### 12.4 Abschluss eines Lernfeldes und Terrarium

- Nach fünf verdienten Sternen gilt ein Lernfeld als gemeistert und wird sichtbar als abgeschlossen gekennzeichnet.
- Für den Abschluss erhält das Kind einen eigenen Eintrag im Wissensalbum mit einer besonders schönen Illustration der Schlange passend zum Thema sowie einen thematisch passenden Pokal oder Orden.
- Das Terrarium ist eine **frei gestaltbare Sammlung**: Das Kind entscheidet, wo es Pokale, Orden und Dekorationen platziert. Auszeichnungen können verschoben werden; die vollständige Sammlung bleibt unabhängig von der aktuellen Platzierung erhalten.
- Ein gemeistertes Lernfeld bleibt jederzeit normal spielbar. Es gibt dort keine erneuten Sterne oder dieselbe Abschlussauszeichnung. Die App darf neue, noch nicht gemeisterte Lernfelder als nächste Möglichkeit sichtbar machen.

### 12.5 Relikte – kleiner freiwilliger Expertenbereich

- Relikte sind ein **Randfeature**, kein eigener großer Spielmodus und keine Pflicht.
- Der Bereich wird erst sichtbar, wenn mindestens ein Lernfeld abgeschlossen wurde.
- Der Pokal des abgeschlossenen Lernfeldes ist der Türöffner und öffnet die dazugehörigen Relikte.
- Relikte greifen bekannte Inhalte bzw. Aufgaben auf und bieten anspruchsvollere Varianten, um bereits Gelerntes auf Expertenniveau zu festigen. Die bestehende Aufgabenlogik bleibt dabei maßgeblich.
- Für Relikt-Herausforderungen gibt es Terrariummünzen.
- Relikte vergeben ausdrücklich keine Sterne, Pokale, Medaillen oder Kompetenz-Auszeichnungen. Sie verändern den regulären Lernfortschritt nicht.
