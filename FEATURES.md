# FEATURES.md – Funktionsübersicht der Lernapp

> **Zweck:** Diese Datei beschreibt den aktuell im Repository erkennbaren Funktionsumfang. Sie soll als praktische Übersicht für Produktentwicklung und Pflege dienen.
>
> **Stand:** 22.11.2026  
> **Grundlage:** Quellcode- und Dokumentationsprüfung. Nicht jede Funktion wurde in einem echten Browserdurchlauf oder auf einem Endgerät manuell getestet.

## Status-Legende

- **Implementiert** – im aktuellen Quellcode vorhanden.
- **Teilweise** – Grundfunktion vorhanden, aber mit erkennbaren Einschränkungen.
- **Offen** – im geprüften Stand nicht vorhanden oder noch zu ergänzen.
- **Prüfen** – aus dem Quellcode allein nicht abschließend beurteilbar bzw. sollte praktisch getestet werden.

---

## 1. Lerninhalte und Aufgaben

### Lernbereiche

Die App enthält drei Themenbereiche mit insgesamt zehn Aufgabentypen. Der Zahlenraum reicht im geprüften Stand bis 100.

| Bereich | Aufgabentyp | Status |
|---|---|---|
| A – Zahlen verstehen | Zahlwörter lesen und schreiben bzw. Zahlenkarten zuordnen | Implementiert |
| A – Zahlen verstehen | Stellenwerttafel (Zehner und Einer) | Implementiert |
| A – Zahlen verstehen | Zahlenfolgen vorwärts, rückwärts und in Schritten | Implementiert |
| B – Zahlen darstellen | Zahlenbilder mit Zehnerstangen und Einern lesen | Implementiert |
| B – Zahlen darstellen | Zahlenbilder legen | Implementiert |
| B – Zahlen darstellen | Zahlen vergleichen und ordnen | Implementiert |
| C – Zahlen verorten | Zahlen am Zahlenstrahl einordnen | Implementiert |
| C – Zahlen verorten | Markierungen am Zahlenstrahl ablesen | Implementiert |
| C – Zahlen verorten | Vorgänger und Nachfolger | Implementiert |
| C – Zahlen verorten | Nachbarzehner | Implementiert |

### Aufgabensteuerung und Lernanpassung

- **Implementiert:** Aufgaben werden algorithmisch bzw. zufallsbasiert erzeugt.
- **Implementiert:** Pro Aufgabentyp gibt es vier dokumentierte Schwierigkeits-/Kompetenzstufen (0–3).
- **Implementiert:** Die Aufgabenauswahl gewichtet schwächere Kompetenzen stärker (ungefähr 60 % schwach, 30 % mittel, 10 % stark).
- **Implementiert:** Im gemischten Modus werden die Themenbereiche berücksichtigt.
- **Implementiert:** Es gibt einen gemischten Modus und einen themenspezifischen Modus.
- **Implementiert:** Ein Knobelmodus erzeugt anspruchsvollere Varianten; Buchaufgaben sind dort nicht Teil des Modus.
- **Implementiert:** Nach einem ersten Fehlversuch gibt es einen Hinweis. Nach einem zweiten Fehlversuch wird eine Lösung bzw. Visualisierung gezeigt.
- **Implementiert:** Am Rundenende können bis zu drei Aufgaben wiederholt werden, bei denen zuvor ein Fehler aufgetreten ist. Wiederholungen geben kein zusätzliches Futter, beeinflussen aber den Kompetenzstand.
- **Implementiert:** Pro Aufgabe sind zwei Antwortversuche vorgesehen.

### Buchaufgaben

