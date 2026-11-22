# Mathe-Schlange (Lern-Tamagotchi) - Design

> Datum: 2026-11-22
> Status: ENTWURF, wartet auf Freigabe durch Nina
> Ziel: Ein Zweitklässler übt den Zahlenraum bis 100 in kurzen Runden. Jede gute
> Übungsrunde füttert seine Schlange, die dadurch wächst. Der Schwerpunkt liegt auf
> dem Tamagotchi- und Belohnungsprinzip. Die Mathematik dahinter muss stimmen.

## 1. Kontext

- Auslöser: Transparenzpapier zum Mathe-Test am Dienstag, 24.11.2026 (Lehrwerk mit
  Zahlbildern, Buch S. 14-21, Arbeitsheft S. 8, 9, 11, dazu Anton-App-Links).
- Realistisch ist V1 NICHT rechtzeitig für diesen Test fertig. Sie dient den Folgethemen
  und dem langfristigen Üben. Für den Test selbst zählen Buch, Arbeitsheft und Anton.
- Entscheidungen: komplett eigenständige App (Stand-alone, nicht in FamilyBoard), V1 nur die
  drei Testthemen, Workflow Superpowers (Spec, Plan, TDD).
- Dieses Spec liegt vorerst in FamilyBoard. Der Code entsteht in einem neuen, eigenen Projektordner
  (Vorschlag: `/Users/ninanitzsche/aipm/MatheSchlange`). Die Schlangen-Bilder werden dorthin
  kopiert, nicht verschoben, damit FamilyBoard unverändert bleibt.
- Vorhandene Assets (`public/images/snake/`): fünf transparente Entwicklungsstufen
  (`baby`, `smallChild`, `child`, `teen`, `adult`) sowie Shop-Bilder (Terrarium, Äste,
  Pflanzen, Kristalle). Die Shop-Bilder sind erst V2.
- Hinweis: Die Schlangen-Bilder sind im Repo noch nicht eingecheckt (untracked bzw. umgezogen).
  Vor dem Anlegen eines Worktrees müssen sie committet werden, sonst fehlen sie dort.

## 2. Nicht-Ziele (V1)

- Keine KI zur Laufzeit, kein Chat, keine freien Texteingaben des Kindes an ein Modell.
- Kein Login, keine Cloud-Synchronisierung, keine Anbindung an Supabase.
- Kein Shop, keine Terrarium-Einrichtung, keine Sounds.
- Kein Zeitdruck, keine Ranglisten, kein Vergleich mit anderen Kindern.
- Keine Kopie von Grafiken oder Aufgabentexten aus dem Schulbuch (Urheberrecht).
  Zahlbilder und Zahlenstrahl werden vom Code selbst gezeichnet.

## 3. Pädagogische Leitplanken

Diese Leitlinien stützen sich auf Forschung, die vor dem Bau gegengelesen werden sollte:

- Abrufübungen und verteiltes Üben gehören zu den wirksamsten Lerntechniken
  (Dunlosky et al., 2013, Psychological Science in the Public Interest). Daraus folgen
  kurze Runden, Wiederholung von Fehlern und mehrere Tage statt eines Lernmarathons.
- Belohnungen können die innere Motivation untergraben, wenn sie als Kontrolle erlebt
  werden (Deci, Koestner & Ryan, 1999, Psychological Bulletin). Daraus folgen: Belohnt wird
  Fortschritt und Anstrengung, nicht Tempo. Die Schlange wächst, sie bestraft aber nie.
- Annahme, zu prüfen: Für 7-8-Jährige sind kleine, sofort sichtbare Erfolge wichtiger als
  lange Ziele. Das prüft ihr gemeinsam im Praxistest (siehe Abschnitt 11).

## 4. Das Tamagotchi-Prinzip

### 4.1 Kernschleife

1. Kind öffnet die App und sieht seine Schlange (Name vom Kind gewählt, beim Start).
2. Kind startet eine Übungsrunde (10 Aufgaben, ca. 3-5 Minuten).
3. Richtige Antworten erzeugen "Futter" (Leckerli-Punkte). Die Schlange frisst am Rundenende.
4. Genug Futter lässt die Schlange wachsen: neue Stufe, kurze Feier.
5. Ein Wochenziel ersetzt den klassischen Streak (siehe 4.5).

