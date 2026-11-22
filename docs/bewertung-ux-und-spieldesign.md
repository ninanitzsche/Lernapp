# Mathe-Schlange: Bewertung aus UX/UI- und Spieldesign-Sicht

Stand: 2026-11-22. Grundlage: Quellcode, Spezifikation, CSS, Spiellogik und Testlauf (85 von 85 Tests grün). Die App wurde nicht visuell im Browser ausprobiert und nicht mit einem Kind getestet. Alle Aussagen zur Wirkung beim Kind sind deshalb begründete Annahmen und gehören in den Praxistest.

## Gesamturteil

Für eine V1 ist die App ungewöhnlich ausgereift. Die Mathematik ist durch Tests abgesichert, der Ton der Schlange ist durchdacht, die Gestaltung hat eine klare eigene Identität, und die pädagogischen Leitplanken (kein Zeitdruck, kein Verlust, keine Strafe) sind konsequent umgesetzt. Die größten Schwächen liegen nicht im Handwerk, sondern in der langfristigen Motivation und in der Ökonomie: Nach den ersten zwei bis drei Wochen läuft die App Gefahr, ihre Antriebskraft zu verlieren.

Gesamtnote: UX/UI 8 von 10, Spieldesign 6,5 von 10.

## Teil 1: UX/UI

### Was gut funktioniert

**Eigene visuelle Identität.** Das Konzept "beleuchtetes Terrarium" (dunkles Moos, warmes Laternenlicht, helle Papierkarten für alles, was gelesen wird) ist stimmig und nicht austauschbar. Die Trennung ist klug: dunkle Fläche für Atmosphäre, helle Karten für Inhalt. Das ist eine bewusste Lesbarkeitsentscheidung und keine Dekoration.

**Kontrast.** Nachgerechnet nach WCAG: Haupttext auf Moos 13,6:1, Nebentext auf Moos 9,3:1, Tinte auf Papier 14,0:1, Nebentext auf Papier 6,6:1, Tinte auf den Lime- und Amber-Tasten je rund 8,6:1, weiß auf Blau 5,3:1, weiß auf Lila 5,9:1. Alles liegt über der Schwelle von 4,5:1. Das ist für ein Kinderprodukt überdurchschnittlich.

**Haptische Tasten.** Die Tasten mit dicker Unterkante, die beim Drücken einsinken, sind ein bewährtes Muster für Kinder: Sie erklären sich selbst und geben sofortiges Feedback. Mindestgrößen (52 bis 64 px) erfüllen die Spezifikation.

**Eigenes Zifferfeld.** Die Handy-Tastatur bleibt zu, die Aufgabe bleibt sichtbar, Zahlen sind groß. Das ist eine der wichtigsten Entscheidungen für Mobilgeräte und sie ist richtig getroffen.

**Fehlerkultur.** Falsch bedeutet nie Rot und nie Abzug. Die Schlange bekommt "falsches Futter" geliefert (Schuh, Socke), der Fehler gehört dem Futter-Lieferdienst, nicht dem Kind. Das ist psychologisch sauber und gleichzeitig lustig. Es passt zur Vorgabe "lustig statt fies".

**Barrierefreiheit.** Sichtbarer Tastaturfokus (4 px, hoher Kontrast), `prefers-reduced-motion` wird respektiert, `aria-live` für Rückmeldungen, `aria-label` an Sternen und Fortschrittsbalken, Emoji sind `aria-hidden`. Vorlesen ist eingebaut, was für Zweitklässler mit Leseschwäche entscheidend sein kann.

**Eltern getrennt.** Der Elternbereich ist bewusst ruhig und hell gehalten, Zurücksetzen ist mit einer Bestätigung gesichert, die Erinnerung zur Sicherung erscheint erst nach 14 Tagen.

### Probleme und Verbesserungen, nach Priorität

**1. Abbruch ohne Rückfrage (hoch).** In `Round.tsx` ruft "Zurück" sofort `onAbort` auf. Ein versehentlicher Tipp wirft die ganze Runde weg, ohne Futter. Für ein Kind, das noch unsicher navigiert, ist das ein klassischer Frustmoment. Empfehlung: Rückfrage in kindgerechter Sprache ("Runde wirklich verlassen? Deine Antworten bis hierher gehen verloren") mit der Hauptaktion "Weiterüben" als größtem Knopf.

**2. Technische Beschriftung in der Runde (mittel bis hoch).** Die Zeile `.thema` zeigt etwas wie "Zahlbilder: Zahlbild lesen | Knobelrunde | Buch S. 15". Für ein Kind sind das Fachbegriffe und Metadaten, die ablenken. Die Quellenangabe ist für Eltern nützlich, gehört aber in den Elternbereich. Empfehlung: Für das Kind nur ein kurzer Aufgabenname, den es versteht, oder gar nichts.

