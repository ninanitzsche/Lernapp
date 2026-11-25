# Belohnungs- und Fortschrittssystem

**Verbindliche Produktgrundlage für alle Belohnungen, Fortschrittsanzeigen und Sammelsysteme der Lernapp.**  
Stand: 25.11.2026

Dieses Dokument bündelt die gemeinsam festgelegten Produktregeln. Es verhindert, dass ältere Bestandsbeschreibungen oder technische Altimplementierungen als neue Produktentscheidungen missverstanden werden.

## 1. Grundprinzipien

1. Lernen und Belohnung sind klar getrennt: Kompetenz wird durch Sterne sichtbar, Futter lässt Nico wachsen, Münzen dienen dem Gestalten.
2. Jede Belohnung hat genau eine verständliche Funktion. Systeme dürfen einander nicht ersetzen.
3. Keine Strafe, kein Verlust und kein Zeitdruck. Fehler oder Pausen nehmen niemals Futter, Münzen, Sterne, Meilensteine oder gekaufte Gegenstände weg.
4. Freiwillige schwierigere Aufgaben sind erlaubt. Sie dürfen aber den regulären Kompetenzfortschritt nicht umgehen.
5. Belohnungen honorieren Lernen und besondere Leistungen, nicht bloße Nutzungsmenge, tägliches Einloggen oder eine bestimmte Spielhäufigkeit. Die ausdrücklich gewollte Tagesmitbringsel-Münze für die erste abgeschlossene Runde eines Tages ist eine begrenzte Ausnahme – keine Login- oder Streak-Prämie.
6. Alle Zahlenwerte sind zentral in `src/logic/config.ts` zu pflegen. Die Werte in diesem Dokument (Futter, Wachstumsschwellen, Münzen) sind Startwerte für den Praxistest und noch nicht fachlich abschließend freigegeben. Es gibt genau eine Wahrheit: Weichen Code und Dokument voneinander ab, wird die Abweichung zuerst gemeldet. Der Projektinhaber entscheidet, welche Seite gilt. Danach wird die andere Seite angeglichen, sodass keine Abweichung offen bleibt. Bis zur Entscheidung wird weder Code noch Dokument stillschweigend geändert.

### Begriffe (eindeutige Verwendung)

Das Wort "Stufe" steht in Texten nie allein, weil es sonst vier verschiedene Dinge meint:

| Begriff | Bedeutung | Wertebereich |
|---|---|---|
| Schwierigkeit | leicht, mittel oder knifflig einer einzelnen Aufgabe (im Code `Stufe`) | 1 bis 3 |
| Lernstand | Können je Aufgabentyp (Elternbereich, Rampe) | 0 bis 3 |
| Kompetenzstern | nachgewiesenes Können je Lernfeld | 1 bis 5 |
| Entwicklungsstufe | Wachstum von Nico (Baby bis Erwachsen/legendär) | 1 bis 5 |

In Kinder-Texten stehen nur "leicht", "mittel" und "knifflig". Die übrigen Dokumente verwenden diese Begriffe.

## 2. Futter und Wachstum

### 2.1 Bedeutung von Futter

- Futter ist die unmittelbare Belohnung für bearbeitete Lernaufgaben.
- Futter ernährt Nico und lässt ihn wachsen.
- Futter ist **keine Münze**, kein Kompetenznachweis und nicht im Shop ausgebbar.
- Das Futter wird nach einer beantworteten Aufgabe sichtbar gutgeschrieben.
- Wiederholungsaufgaben am Rundenende geben kein zusätzliches Futter.

### 2.2 Futter je Aufgabe

| Aufgabenschwierigkeit | Im 1. Versuch richtig | Im 2. Versuch richtig | Nicht gelöst |
|---|---:|---:|---:|
| Leicht (Schwierigkeit 1) | 2 | 1 | 0 |
| Mittel (Schwierigkeit 2) | 2 | 1 | 0 |
| Knifflig (Schwierigkeit 3) | 5 | 3 | 0 |

**Denkimpuls (Hilfe):** Nutzt das Kind vor der Antwort den Denkimpuls, bringt die Aufgabe nur das Futter eines zweiten Versuchs (leicht und mittel 1, knifflig 3), auch wenn sie sofort richtig gelöst wird. Wurde die Aufgabe ohnehin erst im zweiten Versuch gelöst, gibt es nicht noch weniger. Die Aufgabe darf weiterhin zum Kompetenznachweis beitragen. Münzen sind davon nicht betroffen.

