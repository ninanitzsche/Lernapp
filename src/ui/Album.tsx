import { useState } from 'react'
import type { GameState } from '../logic/game.ts'
import { rueckblickZeilen, titelVon } from '../logic/rueckblick.ts'
import { ART_SYMBOL } from './Haeutung.tsx'

function datumLesbar(d: string): string {
  const [y, m, t] = d.split('-')
  return `${t}.${m}.${y}`
}

/** "Meine Häute": alle bisherigen Meilensteine, neueste zuerst. Antippen zeigt den Rückblick von damals. */
export function Album({ state }: { state: GameState }) {
  const [offen, setOffen] = useState<string | null>(null)
  const liste = [...state.meilensteine].reverse()
  if (liste.length === 0) {
    return <p className="ergebnis-text">Noch keine Haut im Album. Übe ein paar Runden, dann häutet sich {state.name} zum ersten Mal.</p>
  }
  return (
    <ul className="album">
      {liste.map((m) => {
        const zeilen = rueckblickZeilen(m.rueckblick)
        const aufgeklappt = offen === m.id
        return (
          <li key={m.id}>
            <button
              type="button" className={`album-karte${aufgeklappt ? ' offen' : ''}`} aria-expanded={aufgeklappt}
              onClick={() => setOffen(aufgeklappt ? null : m.id)}
            >
              <span className="album-symbol" aria-hidden="true">{ART_SYMBOL[m.art]}</span>
              <span className="album-text">
                <span className="album-titel">{titelVon(m, state.name)}</span>
                <span className="album-datum">{datumLesbar(m.datum)}</span>
                {aufgeklappt && zeilen.map((z) => <span key={z} className="album-zeile">{z}</span>)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
