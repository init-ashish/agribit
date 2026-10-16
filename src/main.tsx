import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { siteConfig } from './config/site.config'

// Apply brand colors from config as CSS variables (Tailwind reads these).
for (const [name, value] of Object.entries(siteConfig.theme)) {
  document.documentElement.style.setProperty(`--color-${name}`, value)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
