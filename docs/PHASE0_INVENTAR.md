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

**Methode:** Hintergrundfarbe aus dem Bildrand bestimmt, Farbabstand zu jedem Pixel als Alpha-Wert, Farben entmischt, Vorschau auf Creme-Hintergrund. Das Original wurde nicht verändert.

**Ergebnis:**
- Das Original hat keinen Alpha-Kanal, der Hintergrund ist eingebrannt.
- Der Hintergrund ist **nicht einfarbig**. Die Randpixel schwanken (z. B. RGB 2/15/29 in den Ecken, 1/82/45 am rechten Rand), weil das grüne Leuchten bis zum Bildrand reicht.
- Das einfache Freistellen über den Farbabstand liefert **kein sauberes Ergebnis**: Der Glow wird zu einem hellen, ausgefransten Schleier, und dunkle Konturen (Absolventenhut, Textumrandung) verlieren Substanz.
- **Nicht geprüft** sind aufwendigere Verfahren (KI-Matting, manuelle Maske) und ein Neuexport des Logos aus der Entstehungsquelle mit Transparenz.

**Bewertung:** Eine saubere transparente Variante ist mit dem einfachen Verfahren nicht erreicht. **Entscheidung des Projektinhabers (2026-11-24):** Für den Splash gilt Weg 3, also das Original unverändert mit seinem dunklen Hintergrund auf dunklem Splash. Eine transparente Variante wird separat und später entschieden.

## 6. Ausgangszustand Tests und Build

| Prüfung | Ergebnis | Hinweis |
|---|---|---|
| `npm test` | **144 von 144 bestanden**, 0 Fehler | Lief in der Linux-Sandbox |
| `tsc -b` (Typprüfung) | **ohne Fehler** | Lief in der Linux-Sandbox |
| `vite build` | **auf dem Mac ausgeführt, Artefakte vorhanden** | Von mir nicht selbst beobachtet. Beleg: `dist/` mit Zeitstempel 2026-11-24 10:34, `index.html`, `assets/index-D35vNUHg.js` (453 KB, 144 KB gzip) und `assets/index-BVaYzzVu.css` (31 KB, 7,5 KB gzip). Konsolenausgabe und Warnungen unbekannt. In der Sandbox selbst scheitert der Build wegen der macOS-Binärdateien von rolldown. |
| Sichtprüfung im Browser | **nicht durchgeführt** | |

Die Testanzahl 144 weicht von den Angaben in der README (95) und in der älteren Dokumentation (85) ab. Das Dokumentationsproblem ist bekannt und gehört nicht zur Designarbeit.

**Größe des Builds:** `dist/` ist 78 MB groß. Fast alles davon sind Bilder aus `public/images/`, die Vite unverändert kopiert, darunter `snake/baby` (11 MB), `snake/transparent` (11 MB), `snake/Shop` (14 MB) und `snake/adult` (8,3 MB, enthält die Rohbilder). Der Code selbst ist klein. Für Phase 2 (Asset-Optimierung) ist das relevant, ob die Rohbilder ausgeliefert werden sollen, ist eine Frage für den Projektinhaber. Nichts wurde gelöscht oder verschoben.

## 7. Hinweise für die weitere Arbeit

- Die Palette-Umstellung betrifft viele feste Farbwerte. Vorschlag für Phase 1: neue Tokens ergänzen, dann Bereich für Bereich migrieren, damit die App durchgehend lauffähig bleibt.
- `FEATURES.md` nennt Futter-Schwellen 0/60/150/300/500, `src/logic/config.ts` hat 0/30/90/200/350. Konflikt gemeldet, nicht verändert.
- Laut `FEATURES.md` geht der Versuchszähler beim Pausieren verloren. Das ist ein Logikthema außerhalb dieser Designaufgabe.
- `DESIGN_SYSTEM.md` nennt "Umsetzung noch nicht begonnen", obwohl der Splash mit leuchtendem Logo in `c8d10e2` bereits verfeinert wurde. Konflikt gemeldet.

## 8. Anfrage Schriftwahl (an ChatGPT als Creative Director)

Die Roadmap führt die Schrift als offen. Bitte um Entscheidung, damit Phase 1 starten kann. Randbedingungen aus Code und Designsystem:

- Zielgruppe ist ein Grundschulkind (Zahlenraum bis 100), Smartphone im Hochformat.
- Zahlen und Aufgaben brauchen eine sehr gut lesbare, eindeutige Schrift. Insbesondere müssen 1, 7, 4, 6 und 9 klar unterscheidbar sein.
- Display-Schrift nur für kurze Titel und Belohnungsmomente, nicht für Erklärtexte und Mathe.
- Es gibt aktuell keine mitgelieferte Schrift. Eine Webfont muss lokal ausgeliefert werden (keine Abfrage bei Fremdservern, wegen Datenschutz bei Kindern, plus die App soll offlinefähig bleiben können). Die Lizenz muss das erlauben, zum Beispiel SIL Open Font License.
- Bitte angeben: Schrift für Überschriften, Schrift für Fließtext und Zahlen, benötigte Schnitte (je zusätzlicher Schnitt kostet Ladezeit) und die Lizenz.
- Mein Hinweis zur Entscheidung: Unterstützung der deutschen Umlaute und des ß ist Pflicht.
