// Aufgabenbank nach den Buchseiten (Fotos von Nina) und dem Transparenzpapier.
// Es werden die Zahlen und Aufgabenformen übernommen, Texte und Grafiken sind eigene.
// Rechenergebnisse und richtige Antworten werden immer berechnet, nie von Hand eingetragen.
import { TOPIC_OF } from './tasks.ts'
import type { Task, TaskType } from './tasks.ts'
import { nachbarzehner, nachfolger, vorgaenger } from './nachbarn.ts'
import { zahlZuWort, zahlwortTeile } from './zahlwort.ts'
import { shuffle, pick } from './rng.ts'
import type { Rng } from './rng.ts'

export interface BookTask {
  type: TaskType
  source: string
  build: () => Task
}

const SYMBOLE = ['<', '>', '='] as const
const idx = (a: number, b: number) => SYMBOLE.indexOf(a < b ? '<' : a > b ? '>' : '=')

function mk(type: TaskType, source: string, rest: Omit<Task, 'type' | 'topic' | 'source'>): Task {
  return { type, topic: TOPIC_OF[type], source, ...rest }
}

const S14_4 = 'Buch S. 14, Aufg. 4'
const S15_6 = 'Buch S. 15, Aufg. 6'
const S15_7 = 'Buch S. 15, Aufg. 7'
const S16_4 = 'Buch S. 16, Aufg. 4'
const S17_6 = 'Buch S. 17, Aufg. 6'
const S17_8 = 'Buch S. 17, Aufg. 8'
const S20_2 = 'Buch S. 20, Aufg. 2'
const S20_3 = 'Buch S. 20, Aufg. 3'
const S21_6 = 'Buch S. 21, Aufg. 6'
const S21_7 = 'Buch S. 21, Aufg. 7'
const S21_8 = 'Buch S. 21, Aufg. 8'
const S21_9 = 'Buch S. 21, Aufg. 9'

export const BOOK_SOURCES = [
  S14_4, S15_6, S15_7, S16_4, S17_6, S17_8, S20_2, S20_3, S21_6, S21_7, S21_8, S21_9,
] as const

const bank: BookTask[] = []
function add(type: TaskType, source: string, build: () => Task) {
  bank.push({ type, source, build })
}

// ---------- Thema A ----------

// S. 14 Aufg. 4: Zahlbild, wie viele Zehner und Einer (Stellentafel)
for (const [z, e] of [[4, 5], [3, 2], [5, 2], [8, 5]] as const) {
  add('A2', S14_4, () => mk('A2', S14_4, {
    prompt: 'Wie viele Zehner? Wie viele Einer? Trage in die Stellentafel ein.',
    visual: { kind: 'zahlbilder', items: [{ tens: z, ones: e }] },
    input: { kind: 'pair', labels: ['Z (Zehner)', 'E (Einer)'], answer: [z, e] },
    hint: 'Jede Stange ist ein Zehner. Die roten Punkte sind die Einer.',
    solution: `${z} Zehner und ${e} Einer: das ist die Zahl ${z * 10 + e}.`,
  }))
}

// S. 15 Aufg. 6a: Stellentafel legen, Zahl bilden
for (const [z, e] of [[2, 3], [4, 4], [6, 2], [7, 5]] as const) {
  add('A2', S15_6, () => mk('A2', S15_6, {
    prompt: 'Welche Zahl legst du? Das steht in der Stellentafel.',
    visual: { kind: 'stellentafel', tens: z, ones: e },
    input: { kind: 'number', answer: z * 10 + e },
    hint: 'Erst die Zehner, dann die Einer nebeneinander schreiben.',
    solution: `${z} Zehner und ${e} Einer ergeben ${z * 10 + e}.`,
  }))
}

// S. 15 Aufg. 6b: Terme
for (const [z10, e] of [[90, 2], [50, 5], [20, 8], [60, 7]] as const) {
  add('A2', S15_6, () => mk('A2', S15_6, {
    prompt: `Welche Zahl legst du? Rechne: ${z10} + ${e}`,
    input: { kind: 'number', answer: z10 + e },
    hint: 'Die Zehnerzahl und die Einer gehören zusammen.',
    solution: `${z10} + ${e} = ${z10 + e}`,
  }))
}

