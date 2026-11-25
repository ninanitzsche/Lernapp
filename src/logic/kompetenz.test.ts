import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fortschritt, leereNachweise, MAX_STERNE, nachweiseNach, parseNachweise, sternErbracht, sterneNach, typenDesFeldes } from './kompetenz.ts'
import type { Nachweis } from './kompetenz.ts'
import type { RoundAnswer } from './game.ts'
import type { Stufe } from './tasks.ts'
import { CONFIG } from './config.ts'

/** Baut `n` Nachweise für die Typen eines Feldes, gleichmäßig verteilt auf `runden` Runden. */
function nw(topic: 'A' | 'B' | 'C', n: number, runden: number, stufe: Stufe, start = 1): Nachweis[] {
  const typen = typenDesFeldes(topic)
  return Array.from({ length: n }, (_, i) => ({ r: start + (i % runden), t: typen[i % typen.length], s: stufe }))
}

test('Fünf Sterne je Lernfeld, Kriterien steigen', () => {
  assert.equal(MAX_STERNE, 5)
  const k = CONFIG.kompetenz
  for (let i = 1; i < k.length; i++) {
    assert.ok(k[i].stufe >= k[i - 1].stufe && k[i].runden >= k[i - 1].runden, 'Stufe und Rundenzahl sinken nie')
    if (k[i].stufe === k[i - 1].stufe) assert.ok(k[i].treffer >= k[i - 1].treffer, 'bei gleicher Stufe steigen die Treffer')
  }
})

test('Nur selbstständig gelöste Aufgaben zählen als Nachweis (kein Tipp, keine Lösung)', () => {
  const antworten: RoundAnswer[] = [
    { type: 'A1', outcome: 'first', stufe: 1 },
    { type: 'A2', outcome: 'second', stufe: 2 },
    { type: 'A3', outcome: 'failed', stufe: 2 },
    { type: 'C1', outcome: 'first' },
  ]
  const n = nachweiseNach(leereNachweise(), antworten, 7)
  assert.deepEqual(n.A, [{ r: 7, t: 'A1', s: 1 }])
  assert.deepEqual(n.C, [{ r: 7, t: 'C1', s: 2 }], 'ohne Stufe gilt mittel')
  assert.deepEqual(n.B, [])
})

test('Nachweise sind auf die Höchstzahl begrenzt, die ältesten fallen weg', () => {
  let n = leereNachweise()
  for (let r = 1; r <= CONFIG.nachweisMax + 10; r++) n = nachweiseNach(n, [{ type: 'A1', outcome: 'first', stufe: 2 }], r)
  assert.equal(n.A.length, CONFIG.nachweisMax)
  assert.equal(n.A[0].r, 11)
})

test('Stern 1 braucht mehrere Aufgabentypen, genug Treffer und mehrere Runden', () => {
  assert.equal(sterneNach(0, [], 'A'), 0)
  // viele Treffer, aber nur eine Runde
  assert.equal(sterneNach(0, nw('A', 8, 1, 1), 'A'), 0)
  // viele Treffer, aber nur ein Typ
  const einTyp: Nachweis[] = Array.from({ length: 8 }, (_, i) => ({ r: 1 + (i % 3), t: 'A1', s: 1 }))
  assert.equal(sterneNach(0, einTyp, 'A'), 0)
  assert.equal(sterneNach(0, nw('A', 4, 2, 1), 'A'), 1)
})

test('Sterne werden der Reihe nach vergeben: kniffelige Nachweise überspringen keinen Stern', () => {
  // Nur ein Typ-Mix aus kniffligen Treffern über viele Runden erfüllt jede Anforderung, aber Stern für Stern
  const viel = nw('C', 40, 8, 3)
  assert.equal(sterneNach(0, viel, 'C'), 5, 'alle Anforderungen erfüllt: alle fünf Sterne')
  // Fehlt Stern 2 (alle Typen), kommt Stern 3 nicht, obwohl dessen Anforderung für sich erfüllt wäre
  const nurZweiTypen: Nachweis[] = Array.from({ length: 30 }, (_, i) => ({ r: 1 + (i % 6), t: i % 2 === 0 ? 'C1' : 'C2', s: 2 }))
  assert.equal(sternErbracht(nurZweiTypen, 'C', 3), true)
  assert.equal(sterneNach(0, nurZweiTypen, 'C'), 1)
})

test('Höhere Stufen zählen auch für niedrigere Anforderungen, niedrige nicht für höhere', () => {
  assert.equal(sterneNach(0, nw('B', 6, 3, 3), 'B'), 3, 'sechs kniffelige Treffer in drei Runden erfüllen Stern 1 bis 3')
  assert.equal(sterneNach(0, nw('B', 40, 8, 1), 'B'), 2, 'nur leichte Aufgaben reichen nur bis Stern 2')
  assert.equal(sterneNach(0, nw('B', 40, 8, 2), 'B'), 5)
})

test('Verdiente Sterne gehen nie verloren, auch ohne Nachweise', () => {
  assert.equal(sterneNach(3, [], 'A'), 3)
  assert.equal(sterneNach(5, [], 'A'), 5)
  assert.equal(sterneNach(9, [], 'A'), 5, 'mehr als fünf gibt es nicht')
})

test('Fortschritt zum nächsten Stern beruht auf gespeicherten Nachweisen', () => {
  const leer = fortschritt(0, [], 'A')
  assert.ok(leer)
  assert.equal(leer.stern, 1)
  assert.equal(leer.anteil, 0)
  assert.deepEqual(leer.fehlt, { typen: 2, treffer: 4, runden: 2 })
  const halb = fortschritt(0, nw('A', 2, 1, 1), 'A')
  assert.ok(halb)
  assert.equal(halb.anteil, 0.5)
  assert.deepEqual(halb.fehlt, { typen: 0, treffer: 2, runden: 1 })
  assert.equal(fortschritt(5, [], 'A'), null)
})

test('Gespeicherte Nachweise werden geprüft, Fremdes fällt weg', () => {
  const ok = parseNachweise({ A: [{ r: 2, t: 'A1', s: 2 }, { r: 'x', t: 'A1', s: 2 }, { r: 1, t: 'B1', s: 2 }, { r: 1, t: 'A2', s: 7 }], B: 'kaputt' })
  assert.deepEqual(ok, { A: [{ r: 2, t: 'A1', s: 2 }], B: [], C: [] })
  assert.deepEqual(parseNachweise(null), leereNachweise())
})