- **Implementiert:** Es gibt einen Aufgabenbestand mit mehr als 100 Buchaufgaben.
- **Implementiert:** Die Aufgaben beziehen sich auf die im Code hinterlegten Buchseiten 14–15, 16–17 und 20–21.
- **Implementiert:** Buchaufgaben können mit generierten Aufgaben kombiniert werden.
- **Teilweise:** Für Buch S. 16, Aufgabe 3, und S. 17, Aufgabe 7, sind laut Projektstand nur ähnliche Aufgaben vorhanden.
- **Offen:** Material aus Arbeitsheft S. 8, 9 und 11 ist im geprüften Aufgabenbestand nicht abgedeckt.
- **Hinweis:** Buch- und Seitenangaben sollten bei Änderungen am Aufgabenbestand mit dem tatsächlich verwendeten Schulbuch abgeglichen werden.

### Abgrenzung der Lerninhalte

- **Teilweise:** Plus- und Minusoperationen kommen vereinzelt innerhalb anderer Aufgabentypen vor.
- **Offen:** Eigene, systematische Lernmodule für Addition und Subtraktion sind im geprüften Stand nicht vorhanden.
- **Offen:** Ein systematischer Zahlenraum über 100 hinaus ist nicht vorhanden.

---

## 2. Schlange und Spielwelt

- **Implementiert:** Die Schlange hat einen Namen, der geändert werden kann.
- **Implementiert:** Es gibt fünf Wachstumsstufen mit Futter-Schwellen bei 0, 60, 150, 300 und 500 Futter.
- **Implementiert:** Richtig beantwortete Aufgaben bringen Futter; dadurch wächst die Schlange.
- **Implementiert:** Fortschrittsanzeige, Gesichtsausdrücke und unterschiedliche Stimmungen.
- **Implementiert:** Die Schlange reagiert auf Antippen.
- **Implementiert:** Es gibt wechselnde Sprechblasen und Animationen.
- **Implementiert:** Fütterungsanimation und Konfetti beim Stufenaufstieg.
- **Implementiert:** Bei längerer Inaktivität verändert sich die Stimmung (hungrig nach etwa 24 Stunden, schlafend nach etwa 48 Stunden).
- **Implementiert:** Richtige und falsche Antworten lösen unterschiedliche Reaktionen aus. Fehler werden spielerisch und ohne Beschämung kommentiert.
- **Implementiert:** Lob wird variiert und nicht nach jeder richtigen Antwort abgespielt.

---

## 3. Terrarium und Shop

- **Implementiert:** Eigenes Terrarium als gestaltbare Umgebung.
- **Implementiert:** Shop mit aktuell 44 Einrichtungsgegenständen.
- **Implementiert:** Drei Preiskategorien (1, 2 oder 3 Münzen); die Summe aller im aktuellen Katalog aufgeführten Kaufpreise beträgt 89 Münzen.
- **Implementiert:** Gegenstände wie Pflanzen, Äste, Steine, Kristalle und Hängematte.
- **Implementiert:** Unterschiedliche Hintergründe.
- **Implementiert:** Vorschau im Shop und Kaufreaktionen mit Sound.
- **Implementiert:** Gekaufte Gegenstände bleiben erhalten und werden aus dem verfügbaren Shop-Angebot entfernt.
- **Implementiert:** Gegenstände werden im Terrarium platziert und können per Drag-and-drop verschoben werden.
- **Implementiert:** Positionen der Gegenstände werden gespeichert.
- **Implementiert:** Die Darstellung unterstützt Vorder- und Hintergrundebenen, sodass Gegenstände vor oder hinter der Schlange liegen können.

---

## 4. Belohnungen und Motivation

