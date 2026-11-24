# Anforderungen: Feedback-Runde 1 (Belohnung, Stufen, Meilensteine, Elternblick)

Stand: 2026-11-22. Status: umgesetzt (Logik mit Tests, Oberfläche ohne Sichtprüfung). Offen: Vite-Build und manuelle Prüfpunkte auf dem Mac.
Verfahren: spec-driven in drei Dokumenten (Anforderungen, Design, Aufgaben), nach dem Muster Requirements, Design, Tasks mit Anforderungen im EARS-Format. Dieses Dokument sagt, WAS gelten muss. `design.md` sagt, WIE. `tasks.md` sagt, in welcher Reihenfolge gebaut und geprüft wird.
Die verbindlichen visuellen Grundlagen stehen in `docs/DESIGN_SYSTEM.md` und `docs/VISUELLES_WELTENKONZEPT.md`. Diese Feedback-Spezifikation ergänzt sie; sie verweist nicht auf ein separates `docs/spec.md`.

## 1. Auslöser (Feedback)

1. Die Belohnung folgt aktuell sehr spät.
2. Schwierigkeitsstufen sollen sichtbar sein.
3. Am Anfang nur leichte Aufgaben, dann immer schwerere.
4. Eltern sollen in ihrem Bereich erkennen, auf welchem Stand das Kind ist.
5. Knobelaufgaben sollen besser vergütet werden.
6. Meilensteine dürfen resümiert und gefeiert werden.

Entscheidungen von Nina (2026-11-22): Belohnung sofort plus Zwischenstopp. Schwierigkeit als automatische Rampe, Stufe sichtbar. Meilensteine: Entwicklung der Schlange, neue Sterne und bedeutsame Lernfortschritte in einem eigenständigen neuen Themenfeld (z. B. Multiplikation) sowie Knobelerfolge. Kein Wochenziel und keine Belohnung für reine Rundenzahl. Elternbereich: Ampel je Aufgabentyp, Empfehlung "Das hilft jetzt", Testbereitschaft.

## 2. Befund zum Ist-Stand (aus dem Quellcode)

Das Feedback "Belohnung zu spät" ist nur zum Teil richtig, und das ändert die Lösung:

- Futter kommt schon nach jeder Antwort (Live-Balken, Mampf-Ton). Spät kommen die Dinge, die das Kind wirklich haben will: Münzen (erst am Rundenende, höchstens 1 pro Tag als Mitbringsel) und Wachstum (Kleinkind erst bei 60 Futter, das sind drei bis vier Runden an mehreren Tagen).
- Deshalb reicht "mehr Futter pro Aufgabe" nicht. Es braucht frühere Wachstumsschwellen, Zwischenerfolge innerhalb der Runde und Meilensteine zwischen den Stufen.
- Heute gibt es nur zwei Schwierigkeiten (normal, Knobel). Die Aufgabenrampe fehlt, und wer neu anfängt, bekommt gleich normale Aufgaben mit Zahlen bis 99.
- Der Lernstand je Aufgabentyp (0 bis 3) ist die einzige Information im Elternbereich. Es gibt keinen Verlauf und keine Trefferquote.

## 3. Begriffe

| Begriff | Bedeutung |
|---|---|
| Stufe | Schwierigkeit einer Aufgabe: 1 leicht, 2 mittel, 3 knifflig. Bisherige "normale" Aufgaben sind Stufe 2, bisherige Knobelaufgaben Stufe 3. |
| Rampe | Reihenfolge der Stufen innerhalb einer Runde (leicht zuerst). |
| Halbzeit | Zwischenstopp nach Aufgabe 5 der Runde. |
| Serie | Drei Aufgaben nacheinander im ersten Versuch richtig, nur innerhalb einer Runde. |
| Meilenstein | Einmaliges Ereignis mit Feier und Rückblick (Abschnitt 8). |
| Rückblick | Kurze Zusammenfassung dessen, was das Kind bis zum Meilenstein geschafft hat. |
| Häutung | Name der Meilenstein-Feier im Kinderbereich (Schlangen häuten sich, wenn sie wachsen). |

## 4. Anforderungen: Stufen sichtbar (Feedback 2)

