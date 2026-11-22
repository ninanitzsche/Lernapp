import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOOK_TASKS, BOOK_SOURCES, bookTaskFor, bookTypes, taskKey } from './bookTasks.ts'
import { TASK_TYPES, checkAnswer, correctResponse } from './tasks.ts'
import { BUCHAUFGABEN_LT_TRANSPARENZPAPIER } from './coverage.ts'
import { createRng } from './rng.ts'

test('Jede Buchaufgabe ist gültig und ihre richtige Antwort wird akzeptiert', () => {
  assert.ok(BOOK_TASKS.length >= 100)
  for (const b of BOOK_TASKS) {
    const t = b.build()
    assert.equal(t.type, b.type)
    assert.equal(t.source, b.source)
    assert.ok(checkAnswer(t, correctResponse(t)), t.prompt)
    if (t.input.kind === 'choice') {
      assert.equal(new Set(t.input.options).size, t.input.options.length)
    }
    if (t.input.kind === 'cards') {
      assert.equal(new Set(t.input.pool).size, t.input.pool.length, t.prompt)
      assert.ok(t.input.answer.every((c) => (t.input as { pool: string[] }).pool.includes(c)))
    }
  }
})

test('Alle Aufgabentypen haben Buchaufgaben', () => {
  assert.deepEqual([...bookTypes()].sort(), [...TASK_TYPES].sort())
})

test('Alle Buchstellen sind belegt', () => {
  const vorhanden = new Set(BOOK_TASKS.map((b) => b.source))
  for (const s of BOOK_SOURCES) assert.ok(vorhanden.has(s), `Keine Aufgabe für ${s}`)
})

test('Jede im Transparenzpapier genannte Buchaufgabe ist in der Bank oder bewusst als Lücke markiert', () => {
  const vorhanden = new Set(BOOK_TASKS.map((b) => b.source))
  for (const r of BUCHAUFGABEN_LT_TRANSPARENZPAPIER) {
    if (r.inBank) assert.ok(vorhanden.has(r.ref), `Behauptet, aber nicht vorhanden: ${r.ref}`)
    else assert.ok(r.anmerkung, `Lücke ohne Begründung: ${r.ref}`)
  }
})

function finde(source: string, prompt: RegExp) {
  return BOOK_TASKS.filter((b) => b.source === source).map((b) => b.build()).filter((t) => prompt.test(t.prompt))
}

test('S. 17 Aufg. 8: Zeichen stimmen (nachgerechnet)', () => {
  const z = ['<', '>', '=']
  const erwartet: Record<string, string> = {
    '34 ? 45': '<', '89 ? 98': '<', '78 ? 78': '=', '46 ? 46': '=', '56 ? 58': '<', '73 ? 37': '>',
    '56 ? 60 + 5': '<', '72 ? 70 + 2': '=', '93 ? 60 + 3': '>',
    '80 + 6 ? 90 - 6': '>', '60 + 4 ? 60 - 4': '>', '30 + 5 ? 40 - 5': '=',
  }
  const gefunden = finde('Buch S. 17, Aufg. 8', /./)
  assert.equal(gefunden.length, 12)
  for (const t of gefunden) {
    const key = t.prompt.replace('Welches Zeichen passt? ', '')
    assert.ok(key in erwartet, key)
    assert.equal(t.input.kind === 'choice' ? z[t.input.answer] : '', erwartet[key], key)
  }
})

test('S. 21: Vorgänger, Nachfolger und Nachbarzehner aus dem Buch', () => {
  const nach = finde('Buch S. 21, Aufg. 9', /./).map((t) => (t.input.kind === 'pair' ? t.input.answer : null))
  assert.deepEqual(nach, [[50, 60], [30, 40], [40, 50], [10, 20], [20, 30], [60, 70], [70, 80]])
  const vn = finde('Buch S. 21, Aufg. 8', /./).map((t) => (t.input.kind === 'pair' ? t.input.answer : null))
  assert.deepEqual(vn, [[11, 13], [76, 78], [42, 44], [53, 55], [68, 70]])
})

test('S. 15: Zahlwörter und Stellentafeln aus dem Buch', () => {
  const zahlen = finde('Buch S. 15, Aufg. 6', /Das steht in der Stellentafel/).map((t) => (t.input.kind === 'number' ? t.input.answer : 0))
  assert.deepEqual(zahlen.slice(0, 4), [23, 44, 62, 75])
  const terme = finde('Buch S. 15, Aufg. 6', /Rechne: /).map((t) => (t.input.kind === 'number' ? t.input.answer : 0))
  assert.deepEqual(terme, [92, 55, 28, 67])
  const worte = finde('Buch S. 15, Aufg. 6', /Wortkarten "/).map((t) => (t.input.kind === 'number' ? t.input.answer : 0))
  assert.deepEqual(worte, [74, 95, 63, 57, 37, 31])
})

test('S. 15 und S. 21: Zahlenreihen', () => {
  const r = [...finde('Buch S. 15, Aufg. 7', /./), ...finde('Buch S. 21, Aufg. 7', /./)]
  const antworten = r.map((t) => (t.input.kind === 'pair' ? t.input.answer : null))
  assert.deepEqual(antworten, [[24, 25], [78, 79], [47, 46], [29, 28], [35, 45], [69, 59]])
})

test('S. 21 Aufg. 6: Zahlenstrahl-Zahlen und Toleranzen', () => {
  const t = finde('Buch S. 21, Aufg. 6', /./)
  assert.equal(t.length, 15)
  const lines = t.map((x) => (x.input.kind === 'line' ? x.input : null))
  assert.deepEqual(lines.slice(0, 5).map((l) => [l?.answer, l?.snap, l?.tolerance]), [[20, 10, 0], [30, 10, 0], [60, 10, 0], [80, 10, 0], [100, 10, 0]])
  assert.deepEqual(lines.slice(5, 10).map((l) => l?.answer), [15, 25, 55, 65, 95])
  assert.deepEqual(lines.slice(10).map((l) => [l?.answer, l?.tolerance]), [[22, 2], [37, 2], [53, 2], [61, 2], [89, 2]])
})

test('Buchaufgaben ändern sich mit dem Zufall und wiederholen sich in einer Runde nicht unnötig', () => {
  const rng = createRng(5)
  const benutzt = new Set<string>()
  for (let i = 0; i < 20; i++) {
    const t = bookTaskFor('C4', rng, benutzt)
    assert.ok(t)
    if (i < 7) assert.ok(!benutzt.has(taskKey(t)), 'Aufgabe doppelt, obwohl noch nicht alle benutzt')
    benutzt.add(taskKey(t))
  }
})
