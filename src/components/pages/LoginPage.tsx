import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage(){

    const [mensagem,setMensagem] = useState("")

    const navigate = useNavigate()
    /*/ Criar toda uma estrutura de Login com inputs e usando do 
    useState para enviar os dados do usuario querendo fazer o login
    e pegue o token que vem do servidor e mete no localstrorage /*/

    async function logar(event:React.FormEvent<HTMLFormElement>){
          event.preventDefault();
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const senha = formData.get("senha")

        try {
            const res = await api.post("/login",{email,senha})
               if(res.status===200){
                localStorage.setItem("token",res?.data?.token)
                navigate("/")
            }
        } catch (error) {
            const msg = "Erro ao fazer login. Verifique suas credenciais."
            navigate(`/login?mensagem=${encodeURIComponent(msg)}`)
            
        }
       
        

    }
    


    return(
        <div>
            <h1>Login Page</h1>
            <form onSubmit={logar}>
                <input type="text" />
                <input type="password" />
                <button type="submit">Login</button> 
            </form>
  
        </div>

    )
}




export default LoginPage