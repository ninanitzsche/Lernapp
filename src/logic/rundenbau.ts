// Baut die zehn Aufgaben einer Runde mit der Stufen-Rampe. Reine Logik ohne React.
import { CONFIG } from './config.ts'
import { createRng } from './rng.ts'
import { selectTypes } from './game.ts'
import { stufeFuerAufgabe } from './stufen.ts'
import { bookTaskFor, taskKey } from './bookTasks.ts'
import { generateTask } from './tasks.ts'
import type { Task, TaskType, Topic } from './tasks.ts'

export interface Bauplan {
  skill: Record<TaskType, number>
  /** Abgeschlossene Runden insgesamt (steuert, ab wann Stufe 2 freigeschaltet ist) */
  abgeschlosseneRunden: number
  topic?: Topic
  /** 'buch': nur Aufgaben nach dem Lehrwerk (bewusste Wahl, folgt nicht der Rampe). 'mix': Rampe, in mittleren Positionen etwa zur Hälfte Buchaufgaben. */
  quelle: 'buch' | 'mix'
  knobel: boolean
  seed: number
}

export function baueAufgaben(p: Bauplan): Task[] {
  const rng = createRng(p.seed)
  const typen = selectTypes(rng, p.skill, CONFIG.roundLength, p.topic)
  const benutzt = new Set<string>()
  return typen.map((typ, position) => {
    const stufe = stufeFuerAufgabe(p.knobel, position, p.skill[typ], p.abgeschlosseneRunden)
    let t: Task | null = null
    // Buchaufgaben gelten als mittel: In der Rampe nur an mittleren Positionen, im Buch-Modus überall.
    if (!p.knobel && (p.quelle === 'buch' || (stufe === 2 && rng() < 0.5))) t = bookTaskFor(typ, rng, benutzt)
    if (t === null) {
      t = generateTask(typ, rng, stufe)
      for (let i = 0; i < 20 && benutzt.has(taskKey(t)); i++) t = generateTask(typ, rng, stufe)
    }
    benutzt.add(taskKey(t))
    return t
  })
}
