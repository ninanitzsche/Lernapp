// Platzhalter-Grafik für Pokale (Lernfeld-Abschluss). Die endgültige Illustration entsteht beim Creative Director;
// dann wird nur diese Datei auf die freigegebenen Bilddateien umgestellt. Farben aus der freigegebenen Palette.
const SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'>",
  "<path d='M22 14 H78 V46 Q78 74 50 80 Q22 74 22 46 Z' fill='#FFD329' stroke='#064D30' stroke-width='5' stroke-linejoin='round'/>",
  "<path d='M22 24 H8 Q8 52 28 56' fill='none' stroke='#FF9D16' stroke-width='6' stroke-linecap='round'/>",
  "<path d='M78 24 H92 Q92 52 72 56' fill='none' stroke='#FF9D16' stroke-width='6' stroke-linecap='round'/>",
  "<rect x='44' y='80' width='12' height='18' fill='#FF9D16' stroke='#064D30' stroke-width='4'/>",
  "<rect x='28' y='98' width='44' height='14' rx='4' fill='#FFD329' stroke='#064D30' stroke-width='5'/>",
  "<polygon points='50,28 55,40 68,41 58,49 62,62 50,55 38,62 42,49 32,41 45,40' fill='#FFF4DE'/>",
  '</svg>',
].join('')

/** Bildquelle des Pokals eines Lernfeldes (derzeit für alle Lernfelder dieselbe Platzhalter-Grafik). */
export function pokalBild(_id: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(SVG)}`
}
