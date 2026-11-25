import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  initialState, foodForOutcome, stageFor, nextStageFood, moodAt, dayKey, updateSkill, topicStars,
  selectTypes, pickRepeats, pickRepeatAnswers, finishRound, serializeState, parseState,
} from './game.ts'
import type { RoundAnswer } from './game.ts'
import { createRng } from './rng.ts'
import { TASK_TYPES, TOPIC_OF } from './tasks.ts'

function runde(outcome: RoundAnswer['outcome'], n = 10): RoundAnswer[] {
  return Array.from({ length: n }, (_, i) => ({ type: TASK_TYPES[i % TASK_TYPES.length], outcome }))
}
// Montag, 23.11.2026, 10:00 Uhr
const MO = new Date(2026, 10, 23, 10, 0, 0)
const tag = (offset: number, std = 10) => new Date(2026, 10, 23 + offset, std, 0, 0)

test('Futter pro Aufgabe', () => {
  assert.equal(foodForOutcome('first'), 2)
  assert.equal(foodForOutcome('second'), 1)
  assert.equal(foodForOutcome('failed'), 0)
})

test('Tagesmitbringsel: genau die erste abgeschlossene Runde des Tages bringt eine Münze', () => {
  const first = finishRound(initialState('S'), runde('failed'), MO)
  assert.equal(first.tagesMuenze, true)
  assert.equal(first.neueBonusMuenzen, 1)
  const second = finishRound(first.state, runde('failed'), tag(0, 11))
  assert.equal(second.tagesMuenze, false)
  assert.equal(second.neueBonusMuenzen, 0)
  assert.equal(second.state.bonusMuenzen, 1)
})

test('Denkimpuls: eine Münze weniger aus dem Bonuspool der Runde', () => {
  const antworten = runde('first').map((a, i) => i === 0 ? { ...a, denkimpuls: true } : a)
  const start = { ...initialState('S'), totalFood: 20 }
  const r = finishRound(start, antworten, MO)
  // Stufenaufstieg + Tagesmitbringsel = 2 Bonusmünzen; ein Impuls zieht genau eine davon ab.
  assert.equal(r.denkimpulsAbzug, 1)
  assert.equal(r.neueBonusMuenzen, 1)
  assert.equal(r.state.bonusMuenzen, 1)
  // Futter und Kompetenznachweise werden durch den Impuls nicht reduziert.
  assert.equal(r.foodGained, 20)
  assert.ok(r.state.nachweise.A.length + r.state.nachweise.B.length + r.state.nachweise.C.length > 0)
})

test('Denkimpuls: Abzug ist auf Bonusmünzen dieser Runde begrenzt', () => {
  const antworten = runde('first').map((a) => ({ ...a, denkimpuls: true }))
  const r = finishRound(initialState('S'), antworten, MO)
  // In dieser Runde gibt es nur das Tagesmitbringsel; zehn Impulse können höchstens eine Münze kosten.
  assert.equal(r.denkimpulsAbzug, 1)
  assert.equal(r.neueBonusMuenzen, 0)
  assert.equal(r.state.bonusMuenzen, 0)
})

test('Ein falscher Versuch ohne Denkimpuls kostet keine Münze', () => {
  const r = finishRound(initialState('S'), runde('failed', 1), MO)
  assert.equal(r.denkimpulsAbzug, 0)
  assert.equal(r.neueBonusMuenzen, 1) // Tagesmitbringsel
})

test('Perfekte Runde: 10 mal 2 Futter plus 5 Bonus', () => {
  const r = finishRound(initialState('Slinky'), runde('first'), MO)
  assert.equal(r.foodGained, 20)
  assert.equal(r.bonusFood, 5)
  assert.equal(r.state.totalFood, 25)
})

test('Alles falsch: kein Futter und kein Abzug beim Futter, Rundenbonus gibt es fürs Dranbleiben', () => {
  const s = { ...initialState('Slinky'), totalFood: 40 }
  const r = finishRound(s, runde('failed'), MO)
  assert.equal(r.foodGained, 0)
  assert.equal(r.bonusFood, 5)
  assert.ok(r.state.totalFood >= 40)
})

test('Unvollständige Runde gibt keinen Rundenbonus', () => {
  const r = finishRound(initialState('S'), runde('first', 6), MO)
  assert.equal(r.bonusFood, 0)
  assert.equal(r.foodGained, 12)
})

test('Wiederholungsaufgaben geben kein Futter, ändern aber den Lernstand', () => {
  const antworten: RoundAnswer[] = [...runde('first'), { type: 'A1', outcome: 'first', isRepeat: true }]
  const r = finishRound(initialState('S'), antworten, MO)
  assert.equal(r.foodGained, 20)
  assert.equal(r.state.skill.A1, 2)
})