### 4.2 Futter-Regeln

| Ergebnis einer Aufgabe | Futter |
|---|---|
| Richtig im ersten Versuch | 2 |
| Richtig im zweiten Versuch (nach einem Hinweis) | 1 |
| Falsch im zweiten Versuch | 0, die Lösung wird anschaulich gezeigt, kein Abzug |

- Rundenbonus: +5 Futter, wenn alle 10 Aufgaben bearbeitet wurden (belohnt das Dranbleiben).
- Tageslimit: Die ersten 3 Runden pro Tag geben Futter. Danach: "Deine Schlange ist
  satt. Bis morgen!" Weiterüben ist erlaubt, bringt aber kein Futter. Das schützt vor
  Dauer-Spielen und fördert verteiltes Üben.
- Alle Werte stehen zentral in einer Konfigurationsdatei und sind leicht änderbar.

### 4.3 Wachstumsstufen

| Stufe | Bild | Futter gesamt ab |
|---|---|---|
| 1 Baby | `transparent/snake-baby.png` | 0 |
| 2 Kleinkind | `transparent/snake-smallChild.png` | 60 |
| 3 Kind | `transparent/snake-child.png` | 150 |
| 4 Teenager | `transparent/snake-teen.png` | 300 |
| 5 Erwachsen | `transparent/snake-adult.png` | 500 |

Bei maximal 3 Runden mal bis zu 25 Futter pro Tag wäre Stufe 5 theoretisch nach etwa
7 Tagen erreichbar, bei regelmäßigem Üben realistisch nach etwa 2-3 Wochen. Die Schwellen
sind Startwerte und werden nach dem Praxistest angepasst.

### 4.4 Stimmung (rein kosmetisch)

Die Stimmung leitet sich aus der Zeit seit der letzten Fütterung ab:

- unter 24 Stunden: froh
- 24 bis 48 Stunden: hungrig ("Deine Schlange freut sich auf eine Runde")
- über 48 Stunden: schläft und wartet auf dich

Wichtig: Die Schlange verliert NIE Wachstum, wird nicht krank und stirbt nicht. Ein
echtes Tamagotchi bestraft Vernachlässigung. Bei einem Lernspiel für Kinder wäre das
kontraproduktiv und erzeugt Druck statt Lust zum Üben.

Umsetzung ohne neue Bilder: Die Stufenbilder bleiben statisch. Die Stimmung wird über
CSS-Animationen (atmen, wippen, wackeln) und kleine Partikel (Herzen, Zzz, Futter)
gezeigt. Eigene Gesichtsvarianten sind V2 (Prompt-Paket liegt in `docs/snakean-prompt-paket.md`).

### 4.5 Wochenziel statt Streak

- Ziel: an 3 verschiedenen Tagen pro Woche (Montag bis Sonntag) mindestens eine Runde.
- Belohnung beim Erreichen: einmalig +20 Futter und ein Stern in der Wochenübersicht.
- Verpasste Tage kosten nichts. Es gibt keine Serie, die reißen kann.

### 4.6 Test-Fit

Für jedes der drei Themen zeigt die App 0 bis 3 Schuppen-Sterne (statt Prozentwerten).
Die Berechnung steht in Abschnitt 6. Optional kann Nina ein Testdatum eintragen und
sieht dann "Noch X Tage bis zum Test" im Elternbereich (nicht beim Kind, um keinen Druck
zu erzeugen).

## 5. Aufgabentypen (Katalog V1)

Zahlenraum 0 bis 100. Alle Aufgaben haben genau eine richtige Antwort bzw. eine definierte
Toleranz. Jeder Typ ist ein eigener reiner Generator (siehe Abschnitt 8).

### Thema A: Zehner und Einer

