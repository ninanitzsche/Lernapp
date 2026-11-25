import { createRng, int, pick, shuffle } from './rng.ts'
import type { Rng } from './rng.ts'
import { vorgaenger, nachfolger, nachbarzehner } from './nachbarn.ts'
import {
  zahlZuWort, zahlwortTeile, einerStamm, zehnerWort, ALLE_EINER_STAEMME, ALLE_ZEHNER_WOERTER,
} from './zahlwort.ts'

/**
 * Zentrale Lernfeld-Liste. Neue Lernfelder werden nur hier eingetragen.
 * `imMix`: Das Lernfeld taucht in gemischten Runden, Knobelrunden und im Buchmodus auf.
 */
export const LERNFELDER = [
  { id: 'A', name: 'Zehner und Einer', imMix: true },
  { id: 'B', name: 'Zahlbilder', imMix: true },
  { id: 'C', name: 'Zahlenstrahl', imMix: true },
] as const
export type Topic = (typeof LERNFELDER)[number]['id']

/** Baut einen Record je Lernfeld, damit nirgends `{ A: ..., B: ..., C: ... }` von Hand steht. */
export function jeLernfeld<T>(wert: (t: Topic) => T): Record<Topic, T> {
  const r = {} as Record<Topic, T>
  for (const f of LERNFELDER) r[f.id] = wert(f.id)
  return r
}

export function istTopic(x: unknown): x is Topic {
  return LERNFELDER.some((f) => f.id === x)
}
/** Schwierigkeit: 1 leicht, 2 mittel (das bisherige Normal), 3 knifflig (die bisherige Knobelrunde). */
export type Stufe = 1 | 2 | 3
export const STUFEN_NAMEN: Record<Stufe, string> = { 1: 'leicht', 2: 'mittel', 3: 'knifflig' }
export const TASK_TYPES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'C4'] as const
export type TaskType = (typeof TASK_TYPES)[number]

export const TOPIC_OF: Record<TaskType, Topic> = {
  A1: 'A', A2: 'A', A3: 'A', B1: 'B', B2: 'B', B3: 'B', C1: 'C', C2: 'C', C3: 'C', C4: 'C',
}
export const TOPICS: Topic[] = LERNFELDER.map((f) => f.id)
/** Lernfelder, aus denen gemischte Runden, Knobelrunden und der Buchmodus Aufgaben ziehen. */
export const MIX_TOPICS: Topic[] = LERNFELDER.filter((f) => f.imMix).map((f) => f.id)
export const TOPIC_NAMES: Record<Topic, string> = jeLernfeld((t) => LERNFELDER.find((f) => f.id === t)!.name)
export const TYPE_NAMES: Record<TaskType, string> = {
  A1: 'Zahlwörter und Zahlen',
  A2: 'Stellentafel',
  A3: 'Zahlenreihen',
  B1: 'Zahlbild lesen',
  B2: 'Zahlbild legen',
  B3: 'Vergleichen und ordnen',
  C1: 'Zahl auf dem Zahlenstrahl',
  C2: 'Zahl ablesen',
  C3: 'Vorgänger und Nachfolger',
  C4: 'Nachbarzehner',
}

export type Visual =
  | { kind: 'zahlbilder'; items: { tens: number; ones: number }[] }
  | { kind: 'strahl'; from: number; to: number; tickStep: number; labelStep: number; marker?: number }
  | { kind: 'stellentafel'; tens: number | null; ones: number | null }

export type Input =
  | { kind: 'number'; answer: number }
  | { kind: 'pair'; labels: [string, string]; answer: [number, number] }
  | { kind: 'choice'; options: string[]; answer: number }
  | { kind: 'order'; numbers: number[] }
  | { kind: 'build'; tens: number; ones: number }
  | { kind: 'line'; from: number; to: number; tickStep: number; labelStep: number; snap: number; answer: number; tolerance: number }
  | { kind: 'cards'; pool: string[]; answer: string[] }

export interface Task {
  type: TaskType
  topic: Topic
  prompt: string
  visual?: Visual
  input: Input
  hint: string
  solution: string
  /** Schwierigkeit. Altdaten ohne Stufe gelten als 2. */
  stufe: Stufe
  /** Buchstelle, wenn die Aufgabe aus dem Lehrwerk stammt, zum Beispiel "Buch S. 21, Aufg. 8". */
  source?: string
}