test('Tageslimit: nur die ersten 3 Runden geben Futter', () => {
  let s = initialState('S')
  const gewinne: number[] = []
  for (let i = 0; i < 5; i++) {
    const r = finishRound(s, runde('first'), tag(0, 10 + i))
    gewinne.push(r.foodGained + r.bonusFood)
    s = r.state
    assert.equal(r.satt, i >= 3)
  }
  assert.deepEqual(gewinne, [25, 25, 25, 0, 0])
  assert.equal(s.rounds[dayKey(MO)], 5)
})

test('Am nächsten Tag gibt es wieder Futter', () => {
  let s = initialState('S')
  for (let i = 0; i < 4; i++) s = finishRound(s, runde('first'), tag(0, 10 + i)).state
  const r = finishRound(s, runde('first'), tag(1))
  assert.equal(r.satt, false)
  assert.equal(r.foodGained, 20)
})

test('Stufenwechsel genau an den Schwellen 30, 90, 200, 350', () => {
  assert.equal(stageFor(0).stage, 1)
  assert.equal(stageFor(29).stage, 1)
  assert.equal(stageFor(30).stage, 2)
  assert.equal(stageFor(89).stage, 2)
  assert.equal(stageFor(90).stage, 3)
  assert.equal(stageFor(199).stage, 3)
  assert.equal(stageFor(200).stage, 4)
  assert.equal(stageFor(349).stage, 4)
  assert.equal(stageFor(350).stage, 5)
  assert.equal(stageFor(9999).stage, 5)
  assert.equal(nextStageFood(0), 30)
  assert.equal(nextStageFood(350), null)
})

test('Level-up wird gemeldet', () => {
  const s = { ...initialState('S'), totalFood: 20 }
  const r = finishRound(s, runde('first'), MO)
  assert.equal(r.stageBefore, 1)
  assert.equal(r.stageAfter, 2)
  assert.equal(r.leveledUp, true)
})

test('Stimmung wechselt genau bei 24 und 48 Stunden', () => {
  const t0 = new Date(2026, 10, 20, 12, 0, 0)
  const nach = (h: number) => new Date(t0.getTime() + h * 3_600_000)
  const iso = t0.toISOString()
  assert.equal(moodAt(null, MO), 'froh')
  assert.equal(moodAt(iso, nach(23.99)), 'froh')
  assert.equal(moodAt(iso, nach(24)), 'hungrig')
  assert.equal(moodAt(iso, nach(48)), 'hungrig')
  assert.equal(moodAt(iso, nach(48.01)), 'schlaeft')
})

test('Wachstum sinkt nie, auch nicht nach langer Pause', () => {
  const s = { ...initialState('S'), totalFood: 100, lastFedAt: new Date(2026, 0, 1).toISOString() }
  assert.equal(moodAt(s.lastFedAt, MO), 'schlaeft')
  assert.equal(stageFor(s.totalFood).stage, 3)
  const r = finishRound(s, runde('failed'), MO)
  assert.ok(r.state.totalFood >= 100)
})

test('Lernstand bleibt zwischen 0 und 3', () => {
  assert.equal(updateSkill(0, 'failed'), 0)
  assert.equal(updateSkill(0, 'first'), 1)
  assert.equal(updateSkill(3, 'first'), 3)
  assert.equal(updateSkill(2, 'second'), 2)
  assert.equal(updateSkill(2, 'failed'), 1)
})

test('Sterne pro Thema', () => {
  const s = initialState('S').skill
  assert.equal(topicStars(s, 'A'), 0)
  s.A1 = 1
  assert.equal(topicStars(s, 'A'), 0, '1 von 3 Typen ist weniger als die Hälfte')
  s.A2 = 1
  assert.equal(topicStars(s, 'A'), 1)
  s.A3 = 2; s.A1 = 2; s.A2 = 2
  assert.equal(topicStars(s, 'A'), 2)
  s.A3 = 3; s.A1 = 3; s.A2 = 3
  assert.equal(topicStars(s, 'A'), 3)
  assert.equal(topicStars(s, 'B'), 0)
})

test('Aufgabenauswahl: Mix hat von jedem Thema mindestens eine Aufgabe', () => {
  const skill = initialState('S').skill
  for (let seed = 1; seed <= 200; seed++) {
    const typen = selectTypes(createRng(seed), skill, 10)
    assert.equal(typen.length, 10)
    for (const th of ['A', 'B', 'C'] as const) assert.ok(typen.some((t) => TOPIC_OF[t] === th), `Thema ${th} fehlt`)
  }
})

