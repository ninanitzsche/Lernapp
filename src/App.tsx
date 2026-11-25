import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TOPICS, TOPIC_NAMES } from './logic/tasks.ts'
import type { Topic } from './logic/tasks.ts'
import { CONFIG } from './logic/config.ts'
import { dayKey, finishRound, initialState } from './logic/game.ts'
import type { GameState, RoundAnswer, RoundSummary } from './logic/game.ts'
import { bitteUmDauerhaftenSpeicher, ladeRunde, letzteSicherung, loadState, loescheRunde, saveState, sicherungFaellig } from './storage.ts'
import type { RundenStand } from './logic/runde.ts'
import { Blase, ErgebnisSchlange, Snake, TerrariumVorschau } from './ui/Snake.tsx'
import { Info } from './ui/Info.tsx'
import { muenzRegen } from './ui/feier.ts'
import { Einfuehrung } from './ui/Einfuehrung.tsx'
import { spruch } from './ui/reaktion.ts'
import { Round } from './ui/Round.tsx'
import { Parent } from './ui/Parent.tsx'
import { Haeutung } from './ui/Haeutung.tsx'
import { Album, Wissensalbum } from './ui/Album.tsx'
import { Reliktbereich } from './ui/Relikt.tsx'
import { reliktBereichSichtbar } from './logic/relikte.ts'
import { MAX_STERNE, fehltText, fortschritt } from './logic/kompetenz.ts'
import { Schuppen } from './ui/Schuppen.tsx'
import { hoechsteStufe } from './logic/stufen.ts'
import { TASK_TYPES, TOPIC_OF } from './logic/tasks.ts'
import type { Stufe } from './logic/tasks.ts'
import { Muenzen, Shop } from './ui/Shop.tsx'
import { kontostand } from './logic/shop.ts'

type View = 'home' | 'round' | 'result' | 'haeutung' | 'parent' | 'shop' | 'themen' | 'album' | 'relikte'

/**
 * Start-Gruß: Das Logo zeigt sich beim Öffnen kurz, ein Tipp überspringt es. Neue Spieler sehen es nicht,
 * weil sie gleich danach das Willkommen mit dem Logo bekommen.
 */
function Startgruss({ onFertig }: { onFertig: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onFertig, 1900)
    return () => window.clearTimeout(t)
  }, [onFertig])
  return (
    <motion.button
      type="button" className="startgruss" aria-label="Nico's Snake App. Tippen zum Starten." onClick={onFertig}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="" draggable={false}
        initial={{ scale: 0.6, opacity: 0, rotate: -4 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 13 }}
      />
    </motion.button>
  )
}

export default function App() {
  const [gruss, setGruss] = useState(() => loadState() !== null)
  return (
    <>
      <AppInhalt />
      <AnimatePresence>{gruss && <Startgruss key="gruss" onFertig={() => setGruss(false)} />}</AnimatePresence>
    </>
  )
}

