import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {CssBaseline} from '@mui/material'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <div onContextMenu={(e) => e.preventDefault()}>
      <App />
    </div>
  </StrictMode>,
)
