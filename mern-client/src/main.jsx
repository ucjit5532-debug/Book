import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import router from './routers/router.jsx'

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
