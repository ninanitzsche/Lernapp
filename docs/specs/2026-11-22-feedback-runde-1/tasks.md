# Aufgaben: Feedback-Runde 1

Stand: 2026-11-22. Gehört zu `requirements.md` und `design.md`. Reihenfolge: erst Test, dann Code (rot, grün). Jede Aufgabe endet mit `npx tsc --noEmit` und `npm test` ohne Fehler. Der Vite-Build und die Sichtprüfung laufen auf Ninas Mac.

Abhängigkeiten: T1 vor allem. T2 bis T4 nacheinander. T5 und T6 danach, voneinander unabhängig. T7 nach T5 und T6. T8 zuletzt.

## Phase A: Grundlagen (Logik, ohne Oberfläche)

### T1 Spielwerte und Typen
- Dateien: `src/logic/config.ts`, `src/logic/tasks.ts` (nur Typ `Stufe`)
- Tun: Werte aus `design.md` 4.1 bis 4.3 eintragen, Schwellen in `STAGES` senken, Typ `Stufe` anlegen.
- Test zuerst: `config.test.ts`: Schwellen steigen streng, Rampenlängen gleich `roundLength`, Münztabellen vollständig.
- Anforderungen: R3.1, R3.2, R4.1 bis R4.3, N5

### T2 Stufen in den Aufgaben
- Dateien: `src/logic/tasks.ts`, `src/logic/bookTasks.ts`, `src/logic/tasks.test.ts`, `src/logic/hard.test.ts`
- Tun: `Task.stufe` einführen. Generatoren erhalten die Stufe (1, 2, 3). `generateTask(typ, rng, stufeOderSchwer)` bleibt rückwärtskompatibel (`false` gleich 2, `true` gleich 3). Leichte Varianten nach `design.md` Abschnitt 5. Buchaufgaben tragen Stufe 2.
- Test zuerst: Für jeden Typ und jede Stufe 1000 Aufgaben mit Seeds: gültig, genau eine richtige Antwort, Zahlenbereich der Stufe eingehalten (Stufe 1: kleine Zahlen), Stufe an der Aufgabe gesetzt. Bestehende 95 Tests bleiben grün.
- Anforderungen: R1.1, R2.9, R2.10

### T3 Rampe, Freischaltung, Lernstand
- Dateien: neu `src/logic/stufen.ts` plus Test, `src/logic/game.ts`, `src/logic/runde.ts`
- Tun: `rampeFuer`, `hoechsteStufe`, `skillNach` (Stufe 1 deckelt auf 1, kniffelig sinkt nie). `selectTypes` bleibt, Aufgabenbau nutzt die Rampe. Wiederholungen mit Stufe höchstens 2. `RoundAnswer.stufe` und `parseRunde` mit Standard 2.
- Test zuerst: neues Konto bekommt nur Stufe 1 in den ersten drei Runden; danach Stufe 2 nur für Typen mit Lernstand mindestens 1; Rampe nie schwerer als Plan; Knobelrampe; Lernstand-Deckel; kein Sinken bei Stufe 3; Wiederholung höchstens Stufe 2; Altrunde ohne Stufen lädt.
- Anforderungen: R2.1 bis R2.8, N9

### T4 Belohnung: Futter nach Stufe, Serie, Halbzeit, Knobel
- Dateien: neu `src/logic/belohnung.ts` plus Test, `src/logic/game.ts` (`finishRound`), `src/logic/runde.ts`
- Tun: `futterFuer`, `serieErkannt`, `halbzeitErreicht`; `finishRound` mit Futter nach Stufe, Rundenbonus je Rundenart, `knobelMuenzen`, `knobelFutter` und `serienFutter` in `RoundSummary`. `RundenStand.halbzeitGezeigt`, `RoundAnswer.serieBonus`.
- Test zuerst: Futtertabelle; normale Runde 10 mal gleich richtig gibt 25 (Regression gegen heute); Knobelrunde gibt mindestens doppelt; Serie nur einmal pro Runde und nur bei drei hintereinander im ersten Versuch; Halbzeit nur einmal, nicht bei Wiederholungen; Tageslimit begrenzt weiterhin; 2 Münzen bei Knobel nur einmal pro Tag.
- Anforderungen: R3.1, R3.3 bis R3.6, R3.8, R4.1 bis R4.5

