# AI Collaboration Contract – Nico's Snake App

Dieses Dokument regelt die Zusammenarbeit und schützt den bestehenden Funktionsumfang.

## 1. Rollen

### ChatGPT – Creative Director / UX Lead
Verantwortlich für Produkterlebnis, UX-Kritik, visuelle Richtung, Designsystem, Screen-Spezifikationen, Mockups, visuelle Assets und Design-Reviews.

ChatGPT verändert im Rahmen visueller Aufgaben keine Anwendungslogik, Datenmodelle, Speicherung, APIs, Authentifizierung, Bewertung, Lernalgorithmen oder Kaufmechanik. Es behauptet keine Umsetzung oder Prüfung, die nicht tatsächlich erfolgt ist.

### Claude Code – Technical Lead / Implementer
Verantwortlich für Repository-Analyse, Architektur, React-/TypeScript-Implementierung, Integration, Logik, Datenhaltung, Tests, Build und Debugging. Claude Code setzt freigegebene Designs um und ändert sie nicht eigenmächtig.

### Projektinhaber
Der Projektinhaber entscheidet abschließend über Umfang, Prioritäten, Design und Ausnahmen. Bei widersprüchlichen oder unklaren Anforderungen wird vor einer folgenreichen Änderung nachgefragt.

## 2. Verbindliche Projektquellen

- `docs/REWARD_SYSTEM.md` ist die maßgebliche Produktquelle für Futter, Wachstum, Schuppen, Sterne, Münzen, Pokale/Orden, Relikte, Meilensteine, Wissensalbum und Terrarium. `FEATURES.md` ist nur eine Statusübersicht; historische Inventare und der aktuelle Code dürfen keine abweichenden Regeln begründen.
- `docs/specs/2026-11-22-feedback-runde-1/requirements.md` formuliert die dazugehörigen testbaren Muss-Anforderungen.
- `FEATURES.md` ist eine knappe Statusübersicht, keine zweite Spezifikation.
- `docs/PHASE0_INVENTAR.md` ist ein historischer Snapshot und keine aktuelle Arbeitsanweisung.

Vor jeder relevanten Arbeit sind die jeweils passenden Dateien zu lesen:

1. `CLAUDE.md` – verbindliche Kurzregeln und Einstieg.
2. `docs/AI_COLLABORATION_SPEC.md` – Rollen und Zusammenarbeit.
3. `docs/DESIGN_SYSTEM.md` – aktuell gültige visuelle Entscheidungen.
4. `docs/ROADMAP_DESIGN.md` – aktueller Arbeitsstand und nächste Schritte.
5. `docs/PHASE0_INVENTAR.md` – technische und visuelle Ausgangslage.
6. `FEATURES.md` – bestehende Produktfunktionen, die zu erhalten sind.

Bei Konflikten gilt folgende Reihenfolge: aktuelle ausdrückliche Anweisung des Projektinhabers, freigegebene Produkt- und Designentscheidungen, danach die tatsächliche Implementierung als Beleg für den Ist-Zustand, zuletzt Annahmen. Code beschreibt nicht automatisch das gewünschte Soll. Bei einer ausdrücklich vom Projektinhaber bestätigten bestehenden Implementierung (aktuell: Tagesmitbringsel und Denkimpuls-Münzabzug) wird diese als Produktregel dokumentiert. Andere Widersprüche werden nicht stillschweigend entschieden.

## 3. Produktschutz

- Alle bestehenden Funktionen, Lernabläufe, Belohnungen, Shop- und Terrarium-Mechaniken, Navigation, Speicherformate und Nutzerdaten bleiben erhalten.
- Ein visueller Auftrag ist keine Erlaubnis, Funktionen zu entfernen, zu vereinfachen, zu ersetzen oder neue Produktmechaniken einzuführen.
- UI-Texte, Zahlen, Buttons und interaktive Zustände bleiben echte responsive Komponenten. Generierte Bilder sind Assets, kein Ersatz für UI.
- Bestehende Komponenten bevorzugt anpassen statt eine parallele UI-Architektur aufzubauen.
- Neue Abhängigkeiten nur mit nachvollziehbarer Begründung und vorheriger Abstimmung bei relevanten Auswirkungen.
- Keine Zugangsdaten, Geheimnisse, persönlichen Daten oder Environment-Dateien committen.

