import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
    <Routes>

        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>

      </Routes>
    </BrowserRouter>


  </StrictMode>,
)