function AppInhalt() {
  const [state, setState] = useState<GameState | null>(() => loadState())
  const [view, setView] = useState<View>('home')
  const [topic, setTopic] = useState<Topic | undefined>(undefined)
  const [quelle, setQuelle] = useState<'buch' | 'mix'>('mix')
  const [knobel, setKnobel] = useState(false)
  const [summary, setSummary] = useState<RoundSummary | null>(null)
  // Pausierte Runde: bleibt gespeichert, bis sie fertig ist oder eine neue Runde beginnt.
  const [pause, setPause] = useState<RundenStand | null>(() => { const s = loadState(); return s ? ladeRunde(s.name) : null })
  const [fortsetzen, setFortsetzen] = useState<RundenStand | undefined>(undefined)
  // Neue Spieler sehen die Einführung einmal; wer schon einen Stand hat, kann sie über "Wie geht das?" ansehen.
  const [intro, setIntro] = useState(() => loadState() === null)

  useEffect(() => { if (state) saveState(state) }, [state])
  useEffect(() => { bitteUmDauerhaftenSpeicher() }, [])

  if (!state) return <Willkommen onStart={(name) => { setState(initialState(name)); setIntro(true) }} />
  if (intro) return <Einfuehrung name={state.name} onFertig={() => setIntro(false)} />

  const now = new Date()

  function starten(t?: Topic, q: 'buch' | 'mix' = 'mix', schwer = false) {
    loescheRunde()
    setPause(null)
    setFortsetzen(undefined)
    setTopic(t)
    setQuelle(q)
    setKnobel(schwer)
    setView('round')
  }

  function weitermachen() {
    if (!pause) return
    setFortsetzen(pause)
    setTopic(pause.topic)
    setQuelle(pause.quelle)
    setKnobel(pause.schwer)
    setView('round')
  }

  function beenden(answers: RoundAnswer[]) {
    if (!state) return
    loescheRunde()
    setPause(null)
    setFortsetzen(undefined)
    const ergebnis = finishRound(state, answers, new Date(), knobel)
    setState(ergebnis.state)
    setSummary(ergebnis)
    setView('result')
  }

  if (view === 'round') {
    return (
      <Round
        state={state} topic={topic} quelle={quelle} schwer={knobel} fortsetzen={fortsetzen} onFinish={beenden}
        onPause={() => { setPause(ladeRunde(state.name)); setFortsetzen(undefined); setView('home') }}
      />
    )
  }
  if (view === 'parent') {
    return <Parent state={state} onChange={setState} onReset={() => { setState(null); setView('home') }} onClose={() => setView('home')} />
  }
  if (view === 'result' && summary) {
    return <Ergebnis state={state} summary={summary} onDone={() => setView(summary.meilensteine.length > 0 ? 'haeutung' : 'home')} />
  }
  if (view === 'haeutung' && summary) return <Haeutung state={state} neu={summary.meilensteine} onFertig={() => setView('home')} />
  if (view === 'album') return <AlbumAnsicht state={state} onClose={() => setView('home')} />
  if (view === 'relikte' && reliktBereichSichtbar(state)) return <Reliktbereich state={state} onChange={setState} onClose={() => setView('home')} />
  if (view === 'shop') return <ShopAnsicht state={state} onChange={setState} onClose={() => setView('home')} />
  if (view === 'themen') return <Themen state={state} pausiert={pause !== null} onStart={starten} onClose={() => setView('home')} />

  const heuteRunden = state.rounds[dayKey(now)] ?? 0
  const gesamtRunden = Object.values(state.rounds).reduce((s, n) => s + n, 0)
  const sichern = sicherungFaellig(gesamtRunden, letzteSicherung(), now)
  return (
    <main className="start">
      <img className="start-logo" src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="Nico's Snake App" draggable={false} />
      <Snake state={state} now={now} onChange={setState} />
      {heuteRunden >= CONFIG.foodRoundsPerDay && (
        <p className="satt">{state.name} ist satt. Üben geht trotzdem!</p>
      )}
      {pause ? (
        <button className="knopf gross hauptknopf" type="button" onClick={weitermachen}>Weiter: Aufgabe {pause.index + 1} von {pause.aufgaben.length}</button>
      ) : (
        <button className="knopf gross hauptknopf" type="button" onClick={() => starten()}>Runde starten</button>
      )}
      <div className="zeile">
        <button className="knopf klein" type="button" onClick={() => setView('themen')}>Themen und Buch</button>
        <button className="knopf klein" type="button" onClick={() => setView('album')}>
          <span aria-hidden="true">🐍</span>&nbsp;Album{state.meilensteine.length > 0 && <>&nbsp;<span className="album-zahl">{state.meilensteine.length}</span></>}
        </button>
        <button className="knopf klein" type="button" onClick={() => setView('shop')}>
          <span aria-hidden="true">🛍️</span>&nbsp;Shop&nbsp;<Muenzen n={kontostand(state)} />
        </button>
        {reliktBereichSichtbar(state) && (
          <button className="knopf klein" type="button" onClick={() => setView('relikte')}><span aria-hidden="true">🗝️</span>&nbsp;Relikte</button>
        )}
      </div>
      <div className="zeile">
        <button className="link" type="button" onClick={() => setIntro(true)}>Wie geht das?</button>
        <button className="link" type="button" onClick={() => setView('parent')}>
          Für Erwachsene{sichern && <span className="hinweis-punkt" role="img" aria-label="Eine Sicherung ist fällig" />}
        </button>
      </div>
    </main>
  )
}

