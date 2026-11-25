import { useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { bildFuer, hintergrundVon, istPokal, platziere, pokalId } from '../logic/shop.ts'
import { pokaleVon } from '../logic/relikte.ts'
import { pokalBild } from './pokal.ts'
import type { Ebene } from '../logic/shop.ts'
import type { GameState } from '../logic/game.ts'

function begrenze(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

interface Zug {
  id: string
  ebene: Ebene
  /** Abstand zwischen Finger und Ankerpunkt beim Anfassen, damit das Ding nicht springt */
  dx: number
  dy: number
  x: number
  y: number
}

/** Das Zuhause der Schlange: Hintergrund, gekaufte Dinge (verschiebbar) und die Schlange (als children). */
export function Terrarium({ state, onChange, children }: { state: GameState; onChange: (s: GameState) => void; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [zug, setZug] = useState<Zug | null>(null)
  // Pokale gehören zur Sammlung: Sie stehen automatisch im Terrarium und lassen sich wie alle Dinge verschieben.
  const dinge = platziere([...(state.gekauft ?? []), ...pokaleVon(state).map(pokalId)], state.positionen)

  function prozent(e: PointerEvent): { px: number; py: number } {
    const r = box.current!.getBoundingClientRect()
    return { px: ((e.clientX - r.left) / r.width) * 100, py: ((e.clientY - r.top) / r.height) * 100 }
  }

  function an(e: PointerEvent<HTMLImageElement>, id: string, ebene: Ebene, x: number, y: number) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const { px, py } = prozent(e)
    setZug({ id, ebene, dx: px - x, dy: py - y, x, y })
  }

  function bewege(e: PointerEvent<HTMLImageElement>) {
    if (!zug) return
    const { px, py } = prozent(e)
    const oben = zug.ebene === 'oben'
    setZug({ ...zug, x: begrenze(px - zug.dx, 5, 95), y: oben ? begrenze(py - zug.dy, 0, 60) : begrenze(py - zug.dy, 25, 100) })
  }

  function los() {
    if (!zug) return
    onChange({ ...state, positionen: { ...state.positionen, [zug.id]: { x: Math.round(zug.x * 10) / 10, y: Math.round(zug.y * 10) / 10 } } })
    setZug(null)
  }

  return (
    <>
      <div className="terrarium" ref={box}>
        <img className="terra-hintergrund" src={bildFuer(hintergrundVon(state))} alt="" draggable={false} />
        {dinge.map(({ item, x, y, hinten }) => {
          const gezogen = zug?.id === item.id
          return (
            <img
              key={item.id} className={`deko ${item.ebene === 'oben' ? 'oben' : ''} ${hinten ? 'hinten' : 'vorn'} ${gezogen ? 'gezogen' : ''}`}
              src={istPokal(item.id) ? pokalBild(item.id) : bildFuer(item.id)} alt={`${item.name}, zum Verschieben ziehen`} draggable={false}
              style={{ left: `${gezogen ? zug.x : x}%`, top: `${gezogen ? zug.y : y}%`, width: `${item.breite}%` }}
              onPointerDown={(e) => an(e, item.id, item.ebene, x, y)} onPointerMove={bewege} onPointerUp={los} onPointerCancel={() => setZug(null)}
            />
          )
        })}
        {children}
      </div>
    </>
  )
}
