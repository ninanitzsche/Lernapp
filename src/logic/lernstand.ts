// Lernstand für den Elternbereich: Einschätzung je Aufgabentyp, Trend, Bereitschaft je Thema, Empfehlung.
// Alles ist eine Schätzung aus den Daten der App, kein Testergebnis. Reine Logik ohne React.
import { CONFIG } from './config.ts'
import { TASK_TYPES, TOPIC_OF, TYPE_NAMES } from './tasks.ts'
import type { Stufe, TaskType, Topic } from './tasks.ts'
import { weekKey, dayKey } from './game.ts'
import type { Versuch } from './game.ts'

export type Einschaetzung = 'sicher' | 'fast' | 'ueben' | 'wenig'
export type Trend = 'besser' | 'gleich' | 'schwaecher'
export type Bereitschaft = 'bereit' | 'fast' | 'ueben' | 'offen'

export const EINSCHAETZUNG_TEXT: Record<Einschaetzung, string> = {
  sicher: 'sicher', fast: 'fast sicher', ueben: 'noch üben', wenig: 'noch zu wenig Daten',
}
export const TREND_TEXT: Record<Trend, string> = { besser: 'wird besser', gleich: 'bleibt gleich', schwaecher: 'wird schwächer' }
export const BEREITSCHAFT_TEXT: Record<Bereitschaft, string> = { bereit: 'bereit', fast: 'fast bereit', ueben: 'noch üben', offen: 'noch offen' }

const fenster = (v: Versuch[]) => v.slice(-CONFIG.ampel.fenster)
const ersteQuote = (v: Versuch[]) => (v.length === 0 ? 0 : v.filter((x) => x.o === 'first').length / v.length)

/** Einschätzung aus den letzten zehn Versuchen eines Typs. */
export function typEinschaetzung(verlauf: Versuch[]): Einschaetzung {
  const v = fenster(verlauf)
  if (v.length < CONFIG.ampel.minVersuche) return 'wenig'
  const quote = ersteQuote(v)
  const falsch = v.filter((x) => x.o === 'failed').length / v.length
  const mittel = v.filter((x) => x.s >= 2).length
  if (quote >= CONFIG.ampel.sicherQuote && mittel >= CONFIG.ampel.sicherMinMittel) return 'sicher'
  if (quote < CONFIG.ampel.uebenQuote || falsch > CONFIG.ampel.uebenFalschMax) return 'ueben'
  return 'fast'
}

/** Trend: letzte fünf gegen die fünf davor, nur wenn zehn Versuche vorliegen. */
export function trend(verlauf: Versuch[]): Trend | null {
  if (verlauf.length < 10) return null
  const v = verlauf.slice(-10)
  const diff = ersteQuote(v.slice(5)) - ersteQuote(v.slice(0, 5))
  return diff >= 0.2 ? 'besser' : diff <= -0.2 ? 'schwaecher' : 'gleich'
}

/** Höchste Stufe (0 bis 3), auf der in den letzten zehn Versuchen mindestens zweimal gleich richtig gelöst wurde. */
export function erreichteStufe(verlauf: Versuch[]): 0 | Stufe {
  const v = fenster(verlauf)
  for (const s of [3, 2, 1] as Stufe[]) if (v.filter((x) => x.s === s && x.o === 'first').length >= 2) return s
  return 0
}

/** Bereitschaft je Thema: der schwächste Typ entscheidet. */
export function themaBereitschaft(verlauf: Record<TaskType, Versuch[]>, thema: Topic): Bereitschaft {
  const e = TASK_TYPES.filter((t) => TOPIC_OF[t] === thema).map((t) => typEinschaetzung(verlauf[t] ?? []))
  if (e.includes('ueben')) return 'ueben'
  if (e.includes('wenig')) return 'offen'
  return e.every((x) => x === 'sicher') ? 'bereit' : 'fast'
}

