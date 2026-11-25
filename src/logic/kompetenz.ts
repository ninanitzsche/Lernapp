// Kompetenzsterne je Lernfeld: Nachweise sammeln, Sterne der Reihe nach vergeben, Fortschritt zum nächsten Stern.
// Reine Logik ohne React. Importiert aus game.ts nur Typen, damit es keine Kreisabhängigkeit gibt.
import { CONFIG } from './config.ts'
import { TASK_TYPES, TOPICS, TOPIC_OF } from './tasks.ts'
import type { Stufe, TaskType, Topic } from './tasks.ts'
import type { RoundAnswer } from './game.ts'

/** Eine selbstständig gelöste Aufgabe (erster Versuch richtig). `r` zählt die Runden, in denen sie gelöst wurde. */
export interface Nachweis { r: number; t: TaskType; s: Stufe }
export type Nachweise = Record<Topic, Nachweis[]>

export const MAX_STERNE = CONFIG.kompetenz.length

/** Namen der fünf Kompetenzschritte für Kinder (Startwerte, noch nicht freigegeben). */
export const STERN_ZIEL: readonly string[] = [
  'Erste Schritte bei leichten Aufgaben',
  'Alle leichten Aufgaben sicher lösen',
  'Mittlere Aufgaben meistern',
  'Mittlere Aufgaben in jeder Art lösen',
  'Meister: alles sicher, in vielen Runden',
]

export function leereNachweise(): Nachweise {
  return { A: [], B: [], C: [] }
}

export function typenDesFeldes(topic: Topic): TaskType[] {
  return TASK_TYPES.filter((t) => TOPIC_OF[t] === topic)
}

/** Nimmt die selbstständig gelösten Aufgaben einer Runde auf. Tipp, zweiter Versuch und gezeigte Lösung zählen nicht. */
export function nachweiseNach(bisher: Nachweise, antworten: RoundAnswer[], runde: number): Nachweise {
  const neu: Nachweise = { A: [...bisher.A], B: [...bisher.B], C: [...bisher.C] }
  for (const a of antworten) {
    if (a.outcome !== 'first') continue
    neu[TOPIC_OF[a.type]].push({ r: runde, t: a.type, s: a.stufe ?? 2 })
  }
  for (const t of TOPICS) neu[t] = neu[t].slice(-CONFIG.nachweisMax)
  return neu
}

interface Stand { typen: number; treffer: number; runden: number }

function standFuer(liste: Nachweis[], stufe: number): Stand {
  const passend = liste.filter((n) => n.s >= stufe)
  return { typen: new Set(passend.map((n) => n.t)).size, treffer: passend.length, runden: new Set(passend.map((n) => n.r)).size }
}

function typenNoetig(topic: Topic, stern: number): number {
  const k = CONFIG.kompetenz[stern - 1]
  return k.typen === 'alle' ? typenDesFeldes(topic).length : Math.min(k.typen, typenDesFeldes(topic).length)
}

/** Ist der Nachweis für genau diesen Stern erbracht (ohne die Reihenfolge zu prüfen)? */
export function sternErbracht(liste: Nachweis[], topic: Topic, stern: number): boolean {
  if (stern < 1 || stern > MAX_STERNE) return false
  const k = CONFIG.kompetenz[stern - 1]
  const s = standFuer(liste, k.stufe)
  return s.typen >= typenNoetig(topic, stern) && s.treffer >= k.treffer && s.runden >= k.runden
}

/** Neue Sternzahl: Sterne werden der Reihe nach vergeben und gehen nie verloren. */
export function sterneNach(bisher: number, liste: Nachweis[], topic: Topic): number {
  let n = Math.max(0, Math.min(MAX_STERNE, bisher))
  while (n < MAX_STERNE && sternErbracht(liste, topic, n + 1)) n += 1
  return n
}

export interface Fortschritt {
  /** Nummer des nächsten Sterns (1 bis 5) */
  stern: number
  ziel: string
  /** 0 bis 1, aus den tatsächlich gespeicherten Nachweisen (kleinster Anteil der drei Bedingungen) */
  anteil: number
  /** Was noch fehlt, in Zahlen */
  fehlt: { typen: number; treffer: number; runden: number }
}

/** Fortschritt zum nächsten Stern. Null, wenn alle fünf Sterne verdient sind. */
export function fortschritt(bisher: number, liste: Nachweis[], topic: Topic): Fortschritt | null {
  if (bisher >= MAX_STERNE) return null
  const stern = bisher + 1
  const k = CONFIG.kompetenz[stern - 1]
  const s = standFuer(liste, k.stufe)
  const noetig = typenNoetig(topic, stern)
  const anteil = Math.min(1, s.typen / noetig, s.treffer / k.treffer, s.runden / k.runden)
  return {
    stern, ziel: STERN_ZIEL[stern - 1], anteil,
    fehlt: { typen: Math.max(0, noetig - s.typen), treffer: Math.max(0, k.treffer - s.treffer), runden: Math.max(0, k.runden - s.runden) },
  }
}

/** Was zum nächsten Stern noch fehlt, in Worten für Kinder. Leer, wenn nichts fehlt. */
export function fehltText(f: Fortschritt): string {
  const teile: string[] = []
  if (f.fehlt.treffer > 0) teile.push(`${f.fehlt.treffer} Treffer`)
  if (f.fehlt.typen > 0) teile.push(`${f.fehlt.typen} ${f.fehlt.typen === 1 ? 'weitere Aufgabenart' : 'weitere Aufgabenarten'}`)
  if (f.fehlt.runden > 0) teile.push(`${f.fehlt.runden} ${f.fehlt.runden === 1 ? 'weitere Runde' : 'weitere Runden'}`)
  return teile.length === 0 ? '' : `Noch ${teile.join(', ')}`
}

/** Liest gespeicherte Nachweise. Kaputte Einträge fallen weg. */
export function parseNachweise(raw: unknown): Nachweise {
  const ergebnis = leereNachweise()
  if (typeof raw !== 'object' || raw === null) return ergebnis
  const r = raw as Record<string, unknown>
  for (const topic of TOPICS) {
    const liste = r[topic]
    if (!Array.isArray(liste)) continue
    ergebnis[topic] = liste
      .filter((x): x is Nachweis => {
        const n = x as Partial<Nachweis> | null
        return !!n && Number.isInteger(n.r) && (n.r as number) >= 0 && (TASK_TYPES as readonly unknown[]).includes(n.t) && TOPIC_OF[n.t as TaskType] === topic && [1, 2, 3].includes(n.s as number)
      })
      .map((n) => ({ r: n.r, t: n.t, s: n.s }))
      .slice(-CONFIG.nachweisMax)
  }
  return ergebnis
}
