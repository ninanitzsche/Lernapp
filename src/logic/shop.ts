import { TOPICS } from './tasks.ts'
import type { GameState } from './game.ts'

// Shop: Für jeden erreichten Stern gibt es eine Münze. Sterne gehen nie verloren, auch wenn der Lernstand später sinkt.
// Die Bilder entstehen mit tools/bilder_aufbereiten.py (Ordner public/images/snake/app/shop/).

export type Ebene = 'boden' | 'oben' | 'hintergrund'

export interface ShopItem {
  id: string
  name: string
  /** Münzen */
  preis: 1 | 2 | 3
  ebene: Ebene
  /** Breite im Terrarium in Prozent der Terrariumbreite */
  breite: number
}

export const STANDARD_HINTERGRUND = 'terrarium1'

const I = (id: string, name: string, preis: 1 | 2 | 3, ebene: Ebene, breite: number): ShopItem => ({ id, name, preis, ebene, breite })

export const SHOP: ShopItem[] = [
  // 1 Münze
  I('knorriger-ast', 'Knorriger Ast', 1, 'boden', 20),
  I('blaetterzweig', 'Blätterzweig', 1, 'boden', 24),
  I('spiralast', 'Spiralast', 1, 'boden', 16),
  I('eckstamm', 'Eckiger Stamm', 1, 'boden', 24),
  I('steinturm', 'Steinturm', 1, 'boden', 18),
  I('gewundener-ast', 'Gewundener Ast', 1, 'boden', 28),
  I('geaest', 'Verzweigtes Geäst', 1, 'boden', 28),
  I('korallenast', 'Korallenast', 1, 'boden', 28),
  I('strauchast', 'Strauchast', 1, 'boden', 28),
  I('korkrinde', 'Korkrinde', 1, 'boden', 26),
  I('rinde', 'Gebogene Rinde', 1, 'boden', 22),
  I('duenner-ast', 'Dünner Ast', 1, 'boden', 28),
  I('ranken', 'Ranken', 1, 'oben', 24),
  I('dichte-liane', 'Dichte Liane', 1, 'oben', 28),
  // 2 Münzen
  I('terrarium2', 'Warmes Licht', 2, 'hintergrund', 100),
  I('alocasia', 'Alocasia', 2, 'boden', 24),
  I('monstera-topf', 'Monstera im Topf', 2, 'boden', 22),
  I('monstera', 'Monstera-Zweig', 2, 'boden', 24),
  I('zimmerpflanze', 'Zimmerpflanze', 2, 'boden', 20),
  I('fliegenfallen', 'Fliegenfallen', 2, 'boden', 22),
  I('wurzelbogen', 'Wurzelbogen', 2, 'boden', 30),
  I('alter-stamm', 'Alter Stamm', 2, 'boden', 24),
  I('moosstamm', 'Moosiger Stamm', 2, 'boden', 30),
  I('bluetenranke', 'Blütenranke', 2, 'boden', 26),
  I('wassernapf', 'Wassernapf', 2, 'boden', 22),
  I('steinhaufen', 'Bunter Steinhaufen', 2, 'boden', 24),
  I('geode', 'Geode', 2, 'boden', 18),
  I('steinweg', 'Steinweg', 2, 'boden', 32),
  I('lianenbogen', 'Lianenbogen', 2, 'oben', 38),
  // 3 Münzen
  I('felshoehle', 'Felshöhle', 3, 'boden', 32),
  I('moos-hoehle', 'Moos-Höhle', 3, 'boden', 32),
  I('wasserfall', 'Wasserfall', 3, 'boden', 28),
  I('brunnen', 'Kleiner Brunnen', 3, 'boden', 26),
  I('fliegenfalle-topf', 'Venusfliegenfalle', 3, 'boden', 20),
  I('kristall', 'Kristall', 3, 'boden', 22),
  I('kristall-rosa', 'Rosa Kristall', 3, 'boden', 22),
  I('runenast', 'Runenast', 3, 'boden', 28),
  I('leuchtpilzast', 'Leuchtpilz-Ast', 3, 'boden', 26),
  I('zauberast', 'Zauberast', 3, 'boden', 26),
  I('goldast', 'Goldener Ast', 3, 'boden', 24),
  I('eisast', 'Eisast', 3, 'boden', 24),
  I('haengematte', 'Hängematte', 3, 'oben', 36),
  I('haengebruecke', 'Hängebrücke', 3, 'oben', 38),
  I('discokugel', 'Discokugel', 3, 'oben', 16),
]

