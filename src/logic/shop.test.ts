import test from 'node:test'
import assert from 'node:assert/strict'
import { initialState, finishRound, parseState, serializeState } from './game.ts'
import type { GameState, RoundAnswer } from './game.ts'
import { SHOP, kannKaufen, kaufen, kontostand, platziere, verdiente } from './shop.ts'

const MO = new Date(2026, 0, 5, 12)

test('Jeder Katalogeintrag hat eine eindeutige ID', () => {
  assert.equal(new Set(SHOP.map((i) => i.id)).size, SHOP.length)
})

test('Ohne Sterne gibt es keine Münzen und nichts zu kaufen', () => {
  const s = initialState('S')
  assert.equal(kontostand(s), 0)
  assert.equal(kannKaufen(s, 'knorriger-ast'), false)
  assert.equal(kaufen(s, 'knorriger-ast'), null)
})

test('Ein Stern ist eine Münze, Kaufen zieht den Preis ab', () => {
  const s: GameState = { ...initialState('S'), sterneErreicht: { A: 2, B: 1, C: 0 } }
  assert.equal(verdiente(s), 3)
  const k = kaufen(s, 'felshoehle')
  assert.ok(k)
  assert.equal(kontostand(k), 0)
  assert.equal(kaufen(k, 'felshoehle'), null)
})

test('Sinkt der Lernstand, bleiben die Münzen erhalten', () => {
  const s: GameState = { ...initialState('S'), sterneErreicht: { A: 3, B: 0, C: 0 } }
  const antworten: RoundAnswer[] = [{ type: 'A1', outcome: 'failed' }]
  const r = finishRound(s, antworten, MO)
  assert.equal(r.state.sterneErreicht.A, 3)
  assert.equal(r.neueSterne, 0)
})

test('Neue Sterne werden in der Runde gezählt', () => {
  const s = initialState('S')
  // Drei selbstständige Treffer aus zwei früheren Runden, die Runde bringt den vierten und schließt Stern 1 ab.
  const nachweise = { A: [{ r: 1, t: 'A1' as const, s: 2 as const }, { r: 1, t: 'A2' as const, s: 2 as const }, { r: 2, t: 'A1' as const, s: 2 as const }], B: [], C: [] }
  const r = finishRound({ ...s, nachweise }, [{ type: 'A2', outcome: 'first' }], MO)
  assert.equal(r.neueSterne, 1)
  assert.equal(r.state.sterneErreicht.A, 1)
  assert.equal(verdiente(r.state), r.neueSterne + 1) // +1: Tagesmitbringsel der ersten Runde
})

test('Alte Spielstände ohne Münzen bekommen ihre Sterne rückwirkend', () => {
  const s = initialState('S')
  const skill = { ...s.skill }
  for (const k of Object.keys(skill) as (keyof typeof skill)[]) skill[k] = 3
  const alt = JSON.parse(serializeState({ ...s, skill }))
  delete alt.sterneErreicht
  delete alt.gekauft
  const neu = parseState(JSON.stringify(alt))
  assert.ok(neu)
  assert.equal(verdiente(neu), 9)
  assert.deepEqual(neu.gekauft, [])
})

test('Stufenaufstieg bringt eine Bonus-Münze', () => {
  const s = { ...initialState('S'), totalFood: 20 }
  const r = finishRound(s, Array.from({ length: 10 }, () => ({ type: 'A1' as const, outcome: 'first' as const })), MO)
  assert.equal(r.leveledUp, true)
  assert.equal(r.neueBonusMuenzen, 2) // Aufstieg + Tagesmitbringsel
  assert.equal(r.state.bonusMuenzen, 2)
  assert.equal(verdiente(r.state), r.neueSterne + 2)
})

test('Es gibt kein Wochenziel: Üben an mehreren Tagen derselben Woche bringt nur das Tagesmitbringsel', () => {
  let s = initialState('S')
  const antworten: RoundAnswer[] = [{ type: 'A1', outcome: 'failed' }]
  for (const tag of [5, 6]) s = finishRound(s, antworten, new Date(2026, 0, tag, 12)).state
  const r = finishRound(s, antworten, new Date(2026, 0, 7, 12))
  assert.equal(r.neueBonusMuenzen, 1) // nur das Tagesmitbringsel
  assert.equal(r.foodGained + r.bonusFood, 0)
})

