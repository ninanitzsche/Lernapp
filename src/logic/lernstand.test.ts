import { test } from 'node:test'
import assert from 'node:assert/strict'
import { empfehlung, erreichteStufe, rundenProWoche, tageBisTest, themaBereitschaft, trend, typEinschaetzung } from './lernstand.ts'
import { leererVerlauf } from './game.ts'
import type { Versuch } from './game.ts'
import type { Stufe } from './tasks.ts'

const v = (o: Versuch['o'], s: Stufe = 2): Versuch => ({ o, s })
const mehrfach = (n: number, x: Versuch): Versuch[] => Array.from({ length: n }, () => x)

test('Unter fünf Versuchen gibt es kein Urteil', () => {
  assert.equal(typEinschaetzung(mehrfach(4, v('first'))), 'wenig')
  assert.equal(typEinschaetzung(mehrfach(5, v('first'))), 'sicher')
})

test('Sicher: mindestens 80 Prozent gleich richtig und mindestens drei mittlere oder kniffelige Versuche', () => {
  // genau 80 Prozent (8 von 10)
  assert.equal(typEinschaetzung([...mehrfach(8, v('first')), v('second'), v('second')]), 'sicher')
  // 70 Prozent: nicht sicher
  assert.equal(typEinschaetzung([...mehrfach(7, v('first')), ...mehrfach(3, v('second'))]), 'fast')
  // nur leichte Versuche: höchstens fast
  assert.equal(typEinschaetzung(mehrfach(10, v('first', 1))), 'fast')
  // genau drei mittlere unter zehn zählt
  assert.equal(typEinschaetzung([...mehrfach(7, v('first', 1)), ...mehrfach(3, v('first', 2))]), 'sicher')
  assert.equal(typEinschaetzung([...mehrfach(8, v('first', 1)), ...mehrfach(2, v('first', 2))]), 'fast')
})

test('Noch üben: unter 50 Prozent gleich richtig oder mehr als 20 Prozent ganz falsch', () => {
  assert.equal(typEinschaetzung([...mehrfach(4, v('first')), ...mehrfach(6, v('second'))]), 'ueben') // 40 Prozent
  assert.equal(typEinschaetzung([...mehrfach(5, v('first')), ...mehrfach(5, v('second'))]), 'fast') // genau 50 Prozent
  assert.equal(typEinschaetzung([...mehrfach(7, v('first')), ...mehrfach(3, v('failed'))]), 'ueben') // 30 Prozent falsch
  assert.equal(typEinschaetzung([...mehrfach(7, v('first')), v('second'), v('second'), v('failed')]), 'fast') // 10 Prozent falsch
  assert.equal(typEinschaetzung([...mehrfach(6, v('first')), ...mehrfach(2, v('second')), ...mehrfach(2, v('failed'))]), 'fast') // genau 20 Prozent falsch
})

test('Es zählen nur die letzten zehn Versuche', () => {
  assert.equal(typEinschaetzung([...mehrfach(10, v('failed')), ...mehrfach(10, v('first'))]), 'sicher')
})

test('Trend nur ab zehn Versuchen, letzte fünf gegen die fünf davor', () => {
  assert.equal(trend(mehrfach(9, v('first'))), null)
  assert.equal(trend([...mehrfach(5, v('failed')), ...mehrfach(5, v('first'))]), 'besser')
  assert.equal(trend([...mehrfach(5, v('first')), ...mehrfach(5, v('failed'))]), 'schwaecher')
  assert.equal(trend(mehrfach(10, v('first'))), 'gleich')
})

test('Erreichte Stufe: mindestens zwei gleich richtige auf dieser Stufe', () => {
  assert.equal(erreichteStufe([]), 0)
  assert.equal(erreichteStufe([v('first', 1), v('first', 1)]), 1)
  assert.equal(erreichteStufe([v('first', 1), v('first', 1), v('first', 2), v('second', 2)]), 1)
  assert.equal(erreichteStufe([v('first', 2), v('first', 2), v('first', 3)]), 2)
  assert.equal(erreichteStufe([v('first', 3), v('first', 3)]), 3)
})

