import { CONFIG, STAGES } from './config.ts'
import { TASK_TYPES, TOPIC_OF, TOPICS } from './tasks.ts'
import type { TaskType, Topic } from './tasks.ts'
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
}

export interface GameState {
  version: 1
  name: string
  totalFood: number
  lastFedAt: string | null
  /** Anzahl abgeschlossener Runden pro Tag (Schlüssel JJJJ-MM-TT). */
  rounds: Record<string, number>
  weeklyBonusWeeks: string[]
  skill: Record<TaskType, number>
  testDate: string | null
  /** Höchste je erreichte Sternzahl pro Thema. Jeder Stern ist eine Münze für den Shop und geht nie verloren. */
  sterneErreicht: Record<Topic, number>
  /** Zusätzliche Münzen: je eine pro Stufenaufstieg und pro geschafftem Wochenziel. */
  bonusMuenzen: number
  /** Tage (JJJJ-MM-TT), an denen die Knobelrunde schon eine Zusatzmünze gebracht hat (höchstens eine pro Tag). */
  knobelTage: string[]
  /** IDs der gekauften Shop-Dinge in Kaufreihenfolge */
  gekauft: string[]
  /** Vom Kind verschobene Plätze der Dinge im Terrarium (Prozent der Terrariumgröße) */
  positionen: Record<string, { x: number; y: number }>
}

export function initialState(name: string): GameState {
  const skill = {} as Record<TaskType, number>
  for (const t of TASK_TYPES) skill[t] = 0
  return { version: 1, name, totalFood: 0, lastFedAt: null, rounds: {}, weeklyBonusWeeks: [], skill, testDate: null, sterneErreicht: { A: 0, B: 0, C: 0 }, bonusMuenzen: 0, knobelTage: [], gekauft: [], positionen: {} }
}

// ---------- Futter und Stufen ----------

export function foodForOutcome(outcome: Outcome): number {
  return outcome === 'first' ? CONFIG.foodFirstTry : outcome === 'second' ? CONFIG.foodSecondTry : 0
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

// ---------- Tage und Wochen ----------

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Wochenschlüssel = Datum des Montags (Woche läuft Montag bis Sonntag). */
export function weekKey(d: Date): string {
  const montag = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  montag.setDate(montag.getDate() - ((montag.getDay() + 6) % 7))
  return dayKey(montag)
}

export function daysPracticedInWeek(rounds: Record<string, number>, now: Date): number {
  const woche = weekKey(now)
  return Object.keys(rounds).filter((k) => rounds[k] > 0 && weekKey(parseDay(k)) === woche).length
}

function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// ---------- Lernstand ----------

export function updateSkill(level: number, outcome: Outcome): number {
  const delta = outcome === 'first' ? 1 : outcome === 'failed' ? -1 : 0
  return Math.min(CONFIG.skillMax, Math.max(0, level + delta))
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
  weeklyBonus: number
  /** true, wenn das Tageslimit erreicht war: kein Futter, nur Lernstand. */
  satt: boolean
  stageBefore: number
  stageAfter: number
  leveledUp: boolean
  /** Neu erreichte Sterne in dieser Runde (je eine Münze) */
  neueSterne: number
  /** Bonus-Münzen in dieser Runde: Stufenaufstieg, Wochenziel und Knobelrunde */
  neueBonusMuenzen: number
  /** true, wenn die Knobelrunde in dieser Runde eine Zusatzmünze gebracht hat */
  knobelMuenze: boolean
  /** true bei der ersten Runde des Tages: die Schlange bringt eine Münze mit */
  tagesMuenze: boolean
  /** Futterstand vor der Runde, für die Fortschrittsanzeige */
  foodBefore: number
}

export function finishRound(state: GameState, answers: RoundAnswer[], now: Date, knobel = false): RoundSummary {
  const heute = dayKey(now)
  const roundsToday = state.rounds[heute] ?? 0
  const satt = roundsToday >= CONFIG.foodRoundsPerDay

  const skill = { ...state.skill }
  let food = 0
  const basisAntworten = answers.filter((a) => !a.isRepeat)
  for (const a of answers) skill[a.type] = updateSkill(skill[a.type], a.outcome)
  for (const a of basisAntworten) food += foodForOutcome(a.outcome)

  const bonus = basisAntworten.length >= CONFIG.roundLength ? CONFIG.roundBonus : 0
  const gained = satt ? 0 : food
  const bonusGained = satt ? 0 : bonus

  const rounds = { ...state.rounds, [heute]: roundsToday + 1 }
  let weeklyBonus = 0
  const woche = weekKey(now)
  const weeklyBonusWeeks = [...state.weeklyBonusWeeks]
  if (daysPracticedInWeek(rounds, now) >= CONFIG.weeklyGoalDays && !weeklyBonusWeeks.includes(woche)) {
    weeklyBonus = CONFIG.weeklyBonus
    weeklyBonusWeeks.push(woche)
  }

  const sterneErreicht: Record<Topic, number> = { A: state.sterneErreicht?.A ?? 0, B: state.sterneErreicht?.B ?? 0, C: state.sterneErreicht?.C ?? 0 }
  let neueSterne = 0
  for (const t of TOPICS) {
    const jetzt = topicStars(skill, t)
    if (jetzt > sterneErreicht[t]) { neueSterne += jetzt - sterneErreicht[t]; sterneErreicht[t] = jetzt }
  }

  const totalFood = state.totalFood + gained + bonusGained + weeklyBonus
  const stageBefore = stageFor(state.totalFood).stage
  const stageAfter = stageFor(totalFood).stage
  // Knobelrunde: eine Zusatzmünze, wenn mindestens 7 von 10 Aufgaben gleich beim ersten Versuch stimmen, höchstens einmal pro Tag.
  const knobelTage = [...(state.knobelTage ?? [])]
  const ersteVersuche = basisAntworten.filter((a) => a.outcome === 'first').length
  const knobelMuenze = knobel && basisAntworten.length >= CONFIG.roundLength && ersteVersuche >= CONFIG.knobelMinRichtig && !knobelTage.includes(heute)
  if (knobelMuenze) knobelTage.push(heute)
  // Tagesmitbringsel: die erste Runde jedes Tages bringt eine Münze, auch wenn die Schlange schon satt wäre (gibt es nur beim ersten Üben des Tages).
  const tagesMuenze = roundsToday === 0
  const neueBonusMuenzen = Math.max(0, stageAfter - stageBefore) + (weeklyBonus > 0 ? 1 : 0) + (knobelMuenze ? 1 : 0) + (tagesMuenze ? 1 : 0)

  return {
    state: { ...state, totalFood, lastFedAt: now.toISOString(), rounds, weeklyBonusWeeks, skill, sterneErreicht, bonusMuenzen: (state.bonusMuenzen ?? 0) + neueBonusMuenzen, knobelTage: knobelTage.slice(-60), gekauft: state.gekauft ?? [], positionen: state.positionen ?? {} },
    foodGained: gained,
    bonusFood: bonusGained,
    weeklyBonus,
    satt,
    stageBefore,
    stageAfter,
    leveledUp: stageAfter > stageBefore,
    neueSterne,
    neueBonusMuenzen,
    knobelMuenze,
    tagesMuenze,
    foodBefore: state.totalFood,
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
  if (Array.isArray(r.weeklyBonusWeeks)) {
    state.weeklyBonusWeeks = r.weeklyBonusWeeks.filter((w): w is string => typeof w === 'string')
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
  state.testDate = typeof r.testDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.testDate) ? r.testDate : null
  return state
}
