import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { moodAt, nextStageFood, stageFor } from '../logic/game.ts'
import type { GameState, Mood, RoundSummary } from '../logic/game.ts'
import { STAGES } from '../logic/config.ts'
import { neueReaktion, spruch } from './reaktion.ts'
import type { Art, Flug, Reaktion } from './reaktion.ts'
import { sprich } from './stimme.ts'
import { klang } from './klang.ts'
import { TonKnopf } from './TonKnopf.tsx'
import { Terrarium } from './Terrarium.tsx'
import { konfetti } from './feier.ts'

/** Sprechblase: springt bei jedem neuen Text kurz auf. */
export function Blase({ text, klasse = '', status = false }: { text: string; klasse?: string; status?: boolean }) {
  return (
    <motion.div
      key={text} className={`sprechblase ${klasse}`} role={status ? 'status' : undefined}
      initial={{ scale: 0.7, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
    >
      {text}
    </motion.div>
  )
}

export type Stimmung = 'standard' | 'happy' | 'tired' | 'eating' | 'surprised'
/** Wechsel der Gesichter: [Stimmung, ab Sekunde] */
type Ablauf = [Stimmung, number][]

/** Für diese Stufen gibt es Bilder mit Gesichtsausdrücken (siehe tools/bilder_aufbereiten.py). */
const MIT_GESICHTERN = new Set<string>(['baby', 'smallChild', 'child'])

function bildUrl(stufe: number, stimmung: Stimmung): string {
  const key = STAGES[stufe - 1].key
  const datei = MIT_GESICHTERN.has(key) ? stimmung : 'standard'
  return `${import.meta.env.BASE_URL}images/snake/app/${key}-${datei}.webp`
}

const STIMMUNG_BILD: Record<Mood, Stimmung> = { froh: 'standard', hungrig: 'surprised', schlaeft: 'tired' }

interface BildProps {
  stufe: number
  alt: string
  /** Dauerhafte Bewegung im Ruhezustand */
  ruhe: string
  ablauf?: Ablauf
  art?: Art
  fluege?: Flug[]
  /** Nur für Stufen ohne eigene Gesichter: Emoji statt Gesichtsbild */
  gefuehl?: string
  extra?: string
  onClick?: () => void
  viele?: boolean
  mitZzz?: boolean
}

/** Wird mit `key` neu gestartet, dann laufen Animation und Gesichterwechsel von vorn. */
function SchlangenBild({ stufe, alt, ruhe, ablauf = [['standard', 0]], art, fluege = [], gefuehl, extra = '', onClick, viele, mitZzz }: BildProps) {
  const [aktuell, setAktuell] = useState<Stimmung>(ablauf[0][0])
  const hatGesichter = MIT_GESICHTERN.has(STAGES[stufe - 1].key)

  useEffect(() => {
    const timer = ablauf.map(([s, sek]) => window.setTimeout(() => setAktuell(s), sek * 1000))
    return () => timer.forEach((t) => window.clearTimeout(t))
    // läuft nur beim Einhängen; neue Abläufe kommen über einen neuen key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const letzte = fluege.at(-1)?.verzoegerung ?? 0
  const herzen = !hatGesichter && art === 'lecker' ? [0, 1, 2, 3, 4] : []
  const inhalt = (
    <>
      <span className={`ruhe ${ruhe}`}>
        <img className={art ? `r-${art}${viele ? ' viele' : ''}` : ''} src={bildUrl(stufe, aktuell)} alt={alt} draggable={false} />
      </span>
      {fluege.map((f, i) => (
        <span key={i} className={`futter-flug ${art ?? ''} v${f.variante}`} style={{ animationDelay: `${f.verzoegerung}s` }} aria-hidden="true">
          {f.futter}
        </span>
      ))}
      {!hatGesichter && gefuehl && <span className="gefuehl" style={{ animationDelay: `${letzte + 0.7}s` }} aria-hidden="true">{gefuehl}</span>}
      {herzen.map((h) => (
        <span key={h} className="herz" style={{ '--x': `${(h - 2) * 22}px`, animationDelay: `${letzte + 0.7 + h * 0.12}s` } as CSSProperties} aria-hidden="true">
          {h % 2 ? '✨' : '❤️'}
        </span>
      ))}
      {!hatGesichter && mitZzz && <span className="zzz" aria-hidden="true">Zzz</span>}
    </>
  )
  const klasse = `schlange-bild ${extra}`
  if (onClick) {
    return <button type="button" className={`${klasse} anstupsbar`} onClick={onClick} aria-label="Schlange anstupsen">{inhalt}</button>
  }
  return <div className={klasse}>{inhalt}</div>
}

/** Anteil (0 bis 100) auf dem Weg zur nächsten Stufe. */
export function anteilFuer(totalFood: number): number {
  const stage = stageFor(totalFood)
  const naechste = nextStageFood(totalFood)
  if (naechste === null) return 100
  return Math.round(((totalFood - stage.foodFrom) / (naechste - stage.foodFrom)) * 100)
}

export function FortschrittBalken({ anteil, totalFood }: { anteil: number; totalFood: number }) {
  const naechste = nextStageFood(totalFood)
  return (
    <>
      <div className="balken" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={anteil}>
        <div className="balken-fuellung" style={{ width: `${anteil}%` }} />
      </div>
      <p className="futter-text">
        {naechste === null ? 'Größte Stufe erreicht!' : `Noch ${naechste - totalFood} Futter bis zum Wachsen`}
      </p>
    </>
  )
}

/** Startseite: tippe die Schlange an, dann hüpft sie, lacht und redet. */
export function Snake({ state, now, onChange }: { state: GameState; now: Date; onChange: (s: GameState) => void }) {
  const stage = stageFor(state.totalFood)
  const mood = moodAt(state.lastFedAt, now)
  const [text, setText] = useState(() => spruch(mood))
  const [stups, setStups] = useState(0)
  const basis = STIMMUNG_BILD[mood]
  const ablauf: Ablauf = stups > 0 ? [['happy', 0], [basis, 2.4]] : [[basis, 0]]

  function anstupsen() {
    const t = spruch('anstupsen')
    setText(t)
    setStups(stups + 1)
    klang('plopp')
    sprich(t)
  }

  return (
    <section className="schlange" aria-label={`${state.name}, ${stage.name}`}>
      <div className="kopfzeile-ton"><TonKnopf /></div>
      <Blase key={text} text={text} />
      <Terrarium state={state} onChange={onChange}>
        <SchlangenBild
          key={stups} stufe={stage.stage} alt={`${state.name} die Schlange`} extra={`imterra ${stups > 0 ? 'hopp' : ''}`}
          ruhe={`stimmung-${mood}`} ablauf={ablauf} gefuehl={stups > 0 ? '😄' : undefined} onClick={anstupsen} mitZzz={mood === 'schlaeft'}
        />
      </Terrarium>
      <div className="namenzeile">
        <h2 className="schlange-name">{state.name}</h2>
        <p className="stufe">Stufe {stage.stage}: {stage.name}</p>
      </div>
      <FortschrittBalken anteil={anteilFuer(state.totalFood)} totalFood={state.totalFood} />
    </section>
  )
}

/** Kleine Ansicht des Terrariums, zum Beispiel im Shop. Die Dinge lassen sich auch hier verschieben. */
export function TerrariumVorschau({ state, onChange }: { state: GameState; onChange: (s: GameState) => void }) {
  const stage = stageFor(state.totalFood)
  return (
    <div className="vorschau">
      <Terrarium state={state} onChange={onChange}>
        <SchlangenBild stufe={stage.stage} alt={`${state.name} die Schlange`} extra="imterra" ruhe="stimmung-froh" />
      </Terrarium>
    </div>
  )
}

/** In der Runde: bleibt oben sichtbar, frisst richtiges Futter und spuckt falsches aus. */
export function RundenSchlange({ state, reaktion, ruheText }: { state: GameState; reaktion: Reaktion | null; ruheText: string }) {
  const stage = stageFor(state.totalFood)
  const ablauf: Ablauf = reaktion === null
    ? [['standard', 0]]
    : reaktion.art === 'lecker'
      ? [['standard', 0], ['eating', 0.85], ['happy', 2.4]]
      : reaktion.tipp
        ? [['standard', 0], ['surprised', 0.6], ['happy', 2.1]]
        : [['standard', 0], ['surprised', 0.6], ['standard', 3.2]]
  return (
    <div className="runden-schlange">
      <SchlangenBild
        key={reaktion?.nonce ?? 0} stufe={stage.stage} alt={`${state.name} die Schlange`} ruhe="stimmung-froh" extra="klein"
        ablauf={ablauf} art={reaktion?.art} fluege={reaktion?.fluege} gefuehl={reaktion?.gefuehl}
      />
      <Blase text={reaktion?.text ?? ruheText} klasse={`links ${reaktion?.art === 'bah' ? 'bah' : ''}`} status />
    </div>
  )
}

/** Ergebnis: Futter fliegt nacheinander ins Maul. Bei Aufstieg wächst die Schlange mit Konfetti. */
export function ErgebnisSchlange({ state, summary }: { state: GameState; summary: RoundSummary }) {
  const gesamt = summary.foodGained + summary.bonusFood
  const anzahl = summary.satt ? 0 : Math.min(8, Math.max(1, Math.ceil(gesamt / 3)))
  const reaktion = useMemo(() => (anzahl > 0 ? neueReaktion('lecker', spruch('lecker'), anzahl) : null), [anzahl])
  const fresszeit = anzahl * 0.35 + 1.4
  const [gewachsen, setGewachsen] = useState(false)
  const [gewachsenText] = useState(() => spruch('gewachsen'))
  const [sattText] = useState(() => spruch('satt'))

  useEffect(() => {
    sprich(reaktion ? reaktion.text : sattText)
    if (reaktion) klang('mampf', 1)
    if (!summary.leveledUp) return
    const t = window.setTimeout(() => {
      setGewachsen(true)
      klang('aufstieg')
      sprich(gewachsenText)
    }, fresszeit * 1000)
    return () => window.clearTimeout(t)
  }, [reaktion, summary.leveledUp, fresszeit, gewachsenText, sattText])

  useEffect(() => (gewachsen ? konfetti() : undefined), [gewachsen])

  const stufe = summary.leveledUp && !gewachsen ? summary.stageBefore : summary.stageAfter
  const text = gewachsen ? gewachsenText : reaktion?.text ?? sattText
  const vor = anteilFuer(summary.foodBefore)
  const nach = anteilFuer(summary.state.totalFood)
  const [fuell, setFuell] = useState(vor)
  useEffect(() => {
    // Der Balken füllt sich, während die Schlange frisst. Beim Aufstieg läuft er erst voll.
    const t = window.setTimeout(() => setFuell(summary.leveledUp ? 100 : nach), 700)
    return () => window.clearTimeout(t)
  }, [summary.leveledUp, nach])
  const ablauf: Ablauf = gewachsen
    ? [['happy', 0]]
    : reaktion
      ? [['standard', 0], ['eating', 1], ['happy', fresszeit]]
      : [['happy', 0]]

  return (
    <section className="schlange" aria-label={`${state.name}, ${STAGES[stufe - 1].name}`}>
      <Blase text={text} />
      <SchlangenBild
        key={gewachsen ? 'neu' : 'alt'} stufe={stufe} alt={`${state.name} die Schlange`} ruhe="stimmung-froh" extra={gewachsen ? 'waechst' : ''}
        ablauf={ablauf} art={gewachsen ? undefined : reaktion?.art} fluege={gewachsen ? [] : reaktion?.fluege}
        gefuehl={gewachsen ? '🥳' : reaktion?.gefuehl} viele={anzahl > 1}
      />
      {gewachsen
        ? <FortschrittBalken key="neu" anteil={nach} totalFood={summary.state.totalFood} />
        : <FortschrittBalken key="alt" anteil={fuell} totalFood={summary.leveledUp ? summary.foodBefore : summary.state.totalFood} />}
    </section>
  )
}