test('Bereitschaft je Thema: der schwächste Typ entscheidet', () => {
  const verlauf = leererVerlauf()
  assert.equal(themaBereitschaft(verlauf, 'A'), 'offen')
  for (const t of ['A1', 'A2', 'A3'] as const) verlauf[t] = mehrfach(10, v('first'))
  assert.equal(themaBereitschaft(verlauf, 'A'), 'bereit')
  verlauf.A3 = mehrfach(10, v('first', 1))
  assert.equal(themaBereitschaft(verlauf, 'A'), 'fast')
  verlauf.A2 = mehrfach(10, v('failed'))
  assert.equal(themaBereitschaft(verlauf, 'A'), 'ueben')
  verlauf.B1 = mehrfach(10, v('failed'))
  assert.equal(themaBereitschaft(verlauf, 'B'), 'ueben', 'üben schlägt fehlende Daten')
})

test('Empfehlung: ohne Daten rät sie zum Üben, sonst der schwächste Typ mit Tipp', () => {
  const verlauf = leererVerlauf()
  assert.equal(empfehlung(verlauf, 'Nele').typ, null)
  assert.match(empfehlung(verlauf, 'Nele').text, /Runden/)
  verlauf.C4 = [...mehrfach(5, v('first')), ...mehrfach(5, v('failed'))]
  verlauf.A1 = mehrfach(10, v('first'))
  const e = empfehlung(verlauf, 'Nele')
  assert.equal(e.typ, 'C4')
  assert.match(e.text, /Nachbarzehner/)
  assert.match(e.text, /Tipp/)
})

test('Empfehlung: bei Gleichstand, wenn alles sicher ist kommt keine Übung', () => {
  const verlauf = leererVerlauf()
  verlauf.A1 = [...mehrfach(5, v('first')), ...mehrfach(5, v('failed'))]
  verlauf.A2 = [...mehrfach(5, v('first')), ...mehrfach(5, v('failed'))]
  verlauf.A3 = [...mehrfach(3, v('first')), ...mehrfach(5, v('failed'))]
  assert.equal(empfehlung(verlauf, 'N').typ, 'A3', 'A3 hat die schlechteste Quote')
  verlauf.A3 = []
  verlauf.A2 = [...mehrfach(5, v('first')), ...mehrfach(5, v('failed')), ...mehrfach(0, v('first'))].slice(0, 10)
  verlauf.A1 = [...mehrfach(5, v('first')), ...mehrfach(5, v('failed'))]
  assert.equal(empfehlung(verlauf, 'N').typ, 'A1', 'bei völligem Gleichstand gewinnt der erste')
  const sicher = leererVerlauf()
  sicher.A1 = mehrfach(10, v('first'))
  assert.equal(empfehlung(sicher, 'N').typ, null)
  assert.match(empfehlung(sicher, 'N').text, /sicher/)
})

test('Runden der letzten vier Wochen, Montag bis Sonntag', () => {
  const jetzt = new Date(2026, 10, 25) // Mittwoch, Woche ab 23.11.
  const runden = { '2026-11-23': 2, '2026-11-24': 1, '2026-11-22': 4, '2026-11-16': 1, '2026-11-02': 3, '2026-10-25': 9 }
  assert.deepEqual(rundenProWoche(runden, jetzt, 4), [3, 0, 5, 3])
})

test('Tage bis zum Test', () => {
  const jetzt = new Date(2026, 10, 22, 21, 30)
  assert.equal(tageBisTest(null, jetzt), null)
  assert.equal(tageBisTest('2026-11-24', jetzt), 2)
  assert.equal(tageBisTest('2026-11-22', jetzt), 0)
  assert.equal(tageBisTest('2026-11-20', jetzt), -2)
})
