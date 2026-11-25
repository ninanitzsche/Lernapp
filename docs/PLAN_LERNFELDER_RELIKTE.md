# Umsetzungsplan: Lernfelder, Kompetenzsterne, Wissensalbum, Pokal, Relikte, Denkimpuls

> **Stand:** 25.11.2026
> **Branch:** `design/luminous-fantasy-adventure`
> **Grundlage:** Produktentscheidungen aus `docs/specs/2026-11-22-feedback-runde-1/` (R5, R7, `design.md` Abschnitt 12) und die Freigabe des Projektinhabers vom 25.11.2026, diese Punkte umzusetzen.
> **Status:** Plan. Der Umsetzungsstand steht am Ende des Dokuments und in `FEATURES.md`.

## 1. Entschiedene Vorgaben (nicht erneut diskutieren)

- Ein Lernfeld hat genau fünf Kompetenzsterne. Sterne stehen für nachgewiesene Kompetenz, nicht für Zeit oder Fleiß.
- Die Sterne werden nacheinander verdient. Anspruchsvollere Aufgaben bleiben jederzeit spielbar, überspringen aber keinen Stern.
- Der Nachweis ist ausgewogen: unterschiedliche Aufgabenstellungen und mehrere Übungsrunden. Es gibt keine Mindestzahl an Spieltagen.
- Verdiente Sterne gehen nie verloren. Die Münzbelohnung je Stern (eine Münze) bleibt erhalten.
- Ein gemeistertes Lernfeld bleibt spielbar, ohne erneute Sterne oder Abschlussauszeichnung.
- Abschluss: Eintrag im Wissensalbum mit besonderer Schlangenillustration und ein Pokal.
- Terrarium: frei gestaltbare Sammlung. Pokale lassen sich platzieren und verschieben, die Sammlung bleibt vollständig.
- Relikte: kleines freiwilliges Randfeature, erst nach dem ersten Lernfeld-Abschluss sichtbar. Der Pokal öffnet die passenden Relikte. Relikte bringen Terrariummünzen, aber keine Sterne, Pokale oder Medaillen und ändern den regulären Lernstand nicht.
- Denkimpuls: erwünscht, die Aufgabe zählt weiter zum Kompetenznachweis, eine Münze weniger. Bestehende Hilfe und Lösungsanzeige bleiben. Eine angezeigte Lösung zählt nicht als selbstständiger Nachweis.
- Keine Belohnung für reine Rundenzahl, kein Wochenziel (bereits entfernt).

## 2. Festlegungen der Umsetzung (Annahmen, per Konfiguration änderbar)

**Lernfeld = bestehendes Thema.** Die drei Themen heißen bereits "Zehner und Einer" (A), "Zahlbilder" (B) und "Zahlenstrahl" (C) und entsprechen den Beispielen der Entscheidung. Ein neues Themengebiet wie Multiplikation wird später als eigenes Lernfeld ergänzt (R7.13).

**Nachweis.** Als Nachweis zählt eine Aufgabe, die im ersten Versuch richtig war. Dazu speichert der Spielstand je Lernfeld die letzten 80 solcher Nachweise mit Aufgabentyp, Stufe und Rundenzähler. Eine Aufgabe mit Tipp nach Fehlversuch oder mit angezeigter Lösung zählt nicht. Eine Aufgabe mit Denkimpuls zählt.

**Kriterien je Stern (Startwerte in `CONFIG.kompetenz`).** Eine höhere Stufe zählt auch für niedrigere Anforderungen. Sterne beruhen auf Stufe 1 und 2, damit der Fortschritt weiter auf mittleren Aufgaben ruht (R4.6). Kniffelige Aufgaben zählen dafür mit.

| Stern | Mindeststufe | Aufgabentypen des Lernfeldes | Treffer | Verschiedene Runden |
|---|---|---|---|---|
| 1 | leicht | mindestens 2 | 4 | 2 |
| 2 | leicht | alle | 6 | 3 |
| 3 | mittel | mindestens 2 | 5 | 3 |
| 4 | mittel | alle | 8 | 4 |
| 5 | mittel | alle | 14 | 6 |

Stern n wird erst vergeben, wenn Stern n minus 1 verdient ist. Diese Zahlen sind Startwerte ohne empirische Grundlage und gehören in den Praxistest. Die fachliche Freigabe der Kriterien durch die Projektinhaberin und ChatGPT als UX-Lead bleibt offen, bis dahin gelten sie als "umgesetzt, nicht freigegeben".

**Altstände.** Schon gespeicherte Sterne (0 bis 3) bleiben bestehen. Weitere Sterne brauchen neue Nachweise nach dem Update.

**Denkimpuls.** Ein optionaler Knopf vor der Antwort zeigt den vorhandenen Aufgabenhinweis. Die Münzminderung lässt sich nicht an eine einzelne Aufgabe binden, weil die App keine Münzen je Aufgabe vergibt. Umgesetzt wird: Pro genutztem Denkimpuls wird eine Münze der Runde abgezogen, höchstens bis die in dieser Runde verdienten Münzen aufgebraucht sind. Der Kontostand sinkt dadurch nie, bereits verdientes Geld bleibt unberührt. Diese Auslegung ist eine Produktentscheidung, die noch bestätigt werden muss.

**Relikte.** Je Aufgabentyp eines abgeschlossenen Lernfeldes gibt es ein Relikt mit fünf kniffeligen Aufgaben dieses Typs. Bei mindestens vier Treffern im ersten Versuch erhält das Kind einmalig `CONFIG.reliktMuenzen` (Startwert 2) Terrariummünzen und einen Meilenstein. Wiederholen ist erlaubt, bringt aber keine weiteren Münzen. Relikt-Aufgaben ändern weder Lernstand, Verlauf, Statistik, Futter noch Sterne.

**Platzhalter statt Assets.** Pokal und Albumillustration sind Platzhalter (Emoji beziehungsweise vorhandene Schlangengrafik). Die endgültigen Assets entstehen bei ChatGPT. Die Zuordnung liegt zentral in einer Datei, damit nur dort Bildpfade ersetzt werden.

## 3. Arbeitspakete

1. **Kompetenzlogik** (`src/logic/kompetenz.ts`): Nachweise, Kriterien, Sternvergabe, Fortschritt zum nächsten Stern. Tests zuerst.
2. **Spielstand und Rundenabschluss** (`game.ts`): Felder `nachweise`, bis zu fünf Sterne, Abzug für den Denkimpuls, Altstand-Verträglichkeit, Export und Import.
3. **Meilensteine** (`meilensteine.ts`, `rueckblick.ts`): neue Arten `lernfeld` und `relikt`, Reihenfolge der Feier, Album-Daten.
4. **Relikte** (`src/logic/relikte.ts`): Freischaltung über Pokale, Aufgabenbau, Abschluss mit Münzen. Tests zuerst.
5. **Oberfläche:** Themenkarte mit nächster Kompetenz und echtem Fortschritt, Wissensalbum, Pokale im Terrarium, Relikt-Ansicht, Denkimpuls-Knopf.
6. **Dokumentation und Prüfung:** `FEATURES.md`, `design.md`, `tasks.md`, README-Testanzahl nur aus dem tatsächlichen Lauf.

## 4. Nicht-Ziele

- Keine neuen Lernfelder oder Aufgabentypen.
- Keine finalen Grafiken und keine Änderung an Nico-Assets.
- Keine Änderung der Aufgabenerzeugung, der Rampe oder der Futterwerte.

## 5. Umsetzungsstand

Wird nach der Umsetzung mit tatsächlich ausgeführten Prüfungen ergänzt.
