import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const cssUrl = new URL('../index.css', import.meta.url)
const css = readFileSync(cssUrl, 'utf8')
const viteConfig = readFileSync(new URL('../../vite.config.ts', import.meta.url), 'utf8')

test('Design-Tokens sind innerhalb der Root-Ebene eindeutig und werden verwendet', () => {
  const rootBlocks = [...css.matchAll(/:root\s*\{([^}]*)\}/g)]
  const declarations = rootBlocks.flatMap(([, block]) => [...block.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name))
  const duplicates = declarations.filter((name, index) => declarations.indexOf(name) !== index)
  assert.deepEqual([...new Set(duplicates)], [], 'Ein Design-Token darf nicht mehrfach in :root deklariert werden')

  const unused = declarations.filter((name) => !css.includes('var(' + name + ')'))
  assert.deepEqual(unused, [], 'Jedes Root-Token muss mindestens einmal in einer Komponente verwendet werden')
})

test('Alle CSS-Variablen sind definiert oder explizit inline gesetzt', () => {
  const declared = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name))
  const referenced = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name))
  const inlineOnly = new Set(['--x', '--dreh'])
  const missing = [...referenced].filter((name) => !declared.has(name) && !inlineOnly.has(name))
  assert.deepEqual(missing, [], 'Jede CSS-Variable muss definiert sein')
})

test('Die freigegebenen Schriften liegen lokal als WOFF2 vor', () => {
  const files = [
    'AtkinsonHyperlegibleNext-Latin-400.woff2',
    'AtkinsonHyperlegibleNext-LatinExt-400.woff2',
    'AtkinsonHyperlegibleNext-Latin-700.woff2',
    'AtkinsonHyperlegibleNext-LatinExt-700.woff2',
    'Nunito-Latin-Variable.woff2',
    'Nunito-LatinExt-Variable.woff2',
  ]
  for (const file of files) {
    const url = new URL('../../public/fonts/' + file, import.meta.url)
    assert.equal(existsSync(url), true, file + ' fehlt')
    assert.equal(readFileSync(url).subarray(0, 4).toString('ascii'), 'wOF2', file + ' ist keine gültige WOFF2-Datei')
    assert.ok(css.includes(file), file + ' wird nicht im Stylesheet referenziert')
  }
})

test('Bedienbarkeit, reduzierte Bewegung und Deployment-Pfade sind zentral abgesichert', () => {
  assert.match(css, /--touch-target:\s*48px/)
  assert.match(css, /:focus-visible/)
  assert.match(css, /prefers-reduced-motion:\s*reduce/)
  assert.match(css, /touch-action:\s*manipulation/)
  assert.match(viteConfig, /base:\s*['"]\.\/['"]/)
})
