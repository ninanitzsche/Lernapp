import type { ReactNode } from 'react'

/** Erklärtext, der erst nach Tippen aufklappt. So bleibt der Bildschirm ruhig und die Regeln sind trotzdem da. */
export function Info({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <details className="info">
      <summary>{titel}</summary>
      <div className="info-text">{children}</div>
    </details>
  )
}
