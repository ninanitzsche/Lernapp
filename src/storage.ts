import { parseState, serializeState } from './logic/game.ts'
import type { GameState } from './logic/game.ts'
import { parseRunde, serializeRunde } from './logic/runde.ts'
import type { RundenStand } from './logic/runde.ts'

const KEY = 'mathe-schlange-v1'
const SICHERUNG_KEY = 'mathe-schlange-sicherung'
const RUNDE_KEY = 'mathe-schlange-runde'
/** Nach so vielen Tagen ohne Sicherung erinnert die Startseite die Erwachsenen. */
export const SICHERUNG_ERINNERUNG_TAGE = 14

export function loadState(): GameState | null {
  try {
    const text = localStorage.getItem(KEY)
    return text ? parseState(text) : null
  } catch {
    return null
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(KEY, serializeState(state))
  } catch {
    // Speicher voll oder gesperrt: die App läuft weiter, nur ohne Speichern.
  }
}

/** Bittet den Browser, den Speicher nicht von sich aus zu löschen. Hilft nicht überall (Safari entscheidet selbst). */
export function bitteUmDauerhaftenSpeicher(): void {
  try {
    void navigator.storage?.persist?.()
  } catch {
    // optional
  }
}

/** Pausierte Runde: wird nach jeder Aufgabe gespeichert, damit nichts verloren geht, auch wenn der Browser zugeht. */
export function speichereRunde(r: RundenStand): void {
  try { localStorage.setItem(RUNDE_KEY, serializeRunde(r)) } catch { /* optional */ }
}

export function ladeRunde(name: string): RundenStand | null {
  try {
    const t = localStorage.getItem(RUNDE_KEY)
    return t ? parseRunde(t, name) : null
  } catch {
    return null
  }
}

export function loescheRunde(): void {
  try { localStorage.removeItem(RUNDE_KEY) } catch { /* optional */ }
}

export function merkeSicherung(jetzt: Date = new Date()): void {
  try { localStorage.setItem(SICHERUNG_KEY, jetzt.toISOString()) } catch { /* optional */ }
}

export function letzteSicherung(): Date | null {
  try {
    const t = localStorage.getItem(SICHERUNG_KEY)
    return t && !Number.isNaN(Date.parse(t)) ? new Date(t) : null
  } catch {
    return null
  }
}

/** Soll die Startseite an eine Sicherung erinnern? Erst wenn schon etwas zu sichern da ist. */
export function sicherungFaellig(runden: number, letzte: Date | null, jetzt: Date): boolean {
  if (runden < 3) return false
  if (!letzte) return true
  return (jetzt.getTime() - letzte.getTime()) / 86_400_000 >= SICHERUNG_ERINNERUNG_TAGE
}