Knifflige Aufgaben werden deutlich höher vergütet. Sie ersetzen aber nicht das Grundlagenüben: Sterne und die reguläre Freischaltung von Kompetenz beruhen weiterhin auf mittleren Aufgaben.

### 2.3 Rundenbonus und Serie

- Eine vollständig abgeschlossene normale Runde mit zehn Aufgaben bringt zusätzlich **5 Futter**.
- Eine vollständig abgeschlossene Knobelrunde mit zehn Aufgaben bringt zusätzlich **10 Futter**.
- Der Rundenbonus wird für das Abschließen aller Aufgaben vergeben, nicht für Geschwindigkeit.
- Drei Aufgaben hintereinander im ersten Versuch richtig lösen einen Serien-Jubel mit **+1 Futter** aus.
- Der Serienbonus wird höchstens einmal pro Runde vergeben. Wiederholungsaufgaben zählen nicht.
- Ein Fehler beendet nur die aktuelle Serie. Es gibt keinen Abzug und keine andere Strafe.

### 2.4 Tagesgrenze und Halbzeit

- Höchstens **drei Runden pro Tag** bringen Futter.
- Weitere Runden bleiben jederzeit möglich und aktualisieren weiterhin den Lernstand; sie bringen wegen des Tageslimits kein Futter.
- Das Tageslimit gilt gleichermaßen für normale und Knobelrunden.
- Nach Beantwortung der fünften Aufgabe erscheint einmal pro Runde eine Halbzeit-Karte. Sie zeigt den bisherigen Futterstand und den Abstand zur nächsten Entwicklungsstufe.
- Die Halbzeit vergibt weder Münzen noch eine zusätzliche Kompetenzbelohnung. Sie ist ein Zwischenstopp, kein Leistungsziel.
- Die Halbzeit darf nach Pause und Fortsetzen nicht erneut erscheinen.

### 2.5 Wachstumsschwellen

Nico hat fünf Entwicklungsstufen:

| Entwicklungsstufe | Entwicklungsname | Erforderliches Gesamtfutter |
|---|---|---:|
| 1 | Baby | 0 |
| 2 | Kleinkind | 30 |
| 3 | Kind | 90 |
| 4 | Teenager | 200 |
| 5 | Erwachsen / legendär | 350 |

- Wachstum ist dauerhaft. Futter und erreichte Entwicklungsstufen werden bei Pausen nicht zurückgesetzt.
- Sinkende Schwellen dürfen bestehende Schlangen niemals auf eine niedrigere Entwicklungsstufe zurücksetzen.
- Wenn ein alter Spielstand durch eine niedrigere Schwelle rechnerisch bereits eine höhere Entwicklungsstufe erreicht, wird diese übernommen, aber nicht nachträglich als neue Feier mit Münzen ausgezahlt.
- Wachstum wird schlangenspezifisch als Häutung gefeiert. Die Häutung ist nicht dasselbe wie der Abschluss eines Lernfeldes.

## 3. Schuppen – Schwierigkeit, nicht Belohnung

- Das Schuppenband zeigt die Schwierigkeit der **aktuellen Aufgabe**.
- Eine, zwei oder drei gefüllte Schuppen bedeuten leicht, mittel oder knifflig.
- Leere Schuppen bleiben als Umriss sichtbar.
- Die Bedeutung wird zusätzlich textlich und barrierearm vermittelt; Farbe allein reicht nicht.
- Semantische Farben des Schuppenbands: leicht Lime `#9bd93c`, mittel Amber `#ffb92e`, knifflig Lila `#6b4bd1`. Diese Farben kennzeichnen ausschließlich die Aufgabenschwierigkeit.
- Schuppen sind weder Sammelobjekte noch Währung und werden nicht verdient, ausgegeben oder als Wachstumspunkte gezählt.
- Die echten Schuppen auf Nicos Körper sind Teil seines Charakterdesigns. Sie sind nicht mit dem Schuppenband der Aufgabenoberfläche gleichzusetzen.

## 4. Sterne – nachgewiesene Kompetenz