export function itemFor(id: string): ShopItem | undefined {
  return SHOP.find((i) => i.id === id)
}

export function bildFuer(id: string): string {
  return `${import.meta.env.BASE_URL}images/snake/app/shop/${id}.webp`
}

/** Münzen, die insgesamt verdient wurden: ein Stern = eine Münze, dazu je eine für Stufenaufstieg und Wochenziel. */
export function verdiente(state: GameState): number {
  return TOPICS.reduce((s, t) => s + (state.sterneErreicht?.[t] ?? 0), 0) + (state.bonusMuenzen ?? 0)
}

export function ausgegeben(state: GameState): number {
  return (state.gekauft ?? []).reduce((s, id) => s + (itemFor(id)?.preis ?? 0), 0)
}

export function kontostand(state: GameState): number {
  return verdiente(state) - ausgegeben(state)
}

export function kannKaufen(state: GameState, id: string): boolean {
  const item = itemFor(id)
  return !!item && !(state.gekauft ?? []).includes(id) && kontostand(state) >= item.preis
}

export function kaufen(state: GameState, id: string): GameState | null {
  return kannKaufen(state, id) ? { ...state, gekauft: [...(state.gekauft ?? []), id] } : null
}

export function hintergrundVon(state: GameState): string {
  return (state.gekauft ?? []).includes('terrarium2') ? 'terrarium2' : STANDARD_HINTERGRUND
}

// Feste Plätze: zuerst die Ränder, damit die Schlange in der Mitte frei bleibt. x = Mitte in Prozent, y = Fußpunkt (unten) bzw. Oberkante (oben).
const BODEN_PLAETZE = [
  { x: 17, y: 93 }, { x: 83, y: 93 }, { x: 33, y: 95 }, { x: 68, y: 95 }, { x: 10, y: 84 },
  { x: 90, y: 84 }, { x: 50, y: 88 }, { x: 24, y: 79 }, { x: 76, y: 79 },
]
const OBEN_PLAETZE = [{ x: 28, y: 3 }, { x: 72, y: 3 }, { x: 50, y: 3 }, { x: 15, y: 3 }, { x: 85, y: 3 }]

export interface Platziert {
  item: ShopItem
  x: number
  y: number
  /** Der erste Platz in der Mitte liegt hinter der Schlange. */
  hinten: boolean
}

/** Verteilt die gekauften Dinge in der Reihenfolge des Kaufs auf die Plätze. */
export function platziere(gekauft: string[], positionen: Record<string, { x: number; y: number }> = {}): Platziert[] {
  let boden = 0
  let oben = 0
  const result: Platziert[] = []
  for (const id of gekauft) {
    const item = itemFor(id)
    if (!item || item.ebene === 'hintergrund') continue
    if (item.ebene === 'boden') {
      const p = BODEN_PLAETZE[boden % BODEN_PLAETZE.length]
      const eigene = positionen[id]
      result.push(eigene ? { item, x: eigene.x, y: eigene.y, hinten: eigene.x > 38 && eigene.x < 62 } : { item, x: p.x, y: p.y, hinten: p.x === 50 })
      boden += 1
    } else {
      const p = OBEN_PLAETZE[oben % OBEN_PLAETZE.length]
      const eigene = positionen[id]
      result.push({ item, x: eigene?.x ?? p.x, y: eigene?.y ?? p.y, hinten: true })
      oben += 1
    }
  }
  return result
}
