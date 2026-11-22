import type { Stufe } from '../logic/tasks.ts'

interface Props {
  /** Stufen aller Aufgaben der Runde, in Reihenfolge */
  stufen: Stufe[]
  /** Nummer der aktuellen Aufgabe, beginnend bei 0 */
  index: number
}

/** Fortschrittsleiste als Treppe: Je höher die Stufe der Aufgabe, desto höher die Treppenstufe. */
export function Treppe({ stufen, index }: Props) {
  return (
    <div className="treppe" role="img" aria-label={`Aufgabe ${index + 1} von ${stufen.length}`}>
      {stufen.map((s, i) => (
        <span key={i} className={`treppe-stufe h${s} ${i < index ? 'fertig' : i === index ? 'aktuell' : ''}`} />
      ))}
    </div>
  )
}