- **Jedes Lernfeld hat genau fünf Kompetenzsterne.**
- Sterne stehen für nachgewiesenes Können, nicht für Fleiß, Zeit, Rundenzahl oder bloßes Ausprobieren.
- Die fünf Sterne werden zwingend nacheinander verdient. Ein höherer Stern setzt alle vorherigen Sterne voraus.
- Anspruchsvollere Aufgaben dürfen jederzeit ausprobiert werden, überspringen aber keinen Stern.
- Der Kompetenznachweis muss ausgewogen sein: unterschiedliche Aufgabenstellungen und mehrere Übungsrunden zählen.
- Eine Mindestanzahl von Lerntagen ist nicht erforderlich.
- Ein Denkimpuls darf weiterhin zum Kompetenznachweis beitragen.
- Eine angezeigte Lösung ist kein selbstständiger Kompetenznachweis. Eine spätere selbstständige Lösung kann ihn erbringen.
- Fehler oder ein später sinkender Kompetenzstand nehmen bereits verdiente Sterne nicht weg.
- Die konkreten Teilkompetenzen und Nachweiskriterien jedes einzelnen Sterns werden fachlich je Lernfeld festgelegt. Solange sie nicht freigegeben sind, dürfen keine Schwellen oder Bewertungsregeln erfunden werden. **Dokumentierte Ausnahme (Entscheidung des Projektinhabers, 25.11.2026):** Die vorhandenen Startwerte in `CONFIG.kompetenz` bleiben vorläufig bestehen, bis die fachliche Freigabe vorliegt. Sie sind keine freigegebene Produktregel, werden wie die Ampel im Praxistest nachgeschärft und dürfen nicht stillschweigend geändert werden.
- Die Grundlage des regulären Kompetenzfortschritts bleiben mittlere Aufgaben. Knobelaufgaben geben mehr Futter, ersetzen aber keine Grundlagen.

## 5. Münzen – Terrarium-Währung

- Münzen sind ausschließlich eine Spielwährung für Shop und Terrarium.
- Münzen kaufen keine Sterne, Kompetenzen oder Lernfeldabschlüsse.
- Der Shop führt Gegenstände mit Preisen von **1 bis 3 Münzen**.
- Gekaufte Gegenstände bleiben dauerhaft im Besitz. Platzieren, Verschieben oder Entfernen aus der sichtbaren Szene löscht den Besitz nicht.
- Ein erreichter Stern bringt nach der bestehenden Regel **eine Münze**.
- Jede neu überschrittene Entwicklungsstufenschwelle bringt nach der bestehenden Wachstumsbelohnung **eine Münze**. Werden in einer Runde mehrere Schwellen überschritten, zählt jede neu erreichte Entwicklungsstufe.
- **Denkimpuls und Münzen:** Ein Denkimpuls mindert keine Münzen. Münzen werden nie je Aufgabe vergeben, sondern erst am Ende eines abgeschlossenen Aufgabenbündels (Runde) oder bei einem Meilenstein. Die Wirkung des Denkimpulses auf das Futter steht in Abschnitt 2.2.
- Eine starke Knobelrunde (mindestens 7 von 10 Aufgaben im ersten Versuch richtig) bringt **2 Zusatzmünzen**, höchstens einmal pro Tag.
- Die **erste starke Knobelrunde überhaupt** bringt zusätzlich einmalig **1 Münze** als Knobel-Meilenstein. Damit kann die erste starke Knobelrunde insgesamt 3 Münzen aus diesen beiden Quellen bringen.
- Weitere einmalige Knobel-Meilensteine richten sich nach kumulierten kniffligen Aufgaben, die im ersten Versuch richtig gelöst wurden: 10 Treffer = 1 Münze, 25 Treffer = 2 Münzen, 50 Treffer = 3 Münzen. Diese Meilensteine sind von der täglichen Knobelrunden-Belohnung getrennt.
- Ein Relikt-Erfolg bringt beim ersten erfolgreichen Abschluss **2 Terrariummünzen**. Die fünf Aufgaben sind knifflige Varianten desselben Aufgabentyps; mindestens vier müssen im ersten Versuch richtig gelöst werden. Pro Relikt gibt es die Münzen nur einmal. Die konkreten Startwerte liegen in `CONFIG.reliktAufgaben`, `CONFIG.reliktMinTreffer` und `CONFIG.reliktMuenzen`.
- Die erste abgeschlossene Runde eines Kalendertages bringt **eine Tagesmitbringsel-Münze**. Weitere Runden desselben Tages bringen diese Münze nicht erneut. Eine Runde ist abgeschlossen, wenn das ganze Aufgabenbündel beantwortet ist; die Münze kommt am Ende dieser Runde. Sie wird unabhängig davon vergeben, ob die Antworten der Runde richtig waren. Das ist eine ausdrücklich gewollte Belohnung für die erste abgeschlossene Lernrunde des Tages, keine Login-Prämie.
- Es gibt keine Münzbelohnung für reine Rundenzahl, Wochenziele, bloßes Einloggen oder Nutzungsdauer.
- Fehler, Pausen und spätere Veränderungen des Lernstands ziehen keine Münzen ab.

