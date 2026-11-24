# Phase 0 – Bestandsaufnahme (Stand 2026-11-24)

> Branch: `design/luminous-fantasy-adventure`, Ausgangspunkt Commit `eb6e3be`.
> Grundlage: Prüfung des Quellcodes und der Assets. Es wurde **keine** Anwendungslogik und **kein** Asset verändert.
> Nicht geprüft: Darstellung im Browser oder auf einem Smartphone.

## 1. Ansichten (View-Typ in `src/App.tsx`)

`home`, `round`, `result`, `haeutung`, `parent`, `shop`, `themen`, `album`. Die Navigation erfolgt über einen `useState`-Wert, es gibt keinen Router. Zusätzlich gibt es einen Startgruß (`Startgruss`) und einen Willkommensbildschirm (`Willkommen`) für neue Nutzer.

## 2. Komponenten

| Datei | Zeilen | Inhalt |
|---|---|---|
| `src/App.tsx` | 302 | App, AppInhalt, Startgruss, Seitenkopf, AlbumAnsicht, Themen, ShopAnsicht, Willkommen, Ergebnis |
| `src/ui/Snake.tsx` | 243 | Blase, SchlangenBild, FortschrittBalken, Snake, TerrariumVorschau, RundenSchlange, ErgebnisSchlange |
| `src/ui/TaskView.tsx` | 244 | Aufgabenansicht, Ziffernblock, Auswahl, Ordnen, Legen, StrahlEingabe, Karten |
| `src/ui/Round.tsx` | 256 | Rundenablauf |
| `src/ui/Parent.tsx` | 179 | Elternbereich |
| `src/ui/Visuals.tsx` | 139 | Zahlbild, Stellentafel, Zahlenstrahl, LoesungsBild |
| `src/ui/Shop.tsx` | 81 | Muenzen, Shop |
| `src/ui/Haeutung.tsx` | 73 | Häutungs-Ansicht |
| `src/ui/Terrarium.tsx` | 70 | Terrarium |
| `src/ui/Einfuehrung.tsx` | 67 | Einführung |
| `src/ui/Album.tsx`, `Halbzeit.tsx`, `Schuppen.tsx`, `Treppe.tsx`, `TonKnopf.tsx`, `Info.tsx` | 11 bis 41 | Kleinere Bausteine |
| `src/ui/feier.ts`, `klang.ts`, `reaktion.ts`, `stimme.ts` | – | Effekte, Sound, Reaktionen, Sprachausgabe (keine Optik, nicht anfassen) |

Logik liegt getrennt in `src/logic/` und `src/storage.ts` und ist für den visuellen Relaunch nicht vorgesehen.

## 3. Styling und Tokens

- Eine einzige Stylesheet-Datei: `src/index.css` (521 Zeilen), globales CSS mit deutschen Klassennamen. Kein CSS-in-JS, kein Tailwind, keine Komponentenbibliothek.
- 19 CSS-Variablen in `:root`. Daneben 81 feste Hex-Farben und 48 rgba-Angaben direkt in Regeln. Ein Austausch der Palette erfordert deshalb mehr als das Ändern der Variablen.
- Aktuelle Palette (Moos und Papier): `--nacht #0f2f26`, `--nacht-hell #1b5240`, `--papier #fff8e6`, `--tinte #1c2b24`, `--lime #9bd93c`, `--amber #ffb92e`, `--blau #2a6fb0`, `--lila #6b4bd1`, `--koralle #ff7a63`.
- Designsystem-Farben (`#9DFF00`, `#00C853`, `#064D30`, `#FFD329`, `#FF9D16`, `#071D35`, `#FFF4DE`) sind noch nicht im Code.
- Schrift: reiner System-Fontstack (`ui-rounded`, `SF Pro Rounded`, `Nunito`, …). Kein `@font-face`, keine mitgelieferte Schriftdatei.
- Button-System: `.knopf` mit Varianten `.klein`, `.gross`, `.gefahr`, `.preis`, `.ziffer`. Dicke Unterkante, sinkt beim Drücken ein. Die Touch-Höhe liegt bei mindestens 52 px (groß 64 px, Preis 44 px, Ziffern 42 bis 64 px).
- Weitere Bausteine: `.karte`, `.thema-karte`, `.balken`, `.sterne`, `.muenzen`.
- Responsive: `main` mit `max-width: 640px`, `height: 100dvh`, Safe-Area-Insets, ein `@media (max-height: 680px)`. Kein Breakpoint nach Breite. Es gibt vier `prefers-reduced-motion`-Blöcke.
- Animationen: ca. 25 `@keyframes` (Fliegen, Hüpfen, Wachsen, Konfetti usw.).

