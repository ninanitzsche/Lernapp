import { useState } from 'react'
import { setzeTon, tonIstAn } from './stimme.ts'

export function TonKnopf() {
  const [an, setAn] = useState(tonIstAn())
  return (
    <button
      className="knopf klein ton" type="button" aria-pressed={an}
      aria-label={an ? 'Ton ausschalten' : 'Ton einschalten'}
      onClick={() => { setzeTon(!an); setAn(!an) }}
    >
      {an ? '🔊' : '🔇'}
    </button>
  )
}
