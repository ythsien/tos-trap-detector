import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './landing.css'
import App from './landing/App.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
