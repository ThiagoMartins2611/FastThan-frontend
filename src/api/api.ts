import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const api = axios.create ( {

    baseURL:import.meta.env.VITE_API_URL

} )

// Middleware -> interceptors

// 1 - interceptors de requesição:inclui o token em cada requisição

api.interceptors.request.use ( ( config ) => {

    const token = localStorage.getItem ( "token" )
 
    if ( token )

        config.headers.Authorization = `Bearer ${token}`

    return config

} )

//Interceptor de resposta:quando o backend retornar 401 redireciona para o login

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Se o token expirou ou é inválido, e a rota não é de login
    if (
      status === 401 &&
      !error?.config?.url?.endsWith("/login") // evita loop no login
    ) {
      console.warn("Token expirado ou inválido, limpando login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
      localStorage.clear();
    }

    return Promise.reject(error);
  }
);


export default api;