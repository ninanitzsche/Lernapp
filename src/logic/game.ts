import { CONFIG, STAGES } from './config.ts'
import { TASK_TYPES, TOPIC_OF, TOPICS } from './tasks.ts'
import type { Stufe, TaskType, Topic } from './tasks.ts'
import { futterFuer } from './belohnung.ts'
import { lernstandNach } from './stufen.ts'
import { nachtragen, parseMeilensteine, pruefeMeilensteine, zusatzMuenzen } from './meilensteine.ts'
import type { Meilenstein } from './meilensteine.ts'
import { int, pick } from './rng.ts'
import type { Rng } from './rng.ts'

export type Outcome = 'first' | 'second' | 'failed'
export type Mood = 'froh' | 'hungrig' | 'schlaeft'

export interface RoundAnswer {
  type: TaskType
  outcome: Outcome
  /** Wiederholungsaufgabe am Rundenende: zählt für den Lernstand, gibt aber kein Futter. */
  isRepeat?: boolean
  /** Text der Aufgabe, damit die Wiederholung eine andere Aufgabe wird. */
  prompt?: string
  /** Schwierigkeit der Aufgabe. Fehlt bei Altdaten: gilt als 2. */
  stufe?: Stufe
  /** Diese Antwort hat den Serien-Jubel ausgelöst (drei hintereinander im ersten Versuch). Bringt einmal pro Runde Zusatzfutter. */
  serieBonus?: boolean
}

/** Ein Versuch im Verlauf eines Aufgabentyps. */
export interface Versuch { o: Outcome; s: Stufe }

/** Summen über alle Runden, für den Rückblick der Meilensteine. */
export interface Statistik {
  /** Bearbeitete Aufgaben (ohne Wiederholungen) */
  bearbeitet: number
  /** Gelöste Aufgaben (erster oder zweiter Versuch) */
  geloest: number
  ersteTreffer: number
  /** Kniffelige Aufgaben (Stufe 3) gleich im ersten Versuch richtig */
  knobelTreffer: number
}

export interface GameState {
  version: 1
  name: string
  totalFood: number
  lastFedAt: string | null
  /** Anzahl abgeschlossener Runden pro Tag (Schlüssel JJJJ-MM-TT). */
  rounds: Record<string, number>
  skill: Record<TaskType, number>
  testDate: string | null
  /** Höchste je erreichte Sternzahl pro Thema. Jeder Stern ist eine Münze für den Shop und geht nie verloren. */
  sterneErreicht: Record<Topic, number>
  /** Zusätzliche Münzen: Stufenaufstieg, Tagesmitbringsel und Knobelerfolge. */
  bonusMuenzen: number
  /** Tage (JJJJ-MM-TT), an denen die Knobelrunde schon eine Zusatzmünze gebracht hat (höchstens eine pro Tag). */
  knobelTage: string[]
  /** IDs der gekauften Shop-Dinge in Kaufreihenfolge */
  gekauft: string[]
  /** Vom Kind verschobene Plätze der Dinge im Terrarium (Prozent der Terrariumgröße) */
  positionen: Record<string, { x: number; y: number }>
  /** Die letzten zehn Versuche je Aufgabentyp, für die Einschätzung im Elternbereich. */
  verlauf: Record<TaskType, Versuch[]>
  statistik: Statistik
  /** Erreichte Meilensteine mit Datum und Rückblick. Gehen nie verloren. */
  meilensteine: Meilenstein[]
}

export const VERLAUF_LAENGE = 10

export function leererVerlauf(): Record<TaskType, Versuch[]> {
  const v = {} as Record<TaskType, Versuch[]>
  for (const t of TASK_TYPES) v[t] = []
  return v
}

export function initialState(name: string): GameState {
  const skill = {} as Record<TaskType, number>
  for (const t of TASK_TYPES) skill[t] = 0
  return { version: 1, name, totalFood: 0, lastFedAt: null, rounds: {}, skill, testDate: null, sterneErreicht: { A: 0, B: 0, C: 0 }, bonusMuenzen: 0, knobelTage: [], gekauft: [], positionen: {}, verlauf: leererVerlauf(), statistik: { bearbeitet: 0, geloest: 0, ersteTreffer: 0, knobelTreffer: 0 }, meilensteine: [] }
}

// ---------- Futter und Stufen ----------

export function foodForOutcome(outcome: Outcome, stufe: Stufe = 2): number {
  return futterFuer(outcome, stufe)
}

export function stageFor(totalFood: number) {
  let result: (typeof STAGES)[number] = STAGES[0]
  for (const s of STAGES) if (totalFood >= s.foodFrom) result = s
  return result
}

export function nextStageFood(totalFood: number): number | null {
  for (const s of STAGES) if (totalFood < s.foodFrom) return s.foodFrom
  return null
}

