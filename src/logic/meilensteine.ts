// Meilensteine: erkennen, mit Rückblick speichern, für Altstände rückwirkend eintragen. Reine Logik ohne React.
// Importiert aus game.ts nur Typen, damit es keine Kreisabhängigkeit gibt.
import { CONFIG, STAGES } from './config.ts'
import { TOPICS, TOPIC_OF, TASK_TYPES } from './tasks.ts'
import type { Topic } from './tasks.ts'
import type { GameState } from './game.ts'

export type MeilensteinArt = 'entwicklung' | 'stern' | 'runden' | 'woche' | 'knobel'
export const ART_REIHENFOLGE: MeilensteinArt[] = ['entwicklung', 'runden', 'stern', 'knobel', 'woche']

export interface Rueckblick {
  /** Abgeschlossene Runden insgesamt */
  runden: number
  /** Tage mit mindestens einer Runde */
  tage: number
  /** Gelöste Aufgaben insgesamt */
  aufgaben: number
  /** Anteil gleich richtig beim ersten Mal, 0 bis 1 */
  quote: number
  staerkstesThema: Topic | null
}

export interface Meilenstein {
  /** zum Beispiel 'entwicklung-2', 'runden-10', 'stern-A-2', 'knobel-erste', 'knobel-10', 'woche-2026-11-23' */
  id: string
  art: MeilensteinArt
  /** JJJJ-MM-TT */
  datum: string
  rueckblick: Rueckblick
  /** Münzen, die dieser Meilenstein gebracht hat (Entwicklung, Stern und Wochenziel zahlt das Spiel schon an anderer Stelle aus) */
  muenzen: number
}

function stufeVon(totalFood: number): number {
  let r = 1
  for (const s of STAGES) if (totalFood >= s.foodFrom) r = s.stage
  return r
}

export function rueckblickVon(state: GameState): Rueckblick {
  const runden = Object.values(state.rounds).reduce((s, n) => s + n, 0)
  const tage = Object.values(state.rounds).filter((n) => n > 0).length
  const st = state.statistik
  const summen = TOPICS.map((t) => TASK_TYPES.filter((x) => TOPIC_OF[x] === t).reduce((s, x) => s + state.skill[x], 0))
  const maximum = Math.max(...summen)
  return {
    runden,
    tage,
    aufgaben: st.geloest,
    quote: st.bearbeitet > 0 ? st.ersteTreffer / st.bearbeitet : 0,
    staerkstesThema: maximum > 0 ? TOPICS[summen.indexOf(maximum)] : null,
  }
}

function gesamtRunden(s: GameState): number {
  return Object.values(s.rounds).reduce((a, n) => a + n, 0)
}

function sortiere(liste: Meilenstein[]): Meilenstein[] {
  return [...liste].sort((a, b) => ART_REIHENFOLGE.indexOf(a.art) - ART_REIHENFOLGE.indexOf(b.art))
}

/**
 * Neue Meilensteine zwischen zwei Ständen. `vorher.meilensteine` verhindert doppelte Auslösung.
 * `knobelStark`: Die Runde war eine starke Knobelrunde (Zusatzmünze verdient).
 */
