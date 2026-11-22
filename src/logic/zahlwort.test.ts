import { test } from 'node:test'
import assert from 'node:assert/strict'
import { zahlZuWort, wortZuZahl, zahlwortTeile } from './zahlwort.ts'

test('Referenzliste von Nina: 1 bis 10', () => {
  const erwartet = ['eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn']
  erwartet.forEach((w, i) => assert.equal(zahlZuWort(i + 1), w))
})

test('Referenzliste von Nina: 11 bis 19', () => {
  const erwartet = ['elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn']
  erwartet.forEach((w, i) => assert.equal(zahlZuWort(i + 11), w))
})

test('Referenzliste von Nina: Zehnerzahlen mit ß und hundert', () => {
  const erwartet = ['zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig', 'hundert']
  erwartet.forEach((w, i) => assert.equal(zahlZuWort((i + 2) * 10 === 110 ? 100 : (i + 2) * 10), w))
})

test('Gemischte Zahlen: ein statt eins, Einer vor Zehner', () => {
  assert.equal(zahlZuWort(21), 'einundzwanzig')
  assert.equal(zahlZuWort(53), 'dreiundfünfzig')
  assert.equal(zahlZuWort(99), 'neunundneunzig')
  assert.equal(zahlZuWort(81), 'einundachtzig')
  assert.equal(zahlZuWort(37), 'siebenunddreißig')
  assert.equal(zahlZuWort(76), 'sechsundsiebzig')
})

test('Wortkarten sind dreiteilig: Einer, und, Zehner', () => {
  assert.deepEqual(zahlwortTeile(37), ['sieben', 'und', 'dreißig'])
  assert.deepEqual(zahlwortTeile(21), ['ein', 'und', 'zwanzig'])
  assert.deepEqual(zahlwortTeile(74), ['vier', 'und', 'siebzig'])
  assert.throws(() => zahlwortTeile(30))
  assert.throws(() => zahlwortTeile(15))
})

test('Umkehrung ist für alle Zahlen 0 bis 100 eindeutig', () => {
  const gesehen = new Set<string>()
  for (let n = 0; n <= 100; n++) {
    const wort = zahlZuWort(n)
    assert.ok(!gesehen.has(wort), `Wort doppelt: ${wort}`)
    gesehen.add(wort)
    assert.equal(wortZuZahl(wort), n)
  }
})

test('Eingabe tolerant gegenüber Groß/Klein, Leerzeichen und dreissig', () => {
  assert.equal(wortZuZahl('  Dreissig '), 30)
  assert.equal(wortZuZahl('EINUNDZWANZIG'), 21)
  assert.equal(wortZuZahl('quatsch'), null)
})

test('Ungültige Zahlen werfen einen Fehler', () => {
  assert.throws(() => zahlZuWort(-1))
  assert.throws(() => zahlZuWort(101))
  assert.throws(() => zahlZuWort(2.5))
})
