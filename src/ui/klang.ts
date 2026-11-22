// Kurze Klänge, selbst erzeugt mit der Web Audio API (keine Audiodateien nötig). Hängt am Ton-Knopf.
import { tonIstAn } from './stimme.ts'

export type Klang = 'richtig' | 'mampf' | 'bah' | 'aufstieg' | 'kauf' | 'plopp' | 'tipp'

let kontext: AudioContext | null = null

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  kontext ??= new Ctor()
  if (kontext.state === 'suspended') void kontext.resume()
  return kontext
}

interface Ton {
  /** Frequenz in Hz */
  f: number
  /** Start in Sekunden ab jetzt */
  ab: number
  dauer: number
  art?: OscillatorType
  /** Gleitet bis zu dieser Frequenz */
  bis?: number
  laut?: number
}

function spiele(tone: Ton[]): void {
  if (!tonIstAn()) return
  const c = ctx()
  if (!c) return
  const jetzt = c.currentTime
  for (const t of tone) {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = t.art ?? 'sine'
    o.frequency.setValueAtTime(t.f, jetzt + t.ab)
    if (t.bis) o.frequency.exponentialRampToValueAtTime(t.bis, jetzt + t.ab + t.dauer)
    const laut = t.laut ?? 0.12
    g.gain.setValueAtTime(0.0001, jetzt + t.ab)
    g.gain.exponentialRampToValueAtTime(laut, jetzt + t.ab + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, jetzt + t.ab + t.dauer)
    o.connect(g).connect(c.destination)
    o.start(jetzt + t.ab)
    o.stop(jetzt + t.ab + t.dauer + 0.05)
  }
}

const KLAENGE: Record<Klang, Ton[]> = {
  richtig: [{ f: 660, ab: 0, dauer: 0.14 }, { f: 880, ab: 0.1, dauer: 0.22 }],
  // Drei kurze Knackser wie beim Kauen
  mampf: [
    { f: 180, bis: 90, ab: 0, dauer: 0.12, art: 'triangle', laut: 0.2 },
    { f: 200, bis: 100, ab: 0.2, dauer: 0.12, art: 'triangle', laut: 0.2 },
    { f: 170, bis: 85, ab: 0.4, dauer: 0.14, art: 'triangle', laut: 0.2 },
  ],
  // Fallender, wackeliger Ton
  bah: [{ f: 330, bis: 110, ab: 0, dauer: 0.5, art: 'sawtooth', laut: 0.07 }, { f: 300, bis: 100, ab: 0.05, dauer: 0.5, art: 'square', laut: 0.04 }],
  aufstieg: [
    { f: 523, ab: 0, dauer: 0.2 }, { f: 659, ab: 0.15, dauer: 0.2 }, { f: 784, ab: 0.3, dauer: 0.2 },
    { f: 1047, ab: 0.45, dauer: 0.6, laut: 0.16 }, { f: 784, ab: 0.45, dauer: 0.6, art: 'triangle', laut: 0.1 },
  ],
  kauf: [{ f: 988, ab: 0, dauer: 0.1, art: 'square', laut: 0.06 }, { f: 1319, ab: 0.09, dauer: 0.3, art: 'square', laut: 0.06 }],
  plopp: [{ f: 300, bis: 700, ab: 0, dauer: 0.12, laut: 0.16 }],
  tipp: [{ f: 880, ab: 0, dauer: 0.12 }, { f: 1175, ab: 0.12, dauer: 0.2 }],
}

/** `verzoegerung` in Sekunden, z. B. bis das Futter beim Maul ankommt. */
export function klang(art: Klang, verzoegerung = 0): void {
  if (verzoegerung > 0) window.setTimeout(() => spiele(KLAENGE[art]), verzoegerung * 1000)
  else spiele(KLAENGE[art])
}