**3. Zu viel Erklärtext für die Zielgruppe (mittel).** Die Themenseite enthält Absätze wie "Schwerere Aufgaben. Wenn mindestens 7 von 10 gleich beim ersten Versuch stimmen, gibt es 1 Extra-Münze (einmal pro Tag)" in 0,88 rem. Das ist eine Regel für Erwachsene, nicht für einen Siebenjährigen. Die Schrift ist klein, der Satz lang und verschachtelt. Empfehlung: Regeln auf eine Kernaussage kürzen ("Knifflig. Schaffst du 7 richtig, gibt es eine Münze extra"), größer setzen, den Rest in den Elternbereich verschieben.

**3b. Navigation auf der Startseite (mittel).** Der Startbildschirm hat einen Hauptknopf und drei Nebenziele (Themen und Buch, Shop, Für Erwachsene), plus Wochenanzeige und gelegentliche Sicherungshinweise. Der Hinweis "Hinweis für Erwachsene: Bitte den Stand einmal sichern" erscheint direkt vor dem Kind. Empfehlung: Erwachsenenhinweise nur im Elternbereich anzeigen, auf der Kinderseite höchstens ein kleines Symbol.

**4. Der Kopf der Unterseiten ist improvisiert (niedrig).** In `App.tsx` wird die Zurück-Zeile mit einem leeren `<span style={{ width: 48 }} />` ausbalanciert. Das ist fragil und bricht bei anderen Schriftgrößen. Zudem ist "Zurück" ein heller Papierknopf ohne Symbol. Empfehlung: Ein einheitlicher Kopf mit Pfeil-Symbol, gemeinsame Komponente.

**5. Zähler-Sprache (niedrig bis mittel).** "Futter", "Münzen", "Sterne", "Stufe", "Wochenziel": fünf Fortschrittsbegriffe auf einmal. Jede Zahl steht für etwas anderes (Futter lässt die Schlange wachsen, Sterne und Stufen geben Münzen, Münzen kaufen Dinge). Für ein Zweitklässler-Gedächtnis ist das viel. Empfehlung: Beim ersten Start eine kurze, geführte Einführung (zwei bis drei Bilder, vorgelesen), die den Kreislauf zeigt: Richtig, Futter, Wachsen, Münzen, Terrarium.

**6. Deaktivierter Zustand (niedrig).** Gedeaktivierte Tasten (`#d5e6dc` auf `#6c8a7c`) kommen nur auf 2,9:1. Das ist bei deaktivierten Elementen formal erlaubt, aber ein Kind erkennt so kaum, warum der Knopf nicht geht (zum Beispiel "Prüfen" ohne Eingabe). Empfehlung: Zusätzlich ein kurzes Signal, was fehlt.

**7. Sterne im Aus-Zustand (niedrig).** Leere Sterne (`#d8cfb4` auf Papier) haben 1,5:1. Leere Zustände dürfen leise sein, hier sind sie aber fast unsichtbar. Für ein Fortschrittsziel ("noch zwei Sterne zu holen") ist ein stärkerer Umriss hilfreich.

**8. Terrarium nur per Zeigergerät bedienbar (niedrig).** Die Dinge lassen sich ziehen, eine Tastaturalternative fehlt. Für die Zielgruppe zweitrangig, wird aber relevant, falls ein Kind motorisch eingeschränkt ist.

**9. Dauerhafte Animationen (niedrig).** Die Schlange atmet oder wackelt dauerhaft, dazu Hinweise mit Glühbirnen-Wippen. Beides ist abschaltbar über die Systemeinstellung, aber ein Schalter in der App selbst wäre kindgerechter und elternfreundlicher.

**10. Stimmung und Ton (niedrig).** Sprüche wie "Das Futter-Lieferdienst-Team ist heute in Topform!" sind witzig, aber teilweise für Erwachsene geschrieben. Ob ein Siebenjähriger das versteht, zeigt nur der Test. Positiv: Es gibt viele Varianten, damit sich nichts abnutzt.

### Visuelle Handschrift

Die Gestaltung vermeidet die gängigen Schablonen (keine Cremefarbe mit Terrakotta, kein schwarzer Grund mit Neon, keine Karten-Raster). Die Farben stammen aus den Bildern der Schlange und des Terrariums, das ist ein sauberer Ansatz. Zwei Anmerkungen: Das Auftreten von Emoji (🪙, 🛍️, 🧠, 🔊, 💡) als Symbole neben handgemalten Schlangen- und Shop-Bildern erzeugt einen Stilbruch. Emoji sehen auf jedem Gerät anders aus. Einheitliche, eigene Symbole für Münze, Shop, Vorlesen und Tipp würden die Identität deutlich schärfen. Außerdem wirkt ein einziger starker Moment (das Terrarium mit der Schlange) bereits sehr gut, die übrigen Bildschirme sind zweckmäßig und ruhig. Das ist die richtige Gewichtung.

