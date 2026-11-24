# Projektinventar – Ausgangslage

> **Stand:** 24.11.2026  
> **Branch:** `design/luminous-fantasy-adventure`  
> **Zweck:** Faktenbasis für den visuellen Relaunch. Dieses Dokument beschreibt den geprüften Ausgangsstand, nicht die Roadmap.

## 1. App-Struktur

### Ansichten
In `src/App.tsx`: `home`, `round`, `result`, `haeutung`, `parent`, `shop`, `themen`, `album`. Navigation erfolgt über einen `useState`-Wert, nicht über einen Router. Zusätzlich gibt es `Startgruss` und `Willkommen`.

### Zentrale UI-Dateien

| Datei | Inhalt |
|---|---|
| `src/App.tsx` | App, Navigation und übergeordnete Ansichten |
| `src/ui/Snake.tsx` | Schlange, Sprechblasen, Fortschritt und Vorschau |
| `src/ui/TaskView.tsx` | Aufgaben, Eingaben und Zahlentastatur |
| `src/ui/Round.tsx` | Rundenablauf |
| `src/ui/Parent.tsx` | Elternbereich |
| `src/ui/Visuals.tsx` | Zahlenbilder, Stellentafel, Zahlenstrahl |
| `src/ui/Shop.tsx` | Münzen und Shop |
| `src/ui/Haeutung.tsx` | Häutungsansicht |
| `src/ui/Terrarium.tsx` | Terrarium |
| `src/ui/Einfuehrung.tsx` | Einführung |
| `src/ui/Album.tsx`, `Halbzeit.tsx`, `Schuppen.tsx`, `Treppe.tsx`, `TonKnopf.tsx`, `Info.tsx` | weitere UI-Bausteine |
| `src/logic/`, `src/storage.ts` | Lernlogik und Speicherung; nicht Teil visueller Änderungen |

Sound, Sprachausgabe und Reaktionen liegen unter anderem in `src/ui/feier.ts`, `klang.ts`, `reaktion.ts` und `stimme.ts`. Diese Funktionen sind bei UI-Arbeiten zu erhalten.

## 2. Styling und responsive Verhalten

- Zentrales Stylesheet: `src/index.css`, globales CSS.
- Kein Tailwind, kein CSS-in-JS und keine Komponentenbibliothek im geprüften Stand.
- 19 CSS-Variablen, daneben zahlreiche feste Farbwerte direkt in CSS-Regeln.
- Vorhandene Palette: Moosgrün/Papier mit unter anderem `--nacht #0f2f26`, `--nacht-hell #1b5240`, `--papier #fff8e6`, `--tinte #1c2b24`, `--lime #9bd93c`, `--amber #ffb92e`, `--blau #2a6fb0`, `--lila #6b4bd1`, `--koralle #ff7a63`.
- Die freigegebene neue Designpalette ist noch nicht vollständig in CSS-Tokens umgesetzt.
- Aktuell System-Fontstack; keine mitgelieferten Fonts und kein `@font-face`.
- Vorhandene Button-Klassen unter anderem `.knopf` mit Varianten; Karten, Balken, Sterne und Münzen haben bestehende Styles.
- `main` nutzt `max-width: 640px`, `height: 100dvh`, Safe-Area-Insets. Es gibt einen Höhen-Breakpoint, aber im Inventar keinen Breiten-Breakpoint.
- Vier `prefers-reduced-motion`-Blöcke und ungefähr 25 `@keyframes`-Animationen.

## 3. Bildassets und Logo

| Asset | Befund |
|---|---|
| `public/images/logo.webp` | Original, 1254 × 1254 px, RGB ohne Alpha, dunkler Hintergrund mit Glow |
| `public/images/logo/nicos-snake-app.webp` | 1254 × 1254 px, RGB ohne Alpha |
| `public/images/snake/snake-logo.png` | 1254 × 1254 px, RGB ohne Alpha |
| Schlangenstufen `snake-baby`, `smallChild`, `child`, `adult` | RGBA-Assets |
| `snake-teen.png` | RGB ohne Alpha |
| `public/images/snake/app/` | Gesichtsvarianten der Schlange, je Stufe unterschiedlich vollständig |
| `public/images/snake/adult/` | Enthält Rohbilder mit Leerzeichen und Umlauten in Dateinamen; nicht gelöscht |

Das Original-Logo hat keinen Alpha-Kanal. Die Randpixel sind uneinheitlich; der grüne Glow reicht bis an den Bildrand. Eine getestete automatische Freistellung ergab auf Creme einen ausgefransten Schleier und geschwächte Konturen. Eine saubere transparente Variante liegt nicht vor.

**Freigegebene Verwendung:** Das Original bleibt unverändert und wird für den Splash mit seinem vorhandenen dunklen Hintergrund auf einem dunklen Hintergrund gezeigt. Eine transparente Ableitung ist zurückgestellt. Keine Datei wurde im Rahmen der Bestandsaufnahme verändert.