function Seitenkopf({ titel, onClose }: { titel: string; onClose: () => void }) {
  return (
    <header className="seitenkopf">
      <button className="knopf klein" type="button" onClick={onClose} aria-label="Zurück"><span aria-hidden="true">←</span> Zurück</button>
      <h2>{titel}</h2>
    </header>
  )
}

/** Auf welcher Stufe das Kind in einem Thema gerade übt: die höchste freigeschaltete Stufe über die Typen des Themas. */
function themenStufe(state: GameState, t: Topic): Stufe {
  const runden = Object.values(state.rounds).reduce((s, n) => s + n, 0)
  return Math.max(...TASK_TYPES.filter((x) => TOPIC_OF[x] === t).map((x) => hoechsteStufe(state.skill[x], runden))) as Stufe
}

function AlbumAnsicht({ state, onClose }: { state: GameState; onClose: () => void }) {
  return (
    <main className="start">
      <Seitenkopf titel="Album" onClose={onClose} />
      <Wissensalbum state={state} />
      <h3>Meine Häute</h3>
      <Album state={state} />
    </main>
  )
}

/** Nächste Kompetenz und echter Fortschritt aus den gespeicherten Nachweisen, ohne erfundene Prozentwerte. */
function NaechstesZiel({ state, topic }: { state: GameState; topic: Topic }) {
  const f = fortschritt(state.sterneErreicht[topic], state.nachweise[topic], topic)
  if (!f) return <span className="thema-ziel">Gemeistert! Der Pokal steht im Terrarium.</span>
  const fehlt = fehltText(f)
  return (
    <span className="thema-ziel">
      <span>Nächstes Ziel: {f.ziel}</span>
      <span className="fortschritt" role="progressbar" aria-label="Fortschritt zum nächsten Stern" aria-valuemin={0} aria-valuemax={1} aria-valuenow={f.anteil} aria-valuetext={fehlt || 'Fast geschafft'}>
        <span className="fortschritt-fuellung" style={{ width: `${Math.round(f.anteil * 100)}%` }} />
      </span>
      {fehlt && <span className="klein-text-links">{fehlt}</span>}
    </span>
  )
}

function Themen({ state, pausiert, onStart, onClose }: { state: GameState; pausiert: boolean; onStart: (t?: Topic, q?: 'buch' | 'mix', schwer?: boolean) => void; onClose: () => void }) {
  return (
    <main className="start">
      <Seitenkopf titel="Üben" onClose={onClose} />
      {pausiert && <p className="satt">Eine neue Runde ersetzt deine Pause.</p>}
      <button className="knopf klein buchknopf" type="button" onClick={() => onStart(undefined, 'buch')}>📖 Aufgaben aus deinem Buch</button>
      <button className="knopf buchknopf knobel" type="button" onClick={() => onStart(undefined, 'mix', true)}>
        <span aria-hidden="true">🧠</span>&nbsp;Knobelrunde
      </button>
      <h3>Oder ein Thema üben</h3>
      <div className="themen">
        {TOPICS.map((t, i) => (
          <motion.div
            key={t} className="thema-huelle"
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.08 * i }}
          >
            <button className="thema-karte" type="button" onClick={() => onStart(t, 'mix')}>
              <span className="thema-links">
                <span className="thema-name">{TOPIC_NAMES[t]}<Schuppen stufe={themenStufe(state, t)} klein /></span>
                <NaechstesZiel state={state} topic={t} />
              </span>
              <span className="sterne" aria-label={`${state.sterneErreicht[t]} von ${MAX_STERNE} Sternen`}>
                {Array.from({ length: MAX_STERNE }, (_, i) => i + 1).map((n) => <span key={n} className={n <= state.sterneErreicht[t] ? 'stern an' : 'stern'} />)}
              </span>
            </button>
          </motion.div>
        ))}
      </div>
      <Info titel="Was bedeuten Schuppen, Knobelrunde und Sterne?">
        Schuppen zeigen, wie knifflig eine Aufgabe ist: eine ist leicht, zwei sind mittel, drei sind knifflig. Knifflige Aufgaben geben viel mehr Futter.
        Schaffst du in der Knobelrunde 7 von 10 gleich richtig, gibt es zwei Extra-Münzen.
        Jedes Thema hat fünf Sterne. Du verdienst sie nacheinander, wenn du Aufgaben in mehreren Runden gleich beim ersten Mal richtig löst.
        Jeder Stern bringt eine Münze. Hast du alle fünf, bekommst du einen Pokal für dein Terrarium.
      </Info>
    </main>
  )
}

