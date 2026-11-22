import { test } from 'node:test'
import assert from 'node:assert/strict'
import { finishRound, initialState, parseState, serializeState } from './game.ts'
import type { GameState, RoundAnswer } from './game.ts'
import { nachtragen, pruefeMeilensteine, rueckblickVon, zusatzMuenzen } from './meilensteine.ts'
import { kontostand, verdiente } from './shop.ts'
import { CONFIG } from './config.ts'
import type { Stufe } from './tasks.ts'

const MO = new Date(2026, 10, 23, 10, 0, 0)
const tag = (n: number) => new Date(2026, 10, 23 + n, 10, 0, 0)

function runde(erste: number, stufe: Stufe = 2, extra: Partial<RoundAnswer> = {}): RoundAnswer[] {
  return Array.from({ length: 10 }, (_, i) => ({ type: 'A1' as const, outcome: i < erste ? ('first' as const) : ('failed' as const), stufe, ...(i === 2 ? extra : {}) }))
}

test('Futter nach Stufe in der Rundenabrechnung: normale perfekte Runde bleibt bei 25', () => {
  const r = finishRound(initialState('S'), runde(10, 2), MO)
  assert.equal(r.foodGained + r.bonusFood, 25)
  assert.equal(r.knobelFutter, 0)
})

test('Knobelrunde bringt mindestens doppelt so viel Futter wie eine normale', () => {
  const normal = finishRound(initialState('S'), runde(10, 2), MO)
  const knobel = finishRound(initialState('S'), runde(10, 3), MO, true)
  assert.equal(knobel.knobelFutter, 50)
  assert.equal(knobel.bonusFood, CONFIG.rundenBonusKnobel)
  assert.ok(knobel.foodGained + knobel.bonusFood >= 2 * (normal.foodGained + normal.bonusFood))
})

test('Serienfutter: einmal pro Runde, getrennt ausgewiesen', () => {
  const r = finishRound(initialState('S'), runde(10, 2, { serieBonus: true }), MO)
  assert.equal(r.serienFutter, CONFIG.serieFutter)
  assert.equal(r.foodGained, 20 + CONFIG.serieFutter)
})

test('Tageslimit gilt auch für Knobelrunden', () => {
  let s: GameState = initialState('S')
  for (let i = 0; i < CONFIG.foodRoundsPerDay; i++) s = finishRound(s, runde(10, 3), MO, true).state
  const r = finishRound(s, runde(10, 3), MO, true)
  assert.equal(r.satt, true)
  assert.equal(r.foodGained, 0)
  assert.equal(r.knobelFutter, 0)
})

test('Lernstand: leichte Aufgaben allein bringen keine zweiten und dritten Sterne', () => {
  const s = initialState('S')
  let st = s
  for (let i = 0; i < 6; i++) st = finishRound(st, ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'C4'].map((t) => ({ type: t as 'A1', outcome: 'first' as const, stufe: 1 as Stufe })), tag(i)).state
  assert.ok(Object.values(st.skill).every((l) => l === 1))
  assert.deepEqual(st.sterneErreicht, { A: 1, B: 1, C: 1 })
})

test('Falsch bei kniffligen Aufgaben senkt den Lernstand nicht', () => {
  const s = { ...initialState('S'), skill: { ...initialState('S').skill, A1: 2 } }
  const r = finishRound(s, runde(0, 3), MO, true)
  assert.equal(r.state.skill.A1, 2)
})

test('Meilenstein Runden: genau bei 10, nur einmal, mit Münzen', () => {
  let s = initialState('S')
  for (let i = 0; i < 9; i++) {
    s = finishRound(s, runde(0), tag(i)).state
    assert.ok(!s.meilensteine.some((m) => m.id === 'runden-10'))
  }
  const r = finishRound(s, runde(0), tag(9))
  const m = r.meilensteine.find((x) => x.id === 'runden-10')
  assert.ok(m)
  assert.equal(m.muenzen, CONFIG.meilensteinRunden[10])
  assert.equal(m.rueckblick.runden, 10)
  assert.equal(m.rueckblick.tage, 10)
  const danach = finishRound(r.state, runde(0), tag(10))
  assert.ok(!danach.meilensteine.some((x) => x.id === 'runden-10'))
  assert.equal(r.state.meilensteine.filter((x) => x.id === 'runden-10').length, 1)
})

test('Meilenstein-Münzen für Runden landen im Münzkonto', () => {
  let s = initialState('S')
  for (let i = 0; i < 9; i++) s = finishRound(s, runde(0), tag(i)).state
  const vorher = kontostand(s)
  const r = finishRound(s, runde(0), tag(9))
  const erwartet = 1 /* Tagesmitbringsel */ + CONFIG.meilensteinRunden[10] + (r.weeklyBonus > 0 ? 1 : 0) + r.neueSterne + (r.leveledUp ? r.stageAfter - r.stageBefore : 0)
  assert.equal(kontostand(r.state) - vorher, erwartet)
})

test('Entwicklung ist ein Meilenstein, Münze wie bisher (nicht doppelt)', () => {
  const s = { ...initialState('S'), totalFood: 20 }
  const r = finishRound(s, runde(10), MO)
  const m = r.meilensteine.find((x) => x.id === 'entwicklung-2')
  assert.ok(m)
  assert.equal(r.neueBonusMuenzen, 2) // Aufstieg + Tagesmitbringsel, keine zusätzliche Meilenstein-Münze
})

