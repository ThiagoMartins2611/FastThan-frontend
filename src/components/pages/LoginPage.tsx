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

            const msg = "Erro ao fazer login. Verifique suas credenciais."
            
            setMensagem(msg)
            
        }
    }
    
    return(
        // Classe principal para o container de tela cheia e centralização
        <div className="LoginPage"> 
            {/* Classe para o cartão de login */}
            <div className="login-container">
                <h1>Login</h1>
                {/* Classe para o formulário */}
                <form className="login-form" onSubmit={logar}>
                    {/* Pode adicionar um placeholder para melhorar a UX */}
                    <input name="email" type="text" placeholder="E-mail" required />
                    <input name="senha" type="password" placeholder="Sua Senha" required />
                    <button type="submit">Entrar</button> 
                    {
                        // Use um parágrafo ou div com uma classe específica para a mensagem
                        mensagem && <p className="mensagem-erro">{mensagem}</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default LoginPage