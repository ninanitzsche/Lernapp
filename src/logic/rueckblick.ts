// Texte und Karten der Häutungs-Feier. Reine Logik ohne React, damit die Regeln aus R5.3 und R5.4 testbar sind.
import { STAGES } from './config.ts'
import { TOPIC_NAMES, TYPE_NAMES } from './tasks.ts'
import type { TaskType } from './tasks.ts'
import type { Meilenstein, MeilensteinArt, Rueckblick } from './meilensteine.ts'

/** Höchstens drei kurze Aussagen, alle aus gespeicherten Daten. */
export function rueckblickZeilen(rb: Rueckblick): string[] {
  const zeilen: string[] = []
  if (rb.aufgaben > 0) zeilen.push(`${rb.aufgaben} ${rb.aufgaben === 1 ? 'Aufgabe' : 'Aufgaben'} gelöst an ${rb.tage} ${rb.tage === 1 ? 'Tag' : 'Tagen'}.`)
  if (rb.quote > 0) zeilen.push(`${Math.round(rb.quote * 100)} von 100 gleich beim ersten Mal richtig.`)
  if (rb.staerkstesThema) zeilen.push(`Am stärksten: ${TOPIC_NAMES[rb.staerkstesThema]}.`)
  return zeilen.slice(0, 3)
}

export function titelVon(m: Meilenstein, name: string): string {
  const [art, a, b] = m.id.split('-')
  switch (art) {
    case 'entwicklung': return `${name} ist gewachsen: ${STAGES[Number(a) - 1]?.name ?? ''}`
    case 'runden': return `${a} Runden geschafft`
    case 'stern': return `${b} ${b === '1' ? 'Stern' : 'Sterne'} bei ${TOPIC_NAMES[a as 'A' | 'B' | 'C']}`
    case 'lernfeld': return `${TOPIC_NAMES[a as 'A' | 'B' | 'C']} gemeistert!`
    case 'relikt': return `Relikt gefunden: ${TYPE_NAMES[a as TaskType] ?? a}`
    case 'knobel': return a === 'erste' ? 'Erste starke Knobelrunde' : `${a} Knobelaufgaben gleich richtig`
    default: return 'Wochenziel geschafft'
  }
}

export interface Karte {
  titel: string
  /** Bei einer gemeinsamen Karte: alle enthaltenen Meilensteine */
  liste: string[]
  zeilen: string[]
  muenzen: number
  art: MeilensteinArt | 'mehrere'
  /** Nummer der Haut im Album, nur bei einzelnen Karten */
  nummer?: number
}

/**
 * Feier-Karten für die neuen Meilensteine einer Runde, in der Reihenfolge der Liste.
 * Bis zu drei Meilensteine bekommen je eine Karte, bei mehr gibt es eine gemeinsame Karte.
 * `bisher` ist die Anzahl der Meilensteine vor dieser Runde (für die Nummer der Haut).
 */
export function bauKarten(neu: Meilenstein[], name: string, bisher: number): Karte[] {
  if (neu.length === 0) return []
  if (neu.length <= 3) {
    return neu.map((m, i) => ({ titel: titelVon(m, name), liste: [], zeilen: rueckblickZeilen(m.rueckblick), muenzen: m.muenzen, art: m.art, nummer: bisher + i + 1 }))
  }
  return [{
    titel: `${neu.length} Meilensteine auf einmal`,
    liste: neu.map((m) => titelVon(m, name)),
    zeilen: rueckblickZeilen(neu[neu.length - 1].rueckblick),
    muenzen: neu.reduce((s, m) => s + m.muenzen, 0),
    art: 'mehrere',
  }]
}
