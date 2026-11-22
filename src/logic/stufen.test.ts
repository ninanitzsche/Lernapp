import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hoechsteStufe, lernstandNach, rampeFuer, stufeFuerAufgabe } from './stufen.ts'
import { CONFIG } from './config.ts'
import { futterFuer, halbzeitErreicht, serieErkannt } from './belohnung.ts'
import { TASK_TYPES, generateTask } from './tasks.ts'
import type { Stufe } from './tasks.ts'
import { createRng } from './rng.ts'
import { STAGES } from './config.ts'

test('Pläne haben genau so viele Stufen wie Aufgaben und steigen nie', () => {
  for (const plan of [CONFIG.rampeNormal, CONFIG.rampeKnobel]) {
    assert.equal(plan.length, CONFIG.roundLength)
    for (let i = 1; i < plan.length; i++) assert.ok(plan[i] >= plan[i - 1], `Plan fällt bei ${i}`)
  }
  assert.equal(CONFIG.rampeNormal[0], 1)
})

test('Wachstumsschwellen steigen streng', () => {
  for (let i = 1; i < STAGES.length; i++) assert.ok(STAGES[i].foodFrom > STAGES[i - 1].foodFrom)
  assert.equal(STAGES[1].foodFrom, 30)
})

test('Neue Kinder bekommen in den ersten Runden nur leichte Aufgaben', () => {
  for (let runden = 0; runden < CONFIG.leichtRunden; runden++) {
    for (let pos = 0; pos < CONFIG.roundLength; pos++) {
      assert.equal(stufeFuerAufgabe(false, pos, 3, runden), 1, `Runde ${runden} Position ${pos}`)
    }
  }
})

test('Danach steigt die normale Runde von leicht auf mittel, aber nur bei freigeschalteten Typen', () => {
  const r = CONFIG.leichtRunden
  assert.equal(stufeFuerAufgabe(false, 0, 1, r), 1)
  assert.equal(stufeFuerAufgabe(false, 3, 1, r), 1)
  assert.equal(stufeFuerAufgabe(false, 4, 1, r), 2)
  assert.equal(stufeFuerAufgabe(false, 9, 1, r), 2)
  assert.equal(stufeFuerAufgabe(false, 9, 0, r), 1, 'Lernstand 0: noch nicht freigeschaltet')
})

test('Die normale Runde stellt nie Stufe 3, auch bei höchstem Lernstand', () => {
  for (let pos = 0; pos < 10; pos++) assert.ok(stufeFuerAufgabe(false, pos, 3, 50) <= 2)
})

test('Knobelrunde folgt dem Plan: zwei mittlere zum Aufwärmen, dann knifflig', () => {
  assert.deepEqual(Array.from({ length: 10 }, (_, i) => rampeFuer(true, i)), [2, 2, 3, 3, 3, 3, 3, 3, 3, 3])
  assert.equal(stufeFuerAufgabe(true, 5, 0, 0), 3)
})

test('Wiederholungen hinter dem Plan nutzen den letzten Planwert', () => {
  assert.equal(rampeFuer(false, 12), 2)
  assert.equal(hoechsteStufe(1, CONFIG.leichtRunden), 2)
  assert.equal(hoechsteStufe(1, CONFIG.leichtRunden - 1), 1)
})

test('Lernstand: leichte Aufgaben heben höchstens auf 1', () => {
  assert.equal(lernstandNach(0, 'first', 1), 1)
  assert.equal(lernstandNach(1, 'first', 1), 1)
  assert.equal(lernstandNach(2, 'first', 1), 2, 'ein höherer Stand bleibt')
  assert.equal(lernstandNach(1, 'first', 2), 2)
  assert.equal(lernstandNach(3, 'first', 2), 3)
})

