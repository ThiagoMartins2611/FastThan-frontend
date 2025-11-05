import { useEffect, useState } from "react"
import api from "../../api/api"
import SiteHeader from "../siteDivision/SiteHeader";
import SiteFooter from "../siteDivision/SiteFooter";
import '../../cssComponents/pages/CarrinhoPage.css'

interface Item {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  userId: number;
  quantity: number;
}



function CarrinhoPage(){

    const [carrinho, setCarrinho] = useState<Item[]>([]);

    useEffect(()=>{

        async function buscarItensDoCarrinho(){
            try {
                const res = await api.get('/private/ShowItemsInCart')
                setCarrinho(res.data)

            } catch (error) {
                alert("erro ao conectar com o banco")
            }
        }

        buscarItensDoCarrinho()

    }, [])
    
    return(
        <>
        <div id="carrinhoPage">

            <SiteHeader/>

            <main id="Carrinho">

                <div id="titulo">
                    <h1>Carrinho</h1>
                </div>

                <div className="ItensCarrinho">
                    {carrinho.map((item) => (
                        <div key={item._id} className="item-card">
                            <img src={item.imageUrl} alt={item.name} className="item-image" />
                            <h2>{item.name}</h2>
                            <h1>R${item.price}</h1>
                            <h3>Quantidade: {item.quantity}</h3>
                        </div>
                    ))
                    }

                </div>
            </main>

            <SiteFooter/>
        </div>
        
        </>
    )
}

export default CarrinhoPage