- **R1.1** Jede Aufgabe SHALL genau eine Stufe von 1 bis 3 haben.
- **R1.2** WHILE eine Aufgabe angezeigt wird, THE App SHALL die Stufe als Anzahl gefüllter Schuppen (1, 2 oder 3 von 3) zeigen. Die Stufe SHALL zusätzlich als Text für Screenreader vorhanden sein ("leicht", "mittel", "knifflig") und SHALL NICHT nur über Farbe unterscheidbar sein.
- **R1.3** THE Fortschrittsleiste der Runde SHALL die Stufen der noch kommenden Aufgaben als Treppe andeuten, damit das Kind die Rampe sieht.
- **R1.4** THE Themenkarte SHALL je Thema zeigen, auf welcher Stufe das Kind dort gerade übt (höchste freigeschaltete Stufe über die Typen des Themas).
- **R1.5** Die Stufenanzeige SHALL ohne Fachbegriffe auskommen. Kinder-Texte sagen "leicht", "mittel", "knifflig", nicht "Stufe 2".

## 5. Anforderungen: Rampe und Freischaltung (Feedback 3)

- **R2.1** WHEN ein Kind weniger als `leichtRunden` (Startwert 3) Runden abgeschlossen hat, THE App SHALL ausschließlich Aufgaben der Stufe 1 stellen.
- **R2.2** WHEN eine normale Runde aufgebaut wird, THE App SHALL die Stufen nach dem Plan "Aufgabe 1 bis 4 leicht, Aufgabe 5 bis 10 mittel" vergeben (Plan zentral in `config.ts`).
- **R2.3** IF ein Aufgabentyp noch nicht freigeschaltet ist (Lernstand 0), THEN THE App SHALL für diesen Typ auch an mittleren Positionen eine leichte Aufgabe stellen.
- **R2.4** WHEN eine Knobelrunde aufgebaut wird, THE App SHALL die Stufen nach dem Plan "Aufgabe 1 und 2 mittel zum Aufwärmen, Aufgabe 3 bis 10 knifflig" vergeben.
- **R2.5** THE Rampe SHALL nie schwerer beginnen als der Plan vorsieht, auch nicht bei hohem Lernstand.
- **R2.6** WHEN eine leichte Aufgabe im ersten Versuch richtig ist, THE Lernstand dieses Typs SHALL höchstens auf 1 steigen. Erst mittlere und knifflige Aufgaben SHALL ihn bis 3 steigen lassen. (Verhindert Sterne allein durch Leichtes.)
- **R2.7** WHEN eine kniffelige Aufgabe falsch beantwortet wird, THE Lernstand SHALL NICHT sinken. (Mut zum Knobeln wird nicht bestraft.)
- **R2.8** WHEN die Wiederholungen am Rundenende aufgebaut werden, THE App SHALL jede Wiederholung höchstens auf Stufe 2 stellen und den Typ der gescheiterten Aufgabe beibehalten.
- **R2.9** THE Buchaufgaben SHALL als Stufe 2 gelten und in der Rampe (Mix) nur an mittleren Positionen erscheinen. Auf leichten Positionen SHALL die App erzeugte leichte Aufgaben stellen. Ausnahme: Der Knopf "Aufgaben aus deinem Buch" ist eine bewusste Wahl und stellt Buchaufgaben an allen Positionen.
- **R2.10** FOR JEDEN der zehn Aufgabentypen SHALL es eine leichte Variante geben, die mit kleineren Zahlen und einer einzigen Denkhandlung auskommt (Einzelheiten in `design.md`, Abschnitt 5).

## 6. Anforderungen: Frühere Belohnung (Feedback 1)

- **R3.1** THE Futter je Aufgabe SHALL von der Stufe abhängen (Tabelle in `design.md`, Abschnitt 4). Richtig im ersten Versuch bringt auf Stufe 1 und 2 mindestens so viel Futter wie bisher.
- **R3.2** THE Wachstumsschwellen SHALL gesenkt werden, sodass die erste Entwicklung ("Kleinkind") bei normalem Üben in der zweiten Runde des ersten Tages eintritt. Schwellen sinken nur, damit steigt keine Schlange aus Altständen herunter.
- **R3.3** WHEN Aufgabe 5 einer Runde beantwortet ist, THE App SHALL einen Halbzeit-Zwischenstopp zeigen: bisher gesammeltes Futter, wie weit es bis zur nächsten Entwicklung ist, ein Spruch der Schlange und der Knopf "Weiter" sowie "Pause".
- **R3.4** WHEN Halbzeit erreicht ist, THE Halbzeit SHALL einmal pro Runde auftreten, auch nach Pause und Weitermachen, und SHALL bei Wiederholungsaufgaben nicht erneut erscheinen.
- **R3.5** WHEN das Kind drei Aufgaben nacheinander im ersten Versuch richtig hat, THE App SHALL sofort einen kurzen Serien-Jubel zeigen (Konfetti, Spruch, 1 Zusatzfutter). Ein Fehler beendet die Serie ohne Folgen, die Serie wird nicht gespeichert.
- **R3.6** THE Zusatzfutter der Serie SHALL höchstens einmal pro Runde vergeben werden.
- **R3.7** WHEN das Futter der laufenden Runde die nächste Entwicklung erreichen würde, THE Live-Balken SHALL das schon in der Runde anzeigen (wie bisher) und das Ergebnis SHALL das Wachstum feiern.
- **R3.8** THE Rundenbonus SHALL weiterhin nur für das Beenden aller zehn Aufgaben gelten, nicht für Tempo.