test('Lernstand: Fehler senken, außer bei kniffligen Aufgaben', () => {
  assert.equal(lernstandNach(2, 'failed', 2), 1)
  assert.equal(lernstandNach(0, 'failed', 1), 0)
  assert.equal(lernstandNach(2, 'failed', 3), 2)
  assert.equal(lernstandNach(2, 'second', 3), 2)
  assert.equal(lernstandNach(2, 'first', 3), 3)
})

test('Futter nach Stufe: knifflig zahlt deutlich mehr, leicht und mittel wie bisher', () => {
  assert.equal(futterFuer('first', 1), 2)
  assert.equal(futterFuer('first', 2), 2)
  assert.equal(futterFuer('second', 2), 1)
  assert.equal(futterFuer('first', 3), 5)
  assert.equal(futterFuer('second', 3), 3)
  assert.equal(futterFuer('failed', 3), 0)
  assert.ok(futterFuer('first', 3) >= 2 * futterFuer('first', 2))
})

test('Serie: drei im ersten Versuch hintereinander, nur einmal pro Runde', () => {
  const f = (outcome: 'first' | 'second' | 'failed', extra = {}) => ({ outcome, ...extra })
  assert.equal(serieErkannt([f('first'), f('first')]), false)
  assert.equal(serieErkannt([f('first'), f('first'), f('first')]), true)
  assert.equal(serieErkannt([f('first'), f('second'), f('first'), f('first')]), false)
  assert.equal(serieErkannt([f('failed'), f('first'), f('first'), f('first')]), true)
  assert.equal(serieErkannt([f('first', { serieBonus: true }), f('first'), f('first'), f('first')]), false)
  assert.equal(serieErkannt([f('first'), f('first'), f('first', { isRepeat: true })]), false)
})

test('Halbzeit: einmal, bei der fünften Antwort', () => {
  assert.equal(halbzeitErreicht(4, false), false)
  assert.equal(halbzeitErreicht(5, false), true)
  assert.equal(halbzeitErreicht(5, true), false)
  assert.equal(halbzeitErreicht(6, false), false)
})

test('Leichte Aufgaben: gültig, lösbar, kleine Zahlen, Stufe gesetzt', () => {
  for (const typ of TASK_TYPES) {
    for (let seed = 1; seed <= 500; seed++) {
      for (const stufe of [1, 2, 3] as Stufe[]) {
        const t = generateTask(typ, createRng(seed), stufe)
        assert.equal(t.stufe, stufe)
      }
      const t = generateTask(typ, createRng(seed), 1)
      const i = t.input
      const ctx = `${typ} Seed ${seed}: ${t.prompt}`
      if (typ === 'A1') assert.ok(i.kind === 'choice' && Number(i.options[i.answer]) <= 30, ctx)
      if (typ === 'A2' && i.kind === 'number') assert.ok(i.answer <= 59, ctx)
      if (typ === 'A2' && i.kind === 'pair') assert.ok(i.answer[0] <= 5, ctx)
      if (typ === 'A3' && i.kind === 'number') assert.ok(i.answer <= 33 && !t.prompt.includes('Rechne'), ctx)
      if ((typ === 'B1') && i.kind === 'number') assert.ok(i.answer <= 39, ctx)
      if (typ === 'B2' && i.kind === 'build') assert.ok(i.tens * 10 + i.ones <= 40, ctx)
      if (typ === 'B3') assert.ok(!t.prompt.includes('+') && !t.prompt.includes('-'), ctx)
      if (typ === 'C1') assert.ok(i.kind === 'line' && i.answer % 10 === 0 && i.tolerance === 0, ctx)
      if (typ === 'C2') assert.ok(i.kind === 'number' && i.answer % 10 === 0, ctx)
      if (typ === 'C3' && i.kind === 'pair') assert.ok(i.answer[1] <= 31 && i.answer[0] % 10 !== 9 && i.answer[1] % 10 !== 0, ctx)
      if (typ === 'C4') assert.ok(i.kind === 'pair' && i.answer[0] >= 10 && i.answer[1] <= 50, ctx)
    }
  }
})
