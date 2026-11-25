// Zahlwörter bis 100. Referenz: Zahlwortliste von Nina (Thema A, Zahlen verstehen).
const EINER = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun']
const ZEHN_BIS_NEUNZEHN = [
  'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn',
]
const ZEHNER = [
  '', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig',
]

/** Einer-Teil in Zusammensetzungen: "ein" statt "eins" (einundzwanzig). */
export function einerStamm(e: number): string {
  if (e < 1 || e > 9) throw new RangeError(`Einer von 1 bis 9 erwartet, bekommen: ${e}`)
  return e === 1 ? 'ein' : EINER[e]
}

export function zehnerWort(z: number): string {
  if (z < 2 || z > 9) throw new RangeError(`Zehner von 2 bis 9 erwartet, bekommen: ${z}`)
  return ZEHNER[z]
}

export function zahlZuWort(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 100) throw new RangeError(`Zahl von 0 bis 100 erwartet, bekommen: ${n}`)
  if (n < 10) return EINER[n]
  if (n < 20) return ZEHN_BIS_NEUNZEHN[n - 10]
  if (n === 100) return 'hundert'
  const z = Math.floor(n / 10)
  const e = n % 10
  return e === 0 ? ZEHNER[z] : `${einerStamm(e)}und${ZEHNER[z]}`
}

/** Wortkarten für zusammengesetzte Zahlen 21 bis 99 ohne Zehnerzahlen: [Einer, "und", Zehner]. */
export function zahlwortTeile(n: number): [string, string, string] {
  if (!Number.isInteger(n) || n < 21 || n > 99 || n % 10 === 0) {
    throw new RangeError(`Zusammengesetzte Zahl von 21 bis 99 erwartet, bekommen: ${n}`)
  }
  return [einerStamm(n % 10), 'und', zehnerWort(Math.floor(n / 10))]
}

function normalisiere(wort: string): string {
  return wort.trim().toLowerCase().replace(/dreissig/g, 'dreißig')
}

const WORT_ZU_ZAHL = new Map<string, number>()
for (let n = 0; n <= 100; n++) WORT_ZU_ZAHL.set(zahlZuWort(n), n)

/** Gibt die Zahl zu einem Zahlwort zurück, oder null. Akzeptiert auch "dreissig". */
export function wortZuZahl(wort: string): number | null {
  return WORT_ZU_ZAHL.get(normalisiere(wort)) ?? null
}

export const ALLE_EINER_STAEMME = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(einerStamm)
export const ALLE_ZEHNER_WOERTER = [2, 3, 4, 5, 6, 7, 8, 9].map(zehnerWort)