function ShopAnsicht({ state, onChange, onClose }: { state: GameState; onChange: (s: GameState) => void; onClose: () => void }) {
  return (
    <main className="start">
      <Seitenkopf titel="Shop" onClose={onClose} />
      <TerrariumVorschau state={state} onChange={onChange} />
      <Shop state={state} onChange={onChange} />
    </main>
  )
}

function Willkommen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState('')
  return (
    <main className="start willkommen-screen">
      <h1 className="sr-only">Nico's Snake App</h1>
      <div className="willkommen-marke">
        <img className="willkommen-logo" src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="Nico's Snake App" />
      </div>
      <div className="willkommen-tier">
        <img className="willkommen-bild" src={`${import.meta.env.BASE_URL}images/snake/app/baby-standard.webp`} alt="Eine kleine grüne Schlange – so beginnt dein Abenteuer" />
      </div>
      <section className="willkommen-einstieg" aria-label="Deine Schlange einrichten">
        <p>Wie soll die Schlange heißen?</p>
        <form className="eingabe" onSubmit={(e) => { e.preventDefault(); if (name.trim()) onStart(name.trim()) }}>
          <input className="textfeld" maxLength={20} autoFocus value={name} onChange={(e) => setName(e.target.value)} aria-label="Name der Schlange" placeholder="Schlangennamen eingeben" />
          <button className="knopf gross" type="submit" disabled={!name.trim()}>Los geht's</button>
        </form>
      </section>
    </main>
  )
}

function Ergebnis({ state, summary, onDone }: { state: GameState; summary: RoundSummary; onDone: () => void }) {
  const gesamt = summary.foodGained + summary.bonusFood
  const muenzen = summary.neueSterne + summary.neueBonusMuenzen
  const [mitbringsel] = useState(() => spruch('mitbringsel'))
  useEffect(() => (summary.tagesMuenze ? muenzRegen() : undefined), [summary.tagesMuenze])
  const pop = { type: 'spring', stiffness: 360, damping: 14 } as const
  return (
    <main className="start">
      <ErgebnisSchlange state={state} summary={summary} />
      {summary.tagesMuenze && <Blase text={mitbringsel} klasse="mitbringsel" />}
      {summary.leveledUp && (
        <motion.p className="feier" initial={{ scale: 0.2, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ ...pop, delay: 1.2 }}>
          {state.name} ist gewachsen!
        </motion.p>
      )}
      {summary.knobelMuenze && (
        <motion.p className="feier" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...pop, delay: 0.3 }}>
          Knobelmeister!
        </motion.p>
      )}
      {muenzen > 0 && (
        <motion.p
          className="feier" initial={{ scale: 0.2, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ ...pop, delay: 0.6 }}
        >
          <span aria-hidden="true">🪙</span> +{muenzen} {muenzen === 1 ? 'Münze' : 'Münzen'}!
        </motion.p>
      )}
      {summary.satt ? (
        <p className="ergebnis-text">{state.name} ist satt. Üben hilft trotzdem!</p>
      ) : (
        <p className="ergebnis-text">
          {state.name} hat {gesamt} Futter bekommen.
          {summary.knobelFutter > 0 && <span className="chip">davon knifflig: +{summary.knobelFutter}</span>}
          {summary.serienFutter > 0 && <span className="chip">+{summary.serienFutter} Serie</span>}
          {summary.bonusFood > 0 && <span className="chip">+{summary.bonusFood} Rundenbonus</span>}
          {summary.denkimpulsAbzug > 0 && <span className="chip">Denkimpuls: {summary.denkimpulsAbzug} {summary.denkimpulsAbzug === 1 ? 'Münze' : 'Münzen'} weniger</span>}
        </p>
      )}
      <button className="knopf gross hauptknopf" type="button" onClick={onDone}>{summary.meilensteine.length > 0 ? 'Weiter' : 'Fertig'}</button>
    </main>
  )
}
