import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TASK_TYPES, TOPIC_OF, taskFromSeed, checkAnswer, correctResponse } from './tasks.ts'
import type { Task } from './tasks.ts'
import { zahlZuWort, wortZuZahl } from './zahlwort.ts'

const SEEDS = 1000

function alle(type: (typeof TASK_TYPES)[number]): Task[] {
  return Array.from({ length: SEEDS }, (_, s) => taskFromSeed(type, s + 1))
}

test('Jeder Typ erzeugt 1000 gültige Aufgaben mit genau einer richtigen Antwort', () => {
  for (const type of TASK_TYPES) {
    for (const t of alle(type)) {
      assert.equal(t.type, type)
      assert.equal(t.topic, TOPIC_OF[type])
      assert.ok(t.prompt.length > 0 && t.hint.length > 0 && t.solution.length > 0)
      assert.ok(checkAnswer(t, correctResponse(t)), `richtige Antwort nicht akzeptiert: ${t.prompt}`)
      const i = t.input
      switch (i.kind) {
        case 'number':
          assert.ok(Number.isInteger(i.answer) && i.answer >= 0 && i.answer <= 100, t.prompt)
          assert.equal(checkAnswer(t, i.answer + 1), false)
          break
        case 'pair':
          assert.ok(i.answer.every((v) => Number.isInteger(v) && v >= 0 && v <= 100), t.prompt)
          assert.equal(checkAnswer(t, [i.answer[0], i.answer[1] + 1]), false)
          assert.equal(checkAnswer(t, [i.answer[1], i.answer[0]]), i.answer[0] === i.answer[1])
          break
        case 'choice': {
          assert.equal(new Set(i.options).size, i.options.length, `Optionen doppelt: ${t.prompt}`)
          assert.ok(i.answer >= 0 && i.answer < i.options.length)
          const falsch = i.options.map((_, k) => k).filter((k) => k !== i.answer)
          assert.ok(falsch.every((k) => !checkAnswer(t, k)))
          break
        }
        case 'order':
          assert.equal(new Set(i.numbers).size, i.numbers.length)
          assert.ok(i.numbers.length >= 3)
          assert.equal(checkAnswer(t, [...i.numbers].sort((a, b) => b - a)), false)
          break
        case 'build':
          assert.ok(i.tens >= 1 && i.tens <= 9 && i.ones >= 0 && i.ones <= 9)
          break
        case 'line':
          assert.ok(i.answer > i.from && i.answer < i.to, t.prompt)
          assert.ok((i.answer - i.from) % i.snap === 0 || i.snap === 1, t.prompt)
          break
        case 'cards':
          assert.equal(new Set(i.pool).size, i.pool.length, `Karten doppelt: ${t.prompt}`)
          assert.ok(i.answer.every((c) => i.pool.includes(c)))
          assert.equal(checkAnswer(t, [...i.answer].reverse()), false)
          break
      }
    }
  }
})

test('Gleiche Seeds erzeugen gleiche Aufgaben', () => {
  for (const type of TASK_TYPES) assert.deepEqual(taskFromSeed(type, 42), taskFromSeed(type, 42))
})

test('Alle Typen kommen mit mehreren Varianten vor (Aufgaben unterscheiden sich)', () => {
  for (const type of TASK_TYPES) {
    const texte = new Set(alle(type).map((t) => JSON.stringify([t.prompt, t.visual, t.input])))
    assert.ok(texte.size >= 5, `${type}: zu wenig Abwechslung (${texte.size})`)
  }
})

test('A1: Zahlwort in der Aufgabe passt zur Antwort', () => {
  let geprueft = 0
  for (const t of alle('A1')) {
    if (t.input.kind === 'number' || t.input.kind === 'choice') {
      const wort = t.prompt.match(/"([^"]+)"/)?.[1]
      assert.ok(wort, t.prompt)
      const n = wortZuZahl(wort)
      assert.notEqual(n, null)
      const antwort = t.input.kind === 'number' ? t.input.answer : Number(t.input.options[t.input.answer])
      assert.equal(antwort, n)
      assert.equal(zahlZuWort(antwort), wort)
      geprueft++
    }
  }
  assert.ok(geprueft > 300)
})

test('A1 Wortkarten: Reihenfolge ergibt das richtige Zahlwort', () => {
  let geprueft = 0
  for (const t of alle('A1')) {
    if (t.input.kind === 'cards') {
      const n = Number(t.prompt.match(/zu (\d+)\./)?.[1])
      assert.equal(t.input.answer.join(''), zahlZuWort(n))
      assert.equal(t.input.pool.length, 5)
      geprueft++
    }
  }
  assert.ok(geprueft > 200)
})