### T5 Verlauf, Statistik, Speicher
- Dateien: `src/logic/game.ts` (`GameState`, `initialState`, `parseState`, `finishRound`), `src/storage.test.ts`, `src/logic/game.test.ts`
- Tun: Felder `verlauf`, `statistik`, `meilensteine` additiv. Verlauf hält je Typ die letzten zehn Versuche. Export und Import enthalten sie.
- Test zuerst: Verlauf wächst und wird auf zehn gekürzt; Altstand (Version 1 ohne neue Felder) lädt; Export und Import ergibt gleichen Stand; Kontostand nach dem Laden eines Altstands ist nie kleiner als vorher.
- Anforderungen: R6.9, N7

### T6 Meilensteine
- Dateien: neu `src/logic/meilensteine.ts` plus Test, `src/logic/game.ts`
- Tun: `pruefeMeilensteine(vorher, nachher, now)` für Entwicklung, Stern, Runden (10, 25, 50, 100), Wochenziel und Knobelerfolg mit Rückblick (höchstens drei Aussagen) und Münzen. `nachtragen(state)` für Altstände. `finishRound` addiert Meilenstein-Münzen auf `bonusMuenzen`. Doppelte Auslösung ausgeschlossen. Münzen für Entwicklung, Stern und Wochenziel nicht doppelt zählen (sie existieren schon).
- Test zuerst: jeder Auslöser genau einmal; Reihenfolge bei mehreren; Rückblick aus Daten berechnet; Altstand erzeugt Einträge mit 0 Münzen und keine Feier; Münzkonto der Altstände unverändert; Meilensteine gehen bei sinkendem Lernstand nicht verloren.
- Anforderungen: R5.1, R5.3, R5.4 (Logik), R5.6 bis R5.8

### T7 Lernstand für Eltern
- Dateien: neu `src/logic/lernstand.ts` plus Test
- Tun: `typEinschaetzung`, `trend`, `themaBereitschaft`, `empfehlung` (mit Tipps aus `design.md` Abschnitt 9), `rundenProWoche`.
- Test zuerst: Grenzfälle der Ampel (4 Versuche gleich "zu wenig Daten"; 5 gleich Urteil; "sicher" nur mit mindestens 3 mittleren oder kniffeligen unter den letzten 10; 80 Prozent genau; 50 Prozent genau; 20 Prozent falsch genau); Trend nur ab 10 Versuchen; Empfehlung wählt den schwächsten Typ mit Daten, bei Gleichstand den mit weniger Versuchen; ohne Daten die Übe-Empfehlung; Bereitschaft je Thema (schlechtester Typ entscheidet, "noch offen" bei fehlenden Daten); Tage bis Test.
- Anforderungen: R6.1 bis R6.6, R6.8 (Daten)

## Phase B: Oberfläche (je Aufgabe Sichtprüfung auf dem Mac)

### T8 Bausteine Schuppen und Treppe
- Dateien: neu `src/ui/Schuppen.tsx`, `src/ui/Treppe.tsx`, `src/index.css`
- Tun: Schuppen als SVG (0 bis 3 gefüllt, Text für Screenreader, nicht nur Farbe). Treppe als Fortschrittsleiste mit Stufenhöhen.
- Prüfen: Kontrast nachrechnen, 48 px Zielgröße wo tippbar, `prefers-reduced-motion`.
- Anforderungen: R1.2, R1.3, R1.5, N4

### T9 Runde: Rampe, Stufe, Halbzeit, Serie
- Dateien: `src/ui/Round.tsx`, neu `src/ui/Halbzeit.tsx`, `src/ui/reaktion.ts`, `src/index.css`
- Tun: Aufgabenbau mit Rampe, Stufenanzeige und Treppe in der Aufgabenansicht, Halbzeit nach Aufgabe 5 (auch nach Pause genau einmal), Serien-Sprechblase mit Konfetti, Live-Balken mit Futter nach Stufe, neue Sprüche (mindestens 6 je Art).
- Prüfen: Passt in `100dvh` auf kleinem Handy und im Querformat, Pause und Weitermachen vor und nach Halbzeit, Serie blockiert nichts.
- Anforderungen: R1.2 bis R1.5, R2.2 bis R2.4, R3.3 bis R3.7, N2, N3