## Teil 2: Spieldesign

### Was gut funktioniert

**Klare Kernschleife.** Aufgabe lösen, Futter bekommen, Schlange frisst, wächst, Münzen, Terrarium einrichten. Jede Stufe der Schleife hat sichtbares und hörbares Feedback. Besonders gelungen ist die Verknüpfung von Fehler und Spielwelt: Falsches Futter wird ausgespuckt statt bestraft.

**Kurze Sitzungen mit natürlichem Ende.** Zehn Aufgaben, höchstens drei Futterrunden pro Tag, danach ist die Schlange satt. Das schützt vor Dauerspielen und passt zur Forschung zum verteilten Üben, auf die sich die Spezifikation stützt (Dunlosky et al., 2013). Das ist ein bewusster und seltener Verzicht auf Engagement-Maximierung und sollte unbedingt bleiben.

**Lernlogik im Spiel.** Fehlerhafte Aufgaben kehren am Rundenende in veränderter Form zurück (höchstens drei). Der Lernstand je Aufgabentyp (0 bis 3) steuert, welche Typen häufiger kommen (60 Prozent schwach, 30 Prozent mittel, 10 Prozent stark). Zwei Versuche mit Tipp dazwischen sind pädagogisch sinnvoll. Das ist echte adaptive Übung und kein bloßes Zufallsspiel.

**Kein Verlustdruck.** Die Schlange verliert nie Wachstum, wird nie krank. Der Wochenbonus ersetzt einen Streak, verpasste Tage kosten nichts. Das ist im Einklang mit der Forschung zur Motivation (Deci, Koestner & Ryan, 1999) und für ein Lernspiel richtig.

**Selbstbestimmung durch das Terrarium.** Die Dinge frei zu platzieren gibt dem Kind Gestaltungsfreiheit, die nichts mit Rechnen zu tun hat und genau deshalb die innere Bindung an die Schlange stärkt.

**Testbarkeit.** Alle Spielwerte stehen in `config.ts`, die Logik ist rein und getestet. Das macht Balancing nach dem Praxistest einfach.

### Probleme und Risiken, nach Priorität

**1. Die Münzökonomie läuft nach dem Start trocken (hoch).** Nachgezählt: Der Shop hat 44 Dinge, die Preise summieren sich auf 89 Münzen (14 Dinge zu 1, 15 zu 2, 15 zu 3). Die Quellen sind: 9 Sterne (3 Themen mal 3), 4 Stufenaufstiege, 1 Münze pro Woche bei Erreichen des Wochenziels und 1 Münze pro Tag über die Knobelrunde. Das heißt: Rund 13 Münzen gibt es früh, danach fließt es nur noch tröpfchenweise. Realistisch bringen Wochenziel und Knobelrunde zusammen höchstens etwa 8 Münzen pro Woche, aber die Knobelmünze verlangt mindestens 7 von 10 Aufgaben beim ersten Versuch auf schwereren Aufgaben. Wer die Knobelrunde nicht regelmäßig schafft, hat nach zwei bis drei Wochen kaum noch etwas zu kaufen. Der Shop ist der stärkste sichtbare Anreiz der App, und er wird nach kurzer Zeit leer sein. Empfehlung: Eine Kurve entwerfen (zum Beispiel alle zwei bis drei Tage etwas Neues erreichbar), Münzen auch für das Beenden einer Runde geben, und Preise an die tatsächlich erreichbaren Einnahmen koppeln. Das lässt sich nur mit einer Simulation oder einem Praxistest sauber justieren.

**2. Die Inhaltsdecke ist niedrig (hoch).** Es gibt nur zehn Aufgabentypen in drei Themen, jeder Typ hat Stufen von 0 bis 3, und die Stufe steigt schon bei drei richtigen Antworten im ersten Versuch. Ein Kind, das ordentlich rechnet, hat alle neun Sterne vermutlich innerhalb weniger Tage. Danach bleiben nur das Futter und die Stufen. Das ist erst dann ein Problem, wenn das Kind das Thema schon kann (dann ist die App erfüllt), aber es ist ein Risiko für die Behauptung "langfristiges Üben". Empfehlung: Entweder bewusst als kurze Testvorbereitung positionieren, oder früh weitere Themen (die Spezifikation nennt Plus und Minus) einplanen.