export type Response = number | number[] | string[]

function make(type: TaskType, rest: Omit<Task, 'type' | 'topic' | 'stufe'>): Task {
  return { type, topic: TOPIC_OF[type], stufe: 2, ...rest }
}

function inRange(n: number): boolean {
  return Number.isInteger(n) && n >= 0 && n <= 100
}

/** Vier Antwortmöglichkeiten: richtige Zahl plus typische Verwechslungen (Zahlendreher, +-1, +-10). */
function zahlenOptionen(rng: Rng, answer: number): { options: string[]; answer: number } {
  const kandidaten: number[] = []
  const e = answer % 10
  const z = Math.floor(answer / 10)
  if (answer >= 21 && answer <= 99 && e !== 0 && e !== z) kandidaten.push(e * 10 + z)
  kandidaten.push(answer + 10, answer - 10, answer + 1, answer - 1)
  const distraktoren: number[] = []
  for (const k of shuffle(rng, kandidaten)) {
    if (inRange(k) && k !== answer && !distraktoren.includes(k)) distraktoren.push(k)
    if (distraktoren.length === 3) break
  }
  while (distraktoren.length < 3) {
    const k = int(rng, 0, 100)
    if (k !== answer && !distraktoren.includes(k)) distraktoren.push(k)
  }
  const alle = shuffle(rng, [answer, ...distraktoren])
  return { options: alle.map(String), answer: alle.indexOf(answer) }
}

const SYMBOLE = ['<', '>', '='] as const
function vergleichsIndex(a: number, b: number): number {
  return SYMBOLE.indexOf(a < b ? '<' : a > b ? '>' : '=')
}

// ---------- Thema A: Zehner und Einer ----------

function genA1(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  // Knobelrunde: kein Ankreuzen, sondern selbst schreiben oder Wortkarten legen
  const modus = leicht ? 0 : schwer ? int(rng, 1, 2) : int(rng, 0, 2)
  if (modus === 2) {
    // Zahlwort aus Wortkarten legen (nur 21 bis 99, keine Zehnerzahlen)
    let n = int(rng, 21, 99)
    while (n % 10 === 0) n = int(rng, 21, 99)
    const teile = zahlwortTeile(n)
    const anderEiner = pick(rng, ALLE_EINER_STAEMME.filter((w) => w !== teile[0]))
    const anderZehner = pick(rng, ALLE_ZEHNER_WOERTER.filter((w) => w !== teile[2]))
    return make('A1', {
      prompt: `Lege das Zahlwort zu ${n}. Tippe die Karten in der richtigen Reihenfolge.`,
      input: { kind: 'cards', pool: shuffle(rng, [...teile, anderEiner, anderZehner]), answer: [...teile] },
      hint: 'Im Zahlwort kommen zuerst die Einer, dann "und", dann die Zehner.',
      solution: `${n} heißt ${zahlZuWort(n)}.`,
    })
  }
  const n = int(rng, 11, leicht ? 30 : 100)
  const wort = zahlZuWort(n)
  const hint = 'Höre auf den Anfang und das Ende. Die Einer werden zuerst gesprochen: bei siebenunddreißig kommt die Sieben vor der Dreißig.'
  const solution = `${wort} ist die Zahl ${n}.`
  if (modus === 0) {
    const o = zahlenOptionen(rng, n)
    return make('A1', {
      prompt: `Welche Zahl gehört zu "${wort}"?`,
      input: { kind: 'choice', options: o.options, answer: o.answer },
      hint,
      solution,
    })
  }
  return make('A1', {
    prompt: `Schreibe die Zahl zu "${wort}".`,
    input: { kind: 'number', answer: n },
    hint,
    solution,
  })
}

