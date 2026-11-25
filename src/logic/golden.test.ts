// Golden-Test fuer den verhaltensneutralen Umbau (Schritt 1): Die Fixture wurde VOR dem Umbau aus dem alten Code erzeugt.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { baueAufgaben } from './rundenbau.ts'
import type { Bauplan } from './rundenbau.ts'
import { initialState, parseState, serializeState } from './game.ts'
import { TASK_TYPES } from './tasks.ts'
import type { TaskType, Topic } from './tasks.ts'

export function goldenFaelle() {
  const skillLeer = {} as Record<TaskType, number>
  const skillGemischt = {} as Record<TaskType, number>
  TASK_TYPES.forEach((t, i) => { skillLeer[t] = 0; skillGemischt[t] = i % 4 })
  const faelle: Record<string, Bauplan> = {}
  for (const seed of [1, 7, 42, 123, 2026, 99999]) {
    for (const [sn, skill] of [['leer', skillLeer], ['gemischt', skillGemischt]] as const) {
      faelle[`mix-${sn}-${seed}`] = { skill, abgeschlosseneRunden: 5, quelle: 'mix', knobel: false, seed }
      faelle[`knobel-${sn}-${seed}`] = { skill, abgeschlosseneRunden: 30, quelle: 'mix', knobel: true, seed }
      faelle[`buch-${sn}-${seed}`] = { skill, abgeschlosseneRunden: 5, quelle: 'buch', knobel: false, seed }
      for (const topic of ['A', 'B', 'C'] as Topic[]) {
        faelle[`thema${topic}-${sn}-${seed}`] = { skill, abgeschlosseneRunden: 5, quelle: 'mix', knobel: false, seed, topic }
      }
    }
  }
  return faelle
}

export function goldenErgebnis() {
  const out: Record<string, unknown> = {}
  for (const [k, p] of Object.entries(goldenFaelle())) out[k] = baueAufgaben(p)
  return out
}

const fixture = new URL('./golden.fixture.json', import.meta.url)

test('Golden: Aufgabenlisten normaler, Knobel-, Buch- und Themenrunden bleiben identisch', () => {
  const erwartet = JSON.parse(readFileSync(fixture, 'utf8'))
  assert.deepEqual(JSON.parse(JSON.stringify(goldenErgebnis())), erwartet)
})

test('Golden: Alt-Spielstand ohne Sterne und Nachweise laedt, Werte bleiben gleich', () => {
  const alt = { version: 1, name: 'Nico', totalFood: 120, lastFedAt: null, rounds: { '2026-11-01': 2 }, skill: { A1: 2, A2: 3, A3: 1, B1: 3, B2: 3, B3: 2, C1: 1, C2: 0, C3: 0, C4: 0 }, testDate: null }
  const s = parseState(JSON.stringify(alt))
  assert.ok(s)
  assert.equal(s.totalFood, 120)
  assert.equal(s.skill.A2, 3)
  assert.deepEqual(s.sterneErreicht, { A: 1, B: 2, C: 0, D: 0 })
  assert.deepEqual(s.nachweise, { A: [], B: [], C: [], D: [] })
  const nochmal = parseState(serializeState(s))
  assert.deepEqual(nochmal, s)
  assert.deepEqual(Object.keys(initialState('x').sterneErreicht), ['A', 'B', 'C', 'D'])
})
