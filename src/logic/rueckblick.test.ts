import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bauKarten, rueckblickZeilen, titelVon } from './rueckblick.ts'
import type { Meilenstein, MeilensteinArt } from './meilensteine.ts'

const rb = { runden: 10, tage: 6, aufgaben: 87, quote: 0.724, staerkstesThema: 'C' as const }
const m = (id: string, art: MeilensteinArt, muenzen = 1): Meilenstein => ({ id, art, datum: '2026-11-22', rueckblick: rb, muenzen })

test('Rückblick: höchstens drei Zeilen, aus den Daten, ohne erfundene Werte', () => {
  const z = rueckblickZeilen(rb)
  assert.equal(z.length, 3)
  assert.equal(z[0], '87 Aufgaben gelöst an 6 Tagen.')
  assert.equal(z[1], '72 von 100 gleich beim ersten Mal richtig.')
  assert.equal(z[2], 'Am stärksten: Zahlenstrahl.')
  assert.deepEqual(rueckblickZeilen({ runden: 0, tage: 0, aufgaben: 0, quote: 0, staerkstesThema: null }), [])
  assert.equal(rueckblickZeilen({ ...rb, aufgaben: 1, tage: 1 })[0], '1 Aufgabe gelöst an 1 Tag.')
})

test('Titel in Klartext', () => {
  assert.equal(titelVon(m('runden-10', 'runden'), 'Slinky'), '10 Runden geschafft')
  assert.equal(titelVon(m('entwicklung-2', 'entwicklung'), 'Slinky'), 'Slinky ist gewachsen: Kleinkind')
  assert.equal(titelVon(m('stern-B-1', 'stern'), 'S'), '1 Stern bei Zahlbilder')
  assert.equal(titelVon(m('stern-A-3', 'stern'), 'S'), '3 Sterne bei Zehner und Einer')
  assert.equal(titelVon(m('knobel-erste', 'knobel'), 'S'), 'Erste starke Knobelrunde')
  assert.equal(titelVon(m('knobel-25', 'knobel'), 'S'), '25 Knobelaufgaben gleich richtig')
  assert.equal(titelVon(m('woche-2026-11-23', 'woche'), 'S'), 'Wochenziel geschafft')
})

test('Bis zu drei Meilensteine: je eine Karte, nummeriert; bei mehr eine gemeinsame Karte', () => {
  const drei = bauKarten([m('entwicklung-2', 'entwicklung'), m('runden-10', 'runden', 1), m('stern-A-1', 'stern')], 'S', 4)
  assert.equal(drei.length, 3)
  assert.deepEqual(drei.map((k) => k.nummer), [5, 6, 7])
  const vier = bauKarten([m('entwicklung-2', 'entwicklung'), m('runden-10', 'runden', 1), m('stern-A-1', 'stern'), m('woche-x', 'woche')], 'S', 0)
  assert.equal(vier.length, 1)
  assert.equal(vier[0].liste.length, 4)
  assert.equal(vier[0].muenzen, 4)
  assert.deepEqual(bauKarten([], 'S', 0), [])
})
