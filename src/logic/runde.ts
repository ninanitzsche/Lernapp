// Rundenstand für die Pause: reine Logik ohne React und ohne Browser-Speicher, damit sie testbar ist.
import { TASK_TYPES, generateDifferent } from './tasks.ts'
import type { Task, Topic } from './tasks.ts'
import { createRng } from './rng.ts'
import { CONFIG } from './config.ts'
import { foodForOutcome, pickRepeatAnswers } from './game.ts'
import type { Outcome, RoundAnswer } from './game.ts'

export interface RundenStand {
  version: 1
  name: string
  topic?: Topic
  quelle: 'buch' | 'mix'
  schwer: boolean
  seed: number
  aufgaben: Task[]
  /** Nummer der nächsten Aufgabe. Davor ist jede Aufgabe genau einmal beantwortet. */
  index: number
  antworten: RoundAnswer[]
  wiederholungenGeplant: boolean
}

export interface Fortschritt {
  aufgaben: Task[]
  index: number
  wiederholungenGeplant: boolean
}

/**
 * Wohin geht es nach der Aufgabe `index`? Gibt null zurück, wenn die Runde zu Ende ist.
 * Am Ende der zehn Aufgaben kommen einmalig bis zu drei Wiederholungen (andere Zahlen, gleicher Typ).
 */
export function naechsterSchritt(a: { aufgaben: Task[]; index: number; antworten: RoundAnswer[]; wiederholungenGeplant: boolean; seed: number; schwer: boolean }): Fortschritt | null {
  const naechster = a.index + 1
  if (naechster < a.aufgaben.length) return { aufgaben: a.aufgaben, index: naechster, wiederholungenGeplant: a.wiederholungenGeplant }
  if (!a.wiederholungenGeplant) {
    const wiederholen = pickRepeatAnswers(a.antworten)
    if (wiederholen.length > 0) {
      const rng = createRng(a.seed + 99)
      const neu = wiederholen.map((w) => generateDifferent(w.type, rng, w.prompt ?? '', a.schwer))
      return { aufgaben: [...a.aufgaben, ...neu], index: naechster, wiederholungenGeplant: true }
    }
  }
  return null
}

/** Futter, das die Runde bis jetzt gebracht hat. Wiederholungen zählen nicht. */
export function futterBisJetzt(antworten: RoundAnswer[]): number {
  return antworten.filter((x) => !x.isRepeat).reduce((s, x) => s + foodForOutcome(x.outcome), 0)
}

export function serializeRunde(r: RundenStand): string {
  return JSON.stringify(r)
}

const AUSGAENGE: Outcome[] = ['first', 'second', 'failed']

/** Liest einen gespeicherten Rundenstand. Fremde, kaputte oder zu einem anderen Spieler gehörende Daten ergeben null. */
export function parseRunde(text: string, name: string): RundenStand | null {
  let raw: unknown
  try { raw = JSON.parse(text) } catch { return null }
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (r.version !== 1 || r.name !== name) return null
  if (r.quelle !== 'buch' && r.quelle !== 'mix') return null
  if (typeof r.schwer !== 'boolean' || typeof r.wiederholungenGeplant !== 'boolean') return null
  if (typeof r.seed !== 'number' || !Number.isFinite(r.seed)) return null
  if (!Array.isArray(r.aufgaben) || r.aufgaben.length < CONFIG.roundLength || r.aufgaben.length > CONFIG.roundLength + CONFIG.maxRepeatsPerRound) return null
  const aufgabenOk = r.aufgaben.every((t) => {
    const o = t as { prompt?: unknown; input?: { kind?: unknown }; type?: unknown } | null
    return !!o && typeof o.prompt === 'string' && typeof o.input?.kind === 'string' && (TASK_TYPES as readonly unknown[]).includes(o.type)
  })
  if (!aufgabenOk) return null
  if (!Array.isArray(r.antworten)) return null
  const antwortenOk = r.antworten.every((x) => {
    const o = x as { type?: unknown; outcome?: unknown } | null
    return !!o && (TASK_TYPES as readonly unknown[]).includes(o.type) && AUSGAENGE.includes(o.outcome as Outcome)
  })
  if (!antwortenOk) return null
  if (!Number.isInteger(r.index) || (r.index as number) < 0 || (r.index as number) >= r.aufgaben.length) return null
  // Jede Aufgabe vor `index` ist genau einmal beantwortet, sonst würde Futter doppelt oder gar nicht gezählt.
  if (r.antworten.length !== r.index) return null
  return {
    version: 1,
    name,
    topic: r.topic === 'A' || r.topic === 'B' || r.topic === 'C' ? r.topic : undefined,
    quelle: r.quelle,
    schwer: r.schwer,
    seed: r.seed,
    aufgaben: r.aufgaben as Task[],
    index: r.index as number,
    antworten: r.antworten as RoundAnswer[],
    wiederholungenGeplant: r.wiederholungenGeplant,
  }
}