## 7. Anforderungen: Knobelaufgaben besser vergüten (Feedback 5)

- **R4.1** THE Futter für kniffelige Aufgaben (Stufe 3) SHALL deutlich über dem der mittleren liegen (Tabelle in `design.md`).
- **R4.2** THE Rundenbonus der Knobelrunde SHALL höher sein als der der normalen Runde.
- **R4.3** WHEN in einer Knobelrunde mindestens 7 von 10 Aufgaben im ersten Versuch richtig sind, THE App SHALL `knobelMuenzen` (Startwert 2) statt bisher 1 vergeben, höchstens einmal pro Tag.
- **R4.4** THE Ergebnisbildschirm SHALL den Knobelanteil des Futters getrennt zeigen ("davon knifflig: +N"), damit der Unterschied spürbar ist.
- **R4.5** THE Knobelaufgabe SHALL das Tageslimit für Futter wie jede Runde beachten, damit höhere Vergütung nicht zu Dauerspielen führt.
- **R4.6** THE Basis des Fortschritts (Sterne, Stufenfreischaltung) SHALL weiterhin auf mittleren Aufgaben ruhen. Knobeln gibt mehr Futter, ersetzt aber kein Grundlagenüben.

## 8. Anforderungen: Meilensteine feiern und resümieren (Feedback 6)

Meilensteintypen und Auslöser:

| Typ | Auslöser | Münzen |
|---|---|---|
| Entwicklung | Stufenaufstieg der Schlange | 1 (wie bisher) |
| Stern | Neuer Stern in einem Thema | 1 je Stern (wie bisher) |
| Runden | Abgeschlossene Runden insgesamt: 10, 25, 50, 100 | 1, 2, 3, 5 |
| Wochenziel | Wochenziel erreicht | 1 (wie bisher) |
| Neues Themenfeld | Das Kind ist in einem neu eingeführten, eigenständigen Lernfeld (z. B. Multiplikation) fachlich fit | Belohnung; genaue Höhe und Fit-Kriterium TBD |\n| Knobelerfolg | Erste starke Knobelrunde (mindestens 7 von 10 gleich richtig): 1 Münze. Dann 10, 25, 50 kniffelige Aufgaben insgesamt im ersten Versuch richtig: 1, 2, 3 Münzen | 1, dann 1, 2, 3 |

- **R5.1** Jeder Meilenstein SHALL genau einmal ausgelöst und mit Datum und Rückblick gespeichert werden.
- **R5.2** WHEN ein Meilenstein erreicht wird, THE App SHALL nach dem Rundenergebnis eine Häutungs-Feier zeigen: Konfetti, Spruch der Schlange, Name des Meilensteins und Rückblick.
- **R5.3** THE Rückblick SHALL höchstens drei kurze Aussagen enthalten, gewählt aus: gelöste Aufgaben insgesamt, Übungstage, Anteil gleich richtig beim ersten Mal, stärkstes Thema. Alles SHALL aus gespeicherten Daten berechnet sein, nichts erfunden.
- **R5.4** IF mehrere Meilensteine in derselben Runde eintreten, THEN THE App SHALL sie nacheinander mit "Weiter" zeigen, in der Reihenfolge Entwicklung, neues Themenfeld, Stern, Knobelerfolg. Mehr als drei Feiern hintereinander SHALL zu einer gemeinsamen Karte zusammengefasst werden.
- **R5.5** THE App SHALL eine Ansicht "Meine Häute" (Album) bieten, in der alle bisherigen Meilensteine mit Datum und Rückblick wieder ansehbar sind.
- **R5.6** THE Meilensteine SHALL nie verloren gehen, auch wenn der Lernstand später sinkt.
- **R5.7** WHEN ein Altstand geladen wird, THE App SHALL rückwirkend Meilensteine für schon erreichte Zustände (Entwicklung, Sterne) ohne Feier eintragen, damit nach dem Update keine alte Leistung "nachgefeiert" wird und keine Münze doppelt zählt.
- **R5.8** THE Münzen aus neuen Meilensteinen (Runden, Knobelerfolg) SHALL zum Münzkonto zählen und im Shop ausgegeben werden können.
- **R5.9** THE Feier SHALL ohne Zeitdruck und ohne Verlust ablaufen. Das Kind schließt sie selbst mit "Weiter".