## 4. Visueller Ist-Stand aus bereitgestellten Screenshots

Die Screenshots vom 24.11.2026 zeigen Home, Splash, Aufgabenansicht, Pause-Dialog und Shop in einer Desktop-Browseransicht. Eine separate Prüfung eines echten Smartphone-Viewports ist damit noch nicht belegt.

Beobachtungen:
- Die Grundfarbwelt aus dunklem Grün, Creme, Gold und Limette ist bereits erkennbar.
- Home hat eine klare zentrale Startaktion und stellt Nico in den Mittelpunkt.
- Das Logo erscheint auf Home klein; im Splash ist es groß und vollständig sichtbar.
- Die Aufgabenfläche ist hell und gut vom dunklen Hintergrund getrennt. Die umgebenden UI-Elemente konkurrieren teilweise um Aufmerksamkeit.
- Der Pause-Dialog hat eine klare Hierarchie und eine gut erkennbare Hauptaktion. Seine Gestaltung eignet sich als Referenz für Dialoge.
- Der Shop zeigt ein dichtes Kartenraster. Bild, Titel und Preis sind erkennbar, aber Abstände, Kartenproportionen und Preisflächen wirken noch nicht ausreichend vereinheitlicht.
- Die Screens wirken in Farbwelt und Formensprache verwandt, aber noch nicht vollständig wie ein konsistentes Komponenten-System.

Diese Beobachtungen sind ein visueller Erstbefund, keine Abnahme und kein Nachweis der mobilen Responsivität.

## 5. Prüfstatus

| Prüfung | Ergebnis |
|---|---|
| `npm test` | 144 von 144 bestanden in der Linux-Sandbox |
| `tsc -b` | ohne Fehler in der Linux-Sandbox |
| `vite build` | In der Linux-Sandbox wegen plattformspezifischer rolldown-Binärdateien fehlgeschlagen. Vorhandene `dist/`-Artefakte vom lokalen Mac sind kein vollständiger Nachweis für Exit-Code und Warnungen. |
| Browser-Sichtprüfung | Screenshots vom Projektinhaber geprüft; Desktop-Browseransichten. Smartphone-Hochformat noch nicht separat geprüft. |

Die Testanzahl weicht von älteren Angaben in README und Dokumentation ab. Diese Dokumentationsabweichung ist nicht Teil der visuellen Arbeit.

## 6. Technische Hinweise für spätere Arbeit

- Die neue Farbpalette erfordert mehr als die Anpassung der vorhandenen CSS-Variablen, da viele feste Farbwerte direkt in Regeln stehen.
- Der Build-Ordner `dist/` war im erfassten Stand 78 MB groß. Ein großer Anteil entfiel auf Bilder in `public/images/`, die Vite unverändert kopiert. Rohbilder nicht ohne Prüfung ihrer Verwendung löschen oder verschieben.
- **Offener Funktionsdokumentations-Konflikt:** `FEATURES.md` nennt Futter-Schwellen 0/60/150/300/500; `src/logic/config.ts` enthält 0/30/90/200/350. Keine Werte im Rahmen der visuellen Arbeit ändern. Entscheidung des Projektinhabers erforderlich.
- Der gespeicherte Pausenzustand enthält laut Codeprüfung nicht den vollständigen Versuchszustand. Das kann nach einem ersten Fehlversuch beim Fortsetzen relevant sein. Dies ist ein separates Logikthema und bleibt außerhalb visueller Änderungen.
- `docs/spec.md` und `docs/bewertung-ux-und-spieldesign.md` enthalten laut vorheriger Bestandsprüfung teilweise veraltete Aussagen. Sie sind nicht die Design-Referenz.

## 7. Freigegebene Schriftentscheidung

| Verwendung | Schrift | Schnitt |
|---|---|---|
| Aufgaben, Zahlen und Fließtext | Atkinson Hyperlegible Next | Regular 400, Bold 700 |
| Überschriften und kurze Belohnungstitel | Nunito | ExtraBold 800 |

Die Auswahl ist freigegeben, aber noch nicht implementiert. Beide Fonts lokal als WOFF2 ausliefern und OFL-Lizenzdateien mitführen. Vor der Einbindung Umlaute und ß in den konkreten Fontdateien prüfen; außerdem Dateigröße und Zifferndarstellung im echten UI kontrollieren.

Offizielle Atkinson-Quelle: [Atkinson Hyperlegible Next – Projekt-README](https://github.com/googlefonts/atkinson-hyperlegible-next/blob/main/README.md). Das README nennt Version 2.001 (20.11.2024) und SIL Open Font License 1.1. Die konkrete Zeichensatzabdeckung der später eingebundenen Dateien ist damit noch nicht nachgewiesen.