function genA2(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  if (schwer) {
    const z = int(rng, 1, 8)
    const e = int(rng, 1, 9)
    if (rng() < 0.5) {
      return make('A2', {
        prompt: `Rechne: ${e} + ${z * 10}`,
        input: { kind: 'number', answer: z * 10 + e },
        hint: 'Die Reihenfolge ist egal. Die Zehnerzahl und die Einer gehören zusammen.',
        solution: `${e} + ${z * 10} = ${z * 10 + e}`,
      })
    }
    return make('A2', {
      prompt: `Wie viel sind ${z} Zehner und ${e + 10} Einer zusammen?`,
      input: { kind: 'number', answer: z * 10 + e + 10 },
      hint: '10 Einer sind ein Zehner. Bündle zuerst, dann schreibe die Zahl.',
      solution: `${e + 10} Einer sind 1 Zehner und ${e} Einer. Zusammen: ${z + 1} Zehner und ${e} Einer, also ${z * 10 + e + 10}.`,
    })
  }
  const modus = leicht ? int(rng, 0, 1) : int(rng, 0, 2)
  if (modus === 0) {
    const n = int(rng, 10, leicht ? 50 : 99)
    const z = Math.floor(n / 10)
    const e = n % 10
    return make('A2', {
      prompt: `Trage ${n} in die Stellentafel ein: Wie viele Zehner (Z) und wie viele Einer (E)?`,
      input: { kind: 'pair', labels: ['Z (Zehner)', 'E (Einer)'], answer: [z, e] },
      hint: 'Die erste Ziffer zeigt die Zehner, die zweite die Einer.',
      solution: `${n} hat ${z} Zehner und ${e} Einer.`,
    })
  }
  const z = int(rng, 1, leicht ? 4 : 9)
  const e = int(rng, 1, 9)
  if (modus === 1) {
    return make('A2', {
      prompt: `Welche Zahl steht in der Stellentafel?`,
      visual: { kind: 'stellentafel', tens: z, ones: e },
      input: { kind: 'number', answer: z * 10 + e },
      hint: 'Schreibe erst die Zehner, dann die Einer nebeneinander.',
      solution: `${z} Zehner und ${e} Einer ergeben ${z * 10 + e}.`,
    })
  }
  return make('A2', {
    prompt: `Rechne: ${z * 10} + ${e}`,
    input: { kind: 'number', answer: z * 10 + e },
    hint: 'Die Zehnerzahl und die Einer gehören zusammen.',
    solution: `${z * 10} + ${e} = ${z * 10 + e}`,
  })
}

function genA3(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  const d = pick(rng, schwer ? [2, -2, 5, -5, 20, -20] : leicht ? [1, -1] : [1, -1, 10, -10])
  const betrag = Math.abs(d)
  const hoechst = leicht ? 30 : 100
  const start = d > 0 ? int(rng, 0, hoechst - 3 * betrag) : int(rng, 3 * betrag, hoechst)
  const reihe = [start, start + d, start + 2 * d]
  const naechste = start + 3 * d
  const richtung = d > 0 ? 'größer' : 'kleiner'
  return make('A3', {
    prompt: `Setze die Reihe fort: ${reihe.join(', ')}, ...  Welche Zahl kommt als Nächstes?`,
    input: { kind: 'number', answer: naechste },
    hint: `Die Zahlen werden jedes Mal um ${betrag} ${richtung}.`,
    solution: `Es geht in ${betrag}er-Schritten ${d > 0 ? 'vorwärts' : 'rückwärts'}: ${reihe.join(', ')}, ${naechste}.`,
  })
}

// ---------- Thema B: Zahlbilder ----------

function genB1(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  const z = int(rng, 1, leicht ? 3 : 9)
  const e = int(rng, 0, 9)
  const n = z * 10 + e
  if (schwer && n < 99) {
    return make('B1', {
      prompt: 'Welche Zahl ist 1 mehr als das Zahlbild zeigt?',
      visual: { kind: 'zahlbilder', items: [{ tens: z, ones: e }] },
      input: { kind: 'number', answer: n + 1 },
      hint: 'Lies erst das Zahlbild. Dann zähle 1 dazu.',
      solution: `Das Zahlbild zeigt ${n}. 1 mehr ist ${n + 1}.`,
    })
  }
  return make('B1', {
    prompt: 'Welche Zahl zeigt das Zahlbild?',
    visual: { kind: 'zahlbilder', items: [{ tens: z, ones: e }] },
    input: { kind: 'number', answer: n },
    hint: 'Jede Stange sind 10. Zähle die Stangen, dann die roten Punkte.',
    solution: `${z} Stangen sind ${z * 10}, dazu ${e} Punkte: ${n}.`,
  })
}

