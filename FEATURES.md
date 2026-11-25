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

- Nico hat fünf Entwicklungsstufen: Baby (0), Kleinkind (30), Kind (90), Teenager (200) und Erwachsen/legendär (350 Gesamtfutter).
- Richtig beantwortete Aufgaben bringen Futter; die Höhe richtet sich nach der Aufgabenschwierigkeit und dem Antwortversuch.
- Eine vollständig abgeschlossene Runde bringt einen Rundenbonus; drei aufeinanderfolgende Erstantworten richtig bringen höchstens einmal pro Runde Serienfutter.
- Höchstens drei Runden pro Tag bringen Futter. Weitere Lernrunden bleiben möglich und aktualisieren den Lernstand.
- Wachstum geht nie zurück. Pausen kosten weder Futter noch Entwicklungsstufen.
- Nicos Stimmung darf sich bei längerer Inaktivität kosmetisch verändern; daraus entstehen keine Abzüge.
- Die Schlange hat einen Namen, der geändert werden kann.
- Fütterungsanimation und Häutung machen die Entwicklung sichtbar.

Die verbindlichen Einzelregeln und Werte stehen in [docs/REWARD_SYSTEM.md](docs/REWARD_SYSTEM.md).

## 3. Terrarium und Shop

- Eigenes, frei gestaltbares Terrarium.
- Shop-Gegenstände kosten 1 bis 3 Münzen.
- Gekaufte Gegenstände bleiben dauerhaft im Besitz, können platziert und verschoben werden; die Sammlung bleibt vollständig.
- Das Terrarium nimmt Dekorationen sowie freigeschaltete Pokale/Orden auf.
- Relikte werden erst nach dem ersten Lernfeldabschluss sichtbar; der jeweilige Pokal öffnet die passenden freiwilligen Expertenaufgaben.

Die verbindlichen Regeln stehen in [docs/REWARD_SYSTEM.md](docs/REWARD_SYSTEM.md).

## 4. Belohnungen und Motivation

- **Futter** lässt Nico wachsen; es ist keine Währung und kein Kompetenznachweis.
- **Schuppenband** zeigt die Aufgabenschwierigkeit (leicht, mittel, knifflig); Schuppen sind keine Sammelwährung.
- **Sterne:** genau fünf pro Lernfeld, nacheinander und nur für nachgewiesene Kompetenz.
- **Münzen:** Spielwährung für Shop und Terrarium; unter anderem eine Münze je verdientem Stern, eine je Entwicklungsaufstieg und definierte Knobel-/Reliktbelohnungen.
- **Pokale/Orden:** eine thematische Abschlussauszeichnung je gemeistertem Lernfeld; zugleich Schlüssel zu den passenden Relikten.
- **Relikte:** freiwillige Expertenvarianten bekannter Aufgaben; bringen Terrariummünzen, aber keine Sterne oder Kompetenz-Auszeichnungen.
- **Wissensalbum:** dauerhafte Sammlung der abgeschlossenen Lernfelder mit fünf Sternen und Themenillustration.
- Keine Wochenziele, keine Belohnung für reine Rundenzahl, keine Streak-Pflicht und kein Verlust bei Pausen oder Fehlern.

**Maßgebliche Quelle:** [docs/REWARD_SYSTEM.md](docs/REWARD_SYSTEM.md). Diese Datei ist eine Statusübersicht und darf keine abweichenden Belohnungsregeln definieren.

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
