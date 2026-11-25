import { useMemo, useState } from 'react'
import { TOPIC_NAMES, TOPICS, TASK_TYPES, TYPE_NAMES } from '../logic/tasks.ts'
import { TRANSPARENZPAPIER } from '../logic/coverage.ts'
import { parseState, serializeState } from '../logic/game.ts'
import { MAX_STERNE } from '../logic/kompetenz.ts'
import type { GameState } from '../logic/game.ts'
import { createRng, int } from '../logic/rng.ts'
import { merkeSicherung } from '../storage.ts'
import { Info } from './Info.tsx'
import { Schuppen } from './Schuppen.tsx'
import { titelVon } from '../logic/rueckblick.ts'
import {
  BEREITSCHAFT_TEXT, EINSCHAETZUNG_TEXT, TREND_TEXT, empfehlung, erreichteStufe, tageBisTest, themaBereitschaft, trend, typEinschaetzung,
} from '../logic/lernstand.ts'
import type { Bereitschaft, Einschaetzung } from '../logic/lernstand.ts'

/** Symbol und Wort tragen die Aussage, Farbe ist nur Zugabe. */
const EINSCHAETZUNG_SYMBOL: Record<Einschaetzung, string> = { sicher: '✔', fast: '◐', ueben: '▲', wenig: '–' }
const BEREITSCHAFT_SYMBOL: Record<Bereitschaft, string> = { bereit: '✔', fast: '◐', ueben: '▲', offen: '–' }

function datumLesbar(d: string): string {
  const [y, m, t] = d.split('-')
  return `${t}.${m}.${y}`
}


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

  const jetzt = new Date()
  const tageBis = tageBisTest(state.testDate, jetzt)
  const rat = empfehlung(state.verlauf, state.name)

  return (
    <main className="eltern">
      <h1>Bereich für Erwachsene</h1>
      <button className="knopf klein" type="button" onClick={onClose}>Zurück zur Schlange</button>

      <h2>Das hilft jetzt</h2>
      <p className="eltern-rat">{rat.text}</p>

      <h2>Testbereitschaft</h2>
      <p className="klein-text">Das ist eine Schätzung aus den Daten der App und kein Testergebnis. Buch und Arbeitsheft bleiben maßgeblich.</p>
      {tageBis !== null && <p>{tageBis > 0 ? `Der Test ist in ${tageBis} ${tageBis === 1 ? 'Tag' : 'Tagen'}.` : tageBis === 0 ? 'Der Test ist heute.' : 'Das Testdatum liegt in der Vergangenheit.'}</p>}
      <ul className="bereitschaft">
        {TOPICS.map((t) => {
          const b = themaBereitschaft(state.verlauf, t)
          return (
            <li key={t} className={`ampel ${b}`}>
              <span>{TOPIC_NAMES[t]}</span>
              <strong><span aria-hidden="true">{BEREITSCHAFT_SYMBOL[b]}</span> {BEREITSCHAFT_TEXT[b]}</strong>
            </li>
          )
        })}
      </ul>

      <h2>Aufgabentypen</h2>
      <table className="tabelle">
        <thead><tr><th>Aufgabentyp</th><th>Zuletzt sicher auf</th><th>Einschätzung</th><th>Verlauf</th></tr></thead>
        <tbody>
          {TASK_TYPES.map((t) => {
            const e = typEinschaetzung(state.verlauf[t])
            const st = erreichteStufe(state.verlauf[t])
            const tr = trend(state.verlauf[t])
            return (
              <tr key={t}>
                <td>{TYPE_NAMES[t]}</td>
                <td>{st === 0 ? 'noch keine' : <Schuppen stufe={st} mitWort />}</td>
                <td className={`ampel ${e}`}><span aria-hidden="true">{EINSCHAETZUNG_SYMBOL[e]}</span> {EINSCHAETZUNG_TEXT[e]}</td>
                <td>{tr ? TREND_TEXT[tr] : 'noch offen'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="klein-text">Grundlage sind die letzten zehn Versuche je Typ, mindestens fünf sind nötig. Für "sicher" müssen mindestens 8 von 10 gleich richtig sein und mindestens 3 davon auf mittlerer oder kniffliger Stufe.</p>

      <h2>Meilensteine</h2>
      {state.meilensteine.length === 0 ? <p>Noch keine.</p> : (
        <ul className="meilensteine">
          {[...state.meilensteine].reverse().map((m) => <li key={m.id}>{titelVon(m, state.name)} <span className="klein-text">({datumLesbar(m.datum)})</span></li>)}
        </ul>
      )}

      <h2>Lernstand zum Transparenzpapier</h2>
      <table className="tabelle">
        <thead><tr><th>Lernziel</th><th>Aufgabentypen und Lernstand (0 bis 3)</th></tr></thead>
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
        {TOPICS.map((t) => `${TOPIC_NAMES[t]}: ${state.sterneErreicht[t]} von ${MAX_STERNE} Sternen`).join(' | ')}
      </p>
      <p>Abgeschlossene Runden insgesamt: {Object.values(state.rounds).reduce((s, n) => s + n, 0)} | Futter gesamt: {state.totalFood}</p>

      <h2>Testdatum</h2>
      <label className="feld">Datum des Tests
        <input type="date" value={state.testDate ?? ''} onChange={(e) => onChange({ ...state, testDate: e.target.value || null })} />
      </label>

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