| ID | Aufgabe | Eingabe |
|---|---|---|
| A1 | Zahlwort in Zahl umwandeln ("siebenunddreißig" gibt 37) und umgekehrt (Zahl gibt Zahlwort aus Wortkarten wie "sieben", "und", "dreißig") | Antwort wählen bzw. Karten ordnen |
| A2 | Zahl in Stellentafel (Z, E) eintragen; aus Z und E die Zahl bilden; Terme wie 90 + 2 gibt 92 | Zifferneingabe |
| A3 | Zahlenreihe fortsetzen: in Einerschritten vorwärts und rückwärts, in Zehnerschritten (5, 15, 25, ...) | Zahl eingeben |

Zahlwort-Referenz (von Nina, gilt als Testgrundlage):
- 1 bis 10: eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn
- 11 bis 19: elf, zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn
- Zehnerzahlen: zwanzig, dreißig (mit ß), vierzig, fünfzig, sechzig, siebzig, achtzig, neunzig, hundert
- Gemischte Zahlen: 21 = einundzwanzig (ein statt eins), 53 = dreiundfünfzig, 99 = neunundneunzig
- Wortkarten sind dreiteilig: Einer, "und", Zehner (zum Beispiel "sieben", "und", "dreißig").

Hinweis zu A1: Im Deutschen werden die Einer vor den Zehnern gesprochen. Die Wortbildung
braucht eigene Regeln für Sonderformen: ein (nicht "eins"), sechzig, siebzig, dreißig.
Das ist der häufigste Fehlerquelle und bekommt eigene Tests.

### Thema B: Zahlbilder

| ID | Aufgabe | Eingabe |
|---|---|---|
| B1 | Zahlbild (Zehnerstangen und Einerpunkte) als Zahl lesen | Zahl eingeben |
| B2 | Zahl als Zahlbild legen | Tippen: + Zehner, + Einer, entfernen |
| B3 | Zahlen bzw. Zahlbilder mit <, > oder = vergleichen; 3 bis 4 Zahlen der Größe nach ordnen | Auswahl bzw. Antippen |

Hinweis: In der Test-Übersicht stehen für Zahlbilder die Buchaufgaben 3, 4, 6, 7, 8. Die
Rechenaufgaben mit Wegwischen und Dazumalen (Buchaufgaben 9 bis 11) sind nicht Teil der
Testliste und deshalb erst V2.

### Thema C: Zahlenstrahl bis 100

| ID | Aufgabe | Eingabe |
|---|---|---|
| C1 | Zahl auf einem Zahlenstrahl 0 bis 100 platzieren (Zehner und Einer mit Strichen) | Antippen/Ziehen |
| C2 | Markierten Punkt am Zahlenstrahl ablesen (auch Teilstrahlen wie 30 bis 50) | Zahl eingeben |
| C3 | Vorgänger und Nachfolger nennen | zwei Zahlen eingeben |
| C4 | Nachbarzehner nennen (14 hat die Nachbarzehner 10 und 20) | zwei Zahlen eingeben |

Randfall C4: Zehnerzahlen sind mit dabei (Entscheidung Nina). Annahme, noch zu bestätigen:
Bei einer Zehnerzahl sind die Nachbarzehner der Zehner davor und danach (50 hat 40 und 60).
Bei allen anderen Zahlen sind es der Zehner darunter und darüber (14 hat 10 und 20).
Die Zahlen 0 und 100 werden für C4 nicht erzeugt, weil ihnen ein Nachbar fehlt. Diese Regel
bekommt eigene Tests.

## 6. Fehlerbehandlung und Lernmodell

- Jede Aufgabe hat zwei Versuche. Nach dem ersten Fehler gibt es einen Hinweis in einfacher
  Sprache und mit Bild (zum Beispiel wird beim Zahlbild die Stange farbig umrahmt). Nach
  dem zweiten Fehler zeigt die App die Lösung mit Erklärung.
- Falsch bearbeitete Aufgaben kommen am Rundenende noch einmal vor (max. 3 pro Runde),
  zunächst in leicht veränderter Form (andere Zahl, gleicher Typ).
- Lernstand pro Aufgabentyp als Stufe 0 bis 3 (vereinfachtes Leitner-Prinzip):
  richtig im ersten Versuch +1, falsch -1, nie unter 0 und nie über 3.
