import { useState } from 'react'
import type { GameState } from '../logic/game.ts'
import { rueckblickZeilen, titelVon } from '../logic/rueckblick.ts'
import { ART_SYMBOL } from './Haeutung.tsx'
import { TOPICS, TOPIC_NAMES } from '../logic/tasks.ts'
import { MAX_STERNE, fehltText, fortschritt } from '../logic/kompetenz.ts'
import { pokalId } from '../logic/shop.ts'
import { pokalBild } from './pokal.ts'

function datumLesbar(d: string): string {
  const [y, m, t] = d.split('-')
  return `${t}.${m}.${y}`
}

/**
 * Wissensalbum: Jedes Lernfeld mit seinen fünf Sternen. Gemeisterte Lernfelder bleiben dauerhaft sichtbar,
 * unabhängig davon, wo ihr Pokal im Terrarium steht. Die Illustration ist ein Platzhalter bis zur freigegebenen Grafik.
 */
export function Wissensalbum({ state }: { state: GameState }) {
  return (
    <section className="wissensalbum" aria-label="Wissensalbum">
      <h3>Wissensalbum</h3>
      <ul className="album">
        {TOPICS.map((t) => {
          const sterne = state.sterneErreicht[t]
          const fertig = sterne >= MAX_STERNE
          const abschluss = state.meilensteine.find((m) => m.id === `lernfeld-${t}`)
          const f = fortschritt(sterne, state.nachweise[t], t)
          return (
            <li key={t}>
              <div className={`album-karte wissen${fertig ? ' fertig' : ''}`}>
                {fertig
                  ? <img className="album-pokal" src={pokalBild(pokalId(t))} alt="" draggable={false} />
                  : <span className="album-symbol" aria-hidden="true">🔒</span>}
                <span className="album-text">
                  <span className="album-titel">{TOPIC_NAMES[t]}</span>
                  <span className="album-zeile">{sterne} von {MAX_STERNE} Sternen</span>
                  {fertig && <span className="album-datum">Gemeistert{abschluss ? ` am ${datumLesbar(abschluss.datum)}` : ''}</span>}
                  {!fertig && f && <span className="album-zeile">Nächstes Ziel: {f.ziel}. {fehltText(f)}</span>}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
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