// S. 15 Aufg. 6c, Aufg. 8 und Beispiel: Zahlwörter mit Wortkarten
for (const n of [74, 95, 63, 57, 37, 31]) {
  const [a, , c] = zahlwortTeile(n)
  add('A1', S15_6, () => mk('A1', S15_6, {
    prompt: `Du siehst die Wortkarten "${a}", "und", "${c}". Welche Zahl legst du?`,
    input: { kind: 'number', answer: n },
    hint: 'Die Einer werden zuerst gesprochen, die Zehner danach.',
    solution: `${a} und ${c} ist die Zahl ${n}.`,
  }))
  add('A1', S15_6, () => mk('A1', S15_6, {
    prompt: `Lege die Wortkarten zu ${n}. Tippe die Karten in der richtigen Reihenfolge.`,
    input: {
      kind: 'cards',
      pool: [a, 'und', c, a === 'sechs' ? 'acht' : 'sechs', c === 'neunzig' ? 'achtzig' : 'neunzig'],
      answer: [a, 'und', c],
    },
    hint: 'Zuerst kommen die Einer, dann "und", dann die Zehner.',
    solution: `${n} heißt ${zahlZuWort(n)}.`,
  }))
}

// S. 15 Aufg. 7 und S. 21 Aufg. 7b/c: Zahlenreihen fortsetzen (nächste zwei Zahlen)
function reihe(source: string, start: number, d: number) {
  const gezeigt = [start, start + d, start + 2 * d]
  const n1 = start + 3 * d
  const n2 = start + 4 * d
  add('A3', source, () => mk('A3', source, {
    prompt: `Zähle weiter: ${gezeigt.join(', ')}, ...  Welche zwei Zahlen kommen als Nächstes?`,
    input: { kind: 'pair', labels: ['als Nächstes', 'danach'], answer: [n1, n2] },
    hint: `Es geht in ${Math.abs(d)}er-Schritten ${d > 0 ? 'vorwärts' : 'rückwärts'}.`,
    solution: `${gezeigt.join(', ')}, ${n1}, ${n2}`,
  }))
}
reihe(S15_7, 21, 1)
reihe(S15_7, 75, 1)
reihe(S15_7, 50, -1)
reihe(S15_7, 32, -1)
reihe(S21_7, 5, 10)
reihe(S21_7, 99, -10)

// ---------- Thema B ----------

// S. 14 Aufg. 4: Zahlbild lesen
for (const [z, e] of [[4, 5], [3, 2], [5, 2], [8, 5]] as const) {
  add('B1', S14_4, () => mk('B1', S14_4, {
    prompt: 'Welche Zahl zeigt das Zahlbild?',
    visual: { kind: 'zahlbilder', items: [{ tens: z, ones: e }] },
    input: { kind: 'number', answer: z * 10 + e },
    hint: 'Jede Stange sind 10. Zähle die Stangen, dann die roten Punkte.',
    solution: `${z} Stangen sind ${z * 10}, dazu ${e} Punkte: ${z * 10 + e}.`,
  }))
}

// S. 16 Aufg. 4 und S. 17 Aufg. 6: Zahlbild legen
for (const [n, src] of [
  [23, S16_4], [43, S16_4], [56, S16_4], [82, S16_4],
  [21, S17_6], [34, S17_6], [65, S17_6], [71, S17_6], [83, S17_6], [94, S17_6],
] as [number, string][]) {
  add('B2', src, () => mk('B2', src, {
    prompt: `Lege das Zahlbild zu ${n}.`,
    input: { kind: 'build', tens: Math.floor(n / 10), ones: n % 10 },
    hint: 'Die erste Ziffer sagt, wie viele Stangen du brauchst. Die zweite sagt, wie viele Punkte.',
    solution: `${n} sind ${Math.floor(n / 10)} Zehner und ${n % 10} Einer.`,
  }))
}

// S. 17 Aufg. 8: Zahlen und Terme vergleichen
function vergleich(l: string, lv: number, r: string, rv: number, hint = 'Rechne erst beide Seiten aus, dann vergleiche.') {
  add('B3', S17_8, () => mk('B3', S17_8, {
    prompt: `Welches Zeichen passt? ${l} ? ${r}`,
    input: { kind: 'choice', options: [...SYMBOLE], answer: idx(lv, rv) },
    hint,
    solution: `${l} = ${lv} und ${r} = ${rv}, also ${lv} ${SYMBOLE[idx(lv, rv)]} ${rv}.`,
  }))
}
const zahlHint = 'Vergleiche zuerst die Zehner. Sind sie gleich, dann vergleiche die Einer.'
for (const [a, b] of [[34, 45], [89, 98], [78, 78], [46, 46], [56, 58], [73, 37]] as const) {
  vergleich(String(a), a, String(b), b, zahlHint)
}
vergleich('56', 56, '60 + 5', 65)
vergleich('72', 72, '70 + 2', 72)
vergleich('93', 93, '60 + 3', 63)
vergleich('80 + 6', 86, '90 - 6', 84)
vergleich('60 + 4', 64, '60 - 4', 56)
vergleich('30 + 5', 35, '40 - 5', 35)

