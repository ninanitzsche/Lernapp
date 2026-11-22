// Alle Spielwerte an einer Stelle (Spec Abschnitt 4). Startwerte, nach dem Praxistest anpassen.
export const CONFIG = {
  roundLength: 10,
  foodFirstTry: 2,
  foodSecondTry: 1,
  roundBonus: 5,
  foodRoundsPerDay: 3,
  maxRepeatsPerRound: 3,
  weeklyGoalDays: 3,
  weeklyBonus: 20,
  hungryAfterHours: 24,
  sleepAfterHours: 48,
  skillMax: 3,
  /** Knobelrunde: so viele Aufgaben müssen gleich beim ersten Versuch stimmen, damit es die Zusatzmünze gibt. */
  knobelMinRichtig: 7,
} as const

export const STAGES = [
  { stage: 1, name: 'Baby', image: 'snake-baby.png', key: 'baby', foodFrom: 0 },
  { stage: 2, name: 'Kleinkind', image: 'snake-smallChild.png', key: 'smallChild', foodFrom: 60 },
  { stage: 3, name: 'Kind', image: 'snake-child.png', key: 'child', foodFrom: 150 },
  { stage: 4, name: 'Teenager', image: 'snake-teen.png', key: 'teen', foodFrom: 300 },
  { stage: 5, name: 'Erwachsen', image: 'snake-adult.png', key: 'adult', foodFrom: 500 },
] as const