- Aufgabenauswahl pro Runde (10 Aufgaben): ca. 60 Prozent aus Typen mit Stufe 0 oder 1,
  30 Prozent aus Stufe 2, 10 Prozent Wiederholung beherrschter Typen.
- Test-Fit eines Themas: Stern 1 ab Stufe 1 bei mindestens der Hälfte der Typen, Stern 2 bei
  allen Typen Stufe 2, Stern 3 bei allen Typen Stufe 3.
- Modus "Themenwahl": Das Kind kann auch ein einzelnes Thema üben, Standard ist "Mix"
  mit mindestens einer Aufgabe je Thema.

## 7. UX-Leitplanken

- Kurze Aufgabentexte, wenig Leseaufwand. Optionales Vorlesen über die Browser-Sprachausgabe
  (Web Speech API, Deutsch). Muss in V1 funktionieren oder sauber ausblendbar sein.
- Große Berührflächen (mindestens 48 px), ruhiges Layout, ein Ziel pro Bildschirm.
- Kein Timer, keine Countdown-Anzeige, keine roten Fehlermeldungen. Falsch bedeutet "nochmal
  schauen", nicht "Fehler".
- Kontrast und Lesbarkeit nach der vorhandenen Datei `docs/superpowers/specs/2026-08-09-ux-contrast-audit.md`.
- Eltern-Ansicht (hinter einer einfachen Rechenaufgabe, nicht geheim): Lernstand je
  Aufgabentyp, Anzahl Runden, Testdatum setzen, Fortschritt zurücksetzen, Export/Import.

## 8. Technik

- Eigenständiges Projekt, unabhängig von FamilyBoard: eigenes Repo bzw. eigener Ordner,
  eigenes Deployment, kein Supabase, kein Login, kein Router nötig (eine Seite mit Ansichten).
- Stack wie im Repo: React, TypeScript, Vite, vitest.
- Speicherung: `localStorage` mit Versionsnummer im Schema und Export/Import als JSON-Datei.
  Es werden keine personenbezogenen Daten übertragen. Der Name der Schlange bleibt lokal.
- Aufgabengeneratoren sind reine Funktionen mit einem Zufallsgenerator mit Seed.
  Dadurch sind Tests reproduzierbar.
- Zustandslogik (Futter, Stufe, Stimmung, Wochenziel, Lernstand) liegt in reinen Funktionen
  ohne React, analog zu `src/lib/gamification.ts`.
- Zeit wird injiziert (Funktionsparameter), damit Stimmung und Wochenziel testbar sind.
- Zahlbilder und Zahlenstrahl als SVG, vom Code gezeichnet.
- Als PWA nutzbar (vorhandenes `vite-plugin-pwa`). Das ist optional für V1.

## 9. Abnahmekriterien

Mathematik (automatisch getestet, vitest):

1. Für jeden Aufgabentyp erzeugen 1000 Zufallsaufgaben (verschiedene Seeds) nur gültige
   Aufgaben: Zahl im Bereich, genau eine richtige Antwort, Distraktoren verschieden und
   ungleich der Lösung.
2. Zahlwort-Generator: bekannte Beispiele stimmen, darunter 21 (einundzwanzig), 30 (dreißig),
   60 (sechzig), 70 (siebzig), 81 (einundachtzig), 99 (neunundneunzig) und alle Zahlen von
   13 bis 19. Die Rückwärtsumwandlung (Wort zu Zahl) ist für alle Zahlen 1 bis 100
   umkehrbar.
3. Vorgänger/Nachfolger und Nachbarzehner sind für alle Zahlen im erlaubten Bereich korrekt,
   Randfälle (0, 1, 99, 100) sind definiert und getestet.
4. Vergleiche mit Termen (zum Beispiel 80 + 6 gegen 90 - 6) berechnen das richtige Zeichen.
5. Zahlenstrahl: Platzierungstoleranz ist definiert und getestet (exakt bei Einerstrich,
   plus/minus 1 Strich bei Zehnerstrahl).

Spielmechanik (automatisch getestet):

