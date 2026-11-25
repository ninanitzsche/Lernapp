// Relikte: kleines freiwilliges Expertenfeature. Der Pokal eines abgeschlossenen Lernfeldes öffnet die passenden Relikte.
// Relikte bringen Terrariummünzen, aber keine Sterne, Pokale oder Medaillen und ändern den regulären Lernfortschritt nicht.
// Reine Logik ohne React.
import { CONFIG } from './config.ts'
import { createRng } from './rng.ts'
import { TYPE_NAMES, generateTask } from './tasks.ts'
import type { Task, TaskType, Topic } from './tasks.ts'
import type { GameState } from './game.ts'
import { typenDesFeldes } from './kompetenz.ts'
import { rueckblickVon } from './meilensteine.ts'
import type { Meilenstein } from './meilensteine.ts'
import { taskKey } from './bookTasks.ts'

export interface Relikt {
  /** Aufgabentyp, auf dem das Relikt beruht (zugleich die ID) */
  id: TaskType
  name: string
  topic: Topic
}

/** Lernfelder, deren Pokal vorhanden ist (Abschluss mit fünf Sternen). */
export function pokaleVon(state: GameState): Topic[] {
  return (['A', 'B', 'C'] as Topic[]).filter((t) => state.meilensteine.some((m) => m.id === `lernfeld-${t}`))
}

/** Der Reliktbereich ist erst sichtbar, wenn mindestens ein Lernfeld abgeschlossen wurde. */
export function reliktBereichSichtbar(state: GameState): boolean {
  return pokaleVon(state).length > 0
}

/** Relikte der abgeschlossenen Lernfelder: je Aufgabentyp eines. */
export function freigeschalteteRelikte(state: GameState): Relikt[] {
  return pokaleVon(state).flatMap((topic) => typenDesFeldes(topic).map((id) => ({ id, name: TYPE_NAMES[id], topic })))
}

/** Fünf kniffelige Aufgaben desselben Typs, möglichst verschieden. Reine Expertenvariante bekannter Inhalte. */
export function baueReliktAufgaben(typ: TaskType, seed: number): Task[] {
  const rng = createRng(seed)
  const benutzt = new Set<string>()
  return Array.from({ length: CONFIG.reliktAufgaben }, () => {
    let t = generateTask(typ, rng, 3)
    for (let i = 0; i < 30 && benutzt.has(taskKey(t)); i++) t = generateTask(typ, rng, 3)
    benutzt.add(taskKey(t))
    return t
  })
}

export interface ReliktErgebnis {
  state: GameState
  /** Münzen, die dieses Mal gebracht wurden (nur beim ersten Erfolg) */
  muenzen: number
  /** Genug Treffer für den Erfolg */
  geschafft: boolean
  /** Erster Erfolg bei diesem Relikt */
  erstmals: boolean
  meilenstein: Meilenstein | null
}

/**
 * Wertet ein Relikt aus. `treffer` = Aufgaben im ersten Versuch richtig.
 * Ändert ausschließlich Münzen, die Liste der Erfolge und den Meilenstein, nie Lernstand, Verlauf, Statistik, Futter oder Sterne.
 */
export function reliktAbschliessen(state: GameState, id: TaskType, treffer: number, datum: string): ReliktErgebnis {
  const frei = freigeschalteteRelikte(state).some((r) => r.id === id)
  const geschafft = frei && treffer >= CONFIG.reliktMinTreffer
  const erstmals = geschafft && !state.reliktErfolge.includes(id)
  if (!erstmals) return { state, muenzen: 0, geschafft, erstmals: false, meilenstein: null }
  const meilenstein: Meilenstein = { id: `relikt-${id}`, art: 'relikt', datum, rueckblick: rueckblickVon(state), muenzen: CONFIG.reliktMuenzen }
  return {
    state: {
      ...state,
      reliktErfolge: [...state.reliktErfolge, id],
      bonusMuenzen: state.bonusMuenzen + CONFIG.reliktMuenzen,
      meilensteine: [...state.meilensteine, meilenstein],
    },
    muenzen: CONFIG.reliktMuenzen,
    geschafft,
    erstmals,
    meilenstein,
  }
}

