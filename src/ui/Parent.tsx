import { useMemo, useState } from 'react'
import { TOPIC_NAMES, TOPICS, TASK_TYPES, TOPIC_OF, TYPE_NAMES } from '../logic/tasks.ts'
import { TRANSPARENZPAPIER } from '../logic/coverage.ts'
import { parseState, serializeState, topicStars } from '../logic/game.ts'
import type { GameState } from '../logic/game.ts'
import { createRng, int } from '../logic/rng.ts'
import { merkeSicherung } from '../storage.ts'
import { Info } from './Info.tsx'

interface Props {
  state: GameState
  onChange: (s: GameState) => void
  onReset: () => void
  onClose: () => void
}

export function Parent({ state, onChange, onReset, onClose }: Props) {
  const aufgabe = useMemo(() => {
    const rng = createRng(Date.now() % 100000)
    return { a: int(rng, 3, 9), b: int(rng, 4, 9) }
  }, [])
  const [antwort, setAntwort] = useState('')
  const [frei, setFrei] = useState(false)
  const [meldung, setMeldung] = useState('')

  if (!frei) {
    return (
      <main className="eltern">
        <h1>Bereich für Erwachsene</h1>
        <p>Bitte löse zum Öffnen: {aufgabe.a} mal {aufgabe.b}</p>
        <form className="eingabe" onSubmit={(e) => { e.preventDefault(); setFrei(Number(antwort) === aufgabe.a * aufgabe.b) }}>
          <input className="zahlfeld" inputMode="numeric" value={antwort} onChange={(e) => setAntwort(e.target.value)} aria-label="Ergebnis" />
          <button className="knopf" type="submit">Öffnen</button>
        </form>
        <button className="knopf klein" type="button" onClick={onClose}>Zurück</button>
      </main>
    )
  }

  function exportieren() {
    const blob = new Blob([serializeState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mathe-schlange-${state.name}.json`
    a.click()
    URL.revokeObjectURL(url)
    merkeSicherung()
    setMeldung('Stand gesichert. Die Datei liegt in den Downloads.')
  }

  async function importieren(datei: File | undefined) {
    if (!datei) return
    const neu = parseState(await datei.text())
    if (neu) { onChange(neu); setMeldung('Stand geladen.') } else setMeldung('Diese Datei ist kein gültiger Stand.')
  }

  const tageBisTest = state.testDate
    ? Math.ceil((new Date(`${state.testDate}T00:00:00`).getTime() - Date.now()) / 86_400_000)
    : null

  return (
    <main className="eltern">
      <h1>Bereich für Erwachsene</h1>
      <button className="knopf klein" type="button" onClick={onClose}>Zurück zur Schlange</button>

      <h2>Lernstand zum Transparenzpapier</h2>
      <table className="tabelle">
        <thead><tr><th>Lernziel</th><th>Aufgabentypen und Stufe (0 bis 3)</th></tr></thead>
        <tbody>
          {TRANSPARENZPAPIER.map((p) => (
            <tr key={p.text}>
              <td>{p.text}</td>
              <td>{p.types.map((t) => `${TYPE_NAMES[t]}: ${state.skill[t]}`).join('; ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {TOPICS.map((t) => `${TOPIC_NAMES[t]}: ${topicStars(state.skill, t)} von 3 Sternen`).join(' | ')}
      </p>
      <p>Abgeschlossene Runden insgesamt: {Object.values(state.rounds).reduce((s, n) => s + n, 0)} | Futter gesamt: {state.totalFood}</p>
      <p className="klein-text">Aufgabentypen: {TASK_TYPES.map((t) => `${t} (${TOPIC_OF[t]})`).join(', ')}</p>

      <h2>Testdatum</h2>
      <label className="feld">Datum des Tests
        <input type="date" value={state.testDate ?? ''} onChange={(e) => onChange({ ...state, testDate: e.target.value || null })} />
      </label>
      {tageBisTest !== null && <p>{tageBisTest >= 0 ? `Noch ${tageBisTest} Tage bis zum Test.` : 'Das Testdatum liegt in der Vergangenheit.'}</p>}

      <h2>Name der Schlange</h2>
      <input className="textfeld" maxLength={20} value={state.name} onChange={(e) => onChange({ ...state, name: e.target.value })} aria-label="Name der Schlange" />

      <h2>Sichern und Laden</h2>
      <Info titel="Warum sichern?">      
        Der Spielstand liegt nur in diesem Browser. Safari löscht gespeicherte Daten einer Website, wenn sie sieben Tage lang nicht
        benutzt wird (WebKit, ITP). Als App auf dem Home-Bildschirm gilt diese Regel nicht in gleicher Weise. Tipp: In Safari auf
        "Teilen" und dann "Zum Home-Bildschirm" tippen und dort öffnen. Sichere den Stand zusätzlich ab und zu als Datei.
      </Info>
      <div className="zeile">
        <button className="knopf klein" type="button" onClick={exportieren}>Stand sichern (Datei)</button>
        <label className="knopf klein">Stand laden
          <input type="file" accept="application/json" hidden onChange={(e) => importieren(e.target.files?.[0])} />
        </label>
      </div>
      {meldung && <p role="status">{meldung}</p>}

      <h2>Neu anfangen</h2>
      <p>Setzt alles auf Anfang. Sichere vorher den Stand.</p>
      <button className="knopf klein gefahr" type="button" onClick={() => { if (window.confirm('Wirklich alles zurücksetzen?')) onReset() }}>
        Alles zurücksetzen
      </button>
    </main>
  )
}