**3. Die Pflegeschleife fehlt (mittel).** Ein Tamagotchi lebt von Bedürfnissen: hungrig, müde, will spielen. Hier ist die Stimmung rein kosmetisch (froh, hungrig, schläft) und hat keinen Handlungsanreiz. Das ist eine bewusste und pädagogisch gut begründete Entscheidung, hat aber einen Preis: Es gibt keinen "Ich muss nachsehen"-Moment. Der Anreiz zum Wiederkommen kommt nur aus dem Wochenziel. Empfehlung: Ein positiver Rückkehrgrund ohne Druck, zum Beispiel eine kleine Überraschung beim ersten Öffnen am Tag (die Schlange hat etwas mitgebracht) oder Tagesaufgaben, die man ablehnen kann.

**4. Futter ist die falsche Währung für Fortschritt (mittel).** Die Stufen sind an Futter gebunden (60, 150, 300, 500). Futter gibt es für richtige Antworten, also wächst die Schlange auch durch Raten und Wiederholen derselben Aufgaben. Das Tageslimit dämpft das, aber nicht den Anreiz, schnell zu klicken. Das Risiko ist klein, solange Lernstand und Sterne getrennt laufen (das tun sie), und es ist durch das Limit begrenzt. Es lohnt sich im Praxistest zu beobachten, ob das Kind rät, um schneller zu füttern.

**5. Das Wochenziel ist großzügig (niedrig).** Drei Tage pro Woche mit je einer Runde gibt 20 Futter, eine Münze und einen Stern. Das ist pädagogisch richtig niedrig angesetzt. Der Bonus ist aber im Verhältnis zur Stufenschwelle (60 Futter für Kleinkind) sehr groß, ein Wochenbonus allein deckt ein Drittel der ersten Stufe. Prüfen, ob das gewollt ist.

**6. Wiederholungen ohne Futter (niedrig).** Wiederholte Aufgaben am Rundenende geben kein Futter, zählen aber für den Lernstand. Aus Lernsicht richtig, aus Kindersicht eine Runde, in der man arbeitet und nichts bekommt. Die Rückmeldung "Die Aufgabe kommt später noch einmal" kündigt das an, das ist gut. Ob es motiviert, zeigt der Test.

**7. Die Feier des Aufstiegs ist der Höhepunkt, kommt aber selten (niedrig).** Es gibt nur vier Aufstiege. Der Wachstumsmoment mit Konfetti ist das emotionale Highlight und wird hoch investiert. Zwischen den Aufstiegen fehlen kleinere Meilensteine (zum Beispiel jede 25 Futter ein kleiner Gruß oder ein Sammelobjekt). Der Fortschrittsbalken füllt sich sichtbar, das hilft, ersetzt aber keine Zwischenziele.

### Passung zur Zielgruppe

Ein Zweitklässler kann mit der Kernschleife sofort etwas anfangen, die Schlange ist klar und freundlich, das Terrarium ist ein Gestaltungsspielzeug. Die Mathematik folgt dem Lehrwerk und ist an das Transparenzpapier zum Test angebunden. Das ist der größte Pluspunkt: Die App löst ein echtes, konkretes Problem.

## Empfohlene Reihenfolge der nächsten Schritte

1. Abbruch der Runde mit Rückfrage absichern (kleiner Aufwand, großer Frustschutz).
2. Kind-Beschriftungen aufräumen: technische Zeile in der Runde und lange Regeltexte kürzen oder in den Elternbereich verschieben.
3. Kurze, vorgelesene Einführung beim ersten Start einbauen.
4. Münzökonomie mit einer kleinen Simulation prüfen (realistische Einnahmen pro Woche gegen die Gesamtsumme von 89 Münzen) und Einnahmequellen oder Preise anpassen.
5. Praxistest mit dem Kind, dabei gezielt beobachten: Versteht es den Kreislauf ohne Hilfe, rät es, will es am dritten Tag freiwillig wiederkommen?
6. Danach über Inhaltserweiterung (weitere Themen) und kleine Zwischenmeilensteine entscheiden.

## Quellen

- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving Students' Learning With Effective Learning Techniques. Psychological Science in the Public Interest, 14(1), 4-58.
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin, 125(6), 627-668.
- W3C: Web Content Accessibility Guidelines (WCAG) 2.2, Erfolgskriterium 1.4.3 Kontrast (Minimum). https://www.w3.org/TR/WCAG22/
- Projektdateien: `docs/spec.md`, `src/logic/game.ts`, `src/logic/config.ts`, `src/logic/shop.ts`, `src/ui/*`, `src/index.css`