// ---------- Stimmung (nur kosmetisch) ----------

export function moodAt(lastFedAt: string | null, now: Date): Mood {
  if (!lastFedAt) return 'froh'
  const stunden = (now.getTime() - new Date(lastFedAt).getTime()) / 3_600_000
  if (stunden < CONFIG.hungryAfterHours) return 'froh'
  if (stunden <= CONFIG.sleepAfterHours) return 'hungrig'
  return 'schlaeft'
}

// ---------- Tage ----------

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}


// ---------- Lernstand ----------

export function updateSkill(level: number, outcome: Outcome, stufe: Stufe = 2): number {
  return lernstandNach(level, outcome, stufe)
}

const TYPES_OF_TOPIC: Record<Topic, TaskType[]> = {
  A: TASK_TYPES.filter((t) => TOPIC_OF[t] === 'A'),
  B: TASK_TYPES.filter((t) => TOPIC_OF[t] === 'B'),
  C: TASK_TYPES.filter((t) => TOPIC_OF[t] === 'C'),
}

/** 0 bis 3 Sterne je Thema. */
export function topicStars(skill: Record<TaskType, number>, topic: Topic): 0 | 1 | 2 | 3 {
  const levels = TYPES_OF_TOPIC[topic].map((t) => skill[t])
  if (levels.every((l) => l >= 3)) return 3
  if (levels.every((l) => l >= 2)) return 2
  if (levels.filter((l) => l >= 1).length * 2 >= levels.length) return 1
  return 0
}

// ---------- Aufgabenauswahl ----------

