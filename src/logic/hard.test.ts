import test from 'node:test'
import assert from 'node:assert/strict'
import { TASK_TYPES, checkAnswer, correctResponse, generateTask } from './tasks.ts'
import { createRng } from './rng.ts'

test('Schwere Aufgaben sind lösbar und bleiben im Zahlenraum bis 100', () => {
  for (const typ of TASK_TYPES) {
    for (let seed = 1; seed <= 500; seed++) {
      const t = generateTask(typ, createRng(seed), true)
      assert.ok(checkAnswer(t, correctResponse(t)), `${typ} Seed ${seed}: richtige Antwort wird nicht akzeptiert`)
      const i = t.input
      if (i.kind === 'number') assert.ok(i.answer >= 0 && i.answer <= 100, `${typ} Seed ${seed}: ${i.answer}`)
      if (i.kind === 'pair') for (const a of i.answer) assert.ok(a >= 0 && a <= 100, `${typ} Seed ${seed}: ${a}`)
      if (i.kind === 'line') assert.ok(i.answer >= i.from && i.answer <= i.to, `${typ} Seed ${seed}`)
      if (i.kind === 'build') assert.ok(i.tens <= 9 && i.ones <= 9, `${typ} Seed ${seed}`)
      if (i.kind === 'order') assert.equal(new Set(i.numbers).size, i.numbers.length, `${typ} Seed ${seed}: doppelte Zahlen`)
    }
  }
})

test('Leichte Aufgaben ändern sich durch den Schwer-Schalter nicht', () => {
  for (const typ of TASK_TYPES) {
    for (let seed = 1; seed <= 50; seed++) {
      assert.deepEqual(generateTask(typ, createRng(seed)), generateTask(typ, createRng(seed), false))
    }
  }
})
