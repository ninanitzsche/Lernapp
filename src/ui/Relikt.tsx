import { useMemo, useState } from 'react'
import { checkAnswer } from '../logic/tasks.ts'
import type { Response, TaskType } from '../logic/tasks.ts'
import { TOPIC_NAMES } from '../logic/tasks.ts'
import { CONFIG } from '../logic/config.ts'
import { dayKey } from '../logic/game.ts'
import type { GameState } from '../logic/game.ts'
import { baueReliktAufgaben, freigeschalteteRelikte, reliktAbschliessen } from '../logic/relikte.ts'
import type { Relikt as ReliktTyp } from '../logic/relikte.ts'
import { TaskView } from './TaskView.tsx'
import { LoesungsBild } from './Visuals.tsx'
import { Schuppen } from './Schuppen.tsx'
import { klang } from './klang.ts'

interface Props {
  state: GameState
  onChange: (s: GameState) => void
  onClose: () => void
}

/**
 * Relikte: freiwillige Expertenaufgaben zu schon gelernten Inhalten. Nur sichtbar, wenn ein Lernfeld abgeschlossen ist.
 * Beim ersten Erfolg gibt es Münzen. Sterne, Lernstand und Futter ändern sich nie.
 */
export function Reliktbereich({ state, onChange, onClose }: Props) {
  const relikte = freigeschalteteRelikte(state)
  const [aktiv, setAktiv] = useState<ReliktTyp | null>(null)

  if (aktiv) {
    return (
      <Reliktlauf
        key={aktiv.id} relikt={aktiv} state={state}
        onFertig={(neu) => { if (neu) onChange(neu) }}
        onZurueck={() => setAktiv(null)}
      />
    )
  }

  const felder = [...new Set(relikte.map((r) => r.topic))]
  return (
    <main className="start">
      <header className="seitenkopf">
        <button className="knopf klein" type="button" onClick={onClose} aria-label="Zurück"><span aria-hidden="true">←</span> Zurück</button>
        <h2>Relikte</h2>
      </header>
      <p className="klein-text">
        Relikte sind freiwillige Expertenaufgaben. Beim ersten Erfolg gibt es {CONFIG.reliktMuenzen} Münzen. Deine Sterne ändern sich dabei nicht.
      </p>
      {felder.map((topic) => (
        <section key={topic} className="relikt-feld" aria-label={TOPIC_NAMES[topic]}>
          <h3>{TOPIC_NAMES[topic]}</h3>
          <ul className="relikte">
            {relikte.filter((r) => r.topic === topic).map((r) => {
              const erledigt = state.reliktErfolge.includes(r.id)
              return (
                <li key={r.id}>
                  <button className="knopf relikt-knopf" type="button" onClick={() => setAktiv(r)}>
                    <span aria-hidden="true">{erledigt ? '✔' : '🗝️'}</span> {r.name}
                    <span className="sr-only">{erledigt ? ', schon geschafft' : ', noch offen'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}

function Reliktlauf({ relikt, state, onFertig, onZurueck }: { relikt: ReliktTyp; state: GameState; onFertig: (neu: GameState | null) => void; onZurueck: () => void }) {
  const aufgaben = useMemo(() => baueReliktAufgaben(relikt.id as TaskType, Date.now() % 2_147_483_647), [relikt.id])
  const [index, setIndex] = useState(0)
  const [treffer, setTreffer] = useState(0)
  const [richtig, setRichtig] = useState<boolean | null>(null)
  const [ende, setEnde] = useState<{ geschafft: boolean; muenzen: number; erstmals: boolean } | null>(null)
  const task = aufgaben[index]

  function abgeben(antwort: Response) {
    const ok = checkAnswer(task, antwort)
    setRichtig(ok)
    if (ok) { setTreffer(treffer + 1); klang('richtig') } else klang('bah', 0.5)
  }

  function weiter() {
    if (index + 1 < aufgaben.length) { setIndex(index + 1); setRichtig(null); return }
    const r = reliktAbschliessen(state, relikt.id, treffer, dayKey(new Date()))
    setEnde({ geschafft: r.geschafft, muenzen: r.muenzen, erstmals: r.erstmals })
    onFertig(r.erstmals ? r.state : null)
  }

  if (ende) {
    return (
      <main className="start">
        <h2>{ende.geschafft ? 'Relikt geschafft!' : 'Fast!'}</h2>
        <p className="ergebnis-text">{treffer} von {aufgaben.length} gleich richtig.</p>
        {ende.erstmals && <p className="feier"><span aria-hidden="true">🪙</span> +{ende.muenzen} Münzen!</p>}
        {ende.geschafft && !ende.erstmals && <p className="klein-text">Dieses Relikt hast du schon gefunden. Noch einmal üben macht Spaß, bringt aber keine weiteren Münzen.</p>}
        {!ende.geschafft && <p className="klein-text">Du brauchst {CONFIG.reliktMinTreffer} richtige Antworten gleich beim ersten Mal. Probier es gern noch einmal.</p>}
        <button className="knopf gross hauptknopf" type="button" autoFocus onClick={onZurueck}>Zurück zu den Relikten</button>
      </main>
    )
  }

  return (
    <main className="runde">
      <header className="runde-kopf">
        <button className="knopf klein" type="button" onClick={onZurueck}>← Zurück</button>
        <p className="thema">Relikt: {relikt.name} <Schuppen stufe={3} mitWort /></p>
      </header>
      <p className="klein-text">Aufgabe {index + 1} von {aufgaben.length}. Du hast nur einen Versuch.</p>
      {richtig === null ? (
        <TaskView key={index} task={task} attempt={1} onSubmit={abgeben} />
      ) : (
        <div className="rueckmeldung" role="status">
          {richtig ? <p className="rueckmeldung-titel">Richtig!</p> : (
            <>
              <p className="rueckmeldung-titel">Das schauen wir uns an.</p>
              <LoesungsBild task={task} />
              <p>{task.solution}</p>
            </>
          )}
          <button className="knopf gross" type="button" onClick={weiter} autoFocus>{index + 1 < aufgaben.length ? 'Weiter' : 'Fertig'}</button>
        </div>
      )}
    </main>
  )
}