## 4. Assets

| Asset | Befund |
|---|---|
| `public/images/logo.webp` (Originalquelle) | 1254 × 1254 px, **RGB ohne Alpha**, dunkler Hintergrund mit Glow |
| `public/images/logo/nicos-snake-app.webp` | 1254 × 1254 px, RGB ohne Alpha |
| `public/images/snake/snake-logo.png` | 1254 × 1254 px, RGB ohne Alpha |
| Schlangenstufen `snake-baby`, `smallChild`, `child`, `adult` | RGBA, Alpha 0 bis 255 |
| `snake-teen.png` | RGB, **ohne** Alpha |
| `public/images/snake/app/*.webp` | 5 Gesichtsvarianten (standard, happy, eating, surprised, tired) je Stufe, Teenager und Erwachsener teils weniger |
| Logo-Verwendung im Code | `App.tsx`: Startgruss, Startseite, Willkommen. Klassen `.start-logo`, `.willkommen-logo` |
| Icons | `public/icon-192.png`, `apple-touch-icon.png`, `images/logo/icon-192.png`, `icon-512.png`, `favicon-64.png`; Manifest verweist auf `images/logo/icon-*.png` |
| Unaufgeräumt | `public/images/snake/adult/` enthält ChatGPT-Rohbilder mit Leerzeichen und Umlauten im Dateinamen. Nicht gelöscht. |

## 5. Logo-Transparenz (Prüfung)

Das Original `public/images/logo.webp` wurde nicht verändert. Die Testdateien liegen außerhalb des Repositories und sind nicht Teil des Commits.

### 5.1 Technische Analyse (gemessen)

- Das Original ist 1254 × 1254 px im Modus RGB. Es hat **keinen Alpha-Kanal**, der Hintergrund ist eingebrannt. Dasselbe gilt für `logo/nicos-snake-app.webp` und `snake/snake-logo.png`.
- Die Randpixel sind **nicht einfarbig**. Gemessen wurden z. B. RGB 2/15/29 in den Ecken, 0/43/40 oben Mitte und 1/82/45 am rechten Rand. Das grüne Leuchten reicht also bis an den Bildrand.
- Ein Testverfahren (Hintergrundfarbe als Median des Randes, Farbabstand je Pixel als Alpha-Wert, Farben entmischt) ergab rund 26 % fast vollständig transparente und rund 21 % halbtransparente Pixel. Das Ergebnis hängt stark von den gewählten Schwellwerten ab. Ein Maß für die Qualität der Kanten ist das nicht.

### 5.2 Visuelle Prüfung (betrachtet)

- Betrachtet wurden das Original in voller Auflösung und **eine** Vorschau des Testverfahrens auf Creme-Hintergrund. Weitere Vorschauen (dunkelgrün, grau) wurden erzeugt, aber nicht angesehen.
- Auf Creme erschien der Glow als heller, ausgefranster Schleier um das Logo. Der Absolventenhut und die Schriftumrandung wirkten deutlich heller als im Original, die Konturen also geschwächt.
- Das ist ein Eindruck aus einer einzelnen Vorschau und keine systematische Qualitätsprüfung.

### 5.3 Schlussfolgerung

- Es **existiert keine saubere transparente Logo-Variante**. Eine solche wurde weder erstellt noch behauptet.
- Nicht untersucht sind aufwendigere Verfahren (Matting, manuelle Maske) und ein Neuexport aus der Entstehungsquelle mit Transparenz.
- **Entscheidung des Projektinhabers (2026-11-24): Weg 3 ist freigegeben.** Für den Splash gilt das unveränderte Original mit seinem dunklen Hintergrund auf dunklem Splash. Eine transparente Variante wird separat und später entschieden.