6. Futter, Rundenbonus und Tageslimit entsprechen Abschnitt 4.2.
7. Stufenwechsel treten genau an den Schwellen aus 4.3 auf.
8. Stimmung wechselt genau an 24 und 48 Stunden. Das Wachstum sinkt nie.
9. Wochenziel zählt 3 verschiedene Tage, Montag bis Sonntag, und gibt den Bonus nur einmal
   pro Woche.
10. Lernstand bleibt zwischen 0 und 3, Aufgabenauswahl folgt der Verteilung in Abschnitt 6
    (statistischer Test mit Toleranz).

Bedienung (manuell, mit dem Kind):

11. Das Kind startet ohne Hilfe eine Runde und versteht, wofür das Futter ist.
12. Eine Runde dauert im Mittel 3 bis 5 Minuten.
13. Das Kind will freiwillig an mindestens 3 verschiedenen Tagen üben (Beobachtung über
    eine Woche, ohne Zwang).

## 10. Plan-Skizze (Details im nächsten Schritt)

1. Reine Logik: Zahlwörter, Generatoren (A1 bis C4), Tests zuerst.
2. Spiel-Logik: Futter, Stufen, Stimmung, Wochenziel, Lernstand.
3. Oberfläche: Schlangenansicht, Aufgabenansichten (je Thema), Runde, Feier, Eltern-Ansicht.
4. Praxistest mit dem Kind, Werte nachjustieren.
5. V2: Shop und Terrarium, Gesichtsvarianten, Rechenaufgaben aus Buch 9 bis 11.

## 11. Offene Fragen an Nina

Geklärt am 2026-11-22: Stand-alone-App (1), Zehnerzahlen bei Nachbarzehnern mit dabei (2, die
genaue Regel steht in Abschnitt 5 und braucht noch Bestätigung), Zahlwort-Referenz (3).

Noch offen:

1. Passt die Regel, dass 50 die Nachbarzehner 40 und 60 hat?
4. Soll es einen Elternbereich mit Rechenaufgaben-Sperre geben oder reicht ein einfacher Button?
5. Nina hat nur Fotos der Buchseiten 14 bis 21, nicht die Arbeitsheft-Seiten 9 und 11. Bitte
   Fotos nachliefern, damit die Aufgabentypen vollständig abgedeckt sind.

## 12. Quellen

- Transparenzpapier zum Mathe-Test am 24.11.2026 (Upload, 1 Seite).
- Fotos Lehrwerk S. 14 bis 21 (Upload).
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013).
  Improving Students' Learning With Effective Learning Techniques. Psychological Science in
  the Public Interest, 14(1), 4-58.
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments
  examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin,
  125(6), 627-668.
- Bildungsserver Berlin-Brandenburg: Rahmenlehrplan Teil C Mathematik, Jahrgangsstufen 1 bis 10.

## 13. Änderungen bei der Umsetzung (2026-11-22)

Dieses Dokument ist die gültige Fassung. Die Kopie in FamilyBoard bleibt unverändert als Ausgangsstand.

- Stand-alone-App in `aipm/MatheSchlange`, Tests mit dem eingebauten Node-Testläufer (`npm test`),
  weil dadurch keine zusätzlichen Pakete nötig sind.
- Lernstand (Abschnitt 6): richtig im ersten Versuch +1, richtig nach Hinweis +-0, falsch -1.
  Das Spec nannte nur "falsch -1". Wer es erst im zweiten Versuch schafft, soll nicht abgewertet werden.
- Wiederholungen am Rundenende: bis zu 3, zuerst falsche, dann mit Hinweis gelöste. Sie geben kein Futter.
- Zahlenstrahl-Toleranz (Abschnitt 9, Punkt 5), jetzt konkret: Zehnerzahl auf dem 0-100-Strahl und
  Zahl auf dem 20er-Teilstrahl müssen genau getroffen werden. Die Aufgabe "Wo ungefähr liegt ...?"
  akzeptiert plus/minus 5.
- Nachbarzehner: 50 hat 40 und 60 (von Nina bestätigt). 0 und 100 werden nicht gefragt.
- Eltern-Bereich: einfache Malaufgabe als Sperre (Annahme, Frage 4 war offen).
- Runde fragt jede Aufgabe höchstens zweimal. Der erste Fehler zeigt einen Tipp, der zweite die Lösung.

