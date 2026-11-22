// Schwierigkeitsstufen: Rampe in der Runde, Freischaltung je Aufgabentyp, Lernstand nach Stufe.
import { CONFIG } from './config.ts'
import type { Stufe } from './tasks.ts'

export type Ausgang = 'first' | 'second' | 'failed'

/** Höchste Stufe, die für einen Typ in normalen Runden gestellt wird: 1, oder 2 nach den leichten Startrunden und einem ersten Erfolg. */
export function hoechsteStufe(lernstand: number, abgeschlosseneRunden: number): 1 | 2 {
  return abgeschlosseneRunden >= CONFIG.leichtRunden && lernstand >= 1 ? 2 : 1
}

/** Stufe laut Rampenplan für die Aufgabe an Position `position` (0 beginnt). Hinter dem Plan gilt der letzte Wert. */
export function rampeFuer(knobel: boolean, position: number): Stufe {
  const plan = knobel ? CONFIG.rampeKnobel : CONFIG.rampeNormal
  return plan[Math.min(Math.max(position, 0), plan.length - 1)] as Stufe
}

/**
 * Stufe einer Aufgabe: Rampenplan, in normalen Runden begrenzt durch die Freischaltung des Typs.
 * Die Knobelrunde ist eine bewusste Wahl des Kindes und folgt dem Plan ohne Freischaltung.
 */
export function stufeFuerAufgabe(knobel: boolean, position: number, lernstand: number, abgeschlosseneRunden: number): Stufe {
  const plan = rampeFuer(knobel, position)
  if (knobel) return plan
  return Math.min(plan, hoechsteStufe(lernstand, abgeschlosseneRunden)) as Stufe
}

/**
 * Neuer Lernstand (0 bis 3) nach einer Aufgabe.
 * Leichte Aufgaben heben den Lernstand höchstens auf 1. Fehler bei kniffligen Aufgaben senken ihn nie.
 */
export function lernstandNach(level: number, outcome: Ausgang, stufe: Stufe = 2): number {
  if (outcome === 'second') return level
  if (outcome === 'failed') return stufe === 3 ? level : Math.max(0, level - 1)
  const deckel = stufe === 1 ? 1 : CONFIG.skillMax
  return Math.max(level, Math.min(deckel, level + 1))
}
