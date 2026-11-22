import test from 'node:test'
import assert from 'node:assert/strict'
import { createRng } from './rng.ts'
import { generateTask, TASK_TYPES } from './tasks.ts'
import type { Task } from './tasks.ts'
import type { RoundAnswer } from './game.ts'
import { futterBisJetzt, naechsterSchritt, parseRunde, serializeRunde } from './runde.ts'
import type { RundenStand } from './runde.ts'

function zehnAufgaben(): Task[] {
  const rng = createRng(7)
  return Array.from({ length: 10 }, (_, i) => generateTask(TASK_TYPES[i % TASK_TYPES.length], rng))
}

const antwort = (outcome: RoundAnswer['outcome'], isRepeat = false): RoundAnswer => ({ type: 'A1', outcome, isRepeat, prompt: 'x' })

function stand(index: number, antworten: RoundAnswer[]): RundenStand {
  return { version: 1, name: 'Nele', quelle: 'mix', schwer: false, seed: 42, aufgaben: zehnAufgaben(), index, antworten, wiederholungenGeplant: false }
}

test('Speichern und Laden ergibt denselben Rundenstand', () => {
  const s = stand(2, [antwort('first'), antwort('second')])
  const neu = parseRunde(serializeRunde(s), 'Nele')
  assert.deepEqual(neu, { ...s, topic: undefined })
})

test('Rundenstand eines anderen Spielers oder kaputte Daten werden abgelehnt', () => {
  const text = serializeRunde(stand(1, [antwort('first')]))
  assert.equal(parseRunde(text, 'Anna'), null)
  assert.equal(parseRunde('kein json', 'Nele'), null)
  assert.equal(parseRunde('{"version":2}', 'Nele'), null)
})

test('Rundenstand mit falscher Zahl an Antworten wird abgelehnt (sonst zählt Futter doppelt)', () => {
  assert.equal(parseRunde(serializeRunde(stand(3, [antwort('first')])), 'Nele'), null)
})

test('Rundenstand mit Index außerhalb der Aufgaben wird abgelehnt', () => {
  const s = stand(10, Array.from({ length: 10 }, () => antwort('first')))
  assert.equal(parseRunde(serializeRunde(s), 'Nele'), null)
})

test('Nächster Schritt: weiter bis zur zehnten Aufgabe, danach Ende ohne Fehler', () => {
  const s = stand(4, Array.from({ length: 5 }, () => antwort('first')))
  const n = naechsterSchritt(s)
  assert.equal(n?.index, 5)
  const ende = naechsterSchritt({ ...s, index: 9, antworten: Array.from({ length: 10 }, () => antwort('first')) })
  assert.equal(ende, null)
})

test('Nächster Schritt: Fehler kommen einmalig als Wiederholung zurück, höchstens drei', () => {
  const antworten = Array.from({ length: 10 }, (_, i) => antwort(i < 5 ? 'failed' : 'first'))
  const s = { ...stand(9, antworten), antworten }
  const n = naechsterSchritt(s)
  assert.ok(n)
  assert.equal(n.aufgaben.length, 13)
  assert.equal(n.index, 10)
  assert.equal(n.wiederholungenGeplant, true)
  // Danach geht es nach den Wiederholungen zu Ende
  const spaeter = naechsterSchritt({ ...s, aufgaben: n.aufgaben, index: 12, wiederholungenGeplant: true, antworten: [...antworten, antwort('first', true), antwort('first', true), antwort('first', true)] })
  assert.equal(spaeter, null)
})

test('Nach Pause und Weitermachen kommen dieselben Wiederholungen wie ohne Pause', () => {
  const neun = Array.from({ length: 9 }, () => antwort('failed'))
  const original = stand(9, neun)
  const geladen = parseRunde(serializeRunde(original), 'Nele')
  assert.ok(geladen)
  const zehn = [...neun, antwort('failed')]
  const ohnePause = naechsterSchritt({ ...original, antworten: zehn })
  const mitPause = naechsterSchritt({ ...geladen, antworten: zehn })
  assert.deepEqual(mitPause?.aufgaben.map((x) => x.prompt), ohnePause?.aufgaben.map((x) => x.prompt))
})

test('Futter bis jetzt: erster Versuch 2, zweiter 1, falsch 0, Wiederholungen zählen nicht', () => {
  assert.equal(futterBisJetzt([antwort('first'), antwort('second'), antwort('failed'), antwort('first', true)]), 3)
})