## 14. Abdeckung des Transparenzpapiers

| Lernziel im Transparenzpapier | Aufgabentypen |
|---|---|
| Zahlwörter mit Zahlen verbinden (erkennen und schreiben) | A1 |
| Zehner und Einer in Stellentafel eintragen | A2 |
| Zahlenreihen fortsetzen | A3 |
| Zahlbilder als Zahlen schreiben | B1 |
| Zahlen als Zahlbilder schreiben | B2 |
| Zahlen und Zahlbilder vergleichen und ordnen | B3 |
| Zahlen am Zahlenstrahl eintragen | C1, C2 |
| Vorgänger und Nachfolger benennen | C3 |
| Nachbarzehner benennen | C4 |

Ein automatischer Test (`src/logic/coverage.test.ts`) stellt sicher, dass jedes Lernziel mindestens einem
Typ zugeordnet ist und jeder Typ zu einem Lernziel gehört.

## 15. Aufgabenbank nach den Buchseiten (2026-11-22)

Nina: Die Aufgaben dürfen den Buchaufgaben ähnlich sein, die Inhalte dürfen aber nicht fehlen.

- `src/logic/bookTasks.ts` enthält über 100 Aufgaben mit den Zahlen und Aufgabenformen aus Buch S. 14/15,
  16/17 und 20/21. Jede Aufgabe zeigt ihre Buchstelle an. Richtige Antworten werden berechnet.
- Eine normale Runde mischt etwa zur Hälfte Buchaufgaben und zur Hälfte neu erzeugte, ähnliche Aufgaben.
  Der Knopf "Aufgaben aus deinem Buch" stellt nur Buchaufgaben.
- Lücken: Buch S. 16 Aufg. 3 und S. 17 Aufg. 7 (Zahlbilder im Foto nicht sicher lesbar). Die Aufgabenformen
  sind über die erzeugten Typen B1 und B3 abgedeckt. Arbeitsheft S. 8, 9 und 11 fehlen noch (Fotos nötig).
- Die Zahlbild-Zahlen aus Buch S. 14 Aufg. 4 (45, 32, 52, 85) habe ich aus einem gedrehten Foto gelesen.
  Bitte prüfen.

## 16. Überarbeitung nach UX- und Spiele-Review (2026-11-22)

- **Münzen:** Zusätzlich zu den Themen-Sternen gibt es 1 Münze pro Stufenaufstieg, 1 pro geschafftem Wochenziel und
  1 für eine starke Knobelrunde (Symbol 🪙, die Sterne bleiben ein reines Könnens-Zeichen). Stand: `bonusMuenzen`, `knobelTage`.
- **Knobelrunde:** Schwerere Varianten aller 10 Aufgabentypen im Zahlenraum bis 100 (`generateTask(typ, rng, true)`),
  keine Buchaufgaben. 1 Zusatzmünze bei mindestens 7 von 10 im ersten Versuch, höchstens einmal pro Tag.
- **Startseite:** Nur Schlange und Terrarium, Fortschritt, "Runde starten", "Themen und Buch", "Shop", Wochenanzeige.
  Shop und Themen sind eigene Ansichten. Der Fortschrittsbalken füllt sich auch auf dem Ergebnisbildschirm.
- **Zifferfeld** statt Handy-Tastatur, **Vorlesen** größer mit Option "immer", **Lösung als Bild** nach dem zweiten Fehler.
- **Ton bei falschem Futter:** Nicht das Kind macht etwas falsch, sondern die Lieferung ist durcheinander. Die Schlange wundert
  sich lustig, ohne Ekel-Emojis und ohne "ey". Sprüche sind deutlich erweitert (`src/ui/reaktion.ts`).
- **Kontrast:** Grün auf etwa 5,3:1 abgedunkelt, Platzhalter und Schriftgewichte angepasst.
- **Fix:** Wiederholungsaufgaben vermeiden jetzt den Text der tatsächlich gescheiterten Aufgabe.
- **Sicherung:** Hinweis im Elternbereich (Safari löscht Webseiten-Daten nach 7 Tagen ohne Nutzung, WebKit ITP),
  Erinnerung auf der Startseite nach 14 Tagen ohne Sicherung, Anfrage nach dauerhaftem Speicher.
