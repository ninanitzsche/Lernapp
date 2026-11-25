// Alle Spielwerte an einer Stelle (Spec Abschnitt 4). Startwerte, nach dem Praxistest anpassen.
export const CONFIG = {
  roundLength: 10,
  roundBonus: 5,
  foodRoundsPerDay: 3,
  maxRepeatsPerRound: 3,
  hungryAfterHours: 24,
  sleepAfterHours: 48,
  skillMax: 3,
  /** Knobelrunde: so viele Aufgaben müssen gleich beim ersten Versuch stimmen, damit es die Zusatzmünze gibt. */
  knobelMinRichtig: 7,
  /** So viele Runden lang gibt es nur leichte Aufgaben (Stufe 1). */
  leichtRunden: 3,
  /** Stufen der Aufgaben 1 bis 10 einer Runde. */
  rampeNormal: [1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  rampeKnobel: [2, 2, 3, 3, 3, 3, 3, 3, 3, 3],
  /** Futter je Stufe (Index 0 ist Stufe 1). */
  futterErsterVersuch: [2, 2, 5],
  futterZweiterVersuch: [1, 1, 3],
  /** Rundenbonus: nur für das Beenden aller Aufgaben. */
  rundenBonusKnobel: 10,
  /** Zusatzmünzen für eine starke Knobelrunde (bisher 1). */
  knobelMuenzen: 2,
  /** Zwischenstopp nach dieser Aufgabe (Anzahl beantworteter Aufgaben). */
  halbzeitNach: 5,
  /** So viele richtige im ersten Versuch hintereinander lösen den Serien-Jubel aus. */
  serieAb: 3,
  serieFutter: 1,
  /** Münzen für kniffelige Aufgaben, die insgesamt gleich im ersten Versuch stimmten. */
  knobelTreffer: { 10: 1, 25: 2, 50: 3 } as Record<number, number>,
  /** Münze für die erste starke Knobelrunde. */
  ersteKnobelMuenze: 1,
  /** Einschätzung im Elternbereich */
  ampel: { fenster: 10, minVersuche: 5, sicherQuote: 0.8, sicherMinMittel: 3, uebenQuote: 0.5, uebenFalschMax: 0.2 },
} as const

export const STAGES = [
  { stage: 1, name: 'Baby', image: 'snake-baby.png', key: 'baby', foodFrom: 0 },
  { stage: 2, name: 'Kleinkind', image: 'snake-smallChild.png', key: 'smallChild', foodFrom: 30 },
  { stage: 3, name: 'Kind', image: 'snake-child.png', key: 'child', foodFrom: 90 },
  { stage: 4, name: 'Teenager', image: 'snake-teen.png', key: 'teen', foodFrom: 200 },
  { stage: 5, name: 'Erwachsen', image: 'snake-adult.png', key: 'adult', foodFrom: 350 },
] as const
