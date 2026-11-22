// Vorgänger, Nachfolger, Nachbarzehner im Zahlenraum 0 bis 100.

export function vorgaenger(n: number): number | null {
  return n >= 1 && n <= 100 ? n - 1 : null
}

export function nachfolger(n: number): number | null {
  return n >= 0 && n <= 99 ? n + 1 : null
}

/**
 * Nachbarzehner: der Zehner darunter und darüber (14 hat 10 und 20).
 * Bei einer Zehnerzahl sind es der Zehner davor und danach (50 hat 40 und 60).
 * Für 0 und 100 gibt es keinen Nachbarzehner, dort wird null geliefert.
 */
export function nachbarzehner(n: number): [number, number] | null {
  if (!Number.isInteger(n) || n < 1 || n > 99) return null
  if (n % 10 === 0) return [n - 10, n + 10]
  const unten = Math.floor(n / 10) * 10
  return [unten, unten + 10]
}
