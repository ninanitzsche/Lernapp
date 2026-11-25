import { test } from 'node:test'
import assert from 'node:assert/strict'
import { finishRound, initialState, parseState, serializeState } from './game.ts'
import type { GameState, RoundAnswer } from './game.ts'
import { kontostand } from './shop.ts'
import { typenDesFeldes } from './kompetenz.ts'

const tag = (n: number) => new Date(2026, 10, 1 + n, 10, 0, 0)

/** Eine Runde, in der alle Aufgaben eines Lernfeldes auf mittlerer Stufe im ersten Versuch stimmen. */
function feldRunde(topic: 'A' | 'B' | 'C', extra: Partial<RoundAnswer> = {}): RoundAnswer[] {
  return Array.from({ length: 10 }, (_, i) => ({ type: typenDesFeldes(topic)[i % typenDesFeldes(topic).length], outcome: 'first' as const, stufe: 2 as const, ...(i === 0 ? extra : {}) }))
}

function spiele(topic: 'A' | 'B' | 'C', runden: number, start: GameState = initialState('S')): GameState {
  let s = start
  for (let i = 0; i < runden; i++) s = finishRound(s, feldRunde(topic), tag(i)).state
  return s
}

test('Ein Lernfeld braucht mehrere Runden: nach einer perfekten Runde noch kein Stern', () => {
  assert.equal(spiele('A', 1).sterneErreicht.A, 0)
  assert.equal(spiele('A', 2).sterneErreicht.A, 1)
})

test('Die fünf Sterne kommen der Reihe nach, der Abschluss erst nach dem fünften', () => {
  let s = initialState('S')
  const gesehen: number[] = []
  for (let i = 0; i < 12; i++) {
    s = finishRound(s, feldRunde('A'), tag(i)).state
    gesehen.push(s.sterneErreicht.A)
  }
  for (let i = 1; i < gesehen.length; i++) assert.ok(gesehen[i] >= gesehen[i - 1] && gesehen[i] - gesehen[i - 1] <= 5)
  assert.equal(s.sterneErreicht.A, 5)
  assert.equal(s.sterneErreicht.B, 0, 'andere Lernfelder bleiben unberührt')
  assert.deepEqual(s.meilensteine.filter((m) => m.art === 'stern').map((m) => m.id), ['stern-A-1', 'stern-A-2', 'stern-A-3', 'stern-A-4', 'stern-A-5'])
})

test('Der Abschluss eines Lernfeldes ist ein einmaliger Meilenstein, ohne zusätzliche Münze', () => {
  let s = initialState('S')
  let abschluss = 0
  let letzte = null as null | ReturnType<typeof finishRound>
  for (let i = 0; i < 14; i++) {
    letzte = finishRound(s, feldRunde('C'), tag(i))
    abschluss += letzte.meilensteine.filter((m) => m.art === 'lernfeld').length
    s = letzte.state
  }
  assert.equal(abschluss, 1)
  const m = s.meilensteine.find((x) => x.id === 'lernfeld-C')
  assert.ok(m)
  assert.equal(m.muenzen, 0)
  // Weiterspielen bringt weder neue Sterne noch eine zweite Auszeichnung
  const danach = finishRound(s, feldRunde('C'), tag(30))
  assert.equal(danach.neueSterne, 0)
  assert.ok(!danach.meilensteine.some((x) => x.art === 'lernfeld'))
})

test('Reihenfolge der Feier: der Lernfeld-Abschluss kommt nach den Sternen und vor Relikt-Hinweisen', () => {
  let s = initialState('S')
  let mit: string[] = []
  for (let i = 0; i < 14 && !mit.includes('lernfeld'); i++) {
    const r = finishRound(s, feldRunde('B'), tag(i))
    s = r.state
    if (r.meilensteine.some((m) => m.art === 'lernfeld')) mit = r.meilensteine.map((m) => m.art)
  }
  assert.ok(mit.includes('lernfeld'))
  assert.ok(mit.indexOf('stern') < mit.indexOf('lernfeld'))
})

test('Tipp, zweiter Versuch und gezeigte Lösung zählen nicht als Nachweis', () => {
  let s = initialState('S')
  const schwach = (): RoundAnswer[] => Array.from({ length: 10 }, (_, i) => ({ type: typenDesFeldes('A')[i % 3], outcome: i % 2 === 0 ? ('second' as const) : ('failed' as const), stufe: 2 as const }))
  for (let i = 0; i < 10; i++) s = finishRound(s, schwach(), tag(i)).state
  assert.equal(s.sterneErreicht.A, 0)
  assert.equal(s.nachweise.A.length, 0)
})

test('Altstand: gespeicherte Sterne bleiben, weitere brauchen neue Nachweise', () => {
  const basis = { ...initialState('Alt'), sterneErreicht: { A: 3, B: 0, C: 0 } }
  const geladen = parseState(serializeState(basis))
  assert.ok(geladen)
  assert.equal(geladen.sterneErreicht.A, 3)
  assert.deepEqual(geladen.nachweise, { A: [], B: [], C: [] })
  const r = finishRound(geladen, feldRunde('A'), tag(0))
  assert.equal(r.state.sterneErreicht.A, 3, 'eine einzelne Runde bringt keinen vierten Stern')
  assert.equal(r.neueSterne, 0)
})

test('Nachweise und Relikt-Erfolge überstehen Export und Import', () => {
  const s = spiele('B', 3)
  const geladen = parseState(serializeState({ ...s, reliktErfolge: ['B1'] }))
  assert.ok(geladen)
  assert.deepEqual(geladen.nachweise, s.nachweise)
  assert.deepEqual(geladen.reliktErfolge, ['B1'])
})

test('Denkimpuls: Aufgabe zählt zum Nachweis, die Runde bringt eine Münze weniger, der Kontostand sinkt nie', () => {
  const ohne = finishRound(initialState('S'), feldRunde('A'), tag(0))
  const mit = finishRound(initialState('S'), feldRunde('A', { denkimpuls: true }), tag(0))
  assert.equal(mit.state.nachweise.A.length, ohne.state.nachweise.A.length, 'zählt weiter zum Nachweis')
  assert.equal(ohne.neueBonusMuenzen, 1) // Tagesmitbringsel
  assert.equal(mit.neueBonusMuenzen, 0)
  assert.equal(mit.denkimpulsAbzug, 1)
  assert.ok(kontostand(mit.state) >= 0)
  // mehr Impulse als Münzen: höchstens bis null
  const viele = finishRound(initialState('S'), feldRunde('A').map((a) => ({ ...a, denkimpuls: true })), tag(0))
  assert.equal(viele.neueBonusMuenzen, 0)
  assert.equal(viele.denkimpulsAbzug, 1)
  assert.ok(kontostand(viele.state) >= 0)
})

test('Denkimpuls kostet keine Sterne: ein verdienter Stern bringt seine Münze trotzdem', () => {
  const vorher = spiele('A', 1)
  const r = finishRound(vorher, feldRunde('A', { denkimpuls: true }), tag(5))
  assert.equal(r.neueSterne, 1)
  assert.ok(kontostand(r.state) >= kontostand(vorher) + 1)
})
