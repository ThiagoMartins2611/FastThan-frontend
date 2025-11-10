import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../../cssComponents/pages/LoginPage.css';

function LoginPage(){

    const [mensagem,setMensagem] = useState("")

    const navigate = useNavigate()
    
    async function logar(event:React.FormEvent<HTMLFormElement>){
          event.preventDefault();
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const key = formData.get("senha")

        try {
            const res = await api.post("/public/login",{email,key})
            console.log(res)
            if(res.status===200){
                localStorage.setItem("token",res?.data?.token)
                navigate("/HomePage")
            }
        } catch (error) {

            const msg = ( "Erro ao fazer login. Verifique suas credenciais." )
            
            setMensagem(msg)
            
        }
    }
    
    return(
       
        <div className="LoginPage"> 
           
            <div className="login-container">
                <h1>Login</h1>
              
                <form className="login-form" onSubmit={logar}>
                  
                    <input name="email" type="text" placeholder="E-mail" required />
                    <input name="senha" type="password" placeholder="Sua Senha" required />
                    <button type="submit">Entrar</button> 
                    {
                       
                        mensagem && <p className="mensagem-erro">{mensagem}</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default LoginPage