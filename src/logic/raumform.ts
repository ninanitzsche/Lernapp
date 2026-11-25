// Lernfeld D "Raum und Form": Aufgabengeneratoren. Reine Logik ohne React.
// Grundlage ist der Rahmenlehrplan Stufe B (Arbeitsannahmen U2, U3, U6, U7 in docs/MATHE_KLASSE2_THEMEN_UND_GEOMETRIE_IDEEN.md).
// Noch nicht mit Buch und Arbeitsheften abgeglichen (U9): Die Typen sind ein erster Wurf.
import { int, pick, shuffle } from './rng.ts'
import type { Rng } from './rng.ts'
import type { FigurId, FigurRef, Stufe, Task } from './tasks.ts'

export const FIGUR_NAMEN: Record<FigurId, string> = {
  dreieck: 'Dreieck', quadrat: 'Quadrat', rechteck: 'Rechteck', viereck: 'Viereck', kreis: 'Kreis',
  kugel: 'Kugel', wuerfel: 'Würfel', quader: 'Quader',
}

/** Wie viele Lagen oder Proportionen es je Figur gibt (Variante 0 bis n-1). Quadrat und Kreis gibt es nur in einer Form. */
export const FIGUR_VARIANTEN: Record<FigurId, number> = {
  dreieck: 3, quadrat: 1, rechteck: 3, viereck: 2, kreis: 1, kugel: 1, wuerfel: 1, quader: 2,
}

const ECKEN: Partial<Record<FigurId, number>> = { dreieck: 3, quadrat: 4, rechteck: 4, viereck: 4 }

function make(type: Task['type'], rest: Omit<Task, 'type' | 'topic' | 'stufe'>): Task {
  return { type, topic: 'D', stufe: 2, ...rest }
}

/** Leicht zeigt immer die Standardform, mittel und knifflig auch gedrehte oder gestreckte Formen. */
function ref(rng: Rng, figur: FigurId, stufe: Stufe): FigurRef {
  const n = FIGUR_VARIANTEN[figur]
  return { figur, variante: stufe === 1 || n === 1 ? 0 : int(rng, 0, n - 1) }
}

/** Quadrat, Rechteck und Viereck stehen nie gemeinsam in einer Auswahl (U2): Es gibt genau eine Vierecks-Karte. */
function viereckName(rng: Rng, stufe: Stufe): FigurId {
  return pick(rng, stufe === 3 ? ['quadrat', 'rechteck', 'viereck'] : ['quadrat', 'rechteck'] as FigurId[])
}

// D1: Formen erkennen und benennen (RF-6). Drei Karten, eine ist richtig.
export function genD1(rng: Rng, stufe: Stufe = 2): Task {
  const vier = viereckName(rng, stufe)
  const figuren = shuffle(rng, ['dreieck', 'kreis', vier] as FigurId[])
  const ziel = pick(rng, figuren)
  const karten = figuren.map((f) => ({ ...ref(rng, f, stufe), label: FIGUR_NAMEN[f] }))
  return make('D1', {
    prompt: `Welche Figur ist ein ${FIGUR_NAMEN[ziel]}?`,
    input: { kind: 'figuren', karten, answer: figuren.indexOf(ziel) },
    hint: ziel === 'kreis'
      ? 'Ein Kreis ist ganz rund. Er hat keine Ecken.'
      : ziel === 'dreieck'
        ? 'Ein Dreieck hat drei Ecken und drei Seiten.'
        : 'Ein Viereck hat vier Ecken und vier Seiten.',
    solution: `Das ${FIGUR_NAMEN[ziel]} ist die Karte ${figuren.indexOf(ziel) + 1} von links.`,
  })
}

