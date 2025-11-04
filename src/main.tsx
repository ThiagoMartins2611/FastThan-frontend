import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import CadastrarItensPage from './components/pages/CadastrarItensPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
    <Routes>

        <Route path='/HomePage' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/cadastrarItem' element={<CadastrarItensPage/>}/>
      </Routes>
    </BrowserRouter>


  </StrictMode>
)
