import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TRANSPARENZPAPIER } from './coverage.ts'
import { MIX_TOPICS, TASK_TYPES, TOPIC_OF, taskFromSeed } from './tasks.ts'

test('Das Transparenzpapier hat 9 Lernziele in 3 Themen', () => {
  assert.equal(TRANSPARENZPAPIER.length, 9)
  assert.equal(new Set(TRANSPARENZPAPIER.map((p) => p.thema)).size, 3)
})

test('Jedes Lernziel des Transparenzpapiers wird von mindestens einem Aufgabentyp geübt', () => {
  for (const item of TRANSPARENZPAPIER) {
    assert.ok(item.types.length >= 1, `Nicht abgedeckt: ${item.text}`)
    for (const type of item.types) {
      assert.ok(TASK_TYPES.includes(type), `Unbekannter Typ ${type}`)
      assert.ok(taskFromSeed(type, 1).prompt.length > 0)
    }
  }
})

test('Jeder Aufgabentyp gehört zu einem Lernziel (keine Aufgaben außerhalb des Tests)', () => {
  const abgedeckt = new Set(TRANSPARENZPAPIER.flatMap((p) => p.types))
  // Das Transparenzpapier gilt für den Zahlenraum-Test; Raum und Form (D) ist ein eigenes Lernfeld ohne Transparenzpapier.
  for (const t of TASK_TYPES.filter((x) => MIX_TOPICS.includes(TOPIC_OF[x]))) assert.ok(abgedeckt.has(t), `${t} ist keinem Lernziel zugeordnet`)
})
