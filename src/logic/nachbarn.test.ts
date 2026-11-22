import { test } from 'node:test'
import assert from 'node:assert/strict'
import { vorgaenger, nachfolger, nachbarzehner } from './nachbarn.ts'

test('Vorgänger und Nachfolger, auch an den Rändern', () => {
  assert.equal(vorgaenger(12), 11)
  assert.equal(nachfolger(12), 13)
  assert.equal(vorgaenger(1), 0)
  assert.equal(nachfolger(99), 100)
  assert.equal(vorgaenger(0), null)
  assert.equal(nachfolger(100), null)
})

test('Nachbarzehner nicht-runder Zahlen (Beispiel aus dem Buch: 14)', () => {
  assert.deepEqual(nachbarzehner(14), [10, 20])
  assert.deepEqual(nachbarzehner(52), [50, 60])
  assert.deepEqual(nachbarzehner(99), [90, 100])
  assert.deepEqual(nachbarzehner(1), [0, 10])
})

test('Nachbarzehner von Zehnerzahlen: Zehner davor und danach', () => {
  assert.deepEqual(nachbarzehner(50), [40, 60])
  assert.deepEqual(nachbarzehner(10), [0, 20])
  assert.deepEqual(nachbarzehner(90), [80, 100])
})

test('0 und 100 haben keine Nachbarzehner', () => {
  assert.equal(nachbarzehner(0), null)
  assert.equal(nachbarzehner(100), null)
})

test('Für alle Zahlen 1 bis 99 liegen die Nachbarzehner im Bereich und unterscheiden sich um 10 oder 20', () => {
  for (let n = 1; n <= 99; n++) {
    const r = nachbarzehner(n)
    assert.ok(r)
    const [a, b] = r
    assert.ok(a >= 0 && b <= 100 && a % 10 === 0 && b % 10 === 0)
    assert.equal(b - a, n % 10 === 0 ? 20 : 10)
    assert.ok(a < n || n % 10 === 0 ? a <= n : false)
    assert.ok(b > n)
  }
})
