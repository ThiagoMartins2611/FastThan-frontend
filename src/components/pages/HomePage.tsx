import SiteFooter from "../siteDivision/SiteFooter.tsx"
import SiteHeader from "../siteDivision/SiteHeader.tsx"
import api from "../../api/api.ts"
import { useEffect } from "react"
import { useState } from "react"

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    userId: number;
}



function HomePage(){

    const [mensagem, setMensagem] = useState("")
    const [error, setError] = useState(false)
    const [itens, setItens] = useState<Item[]>([])

    useEffect(() => {

        async function puxarItens() {
            try {
                const res = await api.get("/ShowItems")
                setMensagem("Itens carregados com sucesso!")
                setItens(res.data)
                setError(false)

            } catch (error) {
                setMensagem("Erro ao carregar os itens.")
                setError(true)
            }
      
        }
    }, [])

    


    return(<>

        <SiteHeader/>

            <main>

                <div className="items-container">
                    {error && (
                        <div className="error-message">{mensagem}</div>
                    )

                    }
                    {
                        itens.map((item) => (
                            <div key={item.id} className="item-card">
                                <img src={item.imageUrl} alt={item.name} className="item-image" />
                                <h2>{item.name}</h2>
                                <h1>{item.price}</h1>
                            </div>
                        ))
                    }
                </div>
                

            </main>
      
        <SiteFooter/>
    </>)

}

export default HomePage