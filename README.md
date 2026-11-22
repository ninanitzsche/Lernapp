# Mathe-Schlange

Lern-Tamagotchi für den Zahlenraum bis 100 (Klasse 2). Richtige Antworten füttern die Schlange, sie wächst.
Keine KI zur Laufzeit, kein Login, keine Cloud: Der Stand liegt nur im Browser (localStorage).

## Starten

```
npm install      # holt auch motion und canvas-confetti (Animationen)
npm test        # 95 Tests: Zahlwörter, Aufgaben, Spielregeln, Abdeckung des Transparenzpapiers
npm run dev     # lokal öffnen
npm run build   # Produktionsversion in dist/
```

Voraussetzung: Node 22.6 oder neuer.

## Aufbau

- `src/logic/` reine Logik ohne React (Zahlwörter, Aufgabengeneratoren, Futter, Stufen, Stimmung, Wochenziel, Lernstand)
- `src/ui/` Oberfläche (Schlange, Aufgaben, Runde, Elternbereich). Animationen: `motion` (Federn, Übergänge) und `canvas-confetti` (Konfetti, Münzregen)
- Layout: jede Kinder-Ansicht passt in `100dvh`, Größen skalieren mit der Bildschirmhöhe (siehe Kommentar am Anfang von `main` in `src/index.css`)
- `docs/spec.md` Spezifikation und Änderungen
- `public/images/snake/` Schlangen-Bilder (Kopien aus FamilyBoard)

Spielwerte (Futter, Schwellen, Tageslimit) stehen alle in `src/logic/config.ts`.