- **Implementiert:** Drei Themenbereiche mit jeweils bis zu drei Sternen.
- **Implementiert:** Eine beim ersten Versuch richtige Antwort bringt 2 Futter, eine beim zweiten Versuch richtige Antwort 1 Futter; bei nicht gelöster Aufgabe gibt es kein Futter.
- **Implementiert:** Der Abschluss einer Runde bringt zusätzlich 5 Futter.
- **Implementiert:** Es gibt eine Begrenzung auf drei futterbringende Runden pro Tag. Weitere Lernrunden bleiben möglich und aktualisieren weiterhin den Lernstand.
- **Implementiert:** Wochenziel: an drei unterschiedlichen Tagen lernen; dafür gibt es einen Bonus.
- **Implementiert:** Münzen können unter anderem durch den ersten Tagesdurchlauf, Stufenaufstiege, Sterne, das Wochenziel und den Knobelmodus verdient werden.
- **Implementiert:** Für den Knobelbonus gilt eine Mindestleistung von 7 aus 10 Aufgaben beim ersten Versuch; der Bonus ist auf einmal pro Tag begrenzt.
- **Implementiert:** Bereits erreichte Sterne bleiben erhalten, auch wenn sich der Kompetenzstand später verändert.
- **Implementiert:** Es gibt keinen Verlust von Wachstum bei Lernpausen und keine aufeinander aufbauende Streak-Pflicht.

---

## 5. Audio und Bedienung

- **Implementiert:** Vorlesen von Aufgaben über die Web Speech API.
- **Implementiert:** Option zum automatischen Vorlesen.
- **Implementiert:** Eigene Soundeffekte über die Web Audio API.
- **Implementiert:** Stummschaltung.
- **Implementiert:** Eigene große Zahlentastatur und große Eingabebereiche.
- **Implementiert:** Fortschrittsanzeige während einer Runde.
- **Implementiert:** Runde pausieren und fortsetzen.
- **Implementiert:** Einführungsablauf mit drei Schritten; kann übersprungen und später erneut geöffnet werden.
- **Implementiert:** Die Schlange erklärt den grundlegenden Spielablauf.
- **Prüfen:** Tastaturbedienbarkeit und Screenreader-Unterstützung sollten insbesondere für Drag-and-drop im Terrarium und alle interaktiven Aufgaben systematisch getestet werden.

---

## 6. Elternbereich und Datenspeicherung

- **Implementiert:** Elternbereich mit einfacher Rechenaufgabe als Zugangsschutz.
- **Implementiert:** Anzeige von Kompetenzen pro Aufgabentyp.
- **Implementiert:** Anzeige der Themensterne sowie zusammengefasster Lern-/Spielwerte.
- **Implementiert:** Anzeige von Testdatum und Countdown.
- **Implementiert:** Schlangennamen ändern.
- **Implementiert:** Lernstand als JSON exportieren und importieren.
- **Implementiert:** Fortschritt zurücksetzen.
- **Implementiert:** Hinweise zu Sicherung und Wiederherstellung.
- **Implementiert:** Speicherung lokal im Browser über `localStorage`.
- **Implementiert:** Die App benötigt für den beschriebenen Lernbetrieb kein Benutzerkonto und keinen eigenen Backend-Dienst.
- **Offen / bewusst nicht enthalten:** Cloud-Synchronisierung und geräteübergreifende Konten.
- **Offen:** Mehrere getrennte Kinderprofile auf einem Gerät.
- **Offen:** Detaillierte zeitliche Lernverlaufsanalyse und historische Fehlerauswertung pro Aufgabe.

---

## 7. Technik

Im geprüften Repository sind unter anderem folgende Technologien erkennbar:

- React 19 und TypeScript
- Vite 8
- Motion für Animationen
- canvas-confetti für Konfetti-Effekte
- Browser-`localStorage` für lokale Datenhaltung
- Web Speech API für Sprachausgabe
- Web Audio API für Soundeffekte
- SVG sowie PNG-/WebP-Grafiken

**Nicht im geprüften Repository gefunden:**

- PWA-Manifest bzw. Service-Worker-basierte Offline-Caching-Lösung
- Serverseitige Datenbank oder Benutzerverwaltung
- Laufzeitintegration einer KI

Daraus folgt: Eine installierbare PWA mit verlässlichem Offline-Caching sollte nicht als bereits vorhandene Funktion beworben werden, solange sie nicht ergänzt und getestet wurde.

---

