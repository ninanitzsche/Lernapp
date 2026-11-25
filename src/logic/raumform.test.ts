import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRng } from './rng.ts'
import { TASK_TYPES, TOPIC_OF, TOPICS, MIX_TOPICS, checkAnswer, correctResponse, generateTask } from './tasks.ts'
import type { Stufe, TaskType } from './tasks.ts'
import { baueAufgaben } from './rundenbau.ts'
import { finishRound, initialState, parseState, serializeState, topicStars } from './game.ts'
import type { RoundAnswer } from './game.ts'
import { nachtragen } from './meilensteine.ts'
import { parseRunde, serializeRunde } from './runde.ts'
import { typenDesFeldes } from './kompetenz.ts'
import { FIGUR_VARIANTEN } from './raumform.ts'

const D_TYPEN = TASK_TYPES.filter((t) => TOPIC_OF[t] === 'D')
const STUFEN: Stufe[] = [1, 2, 3]
const tag = (n: number) => new Date(2026, 10, 1 + n, 10, 0, 0)
const skill0 = initialState('S').skill

test('Raum und Form ist registriert, aber nicht im Mix', () => {
  assert.deepEqual(TOPICS, ['A', 'B', 'C', 'D'])
  assert.deepEqual(MIX_TOPICS, ['A', 'B', 'C'])
  assert.deepEqual(D_TYPEN, ['D1', 'D2', 'D3', 'D4', 'D5'])
})

test('Kein Mix-, Knobel- oder Buchdurchlauf enthält einen D-Typ', () => {
  for (let seed = 1; seed <= 300; seed++) {
    for (const [knobel, quelle] of [[false, 'mix'], [true, 'mix'], [false, 'buch']] as const) {
      const aufgaben = baueAufgaben({ skill: skill0, abgeschlosseneRunden: 20, quelle, knobel, seed })
      for (const t of aufgaben) assert.notEqual(t.topic, 'D', `Seed ${seed}: D im Mix`)
    }
  }
})

test('Eine Themenrunde D ist möglich und enthält nur D-Aufgaben', () => {
  const gesehen = new Set<TaskType>()
  for (let seed = 1; seed <= 100; seed++) {
    const aufgaben = baueAufgaben({ skill: skill0, abgeschlosseneRunden: 5, quelle: 'mix', knobel: false, seed, topic: 'D' })
    assert.equal(aufgaben.length, 10)
    for (const t of aufgaben) { assert.equal(t.topic, 'D'); gesehen.add(t.type) }
  }
  assert.deepEqual([...gesehen].sort(), D_TYPEN)
})

test('D-Aufgaben: richtige Antwort wird akzeptiert, Auswahl und Figuren sind gültig', () => {
  for (const typ of D_TYPEN) {
    for (const stufe of STUFEN) {
      for (let seed = 1; seed <= 300; seed++) {
        const t = generateTask(typ, createRng(seed), stufe)
        const ort = `${typ} Stufe ${stufe} Seed ${seed}`
        assert.equal(t.topic, 'D')
        assert.ok(checkAnswer(t, correctResponse(t)), ort)
        assert.ok(t.hint.length > 0 && t.solution.length > 0 && t.prompt.length > 0, ort)
        const i = t.input
        if (i.kind === 'choice') {
          assert.equal(new Set(i.options).size, i.options.length, `${ort}: doppelte Auswahl`)
          assert.ok(i.options.length >= 2 && i.answer >= 0 && i.answer < i.options.length, ort)
        }
        if (i.kind === 'figuren') {
          assert.ok(i.answer >= 0 && i.answer < i.karten.length, ort)
          assert.equal(new Set(i.karten.map((k) => k.figur)).size, i.karten.length, `${ort}: gleiche Figur doppelt`)
          for (const k of i.karten) assert.ok((k.variante ?? 0) < FIGUR_VARIANTEN[k.figur], ort)
        }
        if (i.kind === 'number') assert.ok(i.answer >= 1 && i.answer <= 12, ort)
        for (const f of t.visual?.kind === 'figuren' ? t.visual.items : []) assert.ok((f.variante ?? 0) < FIGUR_VARIANTEN[f.figur], ort)
      }
    }
  }
})

test('U2: Quadrat, Rechteck und Viereck stehen nie gemeinsam in einer Auswahl', () => {
  const vierecke = ['quadrat', 'rechteck', 'viereck']
  for (const stufe of STUFEN) {
    for (let seed = 1; seed <= 300; seed++) {
      const t = generateTask('D1', createRng(seed), stufe)
      assert.equal(t.input.kind, 'figuren')
      if (t.input.kind === 'figuren') assert.equal(t.input.karten.filter((k) => vierecke.includes(k.figur)).length, 1)
    }
  }
})

