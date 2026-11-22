import { useEffect, useState } from 'react'
import type { Response, Task } from '../logic/tasks.ts'
import { VisualView, Zahlbild, Zahlenstrahl } from './Visuals.tsx'
import { sprich } from './stimme.ts'

interface Props {
  task: Task
  attempt: 1 | 2
  onSubmit: (response: Response) => void
}

const AUTO_KEY = 'mathe-schlange-vorlesen'

function autoVorlesenAn(): boolean {
  try { return localStorage.getItem(AUTO_KEY) === 'an' } catch { return false }
}

function vorlesen(text: string) {
  // Aufgaben deutlich und etwas langsamer, aber mit der gleichen freundlichen Stimme.
  sprich(text, { immer: true, pitch: 1.3, rate: 0.92 })
}

function parseZahl(text: string): number | null {
  const t = text.trim()
  return /^\d{1,3}$/.test(t) ? Number(t) : null
}

export function TaskView({ task, attempt, onSubmit }: Props) {
  const kannSprechen = 'speechSynthesis' in window
  const [auto, setAuto] = useState(autoVorlesenAn)

  // Beim ersten Versuch liest die App die Aufgabe vor, wenn das Kind es so eingestellt hat.
  useEffect(() => {
    if (kannSprechen && auto && attempt === 1) {
      const t = window.setTimeout(() => vorlesen(task.prompt), 400)
      return () => window.clearTimeout(t)
    }
  }, [task, attempt, auto, kannSprechen])

  function umschalten() {
    const neu = !auto
    setAuto(neu)
    try { localStorage.setItem(AUTO_KEY, neu ? 'an' : 'aus') } catch { /* optional */ }
    if (neu) vorlesen(task.prompt)
  }

  return (
    <div className="aufgabe">
      <div className="aufgabe-kopf">
        <p className="aufgabe-text">{task.prompt}</p>
        {kannSprechen && (
          <div className="vorlesen-box">
            <button className="knopf vorlesen" type="button" onClick={() => vorlesen(task.prompt)} aria-label="Aufgabe vorlesen">
              <span aria-hidden="true">🔊</span> Vorlesen
            </button>
            <label className="auto-vorlesen">
              <input type="checkbox" checked={auto} onChange={umschalten} /> immer
            </label>
          </div>
        )}
      </div>
      {attempt === 2 && <p className="hinweis"><span className="gluehbirne" aria-hidden="true">💡</span> Tipp: {task.hint}</p>}
      {task.visual && <VisualView visual={task.visual} />}
      <Eingabe task={task} onSubmit={onSubmit} />
    </div>
  )
}

function Eingabe({ task, onSubmit }: { task: Task; onSubmit: (r: Response) => void }) {
  const input = task.input
  switch (input.kind) {
    case 'number': return <ZahlEingabe onSubmit={onSubmit} />
    case 'pair': return <PaarEingabe labels={input.labels} onSubmit={onSubmit} />
    case 'choice': return <Auswahl options={input.options} onSubmit={onSubmit} />
    case 'order': return <Ordnen numbers={input.numbers} onSubmit={onSubmit} />
    case 'build': return <Legen onSubmit={onSubmit} />
    case 'line': return <StrahlEingabe input={input} onSubmit={onSubmit} />
    case 'cards': return <Karten pool={input.pool} laenge={input.answer.length} onSubmit={onSubmit} />
  }
}

function ZahlEingabe({ onSubmit }: { onSubmit: (r: Response) => void }) {
  const [felder, setFelder] = useState<string[]>([''])
  const zahl = parseZahl(felder[0])
  return (
    <Ziffernblock felder={felder} setFelder={setFelder} onSubmit={() => zahl !== null && onSubmit(zahl)} bereit={zahl !== null} labels={[]} />
  )
}

