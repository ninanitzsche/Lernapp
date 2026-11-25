# Aufgaben: Feedback-Runde 1

Historischer Umsetzungsplan vom 24.11.2026. Gehört zu `requirements.md` und `design.md`. Die ursprünglichen Aufgabenbeschreibungen dokumentieren den damaligen Arbeitsauftrag; sie sind keine aktuelle To-do-Liste. Der tatsächliche Status steht in `FEATURES.md` und `docs/ROADMAP_DESIGN.md`. Neue Änderungen folgen weiterhin dem Prinzip: erst Test, dann Code (rot, grün); relevante Prüfungen und manuelle Sichtprüfungen werden getrennt ausgewiesen.

Abhängigkeiten: T1 vor allem. T2 bis T4 nacheinander. T5 und T6 danach, voneinander unabhängig. T7 nach T5 und T6. T8 zuletzt.

## Aktueller Umsetzungsstand (25.11.2026)

Diese Übersicht ist maßgeblich für den Status; die darunterstehenden T1–T13-Texte halten den ursprünglichen Arbeitsauftrag fest.

| Aufgaben | Implementierungsstand | Verifikation / Rest |
|---|---|---|
| T1–T6 | Implementiert | Logik und zugehörige automatisierte Tests vorhanden; aktueller Gesamtlauf siehe Roadmap |
| T7 | Implementiert | Sternlogik und Elternbereich vorhanden. Konkrete Kompetenzkriterien in `CONFIG.kompetenz` sind Startwerte und fachlich noch nicht freigegeben |
| T8–T10 | Implementiert | Schuppen, Treppe, Halbzeit, Rundenfeedback, Häutung, Pokal-/Albumdarstellung vorhanden; manuelle Sichtprüfung offen |
| T11 | Implementiert | Elternbereich mit „Das hilft jetzt“, Testbereitschaft, Typ-Einschätzung, Verlauf, Meilensteinen und Transparenzpapier vorhanden; manuelle Sichtprüfung offen |
| T12 | Teilweise erledigt | Automatisierte Tests, TypeScript-Prüfung und Produktionsbuild über CI erfolgreich. Manuelle Geräte-, Lernablauf- und Regressionsprüfung offen |
| T13 | Implementiert | Terrarium-Sammlung, Pokale und freigeschaltete Relikte vorhanden; manuelle Interaktionsprüfung offen |



## Phase A: Grundlagen (Logik, ohne Oberfläche)

### T1 Spielwerte und Typen
- Dateien: `src/logic/config.ts`, `src/logic/tasks.ts` (nur Typ `Stufe`)
- Tun: Werte aus `docs/REWARD_SYSTEM.md` eintragen, Schwellen in `STAGES` senken, Typ `Stufe` anlegen.
- Test zuerst: `config.test.ts`: Schwellen steigen streng, Rampenlängen gleich `roundLength`, Münztabellen vollständig.
- Anforderungen: R3.1, R3.2, R4.1 bis R4.3, N5

### T2 Stufen in den Aufgaben
- Dateien: `src/logic/tasks.ts`, `src/logic/bookTasks.ts`, `src/logic/tasks.test.ts`, `src/logic/hard.test.ts`
- Tun: `Task.stufe` einführen. Generatoren erhalten die Stufe (1, 2, 3). `generateTask(typ, rng, stufeOderSchwer)` bleibt rückwärtskompatibel (`false` gleich 2, `true` gleich 3). Leichte Varianten nach `design.md` Abschnitt 5. Buchaufgaben tragen Stufe 2.
- Test zuerst: Für jeden Typ und jede Stufe 1000 Aufgaben mit Seeds: gültig, genau eine richtige Antwort, Zahlenbereich der Stufe eingehalten (Stufe 1: kleine Zahlen), Stufe an der Aufgabe gesetzt. Alle bestehenden Tests bleiben grün.
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
- Tun: `pruefeMeilensteine(vorher, nachher, now)` für Entwicklung und den Abschluss eines Lernfeldes (fünf Sterne vollständig) mit Rückblick. Die bestehende Münzbelohnung je Stern bleibt erhalten. Keine Wochenziele und keine Belohnungen für reine Rundenzahl. Abschluss-Auszeichnung und Relikt-Freischaltung gemäß `docs/REWARD_SYSTEM.md` dokumentieren; die genaue fachliche Stern-Zuordnung bleibt bis zur Freigabe offen. `nachtragen(state)` für Altstände. Doppelte Auslösung ausgeschlossen.
- Test zuerst: jeder freigegebene Auslöser genau einmal; Abschluss eines Lernfeldes schaltet genau den passenden Album-Eintrag/Pokal frei; keine Rundenzahl- oder Wochenziel-Auslösung; Altstand erzeugt keine nachträgliche Feier und keine doppelten Belohnungen; Meilensteine gehen bei späteren Fehlern nicht verloren.
- Anforderungen: R5.1, R5.3, R5.4 (Logik), R5.6 bis R5.8