// ---------- Thema C ----------

function tippen(source: string, n: number, snap: number, tolerance: number, ungefaehr: boolean) {
  add('C1', source, () => mk('C1', source, {
    prompt: ungefaehr ? `Wo ungefähr liegt ${n}? Tippe auf den Zahlenstrahl.` : `Zeige ${n} am Zahlenstrahl.`,
    input: { kind: 'line', from: 0, to: 100, tickStep: 10, labelStep: 50, snap, answer: n, tolerance },
    hint: 'Suche erst die beiden Zehner, zwischen denen die Zahl liegt.',
    solution: `${n} liegt ${n % 10 === 0 ? `genau bei ${n}` : `zwischen ${Math.floor(n / 10) * 10} und ${Math.floor(n / 10) * 10 + 10}`}.`,
  }))
}
// S. 21 Aufg. 6: a) Zehnerzahlen (genau), b) 15, 25, ... (genau), c) beliebige Zahlen (+-2)
for (const n of [20, 30, 60, 80, 100]) tippen(S21_6, n, 10, 0, false)
for (const n of [15, 25, 55, 65, 95]) tippen(S21_6, n, 5, 0, false)
for (const n of [22, 37, 53, 61, 89]) tippen(S21_6, n, 1, 2, false)
// S. 20 Aufg. 2: wo ungefähr (+-5)
for (const n of [24, 51, 76, 99, 10, 20, 30, 40, 60, 70, 80, 90, 5, 15, 65, 85]) tippen(S20_2, n, 1, 5, true)

// S. 20 Aufg. 3: Zahl am Teilstrahl ablesen
add('C2', S20_3, () => mk('C2', S20_3, {
  prompt: 'Welche Zahl zeigt der Pfeil?',
  visual: { kind: 'strahl', from: 30, to: 50, tickStep: 10, labelStep: 20, marker: 40 },
  input: { kind: 'number', answer: 40 },
  hint: 'Der Pfeil steht genau in der Mitte zwischen 30 und 50.',
  solution: 'Der Pfeil zeigt 40.',
}))
add('C2', S20_3, () => mk('C2', S20_3, {
  prompt: 'Welche Zahl zeigt der Pfeil?',
  visual: { kind: 'strahl', from: 65, to: 75, tickStep: 5, labelStep: 10, marker: 70 },
  input: { kind: 'number', answer: 70 },
  hint: 'Der Pfeil steht genau in der Mitte zwischen 65 und 75.',
  solution: 'Der Pfeil zeigt 70.',
}))

// S. 21 Aufg. 7a und 8: Vorgänger und Nachfolger
for (const n of [12, 77, 43, 54, 69]) {
  const v = vorgaenger(n) as number
  const f = nachfolger(n) as number
  add('C3', S21_8, () => mk('C3', S21_8, {
    prompt: `Wie heißen Vorgänger und Nachfolger von ${n}?`,
    input: { kind: 'pair', labels: ['Vorgänger', 'Nachfolger'], answer: [v, f] },
    hint: 'Der Vorgänger ist die Zahl direkt davor, der Nachfolger die Zahl direkt danach.',
    solution: `${v} < ${n} < ${f}`,
  }))
}

// S. 21 Aufg. 9: Nachbarzehner
for (const n of [52, 35, 46, 14, 21, 63, 75]) {
  const r = nachbarzehner(n) as [number, number]
  add('C4', S21_9, () => mk('C4', S21_9, {
    prompt: `Wie heißen die Nachbarzehner von ${n}?`,
    input: { kind: 'pair', labels: ['Zehner davor', 'Zehner danach'], answer: r },
    hint: 'Zwischen welchen zwei Zehnern liegt die Zahl?',
    solution: `${r[0]} < ${n} < ${r[1]}`,
  }))
}

export const BOOK_TASKS: readonly BookTask[] = bank

export function bookTypes(): Set<TaskType> {
  return new Set(bank.map((b) => b.type))
}

/** Zufällige Buchaufgabe dieses Typs. `used` enthält bereits gestellte Aufgaben (Schlüssel), die gemieden werden. */
export function bookTaskFor(type: TaskType, rng: Rng, used: Set<string>): Task | null {
  const kandidaten = bank.filter((b) => b.type === type)
  if (kandidaten.length === 0) return null
  const gemischt = shuffle(rng, kandidaten)
  for (const k of gemischt) {
    const t = k.build()
    if (!used.has(taskKey(t))) return t
  }
  return pick(rng, kandidaten).build()
}

export function taskKey(t: Task): string {
  return JSON.stringify([t.prompt, t.visual, t.input])
}
