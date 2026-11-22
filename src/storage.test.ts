import test from 'node:test'
import assert from 'node:assert/strict'
import { sicherungFaellig } from './storage.ts'

const JETZT = new Date(2026, 10, 30, 12)
const vorTagen = (n: number) => new Date(JETZT.getTime() - n * 86_400_000)

test('Keine Erinnerung, solange kaum etwas zu sichern ist', () => {
  assert.equal(sicherungFaellig(2, null, JETZT), false)
})

test('Erinnerung, wenn es Fortschritt gibt und nie gesichert wurde', () => {
  assert.equal(sicherungFaellig(3, null, JETZT), true)
})

test('Erinnerung erst nach 14 Tagen seit der letzten Sicherung', () => {
  assert.equal(sicherungFaellig(10, vorTagen(13), JETZT), false)
  assert.equal(sicherungFaellig(10, vorTagen(14), JETZT), true)
})
