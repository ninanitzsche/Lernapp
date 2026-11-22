import type { TaskType } from './tasks.ts'

/**
 * Transparenzpapier zum Mathe-Test am Dienstag, 24.11.2026.
 * Jede Zeile "Das musst du wissen" ist hier genau den Aufgabentypen zugeordnet, die sie üben.
 */
export interface PaperItem {
  thema: 'Zehner und Einer' | 'Zahlbilder' | 'Zahlenraum bis Hundert am Zahlenstrahl'
  text: string
  types: TaskType[]
}

export const TRANSPARENZPAPIER: PaperItem[] = [
  { thema: 'Zehner und Einer', text: 'Zahlwörter mit Zahlen verbinden (erkennen und schreiben)', types: ['A1'] },
  { thema: 'Zehner und Einer', text: 'Zehner und Einer in Stellentafel eintragen', types: ['A2'] },
  { thema: 'Zehner und Einer', text: 'Zahlenreihen fortsetzen', types: ['A3'] },
  { thema: 'Zahlbilder', text: 'Zahlbilder als Zahlen schreiben', types: ['B1'] },
  { thema: 'Zahlbilder', text: 'Zahlen als Zahlbilder schreiben', types: ['B2'] },
  { thema: 'Zahlbilder', text: 'Zahlen und Zahlenbilder vergleichen und ordnen (größer, kleiner oder gleich)', types: ['B3'] },
  { thema: 'Zahlenraum bis Hundert am Zahlenstrahl', text: 'Zahlen am Zahlenstrahl eintragen', types: ['C1', 'C2'] },
  { thema: 'Zahlenraum bis Hundert am Zahlenstrahl', text: 'Vorgänger und Nachfolger von Zahlen benennen', types: ['C3'] },
  { thema: 'Zahlenraum bis Hundert am Zahlenstrahl', text: 'Nachbarzehner benennen', types: ['C4'] },
]

/**
 * Buchaufgaben, die das Transparenzpapier nennt, und ob die App sie mit den echten Zahlen nachbildet.
 * "nein" heißt: Die Aufgabenform wird durch erzeugte Aufgaben geübt, die konkreten Bilder fehlen noch.
 */
export interface BuchRef {
  ref: string
  inBank: boolean
  anmerkung?: string
}

export const BUCHAUFGABEN_LT_TRANSPARENZPAPIER: BuchRef[] = [
  { ref: 'Buch S. 14, Aufg. 4', inBank: true },
  { ref: 'Buch S. 15, Aufg. 6', inBank: true },
  { ref: 'Buch S. 15, Aufg. 7', inBank: true },
  { ref: 'Buch S. 16, Aufg. 3', inBank: false, anmerkung: 'Aufgabenform (Zahlbild als Zahl lesen) wird mit ähnlichen Aufgaben B1 geübt, Foto war nicht sicher lesbar' },
  { ref: 'Buch S. 16, Aufg. 4', inBank: true },
  { ref: 'Buch S. 17, Aufg. 6', inBank: true },
  { ref: 'Buch S. 17, Aufg. 7', inBank: false, anmerkung: 'Aufgabenform (Zahlbilder vergleichen) wird mit ähnlichen Aufgaben B3 geübt, Foto war nicht sicher lesbar' },
  { ref: 'Buch S. 17, Aufg. 8', inBank: true },
  { ref: 'Buch S. 21, Aufg. 6', inBank: true },
  { ref: 'Buch S. 21, Aufg. 7', inBank: true },
  { ref: 'Buch S. 21, Aufg. 8', inBank: true },
  { ref: 'Buch S. 21, Aufg. 9', inBank: true },
]
