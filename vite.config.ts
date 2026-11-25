import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset URLs keep the app and locally hosted fonts working at the domain root
  // as well as when deployed below a path (for example, a GitHub Pages project site).
  base: './',
  plugins: [react()],
})
