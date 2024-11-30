import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import EventsPage from './pages/EventsPage.tsx'
import CatsPage from './pages/CatsPage.tsx'
import CatProfilePage from './pages/CatProfilePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <App />} />
        <Route path="/events" element={ <EventsPage />} />
        <Route path="/cats" element={ <CatsPage />} />
        <Route path="/cats/:id" element={ <CatProfilePage /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