### T7 Lernstand für Eltern
- Dateien: neu `src/logic/lernstand.ts` plus Test
- Tun: Bereits freigegeben sind fünf Sterne je Lernfeld, die feste Reihenfolge und der ausgewogene Kompetenznachweis über unterschiedliche Aufgabenstellungen und mehrere Übungsrunden. Die konkreten Teilkompetenzen und Nachweiskriterien je Stern sind als konfigurierbare Startwerte in `src/logic/config.ts` umgesetzt, aber fachlich noch nicht freigegeben. Denkimpuls darf zum Kompetenznachweis beitragen; die Aufgabe bringt dann das Futter eines zweiten Versuchs (1 statt 2, knifflig 3 statt 5); Münzen werden nicht gemindert. Die bestehende Hilfe-/Lösungsanzeige bleibt erhalten; eine angezeigte Lösung ist kein selbstständiger Nachweis.
- Tests: Automatisierte Tests für die vorhandene Sternlogik und die Nachweisberechnung sind implementiert. Sie prüfen die technische Regelumsetzung, nicht die pädagogische Angemessenheit der Kriterien. Die fachliche Freigabe der konfigurierten Kriterien und eine gesonderte Validierung der Testbereitschaft bleiben offen.
- Anforderungen: R6.1 bis R6.6 (nach Interview), R6.8

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

### T10 Ergebnis, Lernfeld-Abschluss und Wissensalbum
- Dateien: `src/App.tsx`, `src/ui/Haeutung.tsx`, `src/ui/Album.tsx`, `src/ui/reaktion.ts`, `src/index.css` sowie passende Asset-Zuordnung
- Tun: Ergebnis zeigt Knobelanteil getrennt. Ein vollständig gemeistertes Lernfeld erhält einen besonderen Abschluss mit thematischer Schlangenillustration und Pokal/Orden. Das Wissensalbum sammelt pro abgeschlossenem Lernfeld den Eintrag mit fünf Sternen und Bild. Die bestehende Münzbelohnung je Stern bleibt erhalten. Themenkarte zeigt den nächsten Kompetenzschritt und eine belegbare Fortschrittsanzeige.
- Prüfen: Abschluss wird nur einmal ausgelöst; Album-Eintrag bleibt erhalten; Rückkehr aus dem Album; kein Scrollen; Fortschrittsanzeige behauptet keine nicht gemessene Genauigkeit.
- Anforderungen: R1.4, R5.2 bis R5.5, R5.9, R7.1 bis R7.7, R7.13, N3

### T11 Elternbereich
- Dateien: `src/ui/Parent.tsx`, `src/index.css`
- Tun: Oberer Teil "Das hilft jetzt", Testbereitschaft mit Hinweis "Schätzung", Typenliste mit Schuppenband, Wort und Trend, Meilensteinliste. Keine Nutzungsfrequenz oder Wochenziele. Bestehendes Transparenzpapier-Table bleibt darunter.
- Prüfen: In unter einer Minute lesbar (M4), Zeilenlänge unter 70 Zeichen, keine Farbe als einziger Träger.
- Anforderungen: R6.1 bis R6.8 (nach Interview), R6.10, N4

