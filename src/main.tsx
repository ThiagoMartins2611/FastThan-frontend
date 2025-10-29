import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import SiteHeader from './components/siteDivision/SiteHeader.tsx'
import SiteFooter from './components/siteDivision/SiteFooter.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteHeader/>

    <main>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<HomePage/>}/>

        </Routes>
      </BrowserRouter>
    </main>

    <SiteFooter/>
  </StrictMode>,
)