/** Übungstipps für zu Hause, ohne App machbar. */
export const TIPPS: Record<TaskType, string> = {
  A1: 'Sprecht Zahlwörter laut und schreibt sie auf. Bei siebenunddreißig kommt zuerst die Sieben, dann die Dreißig.',
  A2: 'Zerlegt Zahlen auf einem Zettel in Zehner und Einer, zum Beispiel 47 in 40 und 7.',
  A3: 'Zählt gemeinsam laut weiter, vorwärts und rückwärts, erst in Einerschritten, dann in Zehnerschritten.',
  B1: 'Legt mit Münzen oder Büroklammern Zehnerbündel und Einzelne und lasst die Zahl nennen.',
  B2: 'Nennt eine Zahl und lasst sie mit Bündeln und Einzelnen legen.',
  B3: 'Würfelt oder wählt zwei Zahlen und lasst sagen, welche größer ist. Danach drei Zahlen der Größe nach ordnen.',
  C1: 'Zeichnet einen Zahlenstrahl von 0 bis 100 mit Zehnerstrichen auf Papier und lasst Zahlen einzeichnen.',
  C2: 'Zeigt auf einen Strich eines selbst gezeichneten Zahlenstrahls und lasst die Zahl ablesen.',
  C3: 'Fragt nach den Nachbarn: Welche Hausnummer kommt vor und nach der 17?',
  C4: 'Sucht an Hausnummern und Seitenzahlen den Zehner davor und den Zehner danach.',
}

export interface Empfehlung {
  typ: TaskType | null
  text: string
}

/** "Das hilft jetzt": der schwächste Typ mit genug Daten und ein Übungstipp. */
export function empfehlung(verlauf: Record<TaskType, Versuch[]>, name: string): Empfehlung {
  const mitDaten = TASK_TYPES.filter((t) => typEinschaetzung(verlauf[t] ?? []) !== 'wenig')
  if (mitDaten.length === 0) return { typ: null, text: `Noch zu wenig Daten für eine Empfehlung. Ein paar Runden mit ${name} üben, dann steht hier, was als Nächstes hilft.` }
  const rang = (t: TaskType) => ({ ueben: 0, fast: 1, sicher: 2, wenig: 3 })[typEinschaetzung(verlauf[t] ?? [])]
  const schwaechster = [...mitDaten].sort((a, b) =>
    rang(a) - rang(b) || ersteQuote(fenster(verlauf[a])) - ersteQuote(fenster(verlauf[b])) || verlauf[a].length - verlauf[b].length)[0]
  if (rang(schwaechster) === 2) return { typ: null, text: `Alles, was bisher geübt wurde, sitzt sicher. ${name} kann ruhig eine Knobelrunde probieren.` }
  return { typ: schwaechster, text: `${name} kann „${TYPE_NAMES[schwaechster]}" noch üben. Tipp für zu Hause: ${TIPPS[schwaechster]}` }
}

/** Runden pro Woche der letzten `wochen` Wochen, ältere zuerst, die aktuelle Woche zuletzt. */
export function rundenProWoche(rounds: Record<string, number>, now: Date, wochen = 4): number[] {
  const ergebnis = Array.from({ length: wochen }, () => 0)
  const aktuell = new Date(weekKey(now) + 'T00:00:00')
  for (const [tag, n] of Object.entries(rounds)) {
    const [y, m, d] = tag.split('-').map(Number)
    const montag = new Date(weekKey(new Date(y, m - 1, d)) + 'T00:00:00')
    const diff = Math.round((aktuell.getTime() - montag.getTime()) / (7 * 86_400_000))
    if (diff >= 0 && diff < wochen) ergebnis[wochen - 1 - diff] += n
  }
  return ergebnis
}

/** Tage bis zum Testdatum (0 am Testtag, negativ danach), null ohne Datum. */
export function tageBisTest(testDate: string | null, now: Date): number | null {
  if (!testDate) return null
  const [y, m, d] = testDate.split('-').map(Number)
  const [hy, hm, hd] = dayKey(now).split('-').map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(hy, hm - 1, hd)) / 86_400_000)
}
