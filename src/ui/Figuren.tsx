// Ebene Figuren und Körper als SVG-Komponenten (Lernfeld Raum und Form). Echte Komponenten, keine Bilder.
// Kontur trägt die Form: kräftige Deep-Forest-Kontur, eine ruhige Füllung, bei Körpern drei flache Töne (docs/MATHE_KLASSE2_THEMEN_UND_GEOMETRIE_IDEEN.md, Abschnitt 6).
// Die Farben kommen aus Klassen in index.css (Tokens), nicht aus dieser Datei.
import type { ReactNode } from 'react'
import type { FigurId, FigurRef } from '../logic/tasks.ts'

function Form({ figur, variante = 0 }: FigurRef): ReactNode {
  switch (figur) {
    case 'dreieck':
      return <polygon className="fig-flaeche" points={['50,12 90,86 10,86', '50,88 90,14 10,14', '16,14 16,86 86,86'][variante] ?? '50,12 90,86 10,86'} />
    case 'quadrat':
      return <rect className="fig-flaeche" x="18" y="18" width="64" height="64" />
    case 'rechteck': {
      const r = [[8, 28, 84, 44], [28, 8, 44, 84], [6, 38, 88, 26]][variante] ?? [8, 28, 84, 44]
      return <rect className="fig-flaeche" x={r[0]} y={r[1]} width={r[2]} height={r[3]} />
    }
    case 'viereck':
      return <polygon className="fig-flaeche" points={['14,30 80,16 90,78 24,84', '10,70 36,16 90,28 70,84'][variante] ?? '14,30 80,16 90,78 24,84'} />
    case 'kreis':
      return <circle className="fig-flaeche" cx="50" cy="50" r="38" />
    case 'kugel':
      return (
        <>
          <circle className="fig-mittel" cx="50" cy="50" r="38" />
          <path className="fig-dunkel" d="M78 72 A38 38 0 0 1 28 82 A44 44 0 0 0 78 72 Z" />
          <circle className="fig-hell" cx="36" cy="36" r="9" />
        </>
      )
    case 'wuerfel':
      return (
        <>
          <polygon className="fig-hell" points="10,34 34,12 84,12 60,34" />
          <polygon className="fig-dunkel" points="60,34 84,12 84,62 60,84" />
          <rect className="fig-mittel" x="10" y="34" width="50" height="50" />
        </>
      )
    case 'quader':
      return variante === 1 ? (
        <>
          <polygon className="fig-hell" points="14,36 38,14 74,14 50,36" />
          <polygon className="fig-dunkel" points="50,36 74,14 74,68 50,90" />
          <rect className="fig-mittel" x="14" y="36" width="36" height="54" />
        </>
      ) : (
        <>
          <polygon className="fig-hell" points="6,40 30,18 90,18 66,40" />
          <polygon className="fig-dunkel" points="66,40 90,18 90,58 66,80" />
          <rect className="fig-mittel" x="6" y="40" width="60" height="40" />
        </>
      )
  }
}

/** Eine Figur. `label` ist der Text für Screenreader (Standard: neutral, damit er die Antwort nicht verrät). */
export function Figur({ figur, variante, label = 'Figur' }: FigurRef & { label?: string }) {
  return (
    <svg className="figur" viewBox="0 0 100 100" role="img" aria-label={label}>
      <Form figur={figur} variante={variante} />
    </svg>
  )
}

const KOERPER: FigurId[] = ['kugel', 'wuerfel', 'quader']

/** Mehrere Figuren nebeneinander, zum Beispiel für Aufgaben zur Lage (von links nach rechts) und zum Zählen. */
export function FigurenReihe({ items }: { items: FigurRef[] }) {
  return (
    <div className="figuren" role="group" aria-label="Figuren von links nach rechts">
      {items.map((it, i) => <Figur key={i} {...it} label={KOERPER.includes(it.figur) ? `Körper ${i + 1}` : `Figur ${i + 1}`} />)}
    </div>
  )
}