## 6. Pokale und Orden – Lernfeldabschluss

- Wenn alle fünf Sterne eines Lernfeldes verdient sind, gilt dieses Lernfeld als gemeistert.
- Der Abschluss schaltet genau einen thematisch passenden Pokal/Orden und einen besonderen Eintrag im Wissensalbum frei.
- Pokal und Orden bezeichnen hier dieselbe Abschlussauszeichnung; es gibt kein zweites, paralleles Belohnungssystem.
- Der Pokal ist ein eigenständiger Gegenstand der Terrarium-Sammlung und zugleich der Schlüssel zu den passenden Relikten.
- Pokale/Orden können im Terrarium frei platziert und verschoben werden. Die vollständige Sammlung bleibt unabhängig von der aktuellen Platzierung erhalten.
- Ein abgeschlossenes Lernfeld bleibt normal spielbar. Es gibt beim erneuten Spielen keine weiteren Sterne und nicht erneut dieselbe Abschlussauszeichnung.
- Ein allgemeines, zusätzliches Abzeichen-System für beliebige Aktivitäten ist **nicht festgelegt**. Es wird nicht neben Pokalen/Orden eingeführt, solange dafür keine eigene Produktentscheidung besteht.

## 7. Relikte – freiwillige Knobelaufgaben

- Relikte sind ein kleines freiwilliges Zusatzfeature, kein Pflichtprogramm und kein eigenständiger großer Spielmodus.
- Der Reliktbereich bleibt unsichtbar, bis mindestens ein Lernfeld abgeschlossen wurde.
- Der Pokal eines Lernfeldes öffnet ausschließlich die zu diesem Lernfeld passenden Relikte.
- Relikte greifen bereits bekannte Inhalte auf und bieten anspruchsvollere Expertenvarianten zur Festigung.
- Sie verwenden die bestehende Aufgabenlogik.
- Je Aufgabentyp eines abgeschlossenen Lernfeldes wird ein Relikt freigeschaltet. Es enthält fünf knifflige Aufgaben dieses Typs.
- Bei mindestens vier Aufgaben, die im ersten Versuch richtig gelöst werden, ist das Relikt geschafft. Beim ersten Erfolg gibt es einmalig zwei Terrariummünzen und einen Meilenstein. Wiederholen ist erlaubt, bringt aber keine weiteren Münzen.
- Relikte vergeben **keine** Sterne, Pokale, Orden, Medaillen oder Kompetenz-Auszeichnungen.
- Reliktaufgaben verändern weder den regulären Lernstand noch Verlauf, Statistik, Futter oder Sternfortschritt.

## 8. Wissensalbum und Terrarium

### Wissensalbum
- Das Wissensalbum bewahrt dauerhaft jeden gemeisterten Lernfeldabschluss.
- Jeder Eintrag zeigt die fünf verdienten Sterne und eine eigens gestaltete, thematisch passende Illustration der Schlange.
- Album-Einträge bleiben erhalten, unabhängig davon, ob der zugehörige Pokal gerade im Terrarium platziert ist.

### Terrarium
- Das Terrarium ist eine frei gestaltbare Sammlung.
- Pokale/Orden und gekaufte Dekorationen können frei platziert und verschoben werden.
- Besitz und Sammlung bleiben vollständig erhalten, unabhängig von der aktuellen Platzierung.
- Das Terrarium ist Gestaltung und Spielspaß, kein Kompetenzmaßstab.

## 9. Meilensteine und Feiern

- Meilensteine werden genau einmal ausgelöst, mit Datum und einem kurzen Rückblick gespeichert und gehen nicht verloren.
- Relevante Meilensteinarten sind Schlangenentwicklung, neu verdiente Kompetenzsterne, Lernfeldabschluss und definierte Knobelerfolge. Relikt-Hinweise können nach einem Lernfeldabschluss folgen.
- Ein Rückblick enthält höchstens drei kurze Aussagen und verwendet ausschließlich tatsächlich gespeicherte Lerninformationen.
- Reine Nutzungsdauer, Spielzeit, Rundenzahl und Wochenziele sind keine Lern- oder Belohnungsziele.
- Treten mehrere Meilensteine gleichzeitig auf, werden sie nacheinander gezeigt. Der Lernfeldabschluss hat Vorrang vor nachgeordneten Relikt-Hinweisen. Mehr als drei aufeinanderfolgende Feiern werden zu einer gemeinsamen Karte zusammengefasst.
- Feiern haben keinen Zeitdruck. Das Kind schließt sie selbst mit „Weiter“ ab.
- Alte Spielstände erhalten bereits erreichte Meilensteine ohne nachträgliche Feier und ohne doppelte Münzauszahlung.

