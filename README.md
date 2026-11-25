# Mathe-Schlange

Lern-Tamagotchi für den Zahlenraum bis 100 (Klasse 2). Richtige Antworten füttern die Schlange, sie wächst.
Keine KI zur Laufzeit, kein Login, keine Cloud: Der Stand liegt nur im Browser (localStorage).

## Starten

```
npm install      # holt auch motion und canvas-confetti (Animationen)
npm test        # 147 Tests: Zahlwörter, Aufgaben, Stufen, Spielregeln, Meilensteine, Lernstand, Abdeckung des Transparenzpapiers
npm run dev     # lokal öffnen
npm run build   # Produktionsversion in dist/
```

Voraussetzung: Node 22.6 oder neuer.

## Aufbau

- `src/logic/` reine Logik ohne React (Zahlwörter, Aufgabengeneratoren, Futter, Stufen, Stimmung, Lernstand)
- `src/ui/` Oberfläche (Schlange, Aufgaben, Runde, Elternbereich). Animationen: `motion` (Federn, Übergänge) und `canvas-confetti` (Konfetti, Münzregen)
- Layout: jede Kinder-Ansicht passt in `100dvh`, Größen skalieren mit der Bildschirmhöhe (siehe Kommentar am Anfang von `main` in `src/index.css`)
- `docs/product-vision.md` langfristige Vision der fachübergreifenden Lernapp und Leitplanken für heutige Architekturentscheidungen
- `docs/VISUELLES_WELTENKONZEPT.md` gemeinsame Art Direction mit eigenständigen Tier- und Themenwelten pro Fach
- `docs/PHASE2_ASSETPLAN.md` Asset- und Charakterproduktion für die aktuelle Nico-/Mathematik-Welt
- `docs/specs/2026-11-22-feedback-runde-1/` Anforderungen, Design und Aufgaben zur Feedback-Runde 1 (Belohnung, Schwierigkeitsstufen, Meilensteine, Elternblick)
- `public/images/snake/` Schlangen-Bilder (Kopien aus FamilyBoard)

Spielwerte (Futter, Schwellen, Tageslimit) stehen alle in `src/logic/config.ts`.

## Veröffentlichen (GitHub Pages)

Der Design-Branch `design/luminous-fantasy-adventure` wird bei jedem Push nur getestet und gebaut (`.github/workflows/design-quality.yml`), nicht veröffentlicht. Die Vorschau zur Sichtprüfung läuft laut `docs/ROADMAP_DESIGN.md` über Vercel Preview; eine Vercel-Konfiguration liegt nicht im Repository.

Bei jedem Push auf `main` testet und baut GitHub Actions die App und veröffentlicht sie auf GitHub Pages (`.github/workflows/deploy.yml`).
Einmalig im Repo: Settings, Pages, Source "GitHub Actions" und die eigene Subdomain eintragen.
Bei STRATO zeigt ein CNAME-Eintrag der Subdomain auf `ninanitzsche.github.io` (ohne Repo-Namen). Danach "Enforce HTTPS" aktivieren.
Läuft die App stattdessen unter `ninanitzsche.github.io/Lernapp/`, muss in `vite.config.ts` `base: '/Lernapp/'` stehen.