export function pruefeMeilensteine(vorher: GameState, nachher: GameState, datum: string, knobelStark: boolean): Meilenstein[] {
  const bekannt = new Set(vorher.meilensteine.map((m) => m.id))
  const rb = rueckblickVon(nachher)
  const neu: Meilenstein[] = []
  const add = (id: string, art: MeilensteinArt, muenzen: number) => {
    if (!bekannt.has(id)) { bekannt.add(id); neu.push({ id, art, datum, rueckblick: rb, muenzen }) }
  }

  for (let s = stufeVon(vorher.totalFood) + 1; s <= stufeVon(nachher.totalFood); s++) add(`entwicklung-${s}`, 'entwicklung', 1)

  const vorherRunden = gesamtRunden(vorher)
  const jetztRunden = gesamtRunden(nachher)
  for (const [grenze, muenzen] of Object.entries(CONFIG.meilensteinRunden)) {
    const n = Number(grenze)
    if (vorherRunden < n && jetztRunden >= n) add(`runden-${n}`, 'runden', muenzen)
  }

  for (const t of TOPICS) {
    for (let n = (vorher.sterneErreicht[t] ?? 0) + 1; n <= nachher.sterneErreicht[t]; n++) add(`stern-${t}-${n}`, 'stern', 1)
  }

  if (knobelStark) add('knobel-erste', 'knobel', CONFIG.ersteKnobelMuenze)
  for (const [grenze, muenzen] of Object.entries(CONFIG.knobelTreffer)) {
    const n = Number(grenze)
    if (vorher.statistik.knobelTreffer < n && nachher.statistik.knobelTreffer >= n) add(`knobel-${n}`, 'knobel', muenzen)
  }

  for (const w of nachher.weeklyBonusWeeks) if (!vorher.weeklyBonusWeeks.includes(w)) add(`woche-${w}`, 'woche', 1)

  return sortiere(neu)
}

/** Münzen aus Meilensteinen, die zusätzlich zu den schon bestehenden Münzquellen kommen (Runden und Knobelerfolge). */
export function zusatzMuenzen(liste: Meilenstein[]): number {
  return liste.filter((m) => m.art === 'runden' || m.art === 'knobel').reduce((s, m) => s + m.muenzen, 0)
}

/** Altstände: schon Erreichtes wird ohne Feier und ohne Münzen eingetragen, damit nichts nachgefeiert oder doppelt bezahlt wird. */
export function nachtragen(state: GameState, datum: string): Meilenstein[] {
  const rb = rueckblickVon(state)
  const liste: Meilenstein[] = []
  const add = (id: string, art: MeilensteinArt) => liste.push({ id, art, datum, rueckblick: rb, muenzen: 0 })
  for (let s = 2; s <= stufeVon(state.totalFood); s++) add(`entwicklung-${s}`, 'entwicklung')
  for (const grenze of Object.keys(CONFIG.meilensteinRunden)) if (gesamtRunden(state) >= Number(grenze)) add(`runden-${grenze}`, 'runden')
  for (const t of TOPICS) for (let n = 1; n <= state.sterneErreicht[t]; n++) add(`stern-${t}-${n}`, 'stern')
  if (state.knobelTage.length > 0) add('knobel-erste', 'knobel')
  for (const w of state.weeklyBonusWeeks) add(`woche-${w}`, 'woche')
  return sortiere(liste)
}

/** Liest gespeicherte Meilensteine. Kaputte Einträge fallen weg. */
export function parseMeilensteine(raw: unknown): Meilenstein[] {
  if (!Array.isArray(raw)) return []
  const arten: string[] = ART_REIHENFOLGE
  const gesehen = new Set<string>()
  const ergebnis: Meilenstein[] = []
  for (const x of raw) {
    const m = x as Partial<Meilenstein> | null
    if (!m || typeof m.id !== 'string' || gesehen.has(m.id) || !arten.includes(m.art as string)) continue
    if (typeof m.datum !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(m.datum)) continue
    const r = m.rueckblick as Partial<Rueckblick> | undefined
    if (!r || ![r.runden, r.tage, r.aufgaben, r.quote].every((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)) continue
    const thema = r.staerkstesThema === 'A' || r.staerkstesThema === 'B' || r.staerkstesThema === 'C' ? r.staerkstesThema : null
    const muenzen = typeof m.muenzen === 'number' && Number.isFinite(m.muenzen) && m.muenzen >= 0 ? Math.floor(m.muenzen) : 0
    gesehen.add(m.id)
    ergebnis.push({
      id: m.id, art: m.art as MeilensteinArt, datum: m.datum, muenzen,
      rueckblick: { runden: r.runden as number, tage: r.tage as number, aufgaben: r.aufgaben as number, quote: Math.min(1, r.quote as number), staerkstesThema: thema },
    })
  }
  return ergebnis
}
