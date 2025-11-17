import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import CadastrarItensPage from './components/pages/CadastrarItensPage'
import CarrinhoPage from './components/pages/CarrinhoPage'
import Carrinhos from './components/pages/CarrinhosADM'
import Redirecionamento from './components/pages/Redirecionamento'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
    <Routes>


        <Route path='/' element={<Redirecionamento/>}/>

        <Route path='/HomePage' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/cadastrarItem' element={<CadastrarItensPage/>}/>
        <Route path='/CarrinhoPage' element={<CarrinhoPage/>}/>
        <Route path='/Carrinhos' element={<Carrinhos/>}/>

      </Routes>
    </BrowserRouter>


  </StrictMode>
)