test('A2: Stellentafel und Terme ergeben dieselbe Zahl', () => {
  for (const t of alle('A2')) {
    if (t.input.kind === 'pair') {
      const n = Number(t.prompt.match(/ (\d+) in die/)?.[1])
      assert.equal(t.input.answer[0] * 10 + t.input.answer[1], n)
    }
    if (t.visual?.kind === 'stellentafel' && t.input.kind === 'number') {
      assert.equal(t.input.answer, (t.visual.tens as number) * 10 + (t.visual.ones as number))
    }
    const term = t.prompt.match(/Rechne: (\d+) \+ (\d+)/)
    if (term && t.input.kind === 'number') assert.equal(t.input.answer, Number(term[1]) + Number(term[2]))
  }
})

test('A3: Zahlenreihe bleibt im Zahlenraum und setzt die Schrittweite fort', () => {
  for (const t of alle('A3')) {
    const zahlen = t.prompt.match(/: ([\d, ]+), \.\.\./)?.[1].split(', ').map(Number)
    assert.ok(zahlen && zahlen.length === 3, t.prompt)
    const d = zahlen[1] - zahlen[0]
    assert.ok([1, -1, 10, -10].includes(d))
    assert.equal(zahlen[2] - zahlen[1], d)
    assert.equal(t.input.kind === 'number' ? t.input.answer : -1, zahlen[2] + d)
  }
})

test('B1: Zahlbild entspricht der Antwort', () => {
  for (const t of alle('B1')) {
    assert.equal(t.visual?.kind, 'zahlbilder')
    if (t.visual?.kind === 'zahlbilder' && t.input.kind === 'number') {
      const { tens, ones } = t.visual.items[0]
      assert.equal(tens * 10 + ones, t.input.answer)
    }
  }
})

test('B3: Vergleichszeichen stimmen (Zahlen, Terme, Zahlbilder)', () => {
  const zeichen = ['<', '>', '=']
  let zahlen = 0
  let terme = 0
  let bilder = 0
  let gleichheit = 0
  for (const t of alle('B3')) {
    if (t.input.kind !== 'choice') continue
    const z = zeichen[t.input.answer]
    const direkt = t.prompt.match(/passt\? (\d+) \? (\d+)$/)
    const term = t.prompt.match(/passt\? (\d+) \+ (\d+) \? (\d+) - (\d+)$/)
    let a: number
    let b: number
    if (direkt) { a = Number(direkt[1]); b = Number(direkt[2]); zahlen++ }
    else if (term) { a = Number(term[1]) + Number(term[2]); b = Number(term[3]) - Number(term[4]); terme++ }
    else if (t.visual?.kind === 'zahlbilder') {
      const [p, q] = t.visual.items
      a = p.tens * 10 + p.ones
      b = q.tens * 10 + q.ones
      bilder++
    } else assert.fail(`Unbekanntes Format: ${t.prompt}`)
    const erwartet = a < b ? '<' : a > b ? '>' : '='
    assert.equal(z, erwartet, t.prompt)
    if (z === '=') gleichheit++
  }
  assert.ok(zahlen > 100 && terme > 100 && bilder > 100)
  assert.ok(gleichheit > 20, 'Gleichheit muss vorkommen')
})

test('C1: Zielzahl liegt auf dem Strahl und Toleranz ist definiert', () => {
  const toleranzen = new Set<number>()
  for (const t of alle('C1')) {
    if (t.input.kind !== 'line') continue
    toleranzen.add(t.input.tolerance)
    assert.ok(checkAnswer(t, t.input.answer))
    assert.equal(checkAnswer(t, t.input.answer + t.input.tolerance), true)
    assert.equal(checkAnswer(t, t.input.answer + t.input.tolerance + 1), false)
    assert.equal(checkAnswer(t, t.input.answer - t.input.tolerance - 1), false)
  }
  assert.deepEqual([...toleranzen].sort(), [0, 5])
})

test('C2: Pfeil liegt auf einem Strich', () => {
  for (const t of alle('C2')) {
    if (t.visual?.kind !== 'strahl' || t.input.kind !== 'number') continue
    const v = t.visual
    assert.equal(v.marker, t.input.answer)
    assert.ok(t.input.answer > v.from && t.input.answer < v.to)
    assert.equal((t.input.answer - v.from) % v.tickStep, 0)
  }
})

test('C3 und C4: Vorgänger, Nachfolger, Nachbarzehner stimmen', () => {
  for (const t of alle('C3')) {
    const n = Number(t.prompt.match(/von (\d+)\?/)?.[1])
    assert.deepEqual(t.input.kind === 'pair' ? t.input.answer : null, [n - 1, n + 1])
  }
  for (const t of alle('C4')) {
    const n = Number(t.prompt.match(/von (\d+)\?/)?.[1])
    const a = t.input.kind === 'pair' ? t.input.answer : [0, 0]
    assert.equal(a[0] % 10, 0)
    assert.equal(a[1] % 10, 0)
    assert.ok(a[0] < n && n < a[1])
    assert.equal(a[1] - a[0], n % 10 === 0 ? 20 : 10)
  }
})