function genB2(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  const basis = int(rng, 11, leicht ? 40 : schwer ? 98 : 99)
  const n = schwer ? basis + 1 : basis
  const z = Math.floor(n / 10)
  const e = n % 10
  return make('B2', {
    prompt: schwer ? `Lege das Zahlbild zu der Zahl, die 1 mehr ist als ${basis}.` : `Lege das Zahlbild zu ${n}.`,
    input: { kind: 'build', tens: z, ones: e },
    hint: 'Die erste Ziffer sagt, wie viele Stangen du brauchst. Die zweite Ziffer sagt, wie viele Punkte.',
    solution: `${n} sind ${z} Zehner und ${e} Einer.`,
  })
}

function genB3(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  const hint = 'Vergleiche zuerst die Zehner. Sind sie gleich, dann vergleiche die Einer.'
  const modus = leicht ? pick(rng, [0, 2]) : schwer ? pick(rng, [1, 3]) : int(rng, 0, 3)
  const obergrenze = leicht ? 50 : 99
  if (modus === 0) {
    const a = int(rng, 10, obergrenze)
    const b = rng() < 0.15 ? a : int(rng, 10, obergrenze)
    return make('B3', {
      prompt: `Welches Zeichen passt? ${a} ? ${b}`,
      input: { kind: 'choice', options: [...SYMBOLE], answer: vergleichsIndex(a, b) },
      hint,
      solution: `${a} ${SYMBOLE[vergleichsIndex(a, b)]} ${b}`,
    })
  }
  if (modus === 1) {
    const l = int(rng, 1, 9) * 10 + int(rng, 1, 9)
    const x = int(rng, 3, 10) * 10
    let y = int(rng, 1, 9)
    if (rng() < 0.2 && x - l >= 1 && x - l <= 9) y = x - l
    const rechts = x - y
    return make('B3', {
      prompt: `Welches Zeichen passt? ${Math.floor(l / 10) * 10} + ${l % 10} ? ${x} - ${y}`,
      input: { kind: 'choice', options: [...SYMBOLE], answer: vergleichsIndex(l, rechts) },
      hint: 'Rechne erst beide Seiten aus. Dann vergleichst du die Ergebnisse.',
      solution: `${Math.floor(l / 10) * 10} + ${l % 10} = ${l} und ${x} - ${y} = ${rechts}, also ${l} ${SYMBOLE[vergleichsIndex(l, rechts)]} ${rechts}.`,
    })
  }
  if (modus === 2) {
    const a = int(rng, 10, obergrenze)
    const b = rng() < 0.15 ? a : int(rng, 10, obergrenze)
    return make('B3', {
      prompt: 'Vergleiche die beiden Zahlbilder. Welches Zeichen passt?',
      visual: {
        kind: 'zahlbilder',
        items: [
          { tens: Math.floor(a / 10), ones: a % 10 },
          { tens: Math.floor(b / 10), ones: b % 10 },
        ],
      },
      input: { kind: 'choice', options: [...SYMBOLE], answer: vergleichsIndex(a, b) },
      hint,
      solution: `Die Zahlbilder zeigen ${a} und ${b}: ${a} ${SYMBOLE[vergleichsIndex(a, b)]} ${b}.`,
    })
  }
  const anzahl = schwer ? 4 : int(rng, 3, 4)
  const zehnerBasis = schwer ? int(rng, 1, 8) * 10 : 0
  const zahlen: number[] = []
  while (zahlen.length < anzahl) {
    // Knobelrunde: Zahlen liegen nah beieinander (gleicher oder benachbarter Zehner)
    const k = schwer ? zehnerBasis + int(rng, 0, 19) : int(rng, 10, 99)
    if (!zahlen.includes(k)) zahlen.push(k)
  }
  return make('B3', {
    prompt: 'Ordne die Zahlen. Tippe die kleinste Zahl zuerst.',
    input: { kind: 'order', numbers: zahlen },
    hint,
    solution: `Geordnet: ${[...zahlen].sort((p, q) => p - q).join(' < ')}.`,
  })
}

