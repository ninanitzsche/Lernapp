// Konfetti und Münzregen mit canvas-confetti. Bei "weniger Bewegung" im System passiert nichts.
import confetti from 'canvas-confetti'

const FARBEN = ['#f2b600', '#e9546b', '#3aa0ff', '#2f9e5a', '#a86bff', '#ff8a3d']

/** Zwei Konfetti-Fontänen von unten links und unten rechts, gut 2 Sekunden lang. Gibt eine Aufräumfunktion zurück. */
export function konfetti(): () => void {
  const ende = Date.now() + 2200
  let stop = false
  function schub() {
    if (stop) return
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.9 }, colors: FARBEN, disableForReducedMotion: true })
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.9 }, colors: FARBEN, disableForReducedMotion: true })
    if (Date.now() < ende) requestAnimationFrame(schub)
  }
  schub()
  return () => { stop = true; confetti.reset() }
}

/** Münzen regnen von oben. */
export function muenzRegen(): () => void {
  const muenze = confetti.shapeFromText({ text: '🪙', scalar: 3 })
  let stop = false
  const ende = Date.now() + 1800
  function schub() {
    if (stop) return
    confetti({
      particleCount: 2, angle: 90, spread: 160, startVelocity: 12, gravity: 0.9, ticks: 220,
      origin: { x: Math.random(), y: -0.05 }, shapes: [muenze], scalar: 3, flat: true, disableForReducedMotion: true,
    })
    if (Date.now() < ende) requestAnimationFrame(schub)
  }
  schub()
  return () => { stop = true; confetti.reset() }
}