function PaarEingabe({ labels, onSubmit }: { labels: [string, string]; onSubmit: (r: Response) => void }) {
  const [felder, setFelder] = useState<string[]>(['', ''])
  const za = parseZahl(felder[0])
  const zb = parseZahl(felder[1])
  const bereit = za !== null && zb !== null
  return (
    <Ziffernblock felder={felder} setFelder={setFelder} onSubmit={() => bereit && onSubmit([za, zb])} bereit={bereit} labels={labels} />
  )
}

/** Eigenes Zifferfeld: die Handy-Tastatur bleibt zu, die Aufgabe bleibt sichtbar. Am Rechner gehen auch Tastatur und Enter. */
function Ziffernblock({ felder, setFelder, onSubmit, bereit, labels }: {
  felder: string[]
  setFelder: (f: string[]) => void
  onSubmit: () => void
  bereit: boolean
  labels: string[]
}) {
  const [aktiv, setAktiv] = useState(0)

  function ziffer(z: string) {
    const alt = felder[aktiv]
    if (alt.length >= 3) return
    const neu = alt + z
    setFelder(felder.map((t, i) => (i === aktiv ? neu : t)))
    // Nach zwei Ziffern geht es zum nächsten Feld (außer bei 10, das könnte 100 werden).
    if (neu.length === 2 && neu !== '10' && aktiv < felder.length - 1) setAktiv(aktiv + 1)
  }
  function loeschen() {
    setFelder(felder.map((t, i) => (i === aktiv ? t.slice(0, -1) : t)))
  }

  useEffect(() => {
    function taste(e: KeyboardEvent) {
      if (/^\d$/.test(e.key)) ziffer(e.key)
      else if (e.key === 'Backspace') loeschen()
      else if (e.key === 'Enter') { if ((e.target as HTMLElement).tagName !== 'BUTTON') onSubmit() }
      else if (e.key === 'Tab' && felder.length > 1) { e.preventDefault(); setAktiv((aktiv + 1) % felder.length) }
    }
    window.addEventListener('keydown', taste)
    return () => window.removeEventListener('keydown', taste)
  })

  return (
    <div className="eingabe spalte">
      <div className="anzeigen">
        {felder.map((t, i) => (
          <button
            key={i} type="button" className={`anzeige ${i === aktiv ? 'aktiv' : ''}`} onClick={() => setAktiv(i)}
            aria-label={labels[i] ? `${labels[i]}: ${t || 'leer'}` : `Deine Antwort: ${t || 'leer'}`}
          >
            {labels[i] && <span className="anzeige-label">{labels[i]}</span>}
            <span className="anzeige-zahl">{t || ' '}</span>
          </button>
        ))}
      </div>
      <div className="ziffernblock" role="group" aria-label="Zifferfeld">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((z) => (
          <button key={z} type="button" className="knopf ziffer" onClick={() => ziffer(z)}>{z}</button>
        ))}
        <button type="button" className="knopf klein ziffer loeschen" onClick={loeschen} aria-label="Letzte Ziffer löschen">⌫</button>
        <button type="button" className="knopf ziffer pruefen" disabled={!bereit} onClick={onSubmit} aria-label="Prüfen">✓</button>
      </div>
    </div>
  )
}

function Auswahl({ options, onSubmit }: { options: string[]; onSubmit: (r: Response) => void }) {
  return (
    <div className="auswahl">
      {options.map((o, i) => (
        <button key={i} className="knopf gross" type="button" onClick={() => onSubmit(i)}>{o}</button>
      ))}
    </div>
  )
}

function Ordnen({ numbers, onSubmit }: { numbers: number[]; onSubmit: (r: Response) => void }) {
  const [gewaehlt, setGewaehlt] = useState<number[]>([])
  const fertig = gewaehlt.length === numbers.length
  return (
    <div className="eingabe spalte">
      <div className="auswahl">
        {numbers.map((n) => (
          <button key={n} className="knopf gross" type="button" disabled={gewaehlt.includes(n)} onClick={() => setGewaehlt([...gewaehlt, n])}>{n}</button>
        ))}
      </div>
      <p className="reihenfolge">Deine Reihenfolge: {gewaehlt.length ? gewaehlt.join(' < ') : '...'}</p>
      <div className="zeile">
        <button className="knopf klein" type="button" onClick={() => setGewaehlt([])}>Neu anfangen</button>
        <button className="knopf" type="button" disabled={!fertig} onClick={() => onSubmit(gewaehlt)}>Prüfen</button>
      </div>
    </div>
  )
}