## 10. Stimmung ist keine Strafe

- Nicos Stimmung darf sich bei längerer Inaktivität kosmetisch verändern (hungrig nach etwa 24 Stunden, schlafend nach etwa 48 Stunden).
- Das ist ausschließlich eine Charakterreaktion. Es werden dadurch weder Futter noch Wachstum, Münzen, Sterne, Gegenstände oder Meilensteine abgezogen.
- Es gibt keine Streak-Pflicht und keinen Verfall von Fortschritt.

## 11. Quellenhierarchie und Pflege

- **Produktregeln und Bedeutung:** dieses Dokument (`docs/REWARD_SYSTEM.md`).
- **Testbare Muss-Anforderungen:** `docs/specs/2026-11-22-feedback-runde-1/requirements.md`. Sie konkretisiert diese Produktregeln; bei einem Widerspruch gilt dieses Dokument und die Anforderung muss korrigiert werden.
- **UX-Darstellung und Screens:** `docs/specs/2026-11-22-feedback-runde-1/design.md`. Dieses Dokument beschreibt die Darstellung, nicht eine abweichende Produktlogik.
- **Implementierung:** `src/logic/config.ts` und `src/logic/`. Code und Dokument dürfen nicht dauerhaft voneinander abweichen. Eine erkannte Abweichung wird gemeldet, der Projektinhaber entscheidet, danach wird die unterlegene Seite angeglichen.
- **Funktionsübersicht:** `FEATURES.md` fasst den Status zusammen und verweist hierher; sie definiert keine abweichenden Belohnungsregeln.
- **Archiv (obsolet):** `docs/archive/PHASE0_INVENTAR.md` dokumentiert einen früheren Stand. Zahlen und Beobachtungen daraus sind keine Vorgaben.

Vor Änderungen an Futter, Wachstum, Sternen, Münzen, Schuppen, Pokalen/Orden, Relikten, Meilensteinen, Album oder Terrarium ist dieses Dokument zu lesen und bei Bedarf zuerst zu aktualisieren.

## 12. Abgleich mit der Implementierung

Die folgenden Punkte beschreiben den geprüften Stand des Branches und verhindern, dass überholte Audits als Arbeitsauftrag missverstanden werden:

- Die aktive Sternlogik vergibt **fünf Kompetenzsterne je Lernfeld**. Die ältere Funktion `topicStars()` mit 0–3 Sternen bleibt ausschließlich als Migrations-Fallback für sehr alte Spielstände ohne gespeicherte Sternwerte erhalten.
- Wochenziele und Belohnungen für reine Rundenzahl sind entfernt.
- Das Tagesmitbringsel ist aktiv und ausdrücklich gewollt: eine Münze für die erste abgeschlossene Runde des Tages.
- Der Denkimpuls senkt das Futter der Aufgabe auf den Wert eines zweiten Versuchs (leicht und mittel 1 statt 2, knifflig 3 statt 5) und mindert keine Münzen. Münzen entstehen nur am Rundenende oder bei Meilensteinen.
- Eine starke Knobelrunde bringt laut `CONFIG.knobelMuenzen` zwei Münzen pro Tag; die erste starke Knobelrunde überhaupt bringt zusätzlich `CONFIG.ersteKnobelMuenze` (eine Münze). Kumulative Knobel-Meilensteine verwenden `CONFIG.knobelTreffer`.
- Ein Relikt-Erstabschluss bringt `CONFIG.reliktMuenzen` (zwei Münzen); spätere Abschlüsse desselben Relikts bringen nichts.
- Die Zahlenwerte liegen zentral in `src/logic/config.ts`. Rundenabschluss und Bonuspool werden in `src/logic/game.ts` berechnet; Knobel-/Lernfeld-Meilensteine in `src/logic/meilensteine.ts`, Relikt-Erstbelohnungen in `src/logic/relikte.ts` und Kompetenznachweise/Sterne in `src/logic/kompetenz.ts`.

Bei einer späteren Prüfung ist zwischen **gewollter Produktregel**, **tatsächlichem Implementierungsstand** und **historischem Prüfbericht** zu unterscheiden. Eine Codeabweichung wird nicht stillschweigend als neue Produktentscheidung interpretiert. Sie wird gemeldet, vom Projektinhaber entschieden und anschließend durch Anpassung der unterlegenen Seite geschlossen. Für die hier ausdrücklich festgelegten Regeln gilt die aktuelle Freigabe des Projektinhabers.