## 9. Anforderungen: Elternbereich (Feedback 4)\n\n**TBD vor Umsetzung:** Die Regeln für Lernstand/Sterne und die Testbereitschaft werden in einem ausführlichen Interview mit Nina definiert. Die derzeitigen Prozentwerte und Ableitungen in diesem Abschnitt sind Diskussionsstand, keine freigegebene Produktregel. Bis zum Abschluss des Interviews dürfen diese Regeln nicht als verbindliche Logik implementiert werden.

- **R6.1** THE Elternbereich SHALL je Aufgabentyp eine Einschätzung zeigen: "sicher", "fast sicher", "noch üben" oder "noch zu wenig Daten". Die Einschätzung SHALL als Text und Symbol angezeigt werden, nicht nur als Farbe.
- **R6.2** THE Einschätzung SHALL auf den letzten zehn Versuchen je Typ beruhen. Für ein Urteil SHALL es mindestens fünf Versuche geben, sonst "noch zu wenig Daten".
- **R6.3** "Sicher" SHALL nur erreichbar sein, wenn mindestens drei der zehn Versuche auf mittlerer oder kniffliger Stufe lagen und mindestens 80 Prozent im ersten Versuch richtig waren. "Noch üben" SHALL gelten, wenn weniger als 50 Prozent im ersten Versuch richtig waren oder mehr als 20 Prozent ganz falsch. Alles dazwischen ist "fast sicher".
- **R6.4** THE Elternbereich SHALL je Typ den Trend nennen ("wird besser", "bleibt gleich", "wird schwächer"), ermittelt aus den letzten fünf gegenüber den fünf davor, und nur wenn zehn Versuche vorliegen.
- **R6.5** THE Elternbereich SHALL oben einen Satz "Das hilft jetzt" zeigen: der schwächste Typ mit ausreichend Daten und ein konkreter Übungstipp, der ohne App machbar ist. IF kein Typ ausreichend Daten hat, THEN THE Satz SHALL dazu raten, ein paar Runden zu üben.
- **R6.6** THE Elternbereich SHALL je Thema eine Testbereitschaft zeigen ("bereit", "fast bereit", "noch üben", "noch offen") mit dem Hinweis, dass das eine Schätzung aus den App-Daten ist und kein Testergebnis. Ist ein Testdatum gesetzt, SHALL die Anzeige die Tage bis zum Test nennen.
- **R6.7** THE Elternbereich SHALL die Stufen in Worten nennen (leicht, mittel, knifflig) und keine internen Kürzel (A1 und so weiter) ohne Klartext.
- **R6.8** THE Elternbereich SHALL die erreichten Meilensteine mit Datum auflisten. Eine Auswertung oder Zielvorgabe zur Nutzungsfrequenz wird nicht angezeigt.
- **R6.9** THE Verlaufsdaten SHALL nur auf dem Gerät liegen, im Export und Import enthalten sein und in Altständen fehlen dürfen (dann gilt "noch zu wenig Daten").
- **R6.10** WHEN das Kind vom Elternbereich zurückkehrt, THE Kinderansicht SHALL unverändert sein. Einschätzungen und Ampeln SHALL nie im Kinderbereich erscheinen (kein Druck, kein Vergleich).

## 10. Nicht-funktionale Anforderungen

