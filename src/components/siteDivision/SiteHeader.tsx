import '../../cssComponents/siteDivision/siteHeader.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Usuario {

  _id:string,
  name:string,
  age:number,
  email:string,
  key:string,
  adm:boolean
  
}

function SiteHeader () {
  
  const [ perfilAtivado, setPerfilAtivado ] = useState ( false )
  const [ usuario, setUsuario ] = useState <Usuario> ( {
    
    _id:"",
    name:"",
    age:0,
    email:"",
    key:"",
    adm:false
    
  } );

  const navigate = useNavigate ();

  const [ logado, setLogado ] = useState ( false );

  useEffect ( () => {

    const token = localStorage.getItem ( "token" );

    if ( token ) {
    
      const decodedPayload = jwtDecode <Usuario> ( token )
      
      setUsuario ( decodedPayload )
      setLogado ( true );

    } else {

      setLogado ( false );
      
    }

  }, [] );

  function acionarBotao () {
    
    setPerfilAtivado ( ! perfilAtivado )
    
  }

  function redirecionarParaLogin(){
    navigate ( "/login" )
  }

  function Logout(){
    localStorage.clear();
    location.reload()
  }

  return (

    <>
    
      <header>

        <h1>FASTHAN</h1>
                
        <nav>

            <ul>
              <li> <a href = "/HomePage"> Home </a> </li>
              {usuario.adm ?
                (
                  <>
                    <li> <a href = "#home"> Usuarios </a> </li>
                    <li> <a href = "#about"> Carrinhos </a> </li>
                    <li> <a href = "/cadastrarItem"> Cadastrar Itens </a> </li>
                  </>
                ): (
                  <>
                    <li> <a href = "#about"> Sobre </a> </li>
                    <li> <a href = "#contact"> Contato </a> </li>
                  </>
                )
              } 
                
            </ul>
            
        </nav>

        { logado ? (

          <div id = 'perfil' onClick = { acionarBotao }>

            { perfilAtivado && (
              
              <ul id = 'listaPerfil'>

                <li className = 'itemPerfil' id = 'nomeUsuario'> { usuario.name } </li>
                <li className = 'itemPerfil' id = 'tipoUsuario'> 

                { usuario.adm ? (

                    <> Administrador </>

                  ) : (

                    <> Usuário comum </>
                    
                  )
                
                }

                </li>


                <li className = 'itemPerfil' id = 'Logout' onClick={Logout}>logout</li>
              
              
              </ul>

            )

            }
          
          </div>

        ) : (
          
          <div id = 'semPerfil'>

            <p onClick = { redirecionarParaLogin }> Login </p>
            
          </div>
        )}
     

      </header>

    </>

  )

}

export default SiteHeader