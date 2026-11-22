import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App.tsx'
import './index.css'

// reducedMotion="user": Wer in den Systemeinstellungen weniger Bewegung wählt, bekommt keine Sprung- und Drehanimationen.
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
