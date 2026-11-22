import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Blase } from './Snake.tsx'
import { spruch } from './reaktion.ts'
import { sprich, stoppe } from './stimme.ts'

interface Schritt {
  bild: string
  szene: string[]
  text: string
}

/** Drei kurze Bildschirme, die den Kreislauf zeigen: Aufgabe, Futter, Wachsen und Münzen. Die Schlange spricht, alles ist vorlesbar. */
export function Einfuehrung({ name, onFertig }: { name: string; onFertig: () => void }) {
  const [nr, setNr] = useState(0)
  const [schritte] = useState<Schritt[]>(() => [
    { bild: 'baby-happy', szene: ['7 + 3', '➡️', '🧮'], text: spruch('intro1') },
    { bild: 'baby-eating', szene: ['✅', '🐭', '😋', '❌', '👟', '🤪'], text: spruch('intro2') },
    { bild: 'baby-surprised', szene: ['🍽️', '➡️', '🐍', '➡️', '🪙', '🪴'], text: spruch('intro3') },
  ])
  const s = schritte[nr]
  const letzter = nr === schritte.length - 1

  useEffect(() => {
    const t = window.setTimeout(() => sprich(s.text), 300)
    return () => { window.clearTimeout(t); stoppe() }
  }, [s.text])

  function weiter() {
    if (letzter) onFertig()
    else setNr(nr + 1)
  }

  return (
    <main className="start einfuehrung">
      <AnimatePresence mode="wait">
        <motion.div
          key={nr} className="intro-buehne"
          initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <Blase text={s.text} />
          <motion.img
            className="willkommen-bild" src={`${import.meta.env.BASE_URL}images/snake/app/${s.bild}.webp`} alt={`${name}, die Schlange`}
            animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="intro-szene" aria-hidden="true">
            {s.szene.map((z, i) => (
              <motion.span
                key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 12, delay: 0.25 + 0.12 * i }}
              >
                {z}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="punkte" aria-label={`Schritt ${nr + 1} von ${schritte.length}`}>
        {schritte.map((_, i) => <span key={i} className={i < nr ? 'punkt fertig' : i === nr ? 'punkt aktuell' : 'punkt'} />)}
      </div>
      <button className="knopf gross hauptknopf" type="button" onClick={weiter} autoFocus>{letzter ? 'Los geht\'s!' : 'Weiter'}</button>
      <button className="link" type="button" onClick={() => sprich(s.text, { immer: true })}>🔊 Nochmal anhören</button>
      {!letzter && <button className="link" type="button" onClick={onFertig}>Überspringen</button>}
    </main>
  )
}