## 8. Bekannte technische Punkte und Prüfbedarf

### Pause und Fortsetzen einer laufenden Aufgabe

**Bekannter Prüf-/Korrekturpunkt:** Der gespeicherte Rundenstand enthält im geprüften Code nicht den vollständigen Versuchszustand (`versuch`). Wird eine Runde nach einem ersten Fehlversuch mit eingeblendetem Hinweis pausiert und später fortgesetzt, kann dieser Versuchszustand verloren gehen. Dadurch kann die Aufgabe erneut wie ein erster Versuch behandelt werden.

Betroffene Stellen:
- `src/ui/Round.tsx`
- `src/logic/runde.ts`

**Empfehlung:** Versuchszähler und den für die Wiederaufnahme erforderlichen Aufgaben-/Feedbackzustand in den gespeicherten Rundenstand aufnehmen und mit Tests absichern.

### Dokumentation

- **Prüfen / Aktualisieren:** `docs/spec.md` enthält Aussagen, die nicht mehr dem aktuellen Implementierungsstand entsprechen (unter anderem Shop, Sounds, Terrarium und Einführung).
- **Prüfen / Aktualisieren:** `docs/bewertung-ux-und-spieldesign.md` enthält ebenfalls überholte Annahmen zu bereits implementierten Abläufen.
- **Prüfen:** Die README nennt 95 automatisierte Tests, während ein anderes Dokument 85 nennt. Die tatsächliche Anzahl und der aktuelle Testlauf müssen durch Ausführen der Tests verifiziert werden.
- **Prüfen:** Build und Tests wurden im Rahmen dieser Bestandsaufnahme nicht ausgeführt.

### Repository-Größe

Im geprüften Repository liegen neben den optimierten App-Grafiken weitere ältere bzw. Quelldateien. Das ist nicht automatisch ein Problem für die Laufzeit, kann aber das Repository unnötig groß machen. Vor einem Löschen sollte geprüft werden, ob diese Dateien noch für Gestaltung, Generierung oder Dokumentation gebraucht werden.

---

## 9. Sinnvolle nächste Schritte

Priorisiert nach Zuverlässigkeit und Pflegeaufwand – nicht als Liste vermeintlich fehlender Basisfunktionen:

1. **Hoch:** Pause-/Fortsetzen-Zustand inklusive Versuchszähler zuverlässig speichern und testen.
2. **Hoch:** Automatisierte Tests und Produktionsbuild ausführen; Testanzahl in README und Dokumentation vereinheitlichen.
3. **Hoch:** `docs/spec.md` und UX-Dokumentation an den tatsächlichen Funktionsumfang anpassen.
4. **Mittel:** Aufgabenabdeckung des konkreten Schulbuchs vervollständigen und Seiten-/Aufgabenreferenzen prüfen.
5. **Mittel:** Bedienbarkeit, Barrierefreiheit und Drag-and-drop auf echten Geräten testen.
6. **Nach Bedarf:** Weitere Lerninhalte (z. B. Addition/Subtraktion oder ein größerer Zahlenraum) erst anhand des Lernziels und der Zielgruppe planen.
7. **Nach Bedarf:** PWA/Offline-Caching ergänzen, falls die App zuverlässig ohne Internet und installierbar genutzt werden soll.

---

## 10. Pflege-Regel für diese Datei

Bei jeder größeren Änderung:

1. Neue Funktion hier ergänzen.
2. Status auf **Implementiert**, **Teilweise**, **Offen** oder **Prüfen** setzen.
3. Bei Änderungen an Lernlogik auch die Aufgabentabelle und Belohnungsregeln aktualisieren.
4. Bekannte Einschränkungen nicht als implementierte Funktionen darstellen.
5. Aussagen zu Tests nur dann als erledigt markieren, wenn Tests tatsächlich ausgeführt wurden.

**Diese Datei ist eine Funktionsübersicht, keine Garantie für vollständige manuelle Qualitätssicherung.**