## 4. Verbindliche Designrichtung

Die freigegebene Richtung heißt **Luminous Fantasy Adventure**:
- Hochwertige, stilisierte 3D-Fantasy-Spielwelt.
- Smaragdgrün, Giftgrün, warmes Gold, Mitternachtsblau und warmes Creme.
- Nico entwickelt sich vom niedlichen Baby zur kraftvollen, leuchtenden Legende aus dem bestehenden Logo.
- Das Original-Logo bleibt unverändert.
- Glow und Partikel werden gezielt eingesetzt, nicht flächendeckend.
- Lernaufgaben bleiben ruhig, hell, kontrastreich und besonders gut lesbar.
- Das Terrarium darf die visuell reichste Ansicht sein; Lernansichten priorisieren Konzentration.
- Bewegungen sind kurz, sinnvoll und möglichst mit Reduced-Motion-Verhalten.

**Gerätepriorität:** Smartphone im Hochformat zuerst. Tablet und Desktop bleiben responsiv nutzbar.

**Logo-Quelle:** `public/images/logo.webp`. Sie bleibt unverändert. Für den Splash ist die Verwendung des Originals mit seinem vorhandenen Hintergrund auf einem dunklen Hintergrund freigegeben. Eine transparente Ableitung ist zurückgestellt und darf nicht durch einfache, sichtbar schädliche Hintergrundentfernung ersetzt werden.

## 5. Arbeitsablauf

1. Branch, relevante Dateien, Komponenten und Dokumentation prüfen.
2. Umfang und ausdrücklich ausgeschlossene Änderungen festhalten.
3. Designziel und Abnahmekriterien dokumentieren.
4. Kleinste zusammenhängende Änderung umsetzen.
5. Relevante Tests, Typprüfung und Produktionsbuild ausführen, soweit möglich.
6. UI am Smartphone-Hochformat prüfen; weitere Viewports passend zum Auftrag kontrollieren.
7. Betroffene Bestandsfunktionen auf Regressionen prüfen.
8. Roadmap nur mit belegtem Status aktualisieren.
9. Änderungen, Prüfungen, Ergebnisse und offene Punkte transparent berichten.

Statusbegriffe sind eindeutig zu verwenden:
- **Entworfen:** Spezifikation liegt vor.
- **Implementiert:** Änderung ist im Code vorhanden.
- **Verifiziert:** relevante Prüfung wurde tatsächlich ausgeführt.
- **Offen / Blockiert:** noch nicht erledigt oder abhängig von einer Entscheidung.

Keine Tests, Builds, Browserprüfungen oder Deployments als erfolgreich melden, wenn sie nicht selbst ausgeführt und überprüft wurden.

## 6. Handoff und Review

Design-Handoffs enthalten bei Bedarf:
- Screen/Komponente und Nutzerziel
- Layout-Hierarchie und responsive Verhalten
- Farben, Typografie und Komponenten
- Zustände und Interaktionen
- Assets, Platzierung und Zuschnitt
- Lesbarkeit, Touch-Bedienung und Accessibility
- ausdrücklich zu erhaltendes Verhalten
- Abnahmekriterien und Nicht-Ziele

Reviews unterscheiden beobachtete Probleme von Vermutungen und formulieren konkrete, priorisierte Änderungen.

## 7. Branches und Commits

- Designarbeit erfolgt auf `design/luminous-fantasy-adventure`, sofern nichts anderes vereinbart wurde.
- Kein Push auf `main` und kein Merge ohne ausdrückliche Freigabe.
- Commits bleiben fokussiert und nachvollziehbar.
- Vor dem Commit Diff auf unbeabsichtigte Änderungen, Geheimnisse und Regressionen prüfen.
- Gemeinsame Dateien vor dem Ändern erneut aus dem aktuellen Branch lesen. Keine fremden Änderungen überschreiben.

## 8. Definition of Done

Eine Aufgabe ist erst abgeschlossen, wenn der vereinbarte Umfang umgesetzt, das bestehende Verhalten im betroffenen Bereich erhalten, die relevanten Prüfungen ausgeführt und dokumentiert sowie die UI am primären Smartphone-Viewport geprüft wurde. Dokumentation und Roadmap müssen den tatsächlichen Stand wiedergeben.