### T13 Terrarium-Sammlung und Reliktzugang
- Dateien: bestehende Terrarium-/Inventar-/Shop-Komponenten und Navigation; genaue Dateien nach Repository-Analyse durch Claude Code festlegen
- Tun: Terrarium als frei gestaltbare Sammlung freigeschalteter Pokale, Orden und Dekorationen. Gegenstände lassen sich intuitiv platzieren und verschieben; die Sammlung bleibt unabhängig von der aktuellen Platzierung vollständig. Reliktzugang bleibt bis zum ersten Lernfeld-Abschluss unsichtbar. Der Pokal eines Lernfeldes öffnet ausschließlich die passenden freiwilligen Experten-Relikte. Relikte bleiben ein kleines Randfeature, nutzen die vorhandenen Aufgaben und deren bestehende Logik und vergüten mit Terrariummünzen. Keine Sterne, Medaillen oder weiteren Kompetenz-Auszeichnungen im Reliktbereich.
- Prüfen: kein Reliktzugang vor Lernfeld-Abschluss; korrekte Zuordnung Pokal zu Relikt; Pokale frei platzierbar; Inventar bleibt vollständig; Reliktaufgaben verändern weder Sterne noch regulären Lernstand.
- Anforderungen: R7.8 bis R7.12

## Nachtrag 25.11.2026: Umsetzungsstand der Interview-Anforderungen

Dieser Nachtrag ist der aktuelle Status gegenüber dem historischen Arbeitsplan. Die ursprünglichen Formulierungen unter T1–T13 bleiben als nachvollziehbare Aufgabenherkunft erhalten; sie dürfen nicht als offene Implementierungsaufträge gelesen werden.

Der verbindliche Regelstand steht in `docs/REWARD_SYSTEM.md`, der aktuelle Funktionsstatus in `FEATURES.md`. Umgesetzt: fünf Kompetenzsterne je Lernfeld als konfigurierbare Startwerte (T7; fachliche Freigabe offen), Lernfeld-Abschluss mit Wissensalbum und Pokal (T10), Elternbereich mit „Das hilft jetzt“ und Testbereitschaft (T11), Terrarium-Sammlung und Relikte (T13) sowie Denkimpuls (R7.4). Entfernt: Wochenziel, Belohnungen für reine Rundenzahl und Auswertung der Nutzungsfrequenz im Elternbereich. Offen: fachliche Freigabe der Sternkriterien und manuelle Sicht-/Interaktionsprüfungen. Die Testbereitschaft ist implementiert; ihre fachliche Validierung bleibt offen.

## Phase C: Abschluss

### T12 Prüfung und Doku
- Historischer Auftrag: Rückverfolgbarkeit, README, Konfigurationskommentare, Sandbox-Grenzen und manuelle Prüfpunkte dokumentieren. Der CI-Build ist inzwischen erfolgreich nachgewiesen; die manuellen Prüfpunkte M1 bis M5 und die gemeinsame Sichtprüfung mit dem Kind bleiben offen. Diese Zeile ist keine Aufforderung, Build oder Sichtprüfung als erledigt zu behaupten.
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
| R6.1 bis R6.6 (nach Interview), R6.8 | T7 | Test |
| R6.7, R6.8 (Anzeige), R6.10 | T11 | Sicht plus M4 |
| R6.9 | T5 | Test |
| R7.1 bis R7.5 | T7 | nach Freigabe der konkreten Kriterien |
| R7.6, R7.7 | T10 | Sicht und Test |
| R7.8 bis R7.12 | T13 | Sicht und Test |
| R7.13 | T10 | Sicht und Test |
| N1 | T3, T4 | Test (keine Minderung von Futter, Münzen, Sternen) |
| N2 | T9, T10 | Sicht |
| N3, N4 | T8 bis T11 | Sicht auf dem Mac |
| N5 bis N8 | T1, T5, T12 | Test, Durchsicht |
| N9 | T3 | Test |
| M3, M5 | T12 | Beobachtung mit dem Kind |

## Umfang und Reihenfolge bei knapper Zeit

Wenn nicht alles auf einmal gebaut wird, ist diese Reihenfolge am wirksamsten für das Kind: erst T1 bis T4 plus T8 und T9 (frühe Belohnung, Stufen, Rampe, Halbzeit), danach T5 bis T7 plus T10 (Meilensteine), zuletzt T11 (Elternansicht). Der Elternbereich hängt von den Verlaufsdaten (T5) ab. Je früher T5 live geht, desto früher sammelt die App Daten für die Elternansicht.