test('Mehrere Meilensteine einer Runde kommen in der Reihenfolge Entwicklung, Runden, Stern, Knobel, Woche', () => {
  const vorher = { ...initialState('S'), totalFood: 10 }
  vorher.rounds = { '2026-11-01': 9 }
  const nachher: GameState = {
    ...vorher, totalFood: 40, rounds: { '2026-11-01': 10 }, sterneErreicht: { A: 1, B: 0, C: 0 }, weeklyBonusWeeks: ['2026-11-23'],
    statistik: { bearbeitet: 10, geloest: 10, ersteTreffer: 10, knobelTreffer: 10 },
  }
  const liste = pruefeMeilensteine(vorher, nachher, '2026-11-23', true)
  assert.deepEqual(liste.map((m) => m.art), ['entwicklung', 'runden', 'stern', 'knobel', 'knobel', 'woche'])
  assert.equal(zusatzMuenzen(liste), CONFIG.meilensteinRunden[10] + CONFIG.ersteKnobelMuenze + CONFIG.knobelTreffer[10])
})

test('Knobelerfolg: 10 kniffelige Treffer insgesamt lösen den Meilenstein aus', () => {
  let s = initialState('S')
  s = { ...s, statistik: { ...s.statistik, knobelTreffer: 5 } }
  const r = finishRound(s, runde(5, 3), MO, true)
  assert.ok(r.meilensteine.some((m) => m.id === 'knobel-10'))
})

test('Rückblick wird aus gespeicherten Daten berechnet', () => {
  const s = { ...initialState('S'), rounds: { '2026-11-01': 2, '2026-11-02': 1 }, statistik: { bearbeitet: 30, geloest: 27, ersteTreffer: 15, knobelTreffer: 0 } }
  s.skill = { ...s.skill, C1: 3, C2: 2 }
  const rb = rueckblickVon(s)
  assert.deepEqual(rb, { runden: 3, tage: 2, aufgaben: 27, quote: 0.5, staerkstesThema: 'C' })
  assert.equal(rueckblickVon(initialState('S')).staerkstesThema, null)
  assert.equal(rueckblickVon(initialState('S')).quote, 0)
})

test('Altstand ohne neue Felder lädt, Meilensteine werden ohne Münzen nachgetragen, Kontostand bleibt', () => {
  const basis = { ...initialState('Alt'), totalFood: 120, rounds: { '2026-11-01': 12 }, sterneErreicht: { A: 2, B: 0, C: 0 }, bonusMuenzen: 3, weeklyBonusWeeks: ['2026-10-26'] }
  const alt = JSON.parse(serializeState(basis))
  delete alt.verlauf; delete alt.statistik; delete alt.meilensteine
  const neu = parseState(JSON.stringify(alt))
  assert.ok(neu)
  assert.deepEqual(neu.statistik, { bearbeitet: 0, geloest: 0, ersteTreffer: 0, knobelTreffer: 0 })
  assert.ok(Object.values(neu.verlauf).every((v) => v.length === 0))
  const ids = neu.meilensteine.map((m) => m.id)
  assert.ok(ids.includes('entwicklung-2') && ids.includes('entwicklung-3') && ids.includes('runden-10') && ids.includes('stern-A-2') && ids.includes('woche-2026-10-26'))
  assert.ok(neu.meilensteine.every((m) => m.muenzen === 0))
  assert.equal(verdiente(neu), verdiente(basis))
  assert.equal(neu.bonusMuenzen, 3)
  // Nach dem Laden wird nichts nachgefeiert
  const r = finishRound(neu, runde(0), new Date(2026, 10, 24))
  assert.ok(!r.meilensteine.some((m) => ['runden-10', 'entwicklung-2', 'entwicklung-3', 'stern-A-1', 'stern-A-2'].includes(m.id)))
  assert.deepEqual(nachtragen(neu, '2026-11-22').map((m) => m.id).sort(), ids.slice().sort())
})

test('Speichern und Laden: Verlauf, Statistik und Meilensteine bleiben gleich, Verlauf wird auf zehn gekürzt', () => {
  let s = initialState('S')
  for (let i = 0; i < 4; i++) s = finishRound(s, runde(7), tag(i)).state
  assert.equal(s.verlauf.A1.length, 10)
  const neu = parseState(serializeState(s))
  assert.ok(neu)
  assert.deepEqual(neu.verlauf, s.verlauf)
  assert.deepEqual(neu.statistik, s.statistik)
  assert.deepEqual(neu.meilensteine, s.meilensteine)
})

test('Meilensteine gehen bei sinkendem Lernstand nicht verloren', () => {
  let s = initialState('S')
  s = finishRound(s, ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'C4'].map((t) => ({ type: t as 'A1', outcome: 'first' as const, stufe: 2 as Stufe })), MO).state
  const sterne = s.meilensteine.filter((m) => m.art === 'stern').length
  assert.ok(sterne > 0)
  s = finishRound(s, ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'C4'].map((t) => ({ type: t as 'A1', outcome: 'failed' as const, stufe: 2 as Stufe })), tag(1)).state
  assert.equal(s.meilensteine.filter((m) => m.art === 'stern').length, sterne)
})
