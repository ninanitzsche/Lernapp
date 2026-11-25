import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Info } from './Info.tsx'
import { SHOP, bildFuer, kannKaufen, kaufen, kontostand } from '../logic/shop.ts'
import type { GameState } from '../logic/game.ts'
import { spruch } from './reaktion.ts'
import { sprich } from './stimme.ts'
import { klang } from './klang.ts'

export function Muenzen({ n }: { n: number }) {
  return (
    <motion.span
      key={n} className="muenzen" aria-label={`${n} Münzen`}
      initial={{ scale: 1.5, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}
    >
      <span aria-hidden="true">🪙</span> {n}
    </motion.span>
  )
}

export function Shop({ state, onChange }: { state: GameState; onChange: (s: GameState) => void }) {
  const [wahl, setWahl] = useState<string | null>(null)
  const [meldung, setMeldung] = useState('')
  const stand = kontostand(state)
  const angebot = SHOP.filter((i) => !(state.gekauft ?? []).includes(i.id)).sort((a, b) => a.preis - b.preis)

  function kauf(id: string) {
    const neu = kaufen(state, id)
    if (!neu) return
    const name = SHOP.find((i) => i.id === id)?.name ?? ''
    onChange(neu)
    klang('kauf')
    setWahl(null)
    setMeldung(`${name} ist jetzt im Terrarium.`)
    sprich(spruch('gekauft'))
  }

  return (
    <section className="shop" id="shop" aria-label="Shop">
      <div className="shop-kopf">
        <h3>Shop</h3>
        <Muenzen n={stand} />
      </div>
      <Info titel="Wie bekomme ich Münzen?">
        Für die erste Runde jeden Tages, für Sterne, neue Stufen und starke Knobelrunden. Gekaufte Dinge kannst du im Terrarium hin- und herziehen.
      </Info>
      {meldung && <p className="satt" role="status">{meldung}</p>}
      {angebot.length === 0 ? (
        <p>Du hast alles gekauft. Wow!</p>
      ) : (
        <div className="shop-liste">
          <AnimatePresence mode="popLayout">
          {angebot.map((i) => {
            const geht = kannKaufen(state, i.id)
            return (
              <motion.div
                key={i.id} layout className={`shop-karte ${geht ? '' : 'gesperrt'}`}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: geht ? 1 : 0.72 }}
                exit={{ scale: 1.3, opacity: 0, rotate: 8 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              >
                <img src={bildFuer(i.id)} alt="" draggable={false} loading="lazy" />
                <span className="shop-name">{i.name}</span>
                {wahl === i.id ? (
                  <span className="zeile">
                    <button className="knopf" type="button" onClick={() => kauf(i.id)}>Kaufen</button>
                    <button className="knopf klein" type="button" onClick={() => setWahl(null)}>Nein</button>
                  </span>
                ) : (
                  <button className="knopf klein preis" type="button" disabled={!geht} onClick={() => setWahl(i.id)} aria-label={`${i.name} für ${i.preis} Münzen`}>
                    <span aria-hidden="true">🪙</span> {i.preis}
                  </button>
                )}
              </motion.div>
            )
          })}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