// D2: Ecken und Seiten zählen (RF-7). Der Kreis kommt nicht vor (U7).
export function genD2(rng: Rng, stufe: Stufe = 2): Task {
  const formen: FigurId[] = stufe === 1 ? ['dreieck', 'quadrat'] : ['dreieck', 'quadrat', 'rechteck', 'viereck']
  const frage = pick(rng, ['Ecken', 'Seiten'] as const)
  if (stufe === 3) {
    const zwei = shuffle(rng, formen).slice(0, 2)
    const summe = zwei.reduce((s, f) => s + (ECKEN[f] ?? 0), 0)
    return make('D2', {
      prompt: `Wie viele ${frage} haben die beiden Figuren zusammen?`,
      visual: { kind: 'figuren', items: zwei.map((f) => ref(rng, f, stufe)) },
      input: { kind: 'number', answer: summe },
      hint: 'Zähle erst bei einer Figur, dann bei der anderen. Dann rechne zusammen.',
      solution: `${zwei.map((f) => ECKEN[f]).join(' + ')} = ${summe}`,
    })
  }
  const f = pick(rng, formen)
  const n = ECKEN[f] as number
  return make('D2', {
    prompt: `Wie viele ${frage} hat diese Figur?`,
    visual: { kind: 'figuren', items: [ref(rng, f, stufe)] },
    input: { kind: 'number', answer: n },
    hint: frage === 'Ecken' ? 'Tippe in Gedanken jede Ecke an und zähle mit.' : 'Fahre in Gedanken an jeder Seite entlang und zähle mit.',
    solution: `Ein ${FIGUR_NAMEN[f]} hat ${n} ${frage}.`,
  })
}

const KOERPER: FigurId[] = ['kugel', 'wuerfel', 'quader']

// D3: Körper erkennen (RF-5). Leicht und mittel: Körper zeigen, Namen wählen. Knifflig: Beschreibung lesen, Körper wählen.
export function genD3(rng: Rng, stufe: Stufe = 2): Task {
  if (stufe === 3) {
    const beschreibungen: Record<string, { figur: FigurId; text: string }> = {
      kugel: { figur: 'kugel', text: 'Welcher Körper hat keine Ecken und kann rollen?' },
      wuerfel: { figur: 'wuerfel', text: 'Welcher Körper hat nur gleich große Quadrate als Flächen?' },
      quader: { figur: 'quader', text: 'Welcher Körper sieht aus wie ein Schuhkarton?' },
    }
    const ziel = pick(rng, KOERPER)
    const figuren = shuffle(rng, KOERPER)
    return make('D3', {
      prompt: beschreibungen[ziel].text,
      input: {
        kind: 'figuren',
        karten: figuren.map((f) => ({ ...ref(rng, f, stufe), label: FIGUR_NAMEN[f] })),
        answer: figuren.indexOf(ziel),
      },
      hint: 'Denke an einen Ball, einen Spielwürfel und einen Schuhkarton.',
      solution: `Gesucht ist der ${FIGUR_NAMEN[ziel]}.`,
    })
  }
  const ziel = pick(rng, KOERPER)
  const namen = shuffle(rng, KOERPER).map((f) => FIGUR_NAMEN[f])
  return make('D3', {
    prompt: 'Wie heißt dieser Körper?',
    visual: { kind: 'figuren', items: [ref(rng, ziel, stufe)] },
    input: { kind: 'choice', options: namen, answer: namen.indexOf(FIGUR_NAMEN[ziel]) },
    hint: 'Ein Ball ist eine Kugel. Ein Spielwürfel ist ein Würfel. Ein Schuhkarton ist ein Quader.',
    solution: `Das ist ein ${FIGUR_NAMEN[ziel]}.`,
  })
}

// D4: Flächen, Ecken und Kanten von Würfel und Quader zählen (RF-11, U7). Leicht Flächen, mittel Flächen oder Ecken, knifflig Ecken oder Kanten.
const MERKMALE = {
  flaechen: { wort: 'Flächen', n: 6, hint: 'Zähle oben, unten, vorne, hinten, links und rechts.' },
  ecken: { wort: 'Ecken', n: 8, hint: 'Vier Ecken sind oben, vier sind unten.' },
  kanten: { wort: 'Kanten', n: 12, hint: 'Vier Kanten sind oben, vier unten und vier stehen senkrecht dazwischen.' },
} as const