/** Wählt `count` Aufgabentypen: ca. 60 % schwache (Stufe 0/1), 30 % mittlere (2), 10 % starke (3). */
export function selectTypes(rng: Rng, skill: Record<TaskType, number>, count: number, topic?: Topic): TaskType[] {
  const pool = topic ? TYPES_OF_TOPIC[topic] : [...TASK_TYPES]
  const result: TaskType[] = []
  if (!topic) {
    for (const t of TOPICS) result.push(pick(rng, TYPES_OF_TOPIC[t]))
  }
  const buckets = [
    { weight: 0.6, types: pool.filter((t) => skill[t] <= 1) },
    { weight: 0.3, types: pool.filter((t) => skill[t] === 2) },
    { weight: 0.1, types: pool.filter((t) => skill[t] >= 3) },
  ].filter((b) => b.types.length > 0)
  const total = buckets.reduce((s, b) => s + b.weight, 0)
  while (result.length < count) {
    let r = rng() * total
    let gewaehlt = buckets[buckets.length - 1]
    for (const b of buckets) {
      if (r < b.weight) { gewaehlt = b; break }
      r -= b.weight
    }
    result.push(pick(rng, gewaehlt.types))
  }
  // Reihenfolge mischen, aber die Typen bleiben erhalten
  for (let i = result.length - 1; i > 0; i--) {
    const j = int(rng, 0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Antworten, deren Aufgaben am Rundenende noch einmal kommen (falsche zuerst, dann mit Hinweis gelöste). */
export function pickRepeatAnswers(answers: RoundAnswer[]): RoundAnswer[] {
  const base = answers.filter((a) => !a.isRepeat)
  const failed = base.filter((a) => a.outcome === 'failed')
  const second = base.filter((a) => a.outcome === 'second')
  return [...failed, ...second].slice(0, CONFIG.maxRepeatsPerRound)
}

/** Typen der Aufgaben, die am Rundenende noch einmal kommen. */
export function pickRepeats(answers: RoundAnswer[]): TaskType[] {
  return pickRepeatAnswers(answers).map((a) => a.type)
}

// ---------- Rundenabschluss ----------

export interface RoundSummary {
  state: GameState
  foodGained: number
  bonusFood: number
  /** true, wenn das Tageslimit erreicht war: kein Futter, nur Lernstand. */
  satt: boolean
  stageBefore: number
  stageAfter: number
  leveledUp: boolean
  /** Neu erreichte Sterne in dieser Runde (je eine Münze) */
  neueSterne: number
  /** Bonus-Münzen in dieser Runde: Stufenaufstieg, Tagesmitbringsel und Knobelrunde */
  neueBonusMuenzen: number
  /** true, wenn die Knobelrunde in dieser Runde eine Zusatzmünze gebracht hat */
  knobelMuenze: boolean
  /** true bei der ersten Runde des Tages: die Schlange bringt eine Münze mit */
  tagesMuenze: boolean
  /** Futterstand vor der Runde, für die Fortschrittsanzeige */
  foodBefore: number
  /** Futter aus kniffeligen Aufgaben (steckt in foodGained) */
  knobelFutter: number
  /** Zusatzfutter der Serie (steckt in foodGained) */
  serienFutter: number
  /** Neue Meilensteine dieser Runde, in Feier-Reihenfolge */
  meilensteine: Meilenstein[]
}

export function finishRound(state: GameState, answers: RoundAnswer[], now: Date, knobel = false): RoundSummary {
  const heute = dayKey(now)
  const roundsToday = state.rounds[heute] ?? 0
  const satt = roundsToday >= CONFIG.foodRoundsPerDay

  const skill = { ...state.skill }
  const verlauf = { ...leererVerlauf(), ...state.verlauf }
  const basisAntworten = answers.filter((a) => !a.isRepeat)
  let food = 0
  let knobelFutter = 0
  let serienFutter = 0
  for (const a of answers) {
    const stufe = a.stufe ?? 2
    skill[a.type] = updateSkill(skill[a.type], a.outcome, stufe)
    verlauf[a.type] = [...(verlauf[a.type] ?? []), { o: a.outcome, s: stufe }].slice(-VERLAUF_LAENGE)
  }
  for (const a of basisAntworten) {
    const f = foodForOutcome(a.outcome, a.stufe ?? 2)
    food += f
    if ((a.stufe ?? 2) === 3) knobelFutter += f
    if (a.serieBonus) { food += CONFIG.serieFutter; serienFutter += CONFIG.serieFutter }
  }

  const vollstaendig = basisAntworten.length >= CONFIG.roundLength
  const bonus = vollstaendig ? (knobel ? CONFIG.rundenBonusKnobel : CONFIG.roundBonus) : 0
  const gained = satt ? 0 : food
  const bonusGained = satt ? 0 : bonus

  const rounds = { ...state.rounds, [heute]: roundsToday + 1 }

  const sterneErreicht: Record<Topic, number> = { A: state.sterneErreicht?.A ?? 0, B: state.sterneErreicht?.B ?? 0, C: state.sterneErreicht?.C ?? 0 }
  let neueSterne = 0
  for (const t of TOPICS) {
    const jetzt = topicStars(skill, t)
    if (jetzt > sterneErreicht[t]) { neueSterne += jetzt - sterneErreicht[t]; sterneErreicht[t] = jetzt }
  }

  const totalFood = state.totalFood + gained + bonusGained
  const stageBefore = stageFor(state.totalFood).stage
  const stageAfter = stageFor(totalFood).stage
  // Knobelrunde: Zusatzmünzen, wenn mindestens 7 von 10 Aufgaben gleich beim ersten Versuch stimmen, höchstens einmal pro Tag.
  const knobelTage = [...(state.knobelTage ?? [])]
  const ersteVersuche = basisAntworten.filter((a) => a.outcome === 'first').length
  const knobelMuenze = knobel && vollstaendig && ersteVersuche >= CONFIG.knobelMinRichtig && !knobelTage.includes(heute)
  if (knobelMuenze) knobelTage.push(heute)
  // Tagesmitbringsel: die erste Runde jedes Tages bringt eine Münze, auch wenn die Schlange schon satt wäre.
  const tagesMuenze = roundsToday === 0

  const statistik: Statistik = {
    bearbeitet: state.statistik.bearbeitet + basisAntworten.length,
    geloest: state.statistik.geloest + basisAntworten.filter((a) => a.outcome !== 'failed').length,
    ersteTreffer: state.statistik.ersteTreffer + ersteVersuche,
    knobelTreffer: state.statistik.knobelTreffer + basisAntworten.filter((a) => a.outcome === 'first' && (a.stufe ?? 2) === 3).length,
  }

  const nachher: GameState = {
    ...state, totalFood, lastFedAt: now.toISOString(), rounds, skill, sterneErreicht, knobelTage: knobelTage.slice(-60),
    gekauft: state.gekauft ?? [], positionen: state.positionen ?? {}, verlauf, statistik,
  }
  const meilensteine = pruefeMeilensteine(state, nachher, heute, knobelMuenze)
  const neueBonusMuenzen =
    Math.max(0, stageAfter - stageBefore) + (knobelMuenze ? CONFIG.knobelMuenzen : 0) + (tagesMuenze ? 1 : 0) + zusatzMuenzen(meilensteine)

  return {
    state: { ...nachher, bonusMuenzen: (state.bonusMuenzen ?? 0) + neueBonusMuenzen, meilensteine: [...state.meilensteine, ...meilensteine] },
    foodGained: gained,
    bonusFood: bonusGained,
    satt,
    stageBefore,
    stageAfter,
    leveledUp: stageAfter > stageBefore,
    neueSterne,
    neueBonusMuenzen,
    knobelMuenze,
    tagesMuenze,
    foodBefore: state.totalFood,
    knobelFutter: satt ? 0 : knobelFutter,
    serienFutter: satt ? 0 : serienFutter,
    meilensteine,
  }
}

// ---------- Speichern: Export und Import ----------

export function serializeState(state: GameState): string {
  return JSON.stringify(state, null, 2)
}

/** Liest einen gespeicherten Stand. Fehlerhafte oder fremde Daten ergeben null. */
export function parseState(text: string): GameState | null {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return null
  }
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (r.version !== 1 || typeof r.name !== 'string') return null
  if (typeof r.totalFood !== 'number' || !Number.isFinite(r.totalFood) || r.totalFood < 0) return null
  if (r.lastFedAt !== null && (typeof r.lastFedAt !== 'string' || Number.isNaN(Date.parse(r.lastFedAt)))) return null
  const state = initialState(r.name.slice(0, 20))
  state.totalFood = Math.floor(r.totalFood)
  state.lastFedAt = r.lastFedAt as string | null
  if (typeof r.rounds === 'object' && r.rounds !== null) {
    for (const [k, v] of Object.entries(r.rounds)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && typeof v === 'number' && v >= 0) state.rounds[k] = Math.floor(v)
    }
  }
  if (typeof r.skill === 'object' && r.skill !== null) {
    const s = r.skill as Record<string, unknown>
    for (const t of TASK_TYPES) {
      const v = s[t]
      if (typeof v === 'number') state.skill[t] = Math.min(CONFIG.skillMax, Math.max(0, Math.floor(v)))
    }
  }
  // Alte Spielstände haben noch keine Münzen: die schon erreichten Sterne zählen rückwirkend.
  const se = typeof r.sterneErreicht === 'object' && r.sterneErreicht !== null ? (r.sterneErreicht as Record<string, unknown>) : {}
  for (const t of TOPICS) {
    const gespeichert = typeof se[t] === 'number' ? Math.min(3, Math.max(0, Math.floor(se[t] as number))) : 0
    state.sterneErreicht[t] = Math.max(gespeichert, topicStars(state.skill, t))
  }
  if (typeof r.bonusMuenzen === 'number' && Number.isFinite(r.bonusMuenzen) && r.bonusMuenzen > 0) {
    state.bonusMuenzen = Math.floor(r.bonusMuenzen)
  }
  if (Array.isArray(r.knobelTage)) {
    state.knobelTage = r.knobelTage.filter((k): k is string => typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k)).slice(-60)
  }
  if (Array.isArray(r.gekauft)) {
    state.gekauft = r.gekauft.filter((id, i, a): id is string => typeof id === 'string' && a.indexOf(id) === i)
  }
  if (typeof r.positionen === 'object' && r.positionen !== null) {
    for (const [id, p] of Object.entries(r.positionen as Record<string, unknown>)) {
      const q = p as { x?: unknown; y?: unknown } | null
      if (q && typeof q.x === 'number' && typeof q.y === 'number' && Number.isFinite(q.x) && Number.isFinite(q.y) && state.gekauft.includes(id)) {
        state.positionen[id] = { x: Math.min(100, Math.max(0, q.x)), y: Math.min(100, Math.max(0, q.y)) }
      }
    }
  }
  // Verlauf: letzte Versuche je Typ
  if (typeof r.verlauf === 'object' && r.verlauf !== null) {
    const v = r.verlauf as Record<string, unknown>
    for (const t of TASK_TYPES) {
      const liste = v[t]
      if (!Array.isArray(liste)) continue
      state.verlauf[t] = liste
        .filter((x): x is Versuch => !!x && ['first', 'second', 'failed'].includes((x as Versuch).o) && [1, 2, 3].includes((x as Versuch).s))
        .map((x) => ({ o: x.o, s: x.s }))
        .slice(-VERLAUF_LAENGE)
    }
  }
  if (typeof r.statistik === 'object' && r.statistik !== null) {
    const st = r.statistik as Record<string, unknown>
    const zahl = (k: string) => (typeof st[k] === 'number' && Number.isFinite(st[k]) && (st[k] as number) >= 0 ? Math.floor(st[k] as number) : 0)
    state.statistik = { bearbeitet: zahl('bearbeitet'), geloest: zahl('geloest'), ersteTreffer: zahl('ersteTreffer'), knobelTreffer: zahl('knobelTreffer') }
  }
  state.testDate = typeof r.testDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.testDate) ? r.testDate : null
  // Meilensteine: Altstände ohne dieses Feld bekommen das schon Erreichte ohne Feier und ohne Münzen eingetragen.
  state.meilensteine = Array.isArray(r.meilensteine) ? parseMeilensteine(r.meilensteine) : nachtragen(state, dayKey(new Date()))
  return state
}