test('Aufgabenauswahl: Themenwahl liefert nur Typen dieses Themas', () => {
  const skill = initialState('S').skill
  for (let seed = 1; seed <= 100; seed++) {
    for (const t of selectTypes(createRng(seed), skill, 10, 'C')) assert.equal(TOPIC_OF[t], 'C')
  }
})

test('Aufgabenauswahl folgt grob 60/30/10 nach Lernstand', () => {
  const skill = initialState('S').skill
  const schwach = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'] as const
  const mittel = ['C1', 'C2', 'C3'] as const
  schwach.forEach((t) => (skill[t] = 0))
  mittel.forEach((t) => (skill[t] = 2))
  skill.C4 = 3
  const zaehler = { schwach: 0, mittel: 0, stark: 0 }
  const N = 3000
  const rng = createRng(7)
  for (let i = 0; i < N; i++) {
    for (const t of selectTypes(rng, skill, 10)) {
      if (skill[t] <= 1) zaehler.schwach++
      else if (skill[t] === 2) zaehler.mittel++
      else zaehler.stark++
    }
  }
  const gesamt = zaehler.schwach + zaehler.mittel + zaehler.stark
  // die 3 garantierten Themenaufgaben verschieben die Verteilung leicht, daher Toleranz
  assert.ok(Math.abs(zaehler.schwach / gesamt - 0.6) < 0.1, `schwach ${zaehler.schwach / gesamt}`)
  assert.ok(Math.abs(zaehler.mittel / gesamt - 0.3) < 0.1, `mittel ${zaehler.mittel / gesamt}`)
  assert.ok(Math.abs(zaehler.stark / gesamt - 0.1) < 0.07, `stark ${zaehler.stark / gesamt}`)
})

test('Aufgabenauswahl funktioniert auch, wenn alle Typen beherrscht werden', () => {
  const skill = initialState('S').skill
  TASK_TYPES.forEach((t) => (skill[t] = 3))
  assert.equal(selectTypes(createRng(1), skill, 10).length, 10)
})

test('Wiederholungen: höchstens 3, falsche zuerst', () => {
  const a: RoundAnswer[] = [
    { type: 'A1', outcome: 'second' },
    { type: 'B1', outcome: 'failed' },
    { type: 'C1', outcome: 'second' },
    { type: 'C2', outcome: 'failed' },
    { type: 'C3', outcome: 'failed' },
    { type: 'C4', outcome: 'first' },
  ]
  assert.deepEqual(pickRepeats(a), ['B1', 'C2', 'C3'])
  assert.deepEqual(pickRepeats([{ type: 'A1', outcome: 'first' }]), [])
  assert.deepEqual(pickRepeats([{ type: 'A1', outcome: 'failed', isRepeat: true }]), [])
})

test('Wiederholungen behalten den Text der gescheiterten Aufgabe', () => {
  const a: RoundAnswer[] = [
    { type: 'A1', outcome: 'first', prompt: 'p1' },
    { type: 'B1', outcome: 'failed', prompt: 'p2' },
    { type: 'C1', outcome: 'second', prompt: 'p3' },
  ]
  assert.deepEqual(pickRepeatAnswers(a).map((x) => x.prompt), ['p2', 'p3'])
})

test('Speichern und Laden ergibt denselben Stand', () => {
  let s = initialState('Slinky')
  s = finishRound(s, runde('first'), MO).state
  s.testDate = '2026-12-01'
  assert.deepEqual(parseState(serializeState(s)), s)
})

test('Fehlerhafte oder fremde Daten werden abgelehnt', () => {
  assert.equal(parseState('kein json'), null)
  assert.equal(parseState('null'), null)
  assert.equal(parseState('{"version":2,"name":"x","totalFood":1,"lastFedAt":null}'), null)
  assert.equal(parseState('{"version":1,"name":"x","totalFood":-5,"lastFedAt":null}'), null)
  assert.equal(parseState('{"version":1,"name":"x","totalFood":1,"lastFedAt":"gestern"}'), null)
})

test('Beschädigte Teile werden bereinigt statt übernommen', () => {
  const s = parseState('{"version":1,"name":"x","totalFood":10,"lastFedAt":null,"skill":{"A1":99,"A2":-4,"B1":"x"},"testDate":"morgen"}')
  assert.ok(s)
  assert.equal(s.skill.A1, 3)
  assert.equal(s.skill.A2, 0)
  assert.equal(s.skill.B1, 0)
  assert.equal(s.testDate, null)
})