function Legen({ onSubmit }: { onSubmit: (r: Response) => void }) {
  const [z, setZ] = useState(0)
  const [e, setE] = useState(0)
  return (
    <div className="eingabe spalte">
      <div className="zahlbilder"><Zahlbild tens={z} ones={e} /></div>
      <div className="zeile">
        <button className="knopf" type="button" disabled={z >= 9} onClick={() => setZ(z + 1)}>+ Zehner</button>
        <button className="knopf klein" type="button" disabled={z <= 0} onClick={() => setZ(z - 1)}>- Zehner</button>
        <button className="knopf" type="button" disabled={e >= 9} onClick={() => setE(e + 1)}>+ Einer</button>
        <button className="knopf klein" type="button" disabled={e <= 0} onClick={() => setE(e - 1)}>- Einer</button>
      </div>
      <button className="knopf" type="button" onClick={() => onSubmit([z, e])}>Prüfen</button>
    </div>
  )
}

function StrahlEingabe({ input, onSubmit }: { input: Extract<Task['input'], { kind: 'line' }>; onSubmit: (r: Response) => void }) {
  const [wert, setWert] = useState<number | null>(null)
  // Ein Finger trifft auf dem kleinen Strahl nicht jede Marke: Mit − und + geht es Marke für Marke genauer.
  function schiebe(richtung: -1 | 1) {
    setWert((w) => (w === null ? (richtung > 0 ? input.from : input.to) : Math.min(input.to, Math.max(input.from, w + richtung * input.snap))))
  }
  return (
    <div className="eingabe spalte">
      <Zahlenstrahl
        from={input.from} to={input.to} tickStep={input.tickStep} labelStep={input.labelStep}
        snap={input.snap} selected={wert} onPick={setWert}
      />
      <div className="strahl-wahl">
        <button type="button" className="knopf klein feinstellen" onClick={() => schiebe(-1)} aria-label={`Eine Marke nach links, ${input.snap} weniger`}>−</button>
        <output className="strahl-zahl" aria-live="polite">{wert === null ? '?' : wert}</output>
        <button type="button" className="knopf klein feinstellen" onClick={() => schiebe(1)} aria-label={`Eine Marke nach rechts, ${input.snap} mehr`}>+</button>
      </div>
      <button className="knopf" type="button" disabled={wert === null} onClick={() => wert !== null && onSubmit(wert)}>Prüfen</button>
    </div>
  )
}

function Karten({ pool, laenge, onSubmit }: { pool: string[]; laenge: number; onSubmit: (r: Response) => void }) {
  const [gewaehlt, setGewaehlt] = useState<number[]>([])
  return (
    <div className="eingabe spalte">
      <div className="kartenreihe" aria-label="Deine Karten">
        {gewaehlt.length === 0 && <span className="platzhalter">Tippe die Karten an.</span>}
        {gewaehlt.map((i) => <span key={i} className="karte gewaehlt">{pool[i]}</span>)}
      </div>
      <div className="kartenreihe">
        {pool.map((w, i) => (
          <button key={i} className="karte" type="button" disabled={gewaehlt.includes(i)} onClick={() => setGewaehlt([...gewaehlt, i])}>{w}</button>
        ))}
      </div>
      <div className="zeile">
        <button className="knopf klein" type="button" onClick={() => setGewaehlt(gewaehlt.slice(0, -1))} disabled={gewaehlt.length === 0}>Zurück</button>
        <button className="knopf" type="button" disabled={gewaehlt.length !== laenge} onClick={() => onSubmit(gewaehlt.map((i) => pool[i]))}>Prüfen</button>
      </div>
    </div>
  )
}