export function genD4(rng: Rng, stufe: Stufe = 2): Task {
  const ziel = pick(rng, ['wuerfel', 'quader'] as FigurId[])
  const merkmal = MERKMALE[stufe === 1 ? 'flaechen' : stufe === 2 ? pick(rng, ['flaechen', 'ecken'] as const) : pick(rng, ['ecken', 'kanten'] as const)]
  const koerper = ziel === 'wuerfel' ? 'Würfel' : 'Quader'
  return make('D4', {
    prompt: `Wie viele ${merkmal.wort} hat ein ${koerper}?`,
    visual: { kind: 'figuren', items: [ref(rng, ziel, stufe)] },
    input: { kind: 'number', answer: merkmal.n },
    hint: merkmal.hint,
    solution: `Ein ${koerper} hat ${merkmal.n} ${merkmal.wort}.`,
  })
}

// D5: Lage beschreiben (RF-10). Links und rechts gelten aus Sicht des Kindes vor dem Bildschirm (U6).
const LAGE_FIGUREN: FigurId[] = ['kreis', 'dreieck', 'quadrat', 'kugel', 'wuerfel', 'quader']

export function genD5(rng: Rng, stufe: Stufe = 2): Task {
  const anzahl = stufe === 1 ? 3 : stufe === 2 ? 4 : 5
  const reihe = shuffle(rng, LAGE_FIGUREN).slice(0, anzahl)
  const nicht = LAGE_FIGUREN.filter((f) => !reihe.includes(f))
  let frage: string
  let antwort: FigurId
  let genannt: FigurId[]
  const art = stufe === 3 ? 'zwischen' : pick(rng, ['links', 'rechts', 'zwischen'] as const)
  if (art === 'zwischen') {
    // Genau eine Figur dazwischen: Position i-1 und i+1 werden genannt.
    const i = int(rng, 1, anzahl - 2)
    antwort = reihe[i]
    genannt = [reihe[i - 1], reihe[i + 1]]
    frage = `Was liegt zwischen dem ${FIGUR_NAMEN[genannt[0]]} und dem ${FIGUR_NAMEN[genannt[1]]}?`
  } else if (art === 'links') {
    const i = int(rng, 1, anzahl - 1)
    antwort = reihe[i - 1]
    genannt = [reihe[i]]
    frage = `Was liegt links vom ${FIGUR_NAMEN[genannt[0]]}?`
  } else {
    const i = int(rng, 0, anzahl - 2)
    antwort = reihe[i + 1]
    genannt = [reihe[i]]
    frage = `Was liegt rechts vom ${FIGUR_NAMEN[genannt[0]]}?`
  }
  // Die Auswahl enthält nur Figuren, die nicht in der Frage vorkommen, und eine, die gar nicht im Bild ist.
  const kandidaten = reihe.filter((f) => !genannt.includes(f))
  const auswahl: FigurId[] = [...kandidaten]
  const fremde = shuffle(rng, nicht)
  // Mindestens drei Möglichkeiten, außer in der kniffligen Stufe (dort sind es schon drei).
  while (stufe !== 3 && (auswahl.length < 3 || auswahl.length === kandidaten.length) && fremde.length > 0) auswahl.push(fremde.pop() as FigurId)
  const options = shuffle(rng, auswahl).map((f) => FIGUR_NAMEN[f])
  return make('D5', {
    prompt: frage,
    visual: { kind: 'figuren', items: reihe.map((f) => ({ figur: f })) },
    input: { kind: 'choice', options, answer: options.indexOf(FIGUR_NAMEN[antwort]) },
    hint: 'Links ist die Seite, auf der dein linker Arm ist, wenn du auf den Bildschirm schaust.',
    solution: `Das ist der ${FIGUR_NAMEN[antwort]}.`,
  })
}
