import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { checkAnswer, generateTask, TYPE_NAMES } from '../logic/tasks.ts'
import type { Response, Task, Topic } from '../logic/tasks.ts'
import { CONFIG } from '../logic/config.ts'
import { createRng } from '../logic/rng.ts'
import { bookTaskFor, taskKey } from '../logic/bookTasks.ts'
import { dayKey, foodForOutcome, selectTypes, stageFor } from '../logic/game.ts'
import { futterBisJetzt, naechsterSchritt } from '../logic/runde.ts'
import type { RundenStand } from '../logic/runde.ts'
import { loescheRunde, speichereRunde } from '../storage.ts'
import type { GameState, Outcome, RoundAnswer } from '../logic/game.ts'
import { TaskView } from './TaskView.tsx'
import { LoesungsBild } from './Visuals.tsx'
import { RundenSchlange, anteilFuer } from './Snake.tsx'
import { TonKnopf } from './TonKnopf.tsx'
import { Muenzen } from './Shop.tsx'
import { kontostand } from '../logic/shop.ts'
import { neueReaktion, spruch, startSpruch } from './reaktion.ts'
import type { Reaktion } from './reaktion.ts'
import { sprich, stoppe } from './stimme.ts'
import { klang } from './klang.ts'

interface Props {
  state: GameState
  topic?: Topic
  /** 'buch': nur Aufgaben nach dem Lehrwerk. 'mix': etwa die Hälfte aus dem Lehrwerk, der Rest zufällig erzeugt. */
  quelle: 'buch' | 'mix'
  /** Knobelrunde: schwerere Aufgaben, keine Buchaufgaben */
  schwer?: boolean
  /** Gespeicherte Runde, bei der es weitergeht */
  fortsetzen?: RundenStand
  onFinish: (answers: RoundAnswer[]) => void
  /** Pause: der Stand ist gespeichert, die Startseite bietet Weitermachen an */
  onPause: () => void
}

function baueAufgaben(state: GameState, topic: Topic | undefined, quelle: 'buch' | 'mix', seed: number, schwer: boolean): Task[] {
  const rng = createRng(seed)
  const typen = selectTypes(rng, state.skill, CONFIG.roundLength, topic)
  const aufgaben: Task[] = []
  const benutzt = new Set<string>()
  for (const typ of typen) {
    let t: Task | null = null
    if (!schwer && (quelle === 'buch' || rng() < 0.5)) t = bookTaskFor(typ, rng, benutzt)
    if (t === null) {
      t = generateTask(typ, rng, schwer)
      for (let i = 0; i < 20 && benutzt.has(taskKey(t)); i++) t = generateTask(typ, rng, schwer)
    }
    benutzt.add(taskKey(t))
    aufgaben.push(t)
  }
  return aufgaben
}

