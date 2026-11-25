// Futter nach Stufe, Serie und Halbzeit. Reine Logik ohne React.
import { CONFIG } from './config.ts'
import type { Stufe } from './tasks.ts'
import type { Ausgang } from './stufen.ts'

export function futterFuer(outcome: Ausgang, stufe: Stufe = 2): number {
  if (outcome === 'first') return CONFIG.futterErsterVersuch[stufe - 1]
  if (outcome === 'second') return CONFIG.futterZweiterVersuch[stufe - 1]
  return 0
}

/**
 * Futter einer Antwort. Ein richtiges Ergebnis im ersten Versuch mit Denkimpuls zählt beim Futter wie ein
 * Ergebnis im zweiten Versuch (Stufe 1 und 2: 1 statt 2, Stufe 3: 3 statt 5). Zum Kompetenznachweis zählt die Aufgabe weiter.
 */
export function futterFuerAntwort(a: { outcome: Ausgang; stufe?: Stufe; denkimpuls?: boolean }): number {
  const ausgang: Ausgang = a.denkimpuls && a.outcome === 'first' ? 'second' : a.outcome
  return futterFuer(ausgang, a.stufe ?? 2)
}

interface SerieAntwort { outcome: Ausgang; isRepeat?: boolean; serieBonus?: boolean }

/**
 * Wahr, wenn die letzten `serieAb` Aufgaben der Runde alle gleich richtig waren und die Runde den Serien-Bonus noch nicht hatte.
 * Wiederholungen am Rundenende zählen nicht. Ein Fehler beendet die Serie ohne Folgen.
 */
export function serieErkannt(antworten: SerieAntwort[]): boolean {
  if (antworten.some((a) => a.serieBonus)) return false
  const basis = antworten.filter((a) => !a.isRepeat)
  if (basis.length < CONFIG.serieAb) return false
  return basis.slice(-CONFIG.serieAb).every((a) => a.outcome === 'first')
}

/** Halbzeit: genau dann, wenn die Aufgabe `halbzeitNach` beantwortet ist und noch keine Halbzeit gezeigt wurde. */
export function halbzeitErreicht(beantwortet: number, schonGezeigt: boolean): boolean {
  return !schonGezeigt && beantwortet === CONFIG.halbzeitNach
}