- **N1** Keine Strafe, kein Verlust, kein Zeitdruck. Fehler beenden nur Serien, senken nie Futter, Münzen, Sterne oder Meilensteine.
- **N2** Ton: Die Schlange spricht lustig, nie fies, nie "ey". Neue Texte (Halbzeit, Serie, Häutung) sind in mehreren Varianten vorhanden. Siehe `feedback_schlange_ton`.
- **N3** Jede Kinderansicht passt ohne Scrollen in `100dvh`, auch die neuen (Halbzeit, Häutung, Album).
- **N4** Zugänglichkeit: Kontrast mindestens 4,5:1, Zielgrößen mindestens 48 px, sichtbarer Tastaturfokus, `prefers-reduced-motion` respektiert, Stufen nicht nur über Farbe, Feiern ohne Pflicht zum Schnellklicken.
- **N5** Alle neuen Spielwerte stehen in `src/logic/config.ts`. Sie sind Startwerte für den Praxistest.
- **N6** Reine Logik ohne React, Zeit wird injiziert, Zufall mit Seed. Neue Logik wird zuerst als Test geschrieben.
- **N7** Altstände (Version 1, ohne neue Felder) laden ohne Datenverlust. Gekaufte Dinge, Sterne und Münzen bleiben unverändert. Das Kontostand-Saldo SHALL nach dem Update nie sinken.
- **N8** Keine Webfonts, keine Drittanbieter-Aufrufe, keine KI zur Laufzeit.
- **N9** Eine laufende pausierte Runde (alter Rundenstand ohne Stufen) SHALL nach dem Update weiterlaufen. Fehlende Stufen gelten dort als Stufe 2.

## 11. Pädagogische Absicherung und Risiken

Quellenbasis: Dunlosky et al. (2013) zu Abrufübung und verteiltem Üben, Deci, Koestner und Ryan (1999) zu Belohnung und innerer Motivation. Alles weitere unten sind Annahmen für den Praxistest, keine belegten Tatsachen.

1. **Größere Belohnungen können die Lust am Üben verschieben.** Die Metaanalyse von Deci et al. (1999) fand, dass erwartete, an Leistung gebundene materielle Belohnungen die innere Motivation senken können. Gegenmaßnahmen im Design: Belohnt wird Fortschritt und Dranbleiben (Meilensteine, Halbzeit), nicht Tempo, die Schlange wächst nur, nie Verlust, Futter bleibt der zentrale Ausdruck. Das Risiko wird im Praxistest beobachtet (siehe Prüfpunkte).
2. **Gut bezahltes Knobeln kann Grundlagenüben verdrängen.** Das Kind könnte nur noch Knobelrunden spielen. Gegenmaßnahmen: R4.5 (Tageslimit), R4.6 (Sterne ruhen auf mittleren Aufgaben) und R2.7 (kein Verlust, deshalb kein Anreiz, Knobeln zu meiden). Der Mathe-Test am 24.11. prüft Grundlagen, daher bleibt die normale Runde der Standard.
3. **Leichte Aufgaben zu Beginn können unterfordern.** Annahme: Ein Erfolgserlebnis in den ersten Aufgaben hilft. Die Rampe hebt schon nach wenigen Aufgaben an (Aufgabe 5), und nach `leichtRunden` Runden öffnet sich Stufe 2. Beides ist per Konfiguration verstellbar. Wenn das Kind sich langweilt, hilft Verkürzen auf `leichtRunden = 1`.
4. **Die Testbereitschaft ist eine Schätzung.** Sie ist kein Testergebnis und ersetzt weder Buch noch Arbeitsheft. Das steht im Elternbereich neben der Anzeige.
5. **Unbestätigte Annahmen.** Die konkreten Schwellen (Futterwerte, Wachstumsschwellen und Ampel-Schwellen) sind Startwerte ohne empirische Grundlage und gehören in den Praxistest.

## 12. Abnahme und Rückverfolgbarkeit

Jede Anforderung hat einen automatischen Test oder einen manuellen Prüfpunkt. Die Zuordnung steht in `tasks.md`, Abschnitt "Rückverfolgbarkeit". Manuelle Prüfpunkte sind mit "M" markiert und laufen mit dem Kind (siehe unten).

Manuelle Prüfpunkte mit dem Kind (jeweils beobachten, nicht abfragen):

- **M1** Erste Runde: Das Kind kommt ohne Hilfe bis zur Halbzeit und freut sich sichtbar über Schlange und Futter.
- **M2** Das Kind erklärt in eigenen Worten, was die drei Schuppen bedeuten.
- **M3** Nach drei Tagen: Das Kind will freiwillig üben, nicht nur wegen der Münzen.
- **M4** Eltern können in unter einer Minute sagen, welcher Typ als nächstes geübt werden sollte.
- **M5** Das Kind wählt nicht ausschließlich die Knobelrunde.