export function Round({ state, topic, quelle, schwer = false, fortsetzen, onFinish, onPause }: Props) {
  const seed = useMemo(() => fortsetzen?.seed ?? Date.now() % 2_147_483_647, [fortsetzen])
  const [aufgaben, setAufgaben] = useState<Task[]>(() => fortsetzen?.aufgaben ?? baueAufgaben(state, topic, quelle, seed, schwer))
  const [index, setIndex] = useState(fortsetzen?.index ?? 0)
  const [versuch, setVersuch] = useState<1 | 2>(1)
  const [antworten, setAntworten] = useState<RoundAnswer[]>(fortsetzen?.antworten ?? [])
  const [ergebnis, setErgebnis] = useState<Outcome | null>(null)
  const [wiederholungenGeplant, setWiederholungenGeplant] = useState(fortsetzen?.wiederholungenGeplant ?? false)
  const [zaehlerFalsch, setZaehlerFalsch] = useState(0)
  const [reaktion, setReaktion] = useState<Reaktion | null>(null)
  const [frageVerlassen, setFrageVerlassen] = useState(false)
  const [abbruchText] = useState(() => spruch('abbruch'))
  const task = aufgaben[index]
  const istWiederholung = index >= CONFIG.roundLength
  const richtigerTipp = versuch === 2

  const richtigZaehler = useRef(0)

  function reagiere(art: 'lecker' | 'bah', text: string, tipp?: string) {
    setReaktion(neueReaktion(art, text, 1, tipp !== undefined))
    if (art === 'lecker') {
      klang('richtig')
      klang('mampf', 0.85)
    } else {
      klang('bah', 0.5)
    }
    if (tipp !== undefined) klang('tipp', 2.1)
    // Richtige Antworten kommentiert die Stimme nur bei jeder dritten, sonst nervt sie.
    let sprechen = true
    if (art === 'lecker') {
      richtigZaehler.current += 1
      sprechen = richtigZaehler.current % 3 === 1
    }
    // Die Stimme setzt ein, wenn das Futter beim Maul ankommt. Der Tipp folgt direkt danach.
    if (sprechen) window.setTimeout(() => sprich(text, tipp !== undefined ? { danach: `Tipp: ${tipp}` } : {}), 900)
    else if (tipp !== undefined) window.setTimeout(() => sprich(`Tipp: ${tipp}`), 2100)
  }

  function abgeben(response: Response) {
    if (checkAnswer(task, response)) {
      const outcome: Outcome = versuch === 1 ? 'first' : 'second'
      setAntworten([...antworten, { type: task.type, outcome, isRepeat: istWiederholung, prompt: task.prompt }])
      setErgebnis(outcome)
      reagiere('lecker', spruch(outcome === 'first' ? 'erster' : 'zweiter'))
    } else if (versuch === 1) {
      setVersuch(2)
      setZaehlerFalsch(zaehlerFalsch + 1)
      reagiere('bah', spruch('falsch'), task.hint)
    } else {
      setAntworten([...antworten, { type: task.type, outcome: 'failed', isRepeat: istWiederholung, prompt: task.prompt }])
      setErgebnis('failed')
      reagiere('bah', spruch('daneben'))
    }
  }

  function stand(f: { aufgaben: Task[]; index: number; wiederholungenGeplant: boolean }): RundenStand {
    return { version: 1, name: state.name, topic, quelle, schwer, seed, aufgaben: f.aufgaben, index: f.index, antworten, wiederholungenGeplant: f.wiederholungenGeplant }
  }

  function weiter() {
    const schritt = naechsterSchritt({ aufgaben, index, antworten, wiederholungenGeplant, seed, schwer })
    setErgebnis(null)
    setReaktion(null)
    setVersuch(1)
    if (schritt === null) {
      loescheRunde()
      onFinish(antworten)
      return
    }
    setAufgaben(schritt.aufgaben)
    setIndex(schritt.index)
    setWiederholungenGeplant(schritt.wiederholungenGeplant)
    // Nach jeder Aufgabe merkt sich die App den Stand, damit eine Pause (oder ein geschlossener Browser) nichts kostet.
    speichereRunde(stand(schritt))
  }

  /** Pause: speichert, wo das Kind war. Wurde die Antwort schon gezeigt, geht es bei der nächsten Aufgabe weiter. */
  function pausieren() {
    stoppe()
    if (ergebnis === null && antworten.length === 0) {
      loescheRunde()
      onPause()
      return
    }
    if (ergebnis === null) {
      speichereRunde(stand({ aufgaben, index, wiederholungenGeplant }))
      onPause()
      return
    }
    const schritt = naechsterSchritt({ aufgaben, index, antworten, wiederholungenGeplant, seed, schwer })
    if (schritt === null) {
      loescheRunde()
      onFinish(antworten)
      return
    }
    speichereRunde(stand(schritt))
    onPause()
  }

  // Live-Balken: zeigt sofort, wie viel Futter die Runde bis jetzt gebracht hat.
  const satt = (state.rounds[dayKey(new Date())] ?? 0) >= CONFIG.foodRoundsPerDay
  const gewonnen = satt ? 0 : futterBisJetzt(antworten)
  const gesamtNeu = state.totalFood + gewonnen
  const waechstGleich = stageFor(gesamtNeu).stage > stageFor(state.totalFood).stage
  const anteil = waechstGleich ? 100 : anteilFuer(gesamtNeu)

  const gesamt = aufgaben.length
  const basisTask = !istWiederholung

  return (
    <main className="runde">
      <header className="runde-kopf">
        <button className="knopf klein" type="button" onClick={() => { setFrageVerlassen(true); sprich(abbruchText) }}>← Pause</button>
        <div className="punkte" aria-label={`Aufgabe ${index + 1} von ${gesamt}`}>
          {aufgaben.map((_, i) => <span key={i} className={i < index ? 'punkt fertig' : i === index ? 'punkt aktuell' : 'punkt'} />)}
        </div>
        <Muenzen n={kontostand(state)} />
        <TonKnopf />
      </header>
      <RundenSchlange state={state} reaktion={reaktion} ruheText={startSpruch(index)} />
      {!satt && (
        <div className="live-balken" role="progressbar" aria-label="Futter in dieser Runde" aria-valuemin={0} aria-valuemax={100} aria-valuenow={anteil}>
          <div className="balken">
            <motion.div className="balken-fuellung live" initial={false} animate={{ width: `${anteil}%` }} transition={{ type: 'spring', stiffness: 140, damping: 16 }} />
          </div>
          <motion.span
            key={gewonnen} className="live-futter" initial={{ scale: gewonnen > 0 ? 1.8 : 1, y: gewonnen > 0 ? -6 : 0 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          >
            <span aria-hidden="true">🐭</span> +{gewonnen}
          </motion.span>
        </div>
      )}
      <p className="thema">{schwer ? '🧠 Knobelrunde: ' : ''}{TYPE_NAMES[task.type]}{istWiederholung ? ' (noch einmal)' : ''}</p>

      {ergebnis === null ? (
        <motion.div
          key={index} className="aufgabe-huelle"
          initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <TaskView key={`${index}-${versuch}`} task={task} attempt={versuch} onSubmit={abgeben} />
        </motion.div>
      ) : (
        <motion.div
          className="rueckmeldung" role="status"
          initial={{ scale: 0.6, opacity: 0, rotate: ergebnis === 'failed' ? 0 : -3 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 16 }}
        >
          {ergebnis === 'failed' ? (
            <>
              <p className="rueckmeldung-titel">Das schauen wir uns an.</p>
              <LoesungsBild task={task} />
              <p>{task.solution}</p>
            </>
          ) : (
            <>
              <p className="rueckmeldung-titel">{ergebnis === 'first' ? 'Richtig!' : 'Geschafft!'}</p>
              {basisTask && <p>+{foodForOutcome(ergebnis)} Futter für deine Schlange</p>}
            </>
          )}
          <button className="knopf gross" type="button" onClick={weiter} autoFocus>Weiter</button>
        </motion.div>
      )}
      {ergebnis === null && richtigerTipp && <p className="ermutigung">Fast! Versuche es noch einmal.</p>}
      <p className="sr-only" aria-live="polite">{reaktion?.text}</p>
      <AnimatePresence>
        {frageVerlassen && (
          <motion.div className="dialog-hintergrund" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-titel"
              initial={{ scale: 0.5, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.7, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            >
              <p id="dialog-titel" className="dialog-text">{abbruchText}</p>
              <p className="klein-text">Ich merke mir, wo du warst.</p>
              <button className="knopf gross hauptknopf" type="button" autoFocus onClick={() => { stoppe(); setFrageVerlassen(false) }}>Weiter üben</button>
              <button className="knopf klein" type="button" onClick={pausieren}>Pause machen</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
