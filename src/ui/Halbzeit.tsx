import { motion } from 'motion/react'
import { nextStageFood } from '../logic/game.ts'
import { STAGES } from '../logic/config.ts'

interface Props {
  name: string
  text: string
  /** Futter bis jetzt in dieser Runde */
  gewonnen: number
  /** Gesamtfutter inklusive dieser Runde bis jetzt */
  gesamt: number
  /** Tageslimit erreicht: heute gibt es kein Futter mehr */
  satt: boolean
  onWeiter: () => void
  onPause: () => void
}

/** Zwischenstopp nach Aufgabe 5: Sehen, wie weit es schon ist. Keine Pflicht, keine Münze. */
export function Halbzeit({ name, text, gewonnen, gesamt, satt, onWeiter, onPause }: Props) {
  const naechste = nextStageFood(gesamt)
  const zielName = naechste === null ? null : STAGES.find((s) => s.foodFrom === naechste)?.name
  const naechsterName = zielName === 'Erwachsen' ? 'Erwachsenen' : zielName
  return (
    <motion.div className="dialog-hintergrund" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div
        className="dialog halbzeit" role="dialog" aria-modal="true" aria-labelledby="halbzeit-titel"
        initial={{ scale: 0.5, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      >
        <h2 id="halbzeit-titel" className="dialog-text">Halbzeit!</h2>
        <p className="halbzeit-spruch">{text}</p>
        {satt
          ? <p className="klein-text">{name} ist heute satt. Üben hilft trotzdem!</p>
          : <p className="halbzeit-zahl"><span aria-hidden="true">🐭</span> {gewonnen} Futter gesammelt</p>}
        {!satt && naechste !== null && naechsterName && <p className="klein-text">Noch {naechste - gesamt} Futter, dann wächst {name} zum {naechsterName}.</p>}
        <button className="knopf gross hauptknopf" type="button" autoFocus onClick={onWeiter}>Weiter</button>
        <button className="knopf klein" type="button" onClick={onPause}>Pause machen</button>
      </motion.div>
    </motion.div>
  )
}