### T10 Ergebnis, Häutung, Album
- Dateien: `src/App.tsx`, neu `src/ui/Haeutung.tsx`, neu `src/ui/Album.tsx`, `src/ui/reaktion.ts`, `src/index.css`
- Tun: Ergebnis zeigt Knobelanteil getrennt. Danach Häutungen nacheinander (bis drei, sonst zusammengefasst). Album über die Startseite. Themenkarte mit sichtbarer Stufe.
- Prüfen: Mehrere Meilensteine in einer Runde, Zurück aus dem Album, kein Scrollen.
- Anforderungen: R1.4, R4.4, R5.2, R5.4, R5.5, R5.9, N3

### T11 Elternbereich
- Dateien: `src/ui/Parent.tsx`, `src/index.css`
- Tun: Oberer Teil "Das hilft jetzt", Testbereitschaft mit Hinweis "Schätzung", Typenliste mit Schuppenband, Wort und Trend, Runden der letzten vier Wochen, Meilensteinliste. Bestehendes Transparenzpapier-Table bleibt darunter.
- Prüfen: In unter einer Minute lesbar (M4), Zeilenlänge unter 70 Zeichen, keine Farbe als einziger Träger.
- Anforderungen: R6.1 bis R6.8, R6.10, N4

## Phase C: Abschluss

### T12 Prüfung und Doku
- Tun: Rückverfolgbarkeitstabelle abhaken (Test oder M), `docs/spec.md` Abschnitt 18 ergänzen (Verweis und Änderungen), README (Teststand, neue Ansichten), `config.ts` Kommentar, Sandbox-Grenzen benennen (kein Build, keine Sichtprüfung). Nina führt auf dem Mac `npm run build` und `npm run dev` aus und geht die manuellen Prüfpunkte M1 bis M5 mit dem Kind durch.
- Anforderungen: alle

## Rückverfolgbarkeit

| Anforderung | Aufgabe | Prüfung |
|---|---|---|
| R1.1 | T2 | Test |
| R1.2, R1.3, R1.5 | T8, T9 | Test (Logik der Anzeige) plus M2 |
| R1.4 | T10 | Test plus Sicht |
| R2.1 bis R2.8 | T3 | Test |
| R2.9, R2.10 | T2 | Test |
| R3.1, R3.2 | T1, T4 | Test |
| R3.3, R3.4 | T4, T9 | Test plus M1 |
| R3.5, R3.6 | T4, T9 | Test plus Sicht |
| R3.7 | T9 | Sicht |
| R3.8 | T4 | Test |
| R4.1 bis R4.3, R4.5 | T4 | Test |
| R4.4 | T10 | Sicht |
| R4.6 | T3 | Test (Lernstand-Deckel) |
| R5.1, R5.3, R5.6 bis R5.8 | T6 | Test |
| R5.2, R5.4, R5.5, R5.9 | T10 | Sicht |
| R6.1 bis R6.6, R6.8 (Daten) | T7 | Test |
| R6.7, R6.8 (Anzeige), R6.10 | T11 | Sicht plus M4 |
| R6.9 | T5 | Test |
| N1 | T3, T4 | Test (keine Minderung von Futter, Münzen, Sternen) |
| N2 | T9, T10 | Sicht |
| N3, N4 | T8 bis T11 | Sicht auf dem Mac |
| N5 bis N8 | T1, T5, T12 | Test, Durchsicht |
| N9 | T3 | Test |
| M3, M5 | T12 | Beobachtung mit dem Kind |

## Umfang und Reihenfolge bei knapper Zeit

Wenn nicht alles auf einmal gebaut wird, ist diese Reihenfolge am wirksamsten für das Kind: erst T1 bis T4 plus T8 und T9 (frühe Belohnung, Stufen, Rampe, Halbzeit), danach T5 bis T7 plus T10 (Meilensteine), zuletzt T11 (Elternansicht). Der Elternbereich hängt von den Verlaufsdaten (T5) ab. Je früher T5 live geht, desto früher sammelt die App Daten für die Elternansicht.