test('U7: Der Kreis kommt in keiner Zählaufgabe vor', () => {
  for (const typ of ['D2', 'D4'] as const) {
    for (let seed = 1; seed <= 200; seed++) {
      const t = generateTask(typ, createRng(seed), 3)
      const items = t.visual?.kind === 'figuren' ? t.visual.items : []
      assert.ok(items.every((f) => f.figur !== 'kreis' && f.figur !== 'kugel'))
    }
  }
})

test('D5: Lage stimmt mit dem Bild überein (links, rechts, zwischen aus Sicht des Kindes)', () => {
  const NAMEN: Record<string, string> = { Kreis: 'kreis', Dreieck: 'dreieck', Quadrat: 'quadrat', Kugel: 'kugel', Würfel: 'wuerfel', Quader: 'quader' }
  for (const stufe of STUFEN) {
    for (let seed = 1; seed <= 300; seed++) {
      const t = generateTask('D5', createRng(seed), stufe)
      const reihe = t.visual?.kind === 'figuren' ? t.visual.items.map((f) => f.figur) : []
      assert.equal(reihe.length, stufe + 2)
      assert.equal(new Set(reihe).size, reihe.length)
      const worte = [...t.prompt.matchAll(/dem ([A-ZÄÖÜa-zäöüß]+)|vom ([A-ZÄÖÜa-zäöüß]+)/g)].map((m) => NAMEN[m[1] ?? m[2]])
      assert.ok(worte.every((w) => reihe.includes(w as never)), t.prompt)
      const i = t.input
      assert.equal(i.kind, 'choice')
      if (i.kind !== 'choice') continue
      const antwort = NAMEN[i.options[i.answer]]
      const pos = (f: string) => reihe.indexOf(f as never)
      if (t.prompt.includes('zwischen')) assert.equal(pos(antwort), (pos(worte[0]) + pos(worte[1])) / 2, t.prompt)
      else if (t.prompt.includes('links')) assert.equal(pos(antwort), pos(worte[0]) - 1, t.prompt)
      else assert.equal(pos(antwort), pos(worte[0]) + 1, t.prompt)
      for (const o of i.options) assert.ok(!worte.includes(NAMEN[o]), `Auswahl nennt ein Wort aus der Frage: ${t.prompt}`)
    }
  }
})

test('Pausierte Runde mit Thema D wird gespeichert und wieder geladen', () => {
  const aufgaben = baueAufgaben({ skill: skill0, abgeschlosseneRunden: 5, quelle: 'mix', knobel: false, seed: 5, topic: 'D' })
  const s = { version: 1 as const, name: 'Nele', topic: 'D' as const, quelle: 'mix' as const, schwer: false, seed: 5, aufgaben, index: 0, antworten: [] as RoundAnswer[], wiederholungenGeplant: false }
  assert.equal(parseRunde(serializeRunde(s), 'Nele')?.topic, 'D')
})

test('Altstand ohne D lädt mit 0 Sternen für D und ohne Nachfeier', () => {
  const alt = { ...initialState('Alt'), sterneErreicht: { A: 5, B: 2, C: 1 } as Record<string, number> }
  const geladen = parseState(JSON.stringify(alt))
  assert.ok(geladen)
  assert.equal(geladen.sterneErreicht.D, 0)
  assert.deepEqual(geladen.nachweise.D, [])
  const nachtrag = nachtragen(geladen, '2026-11-25')
  assert.ok(nachtrag.every((m) => !m.id.includes('-D')), 'kein Meilenstein für D bei Altständen')
})

test('Sterne und Pokal für D entstehen über das vorhandene System, ohne Doppelauslösung', () => {
  const runde = (): RoundAnswer[] => Array.from({ length: 10 }, (_, i) => ({ type: typenDesFeldes('D')[i % 5], outcome: 'first' as const, stufe: 2 as const }))
  let s = initialState('S')
  for (let i = 0; i < 12; i++) s = finishRound(s, runde(), tag(i)).state
  assert.ok(s.sterneErreicht.D >= 1)
  const ids = s.meilensteine.map((m) => m.id)
  assert.equal(new Set(ids).size, ids.length, 'keine doppelten Meilensteine')
  assert.ok(ids.includes('stern-D-1'))
  assert.deepEqual([s.sterneErreicht.A, s.sterneErreicht.B, s.sterneErreicht.C], [0, 0, 0])
  const neu = parseState(serializeState(s))
  assert.deepEqual(neu?.meilensteine, s.meilensteine)
})

test('topicStars: D ohne Fortschritt hat 0 Sterne, mit allen Typen auf Stufe 3 drei', () => {
  assert.equal(topicStars(skill0, 'D'), 0)
  assert.equal(topicStars({ ...skill0, D1: 3, D2: 3, D3: 3, D4: 3, D5: 3 }, 'D'), 3)
})
