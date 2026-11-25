import { test } from 'node:test'
import assert from 'node:assert/strict'
import { initialState } from './game.ts'
import type { GameState } from './game.ts'
import { baueReliktAufgaben, freigeschalteteRelikte, pokaleVon, reliktAbschliessen, reliktBereichSichtbar } from './relikte.ts'
import { CONFIG } from './config.ts'
import { kontostand } from './shop.ts'

function mitPokal(topic: 'A' | 'B' | 'C'): GameState {
  const s = initialState('S')
  return {
    ...s, sterneErreicht: { ...s.sterneErreicht, [topic]: 5 },
    meilensteine: [{ id: `lernfeld-${topic}`, art: 'lernfeld', datum: '2026-11-20', rueckblick: { runden: 5, tage: 3, aufgaben: 40, quote: 0.7, staerkstesThema: topic }, muenzen: 0 }],
  }
}

test('Ohne abgeschlossenes Lernfeld ist der Reliktbereich unsichtbar und leer', () => {
  const s = initialState('S')
  assert.equal(reliktBereichSichtbar(s), false)
  assert.deepEqual(freigeschalteteRelikte(s), [])
  assert.deepEqual(pokaleVon(s), [])
})

test('Der Pokal eines Lernfeldes öffnet genau die Relikte dieses Lernfeldes', () => {
  const s = mitPokal('B')
  assert.equal(reliktBereichSichtbar(s), true)
  assert.deepEqual(freigeschalteteRelikte(s).map((r) => r.id), ['B1', 'B2', 'B3'])
  assert.ok(freigeschalteteRelikte(s).every((r) => r.topic === 'B'))
  assert.deepEqual(freigeschalteteRelikte(mitPokal('C')).map((r) => r.id), ['C1', 'C2', 'C3', 'C4'])
})

test('Reliktaufgaben: fünf kniffelige Aufgaben des gewählten Typs', () => {
  const aufgaben = baueReliktAufgaben('C1', 11)
  assert.equal(aufgaben.length, CONFIG.reliktAufgaben)
  assert.ok(aufgaben.every((t) => t.type === 'C1' && t.stufe === 3))
  assert.deepEqual(baueReliktAufgaben('C1', 11).map((t) => t.prompt), aufgaben.map((t) => t.prompt), 'gleicher Seed, gleiche Aufgaben')
})

test('Erfolg bringt einmalig Münzen und einen Meilenstein, Wiederholen bringt nichts mehr', () => {
  const s = mitPokal('A')
  const vorher = kontostand(s)
  const r = reliktAbschliessen(s, 'A1', CONFIG.reliktMinTreffer, '2026-11-25')
  assert.equal(r.geschafft, true)
  assert.equal(r.erstmals, true)
  assert.equal(r.muenzen, CONFIG.reliktMuenzen)
  assert.equal(kontostand(r.state) - vorher, CONFIG.reliktMuenzen)
  assert.equal(r.meilenstein?.id, 'relikt-A1')
  const nochmal = reliktAbschliessen(r.state, 'A1', CONFIG.reliktAufgaben, '2026-11-26')
  assert.equal(nochmal.geschafft, true)
  assert.equal(nochmal.erstmals, false)
  assert.equal(nochmal.muenzen, 0)
  assert.equal(nochmal.state, r.state)
})

test('Zu wenige Treffer bringen nichts, aber das Relikt bleibt jederzeit wieder spielbar', () => {
  const s = mitPokal('A')
  const r = reliktAbschliessen(s, 'A2', CONFIG.reliktMinTreffer - 1, '2026-11-25')
  assert.equal(r.geschafft, false)
  assert.equal(r.muenzen, 0)
  assert.equal(r.state, s)
})

test('Relikte vergeben keine Sterne, Pokale, Futter und ändern den Lernstand nicht', () => {
  const s = mitPokal('A')
  const r = reliktAbschliessen(s, 'A3', CONFIG.reliktAufgaben, '2026-11-25').state
  assert.deepEqual(r.sterneErreicht, s.sterneErreicht)
  assert.deepEqual(r.skill, s.skill)
  assert.deepEqual(r.verlauf, s.verlauf)
  assert.deepEqual(r.statistik, s.statistik)
  assert.deepEqual(r.nachweise, s.nachweise)
  assert.equal(r.totalFood, s.totalFood)
  assert.deepEqual(r.meilensteine.filter((m) => m.art !== 'relikt'), s.meilensteine)
})

test('Ein gesperrtes Relikt (Lernfeld nicht abgeschlossen) bringt nie Münzen', () => {
  const s = mitPokal('A')
  const r = reliktAbschliessen(s, 'C1', CONFIG.reliktAufgaben, '2026-11-25')
  assert.equal(r.geschafft, false)
  assert.equal(r.state, s)
})
