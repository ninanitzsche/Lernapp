import { test } from 'node:test'
import assert from 'node:assert/strict'
import { baueAufgaben } from './rundenbau.ts'
import { initialState } from './game.ts'
import { CONFIG } from './config.ts'
import { TASK_TYPES } from './tasks.ts'

const skill = (n: number) => Object.fromEntries(TASK_TYPES.map((t) => [t, n])) as ReturnType<typeof initialState>['skill']

test('Neue Kinder: in den ersten Runden nur leichte Aufgaben, keine Buchaufgaben im Mix', () => {
  for (let runden = 0; runden < CONFIG.leichtRunden; runden++) {
    for (let seed = 1; seed <= 50; seed++) {
      const a = baueAufgaben({ skill: skill(0), abgeschlosseneRunden: runden, quelle: 'mix', knobel: false, seed })
      assert.equal(a.length, 10)
      assert.ok(a.every((t) => t.stufe === 1 && !t.source), `Runde ${runden} Seed ${seed}`)
    }
  }
})

test('Danach steigt die Runde: vorn leicht, hinten mittel, nie knifflig', () => {
  for (let seed = 1; seed <= 50; seed++) {
    const a = baueAufgaben({ skill: skill(1), abgeschlosseneRunden: 5, quelle: 'mix', knobel: false, seed })
    assert.ok(a.slice(0, 4).every((t) => t.stufe === 1), `Seed ${seed}`)
    assert.ok(a.slice(4).every((t) => t.stufe === 2), `Seed ${seed}`)
    for (let i = 1; i < a.length; i++) assert.ok(a[i].stufe >= a[i - 1].stufe)
  }
})

test('Nicht freigeschaltete Typen bleiben leicht, auch an mittleren Positionen', () => {
  const a = baueAufgaben({ skill: skill(0), abgeschlosseneRunden: 9, quelle: 'mix', knobel: false, seed: 3 })
  assert.ok(a.every((t) => t.stufe === 1))
})

test('Buchaufgaben stehen im Mix nur an mittleren Positionen', () => {
  for (let seed = 1; seed <= 100; seed++) {
    const a = baueAufgaben({ skill: skill(2), abgeschlosseneRunden: 8, quelle: 'mix', knobel: false, seed })
    a.forEach((t, i) => { if (t.source) assert.ok(i >= 4 && t.stufe === 2, `Seed ${seed} Position ${i}`) })
  }
})

test('Knobelrunde: zwei mittlere zum Aufwärmen, dann knifflig, keine Buchaufgaben', () => {
  const a = baueAufgaben({ skill: skill(0), abgeschlosseneRunden: 0, quelle: 'mix', knobel: true, seed: 11 })
  assert.deepEqual(a.map((t) => t.stufe), [2, 2, 3, 3, 3, 3, 3, 3, 3, 3])
  assert.ok(a.every((t) => !t.source))
})

test('Buch-Modus stellt Buchaufgaben (mittel) an allen Positionen, soweit der Typ eine Buchaufgabe hat', () => {
  const a = baueAufgaben({ skill: skill(0), abgeschlosseneRunden: 0, quelle: 'buch', knobel: false, seed: 5 })
  assert.ok(a.filter((t) => t.source).length >= 7)
})

test('Gleiche Eingabe ergibt dieselbe Runde (Pause und Weitermachen)', () => {
  const p = { skill: skill(1), abgeschlosseneRunden: 4, quelle: 'mix' as const, knobel: false, seed: 77 }
  assert.deepEqual(baueAufgaben(p), baueAufgaben(p))
})
