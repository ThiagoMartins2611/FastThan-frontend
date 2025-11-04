import SiteFooter from "../siteDivision/SiteFooter.tsx"
import SiteHeader from "../siteDivision/SiteHeader.tsx"
import api from "../../api/api.ts"
import { useEffect } from "react"
import { useState } from "react"
import '../../cssComponents/pages/HomePage.css'
import pencil from '../../images/pencil.svg'
import trash from '../../images/trash.svg'
import {jwtDecode} from 'jwt-decode'

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    userId: number;
}
interface Usuario {

  _id:string,
  name:string,
  age:number,
  email:string,
  key:string,
  adm:boolean
  
}

function HomePage(){

    const [mensagem, setMensagem] = useState("")
    const [error, setError] = useState(false)
    const [items, setItems] = useState<Item[]>([])
      const [ usuario, setUsuario ] = useState <Usuario> ( {
    
        _id:"",
        name:"",
        age:0,
        email:"",
        key:"",
        adm:false
        
    } );



    useEffect(() => {


        const token = localStorage.getItem ( "token" );

        if ( token ) {
        
        const decodedPayload = jwtDecode <Usuario> ( token )
        
            setUsuario ( decodedPayload )
        }


        async function puxarItens() {
            try {
                const res = await api.get("/public/ShowItems");

                setMensagem ( "Itens carregados com sucesso!" );
                setItems(res.data);
                setError(false);

            } catch (error) {

                setMensagem ( "Erro ao carregar os itens." );
                setError(true);
            }
      
        }

        puxarItens();

    }, [])

    return(<>

        <SiteHeader/>

            <main id="HomePage">

                <div className="items-container">
                    {error && (
                        <div className="error-message">{mensagem}</div>
                    )

                    }
                {
                     items.map((item) => {
 // CORRIGIDO: Removido o fragmento <>...</>
                        return (
                        // A key está agora no elemento raiz retornado: o div
                                <div key={item.id} className="item-card">
                                    <img src={item.imageUrl} alt={item.name} className="item-image" />
                                    <h2>{item.name}</h2>
                                    <h1>{item.price}</h1>

                                    {usuario.adm && (

                                        <div id='editarEapagar'>
                                            <img onClick={editarItem} src={pencil} alt="" id="editar"/>
                                            <img src={trash} alt="" id="apagar"/>
                                            <img onClick={apagarItem} src={trash} alt="" id="editar"/>
                                        </div>
                                    )
                                    
                                    }
                               

                                </div>
                            )
                            })
                        }
                </div>      

            </main>
      
        <SiteFooter/>
    </>)

}

export default HomePage