test('Bonus-Münzen überleben Speichern und Laden, alte Stände starten bei 0', () => {
  const s: GameState = { ...initialState('S'), bonusMuenzen: 4 }
  assert.equal(parseState(serializeState(s))?.bonusMuenzen, 4)
  const alt = JSON.parse(serializeState(s))
  delete alt.bonusMuenzen
  assert.equal(parseState(JSON.stringify(alt))?.bonusMuenzen, 0)
})

test('Gekaufte Dinge bekommen Plätze, der Hintergrund nicht', () => {
  const p = platziere(['knorriger-ast', 'terrarium2', 'haengematte'])
  assert.equal(p.length, 2)
  assert.equal(p[1].y, 3)
})

test('Verschobene Dinge behalten ihren Platz', () => {
  const p = platziere(['knorriger-ast', 'haengematte'], { 'knorriger-ast': { x: 40, y: 70 }, haengematte: { x: 60, y: 20 } })
  assert.deepEqual([p[0].x, p[0].y], [40, 70])
  assert.deepEqual([p[1].x, p[1].y], [60, 20])
})

test('Positionen überleben Speichern und Laden, unbekannte Dinge fliegen raus', () => {
  const s: GameState = { ...initialState('S'), gekauft: ['knorriger-ast'], positionen: { 'knorriger-ast': { x: 33, y: 66 }, fremd: { x: 1, y: 1 } } }
  const neu = parseState(serializeState(s))
  assert.ok(neu)
  assert.deepEqual(neu.positionen, { 'knorriger-ast': { x: 33, y: 66 } })
})

const zehn = (erste: number): RoundAnswer[] =>
  Array.from({ length: 10 }, (_, i) => ({ type: 'A1' as const, outcome: i < erste ? ('first' as const) : ('failed' as const) }))

test('Knobelrunde: Zusatzmünze ab 7 von 10 im ersten Versuch', () => {
  const s = initialState('S')
  assert.equal(finishRound(s, zehn(6), MO, true).knobelMuenze, false)
  const r = finishRound(s, zehn(7), MO, true)
  assert.equal(r.knobelMuenze, true)
  assert.equal(r.neueBonusMuenzen, 4) // Knobel (2) + erste starke Knobelrunde (1) + Tagesmitbringsel (1)
})

test('Tagesmitbringsel: nur die erste Runde des Tages bringt eine Münze', () => {
  const s = initialState('S')
  const eins = finishRound(s, zehn(5), MO)
  assert.equal(eins.tagesMuenze, true)
  assert.equal(eins.neueBonusMuenzen, 1)
  const zwei = finishRound(eins.state, zehn(0), MO)
  assert.equal(zwei.tagesMuenze, false)
  assert.equal(zwei.neueBonusMuenzen, 0)
  const naechsterTag = finishRound(zwei.state, zehn(5), new Date(MO.getTime() + 86_400_000))
  assert.equal(naechsterTag.tagesMuenze, true)
})

test('Wirtschaft: bei üblichem Üben ist der Shop in etwa acht Wochen leergekauft, nicht in zwei', () => {
  // Annahme: 5 Tage pro Woche je eine Runde, Knobelrunde an 2 Tagen mit Erfolg. Sterne und Aufstiege: 13 Münzen am Anfang.
  const proWoche = 5 /* Tagesmitbringsel */ + 4 /* Knobel: 2 Münzen an 2 Tagen */
  const wochen = (89 - 13) / proWoche
  assert.ok(wochen > 6 && wochen < 11, `Wochen bis alles gekauft: ${wochen}`)
})

test('Normale Runde bringt keine Knobelmünze', () => {
  assert.equal(finishRound(initialState('S'), zehn(10), MO, false).knobelMuenze, false)
})

test('Knobelrunde: höchstens eine Zusatzmünze pro Tag, am nächsten Tag wieder', () => {
  let s = initialState('S')
  let r = finishRound(s, zehn(10), MO, true)
  assert.equal(r.knobelMuenze, true)
  s = r.state
  r = finishRound(s, zehn(10), new Date(2026, 0, 5, 15), true)
  assert.equal(r.knobelMuenze, false)
  r = finishRound(r.state, zehn(10), new Date(2026, 0, 6, 12), true)
  assert.equal(r.knobelMuenze, true)
})

test('Knobelrunde: unvollständige Runde gibt keine Zusatzmünze', () => {
  const kurz = zehn(10).slice(0, 8)
  assert.equal(finishRound(initialState('S'), kurz, MO, true).knobelMuenze, false)
})

test('Knobel-Tage überleben Speichern und Laden', () => {
  const r = finishRound(initialState('S'), zehn(10), MO, true)
  assert.deepEqual(parseState(serializeState(r.state))?.knobelTage, r.state.knobelTage)
})
