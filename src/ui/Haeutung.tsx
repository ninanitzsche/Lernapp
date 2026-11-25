import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { stageFor } from '../logic/game.ts'
import type { GameState } from '../logic/game.ts'
import type { Meilenstein, MeilensteinArt } from '../logic/meilensteine.ts'
import { bauKarten } from '../logic/rueckblick.ts'
import { konfetti } from './feier.ts'
import { spruch } from './reaktion.ts'
import { klang } from './klang.ts'
import { sprich } from './stimme.ts'

export const ART_SYMBOL: Record<MeilensteinArt | 'mehrere', string> = {
  entwicklung: '🐍', runden: '🏁', stern: '⭐', lernfeld: '🏆', knobel: '🧠', relikt: '🗝️', woche: '📅', mehrere: '🎉',
}

interface Props {
  state: GameState
  /** Neue Meilensteine dieser Runde, schon in Feier-Reihenfolge */
  neu: Meilenstein[]
  onFertig: () => void
}

/**
 * Häutung: Die Schlange schlüpft aus ihrer alten Haut, die als Karte mit Rückblick ins Album kommt.
 * Mehrere Meilensteine kommen nacheinander. Das Kind schließt jede Karte selbst, ohne Zeitdruck.
 */
export function Haeutung({ state, neu, onFertig }: Props) {
  const karten = useMemo(() => bauKarten(neu, state.name, state.meilensteine.length - neu.length), [neu, state.name, state.meilensteine.length])
  const [nr, setNr] = useState(0)
  const karte = karten[nr]
  const [text, setText] = useState(() => spruch('haeutung'))
  const stufe = stageFor(state.totalFood)

  useEffect(() => {
    const aus = konfetti()
    klang('richtig')
    return aus
  }, [nr])

  function weiter() {
    if (nr + 1 < karten.length) { setNr(nr + 1); setText(spruch('haeutung')) } else onFertig()
  }

  return (
    <main className="start haeutung">
      <div className="haut-buehne" aria-hidden="true">
        <motion.img
          className="haut-alt" src={`${import.meta.env.BASE_URL}images/snake/transparent/${stufe.image}`} alt="" draggable={false}
          key={`alt${nr}`} initial={{ x: 0, rotate: 0, opacity: 0.6 }} animate={{ x: -90, rotate: -14, opacity: 0.22 }} transition={{ delay: 0.5, duration: 1.1, ease: 'easeOut' }}
        />
        <motion.img
          className="haut-neu" src={`${import.meta.env.BASE_URL}images/snake/transparent/${stufe.image}`} alt="" draggable={false}
          key={`neu${nr}`} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.3 }}
        />
      </div>
      <motion.section
        key={nr} className="haut-karte" aria-labelledby="haut-titel"
        initial={{ y: -80, opacity: 0, rotate: -3 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.7 }}
      >
        <p className="haut-nummer">{karte.nummer !== undefined ? `Haut Nr. ${karte.nummer}` : 'Neue Häute'} <span aria-hidden="true">{ART_SYMBOL[karte.art]}</span></p>
        <h2 id="haut-titel">{karte.titel}</h2>
        {karte.liste.length > 0 && <ul className="haut-liste">{karte.liste.map((t) => <li key={t}>{t}</li>)}</ul>}
        {karte.zeilen.length > 0 && <ul className="haut-zeilen">{karte.zeilen.map((z) => <li key={z}>{z}</li>)}</ul>}
        {karte.art === 'lernfeld' && <p className="haut-zeilen">Dein Pokal steht jetzt im Terrarium und dein Eintrag im Wissensalbum. Neue Relikte warten auf dich.</p>}
        {karte.muenzen > 0 && <p className="haut-muenzen"><span aria-hidden="true">🪙</span> +{karte.muenzen} {karte.muenzen === 1 ? 'Münze' : 'Münzen'}</p>}
      </motion.section>
      <p className="haut-spruch" role="status">{text}</p>
      <button className="knopf klein vorlesen-klein" type="button" onClick={() => sprich(`${karte.titel}. ${karte.zeilen.join(' ')}`)}>Vorlesen</button>
      <button className="knopf gross hauptknopf" type="button" autoFocus onClick={weiter}>
        {nr + 1 < karten.length ? 'Weiter' : 'Ins Album'}
      </button>
    </main>
  )
}