- Offen: Der Vite-Build konnte in der Entwicklungsumgebung nicht laufen. Bitte lokal `npm run build` ausführen.

## 17. Visuelles Design (2026-11-22)

- Idee: Blick in ein beleuchtetes Terrarium. Tiefes Moos (`#0f2f26`) mit Laternenlicht von oben als Grund, Papierkarten (`#fff8e6`) für alles, was gelesen wird,
  dicke Tasten mit Unterkante, die beim Drücken einsinken. Farben stammen aus den Schlangen- und Terrarium-Bildern (Lime, Amber der Augen).
- Rollen: Amber = Hauptknopf und Münzen, Lime = richtig/Weiter/Prüfen, Blau = Vorlesen, Lila = Knobelrunde. Alle Textpaare haben mindestens 4,5:1 (Ausnahme: deaktivierte Tasten).
- Schrift: systemeigene runde Schrift in 800er Stärke (`ui-rounded`, Arial Rounded, Trebuchet als Rückfall), keine Webfonts, damit keine Daten an Dritte gehen.
- Das Terrarium ist auf Handys höhenbegrenzt, damit "Runde starten" ohne Scrollen sichtbar ist.

## 18. Feedback-Runde 1: Belohnung, Stufen, Meilensteine, Elternblick (2026-11-22)

Maßgeblich sind `docs/specs/2026-11-22-feedback-runde-1/` (Anforderungen, Design, Aufgaben). Kurzfassung der Änderungen gegenüber den Abschnitten 4, 6 und 16:

- **Stufen:** Jede Aufgabe hat Stufe 1 (leicht), 2 (mittel, bisher normal) oder 3 (knifflig, bisher Knobel), sichtbar als 1 bis 3 Schuppen. Alle zehn Typen haben eine leichte Variante.
- **Rampe:** Die ersten drei Runden nur leicht. Danach Aufgabe 1 bis 4 leicht, 5 bis 10 mittel, Stufe 2 nur für Typen mit Lernstand mindestens 1. Knobelrunde: 2 mittlere, dann knifflig. Der Knopf "Aufgaben aus deinem Buch" ist eine bewusste Wahl und stellt Buchaufgaben (Stufe 2) an allen Positionen.
- **Lernstand:** Leichte Aufgaben heben ihn höchstens auf 1. Falsch bei kniffligen Aufgaben senkt ihn nicht.
- **Belohnung:** Futter 2/1 auf Stufe 1 und 2, 5/3 auf Stufe 3. Rundenbonus der Knobelrunde 10. Starke Knobelrunde gibt 2 Münzen (bisher 1). Wachstumsschwellen 0/30/90/200/350. Halbzeit nach Aufgabe 5, Serien-Jubel (+1 Futter, einmal pro Runde).
- **Meilensteine** (Häutung, Album "Meine Häute"): Entwicklung, Sterne, Runden 10/25/50/100 (1/2/3/5 Münzen), Wochenziel, Knobelerfolge (erste starke Runde 1 Münze, 10/25/50 kniffelige Treffer 1/2/3). Altstände tragen Erreichtes ohne Feier und ohne Münzen nach.
- **Elternbereich:** "Das hilft jetzt", Testbereitschaft (Schätzung), Einschätzung je Typ (sicher, fast sicher, noch üben, zu wenig Daten) mit Trend, Runden der letzten vier Wochen, Meilensteine.
- **Daten:** `GameState` bekommt `verlauf` (letzte zehn Versuche je Typ), `statistik` (bearbeitet, geloest, ersteTreffer, knobelTreffer) und `meilensteine`. Altstände laden ohne Verlust.
- **Offen:** Spielwerte sind Startwerte für den Praxistest. Vite-Build und Sichtprüfung der neuen Ansichten (Schuppen, Treppe, Halbzeit, Häutung, Album, Elternbereich) stehen aus und laufen auf dem Mac.
