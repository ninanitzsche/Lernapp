import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { checkAnswer, TYPE_NAMES } from '../logic/tasks.ts'
import type { Response, Task, Topic } from '../logic/tasks.ts'
import { CONFIG } from '../logic/config.ts'
import { baueAufgaben } from '../logic/rundenbau.ts'
import { serieErkannt, halbzeitErreicht, futterFuerAntwort } from '../logic/belohnung.ts'
import { dayKey, stageFor } from '../logic/game.ts'
import { futterBisJetzt, naechsterSchritt } from '../logic/runde.ts'
import type { RundenStand } from '../logic/runde.ts'
import { loescheRunde, speichereRunde } from '../storage.ts'
import type { GameState, Outcome, RoundAnswer } from '../logic/game.ts'
import { TaskView } from './TaskView.tsx'
import { LoesungsBild } from './Visuals.tsx'
import { RundenSchlange, anteilFuer } from './Snake.tsx'
import { TonKnopf } from './TonKnopf.tsx'
import { Muenzen } from './Shop.tsx'
import { Schuppen } from './Schuppen.tsx'
import { Treppe } from './Treppe.tsx'
import { Halbzeit } from './Halbzeit.tsx'
import { konfetti } from './feier.ts'
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

export function Round({ state, topic, quelle, schwer = false, fortsetzen, onFinish, onPause }: Props) {
  const abgeschlosseneRunden = useMemo(() => Object.values(state.rounds).reduce((s, n) => s + n, 0), [state.rounds])
  const seed = useMemo(() => fortsetzen?.seed ?? Date.now() % 2_147_483_647, [fortsetzen])
  const [aufgaben, setAufgaben] = useState<Task[]>(() => fortsetzen?.aufgaben ?? baueAufgaben({ skill: state.skill, abgeschlosseneRunden: abgeschlosseneRunden, topic, quelle, knobel: schwer, seed }))
  const [index, setIndex] = useState(fortsetzen?.index ?? 0)
  const [versuch, setVersuch] = useState<1 | 2>(fortsetzen?.versuch ?? 1)
  // Denkimpuls: freiwilliger Hinweis vor der Antwort. Die Aufgabe zählt weiter zum Nachweis, bringt aber wie ein zweiter Versuch weniger Futter.
  const [denkimpuls, setDenkimpuls] = useState(fortsetzen?.denkimpuls ?? false)
  const [antworten, setAntworten] = useState<RoundAnswer[]>(fortsetzen?.antworten ?? [])
  const [ergebnis, setErgebnis] = useState<Outcome | null>(null)
  const [wiederholungenGeplant, setWiederholungenGeplant] = useState(fortsetzen?.wiederholungenGeplant ?? false)
  const [zaehlerFalsch, setZaehlerFalsch] = useState(0)
  const [reaktion, setReaktion] = useState<Reaktion | null>(null)
  const [frageVerlassen, setFrageVerlassen] = useState(false)
  const [abbruchText] = useState(() => spruch('abbruch'))
  // Wurde die Runde genau an der Halbzeit pausiert, zeigt sie sich beim Weitermachen einmal
  const faelligBeimStart = !!fortsetzen && halbzeitErreicht(fortsetzen.antworten.filter((a) => !a.isRepeat).length, fortsetzen.halbzeitGezeigt ?? false)
  const [halbzeitGezeigt, setHalbzeitGezeigt] = useState((fortsetzen?.halbzeitGezeigt ?? false) || faelligBeimStart)
  const [halbzeit, setHalbzeit] = useState(faelligBeimStart)
  const [halbzeitText] = useState(() => spruch('halbzeit'))
  // In den ersten Runden erklärt die Schlange einmal die Schuppen
  const [erklaerSchuppen] = useState(() => abgeschlosseneRunden < 2 && !fortsetzen)
  const [serieDa, setSerieDa] = useState(false)
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
      const antwort: RoundAnswer = { type: task.type, outcome, isRepeat: istWiederholung, prompt: task.prompt, stufe: task.stufe, ...(denkimpuls ? { denkimpuls: true } : {}) }
      // Drei im ersten Versuch hintereinander: Serien-Jubel mit Zusatzfutter, einmal pro Runde
      const serie = serieErkannt([...antworten, antwort])
      if (serie) { antwort.serieBonus = true; konfetti() }
      setSerieDa(serie)
      setAntworten([...antworten, antwort])
      setErgebnis(outcome)
      reagiere('lecker', spruch(serie ? 'serie' : outcome === 'first' ? 'erster' : 'zweiter'))
    } else if (versuch === 1) {
      setVersuch(2)
      setZaehlerFalsch(zaehlerFalsch + 1)
      reagiere('bah', spruch('falsch'), task.hint)
    } else {
      setAntworten([...antworten, { type: task.type, outcome: 'failed', isRepeat: istWiederholung, prompt: task.prompt, stufe: task.stufe, ...(denkimpuls ? { denkimpuls: true } : {}) }])
      setSerieDa(false)
      setErgebnis('failed')
      reagiere('bah', spruch('daneben'))
    }
  }

  function stand(f: { aufgaben: Task[]; index: number; wiederholungenGeplant: boolean }, halbzeitSchonGezeigt = halbzeitGezeigt, aktuellerVersuch: 1 | 2 = 1, aktuellerImpuls = false): RundenStand {
    return { version: 1, name: state.name, topic, quelle, schwer, seed, aufgaben: f.aufgaben, index: f.index, antworten, wiederholungenGeplant: f.wiederholungenGeplant, halbzeitGezeigt: halbzeitSchonGezeigt, versuch: aktuellerVersuch, denkimpuls: aktuellerImpuls }
  }

  function weiter() {
    const schritt = naechsterSchritt({ aufgaben, index, antworten, wiederholungenGeplant, seed, schwer })
    setErgebnis(null)
    setReaktion(null)
    setVersuch(1)
    setDenkimpuls(false)
    setSerieDa(false)
    // Halbzeit: nach der fünften Aufgabe einmal pro Runde, auch nach einer Pause
    const zeigeHalbzeit = schritt !== null && halbzeitErreicht(antworten.filter((a) => !a.isRepeat).length, halbzeitGezeigt)
    if (schritt === null) {
      loescheRunde()
      onFinish(antworten)
      return
    }
    setAufgaben(schritt.aufgaben)
    setIndex(schritt.index)
    setWiederholungenGeplant(schritt.wiederholungenGeplant)
    if (zeigeHalbzeit) { setHalbzeitGezeigt(true); setHalbzeit(true); klang('richtig', 1.3) }
    // Nach jeder Aufgabe merkt sich die App den Stand, damit eine Pause (oder ein geschlossener Browser) nichts kostet.
    speichereRunde(stand(schritt, halbzeitGezeigt || zeigeHalbzeit))
  }

  /** Pause: speichert, wo das Kind war. Wurde die Antwort schon gezeigt, geht es bei der nächsten Aufgabe weiter. */
  function pausieren() {
    stoppe()
    // Noch nichts beantwortet und noch kein Fehlversuch: es gibt nichts zu merken.
    if (ergebnis === null && antworten.length === 0 && versuch === 1 && !denkimpuls) {
      loescheRunde()
      onPause()
      return
    }
    if (ergebnis === null) {
      // Der Versuchszähler wird mitgespeichert, damit nach einem Fehlversuch der zweite Versuch (mit Tipp) weiterläuft.
      speichereRunde(stand({ aufgaben, index, wiederholungenGeplant }, halbzeitGezeigt, versuch, denkimpuls))
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
        <Treppe stufen={aufgaben.map((t) => t.stufe)} index={index} />
        <Muenzen n={kontostand(state)} />
        <TonKnopf />
      </header>
      <RundenSchlange state={state} reaktion={reaktion} ruheText={index === 0 && erklaerSchuppen ? spruch('schuppen') : startSpruch(index)} />
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
      <p className="thema">
        {schwer ? '🧠 Knobelrunde: ' : ''}{TYPE_NAMES[task.type]}{istWiederholung ? ' (noch einmal)' : ''}
        <Schuppen stufe={task.stufe} mitWort />
      </p>

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
              {basisTask && (
                <p>
                  +{futterFuerAntwort({ outcome: ergebnis, stufe: task.stufe, denkimpuls })} Futter für deine Schlange
                  {serieDa && <span className="chip">+{CONFIG.serieFutter} Serie</span>}
                </p>
              )}
            </>
          )}
          <button className="knopf gross" type="button" onClick={weiter} autoFocus>Weiter</button>
        </motion.div>
      )}
      {ergebnis === null && versuch === 1 && !denkimpuls && (
        <button className="knopf klein denkimpuls" type="button" onClick={() => { setDenkimpuls(true); sprich(`Denkimpuls: ${task.hint}`) }}>
          <span aria-hidden="true">💡</span> Denkimpuls (weniger Futter)
        </button>
      )}
      {ergebnis === null && denkimpuls && <p className="hinweis" role="status"><span className="gluehbirne" aria-hidden="true">💡</span> Denkimpuls: {task.hint}</p>}
      {ergebnis === null && richtigerTipp && <p className="ermutigung">Fast! Versuche es noch einmal.</p>}
      <p className="sr-only" aria-live="polite">{reaktion?.text}</p>
      <AnimatePresence>
        {halbzeit && (
          <Halbzeit
            name={state.name} text={halbzeitText} gewonnen={gewonnen} gesamt={gesamtNeu} satt={satt}
            onWeiter={() => setHalbzeit(false)} onPause={() => { stoppe(); onPause() }}
          />
        )}
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