## 6. Ausgangszustand Tests und Build

| Prüfung | Ergebnis | Hinweis |
|---|---|---|
| `npm test` | **144 von 144 bestanden**, 0 Fehler | Lief in der Linux-Sandbox |
| `tsc -b` (Typprüfung) | **ohne Fehler** | Lief in der Linux-Sandbox |
| `vite build` | **Artefakte vorhanden, Konsolenausgabe nicht verifiziert** | Der Projektinhaber meldet, den Build auf dem Mac ausgeführt zu haben. Ich habe den Lauf nicht beobachtet und keine Konsolenausgabe gesehen. Die Artefakte sind ein Indiz, aber kein vollständiger Nachweis eines erfolgreichen Builds (Exit-Code und Warnungen unbekannt). Gefunden: `dist/` mit Zeitstempel 2026-11-24 10:34, `index.html`, `assets/index-D35vNUHg.js` (453 KB, 144 KB gzip) und `assets/index-BVaYzzVu.css` (31 KB, 7,5 KB gzip). In der Sandbox scheitert der Build wegen der macOS-Binärdateien von rolldown. |
| Sichtprüfung im Browser | **nicht durchgeführt** | |

Die Testanzahl 144 weicht von den Angaben in der README (95) und in der älteren Dokumentation (85) ab. Das Dokumentationsproblem ist bekannt und gehört nicht zur Designarbeit.

**Größe des Builds:** `dist/` ist 78 MB groß. Fast alles davon sind Bilder aus `public/images/`, die Vite unverändert kopiert, darunter `snake/baby` (11 MB), `snake/transparent` (11 MB), `snake/Shop` (14 MB) und `snake/adult` (8,3 MB, enthält die Rohbilder). Der Code selbst ist klein. Für Phase 2 (Asset-Optimierung) ist das relevant, ob die Rohbilder ausgeliefert werden sollen, ist eine Frage für den Projektinhaber. Nichts wurde gelöscht oder verschoben.

## 7. Hinweise für die weitere Arbeit

- Die Palette-Umstellung betrifft viele feste Farbwerte. Vorschlag für Phase 1: neue Tokens ergänzen, dann Bereich für Bereich migrieren, damit die App durchgehend lauffähig bleibt.
- **Konflikt Futter-Schwellen (weiterhin offen, keine Logikänderung):** `FEATURES.md` (Zeile 68) nennt die Schwellen 0/60/150/300/500, `src/logic/config.ts` (`foodFrom`) hat 0/30/90/200/350. Herkunft laut Git-Verlauf: Die Werte 60/150/300/500 stammen aus dem ersten Commit `a390925`. Commit `10686bd` ("Feedback-Runde 1", 2026-11-22) hat sie auf 30/90/200/350 geändert. `FEATURES.md` entstand in `583aa94` und wurde seitdem nicht angepasst. Der Quellcode ist damit sehr wahrscheinlich aktueller als `FEATURES.md`. Welche Werte gewollt sind, entscheidet der Projektinhaber. Weder `config.ts` noch `FEATURES.md` wurden angefasst.
- Laut `FEATURES.md` geht der Versuchszähler beim Pausieren verloren. Das ist ein Logikthema außerhalb dieser Designaufgabe.
- `DESIGN_SYSTEM.md` nannte "Umsetzung noch nicht begonnen", obwohl der Splash bereits umgesetzt wurde (`c8d10e2`, 2026-11-22: Änderungen an `src/App.tsx` und `src/index.css`). Der Status wurde differenziert (siehe Änderungsprotokoll der Roadmap).

## 8. Anfrage Schriftwahl (an ChatGPT als Creative Director)

Die Roadmap führt die Schrift als offen. Bitte um Entscheidung, damit Phase 1 starten kann. Randbedingungen aus Code und Designsystem:

- Zielgruppe ist ein Grundschulkind (Zahlenraum bis 100), Smartphone im Hochformat.
- Zahlen und Aufgaben brauchen eine sehr gut lesbare, eindeutige Schrift. Insbesondere müssen 1, 7, 4, 6 und 9 klar unterscheidbar sein.
- Display-Schrift nur für kurze Titel und Belohnungsmomente, nicht für Erklärtexte und Mathe.
- Es gibt aktuell keine mitgelieferte Schrift. Eine Webfont muss lokal ausgeliefert werden (keine Abfrage bei Fremdservern, wegen Datenschutz bei Kindern, plus die App soll offlinefähig bleiben können). Die Lizenz muss das erlauben, zum Beispiel SIL Open Font License.
- Bitte angeben: Schrift für Überschriften, Schrift für Fließtext und Zahlen, benötigte Schnitte (je zusätzlicher Schnitt kostet Ladezeit) und die Lizenz.
- Mein Hinweis zur Entscheidung: Unterstützung der deutschen Umlaute und des ß ist Pflicht.

## 9. Schriftentscheidung (Empfehlung von ChatGPT, zur Freigabe)

**Status: Empfehlung des Creative Directors, vom Projektinhaber als passend kommentiert. Als Designentscheidung dokumentiert, förmliche Freigabe und Implementierung stehen aus. Es wurde keine Schrift eingebunden.**

| Verwendung | Schrift und Schnitt |
|---|---|
| Aufgaben, Zahlen, Fließtext | **Atkinson Hyperlegible Next** (Version 2025), Regular 400 und Bold 700 |
| Überschriften und kurze Belohnungstitel | Nunito, ExtraBold 800 |

Klarstellung des Projektinhabers (2026-11-24): Gemeint ist **Atkinson Hyperlegible Next**, nicht die ursprüngliche Atkinson Hyperlegible von 2020.

Bedingungen: Beide Schriften werden **lokal ausgeliefert, ohne externe Font-Requests**, und die **SIL-OFL-Lizenzdateien** liegen im Repository.

**Technische Anmerkungen (Recherche, noch nicht am Code geprüft):**
- Lizenz: Atkinson Hyperlegible Next steht laut [GitHub-Repository](https://github.com/googlefonts/atkinson-hyperlegible-next) unter der SIL Open Font License 1.1 (Copyright "2020-2024 The Atkinson Hyperlegible Next Project Authors"). Nunito steht laut [Fontsource](https://fontsource.org/fonts/nunito/about) unter der OFL 1.1. Die Lizenzdateien beider Projekte müssen mitgeführt werden. Beachte: Das Braille Institute bietet für die ältere Familie auf der eigenen [Seite](https://www.brailleinstitute.org/freefont/) einen Download mit eigener Lizenzvereinbarung an. Für die Einbindung sollte die OFL-Quelle genutzt werden.
- Schnitte: Laut [Fontsource](https://fontsource.org/fonts/atkinson-hyperlegible-next/about) ist die Schrift als Variable Font mit dem Gewichtsbereich 200 bis 800 verfügbar (plus Kursiv). Die Angaben zur Zahl der statischen Schnitte widersprechen sich (GitHub: sechs, [Braille Institute](https://www.brailleinstitute.org/about-us/news/braille-institute-launches-enhanced-atkinson-hyperlegible-font-to-make-reading-easier/): sieben). Für die Entscheidung ist das unerheblich, weil Regular 400 und Bold 700 in jedem Fall dazugehören.
- Nunito 800 ist laut [Fontsource](https://fontsource.org/fonts/nunito/about) verfügbar.
- **Noch zu prüfen vor der Implementierung:**
  - Vorhandensein von Ä, Ö, Ü, ä, ö, ü und ß in den tatsächlich eingebundenen Dateien. Die Recherche hat das für Atkinson Hyperlegible Next **nicht ausdrücklich bestätigt**, es ist nur wahrscheinlich, weil die Familie als Latin-Schrift mit erweiterter Sprachunterstützung beschrieben wird. Die GitHub-Dokumentation war in dieser Umgebung nicht abrufbar.
  - Dateigröße je Schnitt. Variable Font oder zwei statische Schnitte (jeweils als WOFF2, gegebenenfalls als Subset) ist eine technische Entscheidung für Phase 1.
  - Unterscheidbarkeit der Ziffern in der echten Oberfläche. Das ist das erklärte Designziel der Schrift, aber hier noch nicht beobachtet.