// ---------- Thema C: Zahlenstrahl ----------

function genC1(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  const modus = leicht ? 0 : schwer ? int(rng, 1, 2) : int(rng, 0, 2)
  const hint = 'Der Zahlenstrahl beginnt links bei der kleinen Zahl. Suche zuerst die nächste beschriftete Zahl.'
  if (modus === 0) {
    const n = int(rng, 1, 9) * 10
    return make('C1', {
      prompt: `Tippe auf den Zahlenstrahl: Wo liegt ${n}?`,
      input: { kind: 'line', from: 0, to: 100, tickStep: 10, labelStep: 50, snap: 10, answer: n, tolerance: 0 },
      hint,
      solution: `${n} liegt bei ${n / 10} Zehnerschritten von der 0.`,
    })
  }
  if (modus === 1) {
    const from = int(rng, 0, 8) * 10
    const n = from + int(rng, 1, 19)
    return make('C1', {
      prompt: `Tippe auf den Zahlenstrahl: Wo liegt ${n}?`,
      input: { kind: 'line', from, to: from + 20, tickStep: 1, labelStep: 10, snap: 1, answer: n, tolerance: 0 },
      hint,
      solution: `${n} liegt zwischen ${Math.floor(n / 10) * 10} und ${Math.floor(n / 10) * 10 + 10}.`,
    })
  }
  const n = int(rng, 1, 99)
  return make('C1', {
    prompt: `Wo ${schwer ? 'fast genau' : 'ungefähr'} liegt ${n}? Tippe auf den Zahlenstrahl.`,
    input: { kind: 'line', from: 0, to: 100, tickStep: 10, labelStep: 50, snap: 1, answer: n, tolerance: schwer ? 2 : 5 },
    hint: 'Suche erst die beiden Zehner, zwischen denen die Zahl liegt.',
    solution: `${n} liegt zwischen ${Math.floor(n / 10) * 10} und ${Math.floor(n / 10) * 10 + 10}.`,
  })
}

function genC2(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  let from: number
  let to: number
  let tickStep: number
  let marker: number
  if (leicht) {
    // Ganzer Strahl 0 bis 100, der Pfeil zeigt auf einen Zehner
    from = 0
    to = 100
    tickStep = 10
    marker = int(rng, 1, 9) * 10
  } else if (schwer) {
    // Teilstrahl mit Einerstrichen, nur die Enden sind beschriftet
    from = int(rng, 0, 8) * 10
    to = from + 20
    tickStep = 1
    do { marker = from + int(rng, 1, 19) } while (marker === from + 10)
  } else if (rng() < 0.5) {
    from = int(rng, 0, 18) * 5
    to = from + 10
    tickStep = 1
    marker = from + int(rng, 1, 9)
  } else {
    from = int(rng, 0, 8) * 10
    to = from + 20
    tickStep = 5
    marker = from + 5 * int(rng, 1, 3)
  }
  return make('C2', {
    prompt: 'Welche Zahl zeigt der Pfeil?',
    visual: { kind: 'strahl', from, to, tickStep, labelStep: leicht ? 50 : to - from, marker },
    input: { kind: 'number', answer: marker },
    hint: leicht ? 'Jeder Strich ist ein Zehner. Zähle die Striche von der 0 bis zum Pfeil: 10, 20, 30 ...' : `Beginne bei ${from} und zähle in ${tickStep}er-Schritten bis zum Pfeil.`,
    solution: `Der Pfeil zeigt ${marker}.`,
  })
}

function genC3(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  // Knobelrunde: Zahlen an der Zehnergrenze (9, 10, 19, 20, ...)
  let n = schwer ? pick(rng, [9, 10, 19, 20, 29, 30, 39, 40, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90, 99]) : int(rng, 1, 99)
  // Leicht: kleine Zahlen und keine Zehnergrenze (nicht 0 oder 9 am Ende)
  if (leicht) do { n = int(rng, 2, 29) } while (n % 10 === 0 || n % 10 === 9)
  const v = vorgaenger(n) as number
  const f = nachfolger(n) as number
  return make('C3', {
    prompt: `Wie heißen Vorgänger und Nachfolger von ${n}?`,
    input: { kind: 'pair', labels: ['Vorgänger', 'Nachfolger'], answer: [v, f] },
    hint: 'Der Vorgänger ist die Zahl direkt davor, der Nachfolger die Zahl direkt danach.',
    solution: `${v} < ${n} < ${f}`,
  })
}

