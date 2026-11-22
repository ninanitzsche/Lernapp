// Sprachausgabe: helle, lebhafte Stimme für die Schlange. Klingt je nach Gerät etwas anders.

const SCHLUESSEL = 'mathe-schlange-ton'

let ton = ((): boolean => {
  try { return localStorage.getItem(SCHLUESSEL) !== 'aus' } catch { return true }
})()

export function tonIstAn(): boolean {
  return ton
}

export function setzeTon(an: boolean): void {
  ton = an
  try { localStorage.setItem(SCHLUESSEL, an ? 'an' : 'aus') } catch { /* Speichern ist optional */ }
  if (!an) stoppe()
}

export function stoppe(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}

// Helle Stimmen zuerst, tiefe Männerstimmen klingen für Kinder schnell böse.
const BEVORZUGT = ['anna', 'petra', 'google deutsch', 'katja', 'marlene', 'vicki', 'hedda', 'amala', 'sabina']

function waehleStimme(): SpeechSynthesisVoice | null {
  const stimmen = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('de'))
  if (stimmen.length === 0) return null
  for (const name of BEVORZUGT) {
    const treffer = stimmen.find((v) => v.name.toLowerCase().includes(name))
    if (treffer) return treffer
  }
  return stimmen.find((v) => v.lang.toLowerCase() === 'de-de') ?? stimmen[0]
}

interface Optionen {
  /** Auch sprechen, wenn der Ton aus ist (z. B. beim Knopf "Vorlesen"). */
  immer?: boolean
  pitch?: number
  rate?: number
  /** Zweiter Satz, der direkt nach dem ersten gesprochen wird (z. B. der Tipp) */
  danach?: string
}

export function sprich(text: string, opt: Optionen = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  if (!ton && !opt.immer) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text.replace(/\?/g, ' ? '))
  u.lang = 'de-DE'
  u.pitch = opt.pitch ?? 1.7
  u.rate = opt.rate ?? 1.08
  const stimme = waehleStimme()
  if (stimme) u.voice = stimme
  if (opt.danach) {
    const weiter = opt.danach
    u.onend = () => sprich(weiter, { immer: opt.immer, pitch: opt.pitch, rate: 0.95 })
  }
  window.speechSynthesis.speak(u)
}
