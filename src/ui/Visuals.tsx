import type { ReactNode } from 'react'
import type { Task, Visual } from '../logic/tasks.ts'
import { FigurenReihe } from './Figuren.tsx'

const BLAU = '#3b82c4'
const ROT = '#e04848'

export function Zahlbild({ tens, ones }: { tens: number; ones: number }) {
  const stangeB = 26
  const abstand = 8
  const hoehe = 130
  const punktR = 5
  const breite = tens * (stangeB + abstand) + (ones > 0 ? 40 : 0) + 8
  return (
    <svg
      viewBox={`0 0 ${Math.max(breite, 40)} ${hoehe + 10}`}
      width={Math.max(breite, 40)}
      height={hoehe + 10}
      role="img"
      aria-label={`${tens} Zehner und ${ones} Einer`}
    >
      {Array.from({ length: tens }, (_, i) => {
        const x = 4 + i * (stangeB + abstand)
        return (
          <g key={i}>
            <rect x={x} y={4} width={stangeB} height={hoehe} rx={4} fill="#e8f1fa" stroke="#26588a" strokeWidth={2} />
            {Array.from({ length: 10 }, (_, k) => (
              <circle key={k} cx={x + stangeB / 2} cy={4 + 9 + k * 12.4} r={punktR} fill={BLAU} />
            ))}
          </g>
        )
      })}
      {Array.from({ length: ones }, (_, k) => (
        <circle key={k} cx={4 + tens * (stangeB + abstand) + 14} cy={12 + k * 13} r={punktR + 1} fill={ROT} />
      ))}
    </svg>
  )
}

export function Stellentafel({ tens, ones }: { tens: number | null; ones: number | null }) {
  return (
    <table className="stellentafel" aria-label="Stellentafel">
      <thead>
        <tr><th>Z</th><th>E</th></tr>
      </thead>
      <tbody>
        <tr><td>{tens ?? ''}</td><td>{ones ?? ''}</td></tr>
      </tbody>
    </table>
  )
}

interface StrahlProps {
  from: number
  to: number
  tickStep: number
  labelStep: number
  marker?: number
  selected?: number | null
  snap?: number
  onPick?: (value: number) => void
}

export function Zahlenstrahl({ from, to, tickStep, labelStep, marker, selected, snap = 1, onPick }: StrahlProps) {
  const W = 640
  const links = 30
  const innen = W - 2 * links
  const x = (v: number) => links + ((v - from) / (to - from)) * innen
  const ticks: number[] = []
  for (let v = from; v <= to; v += tickStep) ticks.push(v)

  function pick(e: React.PointerEvent<SVGSVGElement>) {
    if (!onPick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const roh = from + ((px - links) / innen) * (to - from)
    const gerastert = from + Math.round((roh - from) / snap) * snap
    onPick(Math.min(to, Math.max(from, gerastert)))
  }

  return (
    <svg
      className={onPick ? 'strahl strahl-eingabe' : 'strahl'}
      viewBox={`0 0 ${W} 120`}
      onPointerDown={pick}
      onPointerMove={(e) => e.buttons === 1 && pick(e)}
      role="img"
      aria-label={`Zahlenstrahl von ${from} bis ${to}`}
    >
      <line x1={links - 10} y1={70} x2={W - links + 10} y2={70} stroke="#26588a" strokeWidth={3} />
      {ticks.map((v) => {
        const gross = (v - from) % labelStep === 0
        return (
          <g key={v}>
            <line x1={x(v)} y1={gross ? 56 : 62} x2={x(v)} y2={gross ? 84 : 78} stroke="#26588a" strokeWidth={gross ? 3 : 2} />
            {gross && (
              <text x={x(v)} y={108} textAnchor="middle" fontSize={22} fill="#1f3b57" fontWeight={500}>{v}</text>
            )}
          </g>
        )
      })}
      {marker !== undefined && <Pfeil px={x(marker)} farbe={ROT} />}
      {selected !== undefined && selected !== null && <Pfeil px={x(selected)} farbe="#2f9e5a" />}
    </svg>
  )
}

function Pfeil({ px, farbe }: { px: number; farbe: string }) {
  return <polygon points={`${px - 11},18 ${px + 11},18 ${px},52`} fill={farbe} />
}

export function VisualView({ visual }: { visual: Visual }) {
  if (visual.kind === 'zahlbilder') {
    return (
      <div className="zahlbilder">
        {visual.items.map((it, i) => (
          <Zahlbild key={i} tens={it.tens} ones={it.ones} />
        ))}
      </div>
    )
  }
  if (visual.kind === 'stellentafel') return <Stellentafel tens={visual.tens} ones={visual.ones} />
  if (visual.kind === 'figuren') return <FigurenReihe items={visual.items} />
  return <Zahlenstrahl {...visual} />
}

/** Zeigt die Lösung als Bild: Zahlenstrahl mit Pfeil, Zahlbild oder Stellentafel. */
export function LoesungsBild({ task }: { task: Task }) {
  const i = task.input
  let inhalt: ReactNode = null
  if (i.kind === 'line') {
    inhalt = <Zahlenstrahl from={i.from} to={i.to} tickStep={i.tickStep} labelStep={i.labelStep} marker={i.answer} />
  } else if (i.kind === 'build') {
    inhalt = <div className="zahlbilder"><Zahlbild tens={i.tens} ones={i.ones} /></div>
  } else if (i.kind === 'pair' && task.type === 'A2') {
    inhalt = <Stellentafel tens={i.answer[0]} ones={i.answer[1]} />
  } else if (i.kind === 'figuren') {
    inhalt = <FigurenReihe items={[i.karten[i.answer]]} />
  } else if (task.visual) {
    inhalt = <VisualView visual={task.visual} />
  }
  return inhalt ? <div className="loesungsbild">{inhalt}</div> : null
}