function genC4(rng: Rng, stufe: Stufe = 2): Task {
  const schwer = stufe === 3
  const leicht = stufe === 1
  // Knobelrunde: öfter Zehnerzahlen, bei denen der Nachbarzehner nicht gleich nebenan liegt
  let n = schwer && rng() < 0.6 ? int(rng, 1, 9) * 10 : int(rng, 1, 99)
  // Leicht: keine Zehnerzahl, Zahlen von 11 bis 49
  if (leicht) do { n = int(rng, 11, 49) } while (n % 10 === 0)
  const r = nachbarzehner(n) as [number, number]
  return make('C4', {
    prompt: `Wie heißen die Nachbarzehner von ${n}?`,
    input: { kind: 'pair', labels: ['Zehner davor', 'Zehner danach'], answer: r },
    hint: n % 10 === 0 ? 'Die Zahl ist selbst ein Zehner. Der Nachbarzehner davor ist 10 weniger, der danach 10 mehr.' : 'Zwischen welchen zwei Zehnern liegt die Zahl?',
    solution: `${r[0]} < ${n} < ${r[1]}`,
  })
}

const GENERATORS: Record<TaskType, (rng: Rng, stufe?: Stufe) => Task> = {
  A1: genA1, A2: genA2, A3: genA3, B1: genB1, B2: genB2, B3: genB3, C1: genC1, C2: genC2, C3: genC3, C4: genC4,
}

/** `true` und `false` bleiben für ältere Aufrufe gültig: true ist Stufe 3, false ist Stufe 2. */
export function alsStufe(s: Stufe | boolean): Stufe {
  return s === true ? 3 : s === false ? 2 : s
}

export function generateTask(type: TaskType, rng: Rng, stufe: Stufe | boolean = 2): Task {
  const st = alsStufe(stufe)
  return { ...GENERATORS[type](rng, st), stufe: st }
}

/** Neue Aufgabe desselben Typs, die sich im Text von `avoidPrompt` unterscheidet. */
export function generateDifferent(type: TaskType, rng: Rng, avoidPrompt: string, stufe: Stufe | boolean = 2): Task {
  let t = generateTask(type, rng, stufe)
  for (let i = 0; i < 30 && t.prompt === avoidPrompt; i++) t = generateTask(type, rng, stufe)
  return t
}

export function taskFromSeed(type: TaskType, seed: number): Task {
  return generateTask(type, createRng(seed))
}

/** Die richtige Antwort in der Form, die checkAnswer erwartet. */
export function correctResponse(task: Task): Response {
  const i = task.input
  switch (i.kind) {
    case 'number': return i.answer
    case 'pair': return [...i.answer]
    case 'choice': return i.answer
    case 'order': return [...i.numbers].sort((a, b) => a - b)
    case 'build': return [i.tens, i.ones]
    case 'line': return i.answer
    case 'cards': return [...i.answer]
  }
}

function gleich(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((v, k) => v === b[k])
}

export function checkAnswer(task: Task, response: Response): boolean {
  const i = task.input
  switch (i.kind) {
    case 'number':
    case 'choice':
      return typeof response === 'number' && response === i.answer
    case 'line':
      return typeof response === 'number' && Math.abs(response - i.answer) <= i.tolerance
    case 'pair':
      return Array.isArray(response) && gleich(response, i.answer)
    case 'build':
      return Array.isArray(response) && gleich(response, [i.tens, i.ones])
    case 'order':
      return Array.isArray(response) && gleich(response, [...i.numbers].sort((a, b) => a - b))
    case 'cards':
      return Array.isArray(response) && gleich(response, i.answer)
  }
}

// Wird von der Oberfläche für Kartenaufgaben gebraucht.
export { einerStamm, zehnerWort }
