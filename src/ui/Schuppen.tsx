import { STUFEN_NAMEN } from '../logic/tasks.ts'
import type { Stufe } from '../logic/tasks.ts'

/** Farbe der Schuppen je Stufe (siehe docs/specs/2026-11-22-feedback-runde-1/design.md, 2.2). */
const FARBE: Record<Stufe, string> = { 1: 'var(--lime)', 2: 'var(--amber)', 3: '#b9a4ff' }

/** Eine Sechseck-Schuppe. Gefüllt oder nur als Umriss. */
function Schuppe({ gefuellt, farbe }: { gefuellt: boolean; farbe: string }) {
  return (
    <svg viewBox="0 0 24 26" aria-hidden="true" className="schuppe">
      <polygon
        points="12,1.5 22,7 22,19 12,24.5 2,19 2,7"
        fill={gefuellt ? farbe : 'none'} stroke={gefuellt ? 'rgba(10,31,25,.55)' : farbe} strokeWidth="2.4" strokeLinejoin="round"
      />
      {gefuellt && <polygon points="12,5 17.5,8 12,11" fill="rgba(255,255,255,.4)" />}
    </svg>
  )
}

interface Props {
  stufe: Stufe
  /** Mit Wort daneben ("leicht", "mittel", "knifflig") */
  mitWort?: boolean
  klein?: boolean
}

/**
 * Schwierigkeit als 1 bis 3 gefüllte Schuppen von 3. Die Anzahl der gefüllten Schuppen trägt die Aussage,
 * die Farbe ist nur Zugabe. Screenreader bekommen das Wort.
 */
export function Schuppen({ stufe, mitWort = false, klein = false }: Props) {
  return (
    <span className={`schuppen${klein ? ' klein' : ''} s${stufe}`} role="img" aria-label={`Schwierigkeit: ${STUFEN_NAMEN[stufe]}, ${stufe} von 3 Schuppen`}>
      {([1, 2, 3] as Stufe[]).map((n) => <Schuppe key={n} gefuellt={n <= stufe} farbe={FARBE[stufe]} />)}
      {mitWort && <span className="schuppen-wort" aria-hidden="true">{STUFEN_NAMEN[stufe]}</span>}
    </span>
  )
}
