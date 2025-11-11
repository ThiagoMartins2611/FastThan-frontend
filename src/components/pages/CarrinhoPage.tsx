import { useEffect, useState } from "react"
import api from "../../api/api"
import SiteHeader from "../siteDivision/SiteHeader";
import SiteFooter from "../siteDivision/SiteFooter";
import '../../cssComponents/pages/CarrinhoPage.css'
import { jwtDecode } from "jwt-decode";

interface Item {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  userId: number;
  quantity: number;
}

interface Carrinho{
    userId:string;
    items: Item[];
    dataAtualizacao: Date | null;
    total:number;
}

function CarrinhoPage(){

    const [carrinho, setCarrinho] = useState<Carrinho>({
        userId: "",
        items: [],
        dataAtualizacao: null,
        total: 0
    });


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

    async function removeItemsOfCart(itemId:string) {
        
        try {
            const res = await api.post("/private/removeItemofCart", {itemId});
            
            console.log(res.data.mensagem)
            const novoCarrinho = carrinho;
            const itemAserRemovido = novoCarrinho.items.findIndex(i=>i._id===itemId)
            
            if(itemAserRemovido !== 1){
                novoCarrinho.items.splice(itemAserRemovido, 1)
                setCarrinho(novoCarrinho)
            }
        } catch (error) {
            console.log(error)
        }
        
    }

   


    
    
    return(
        <>
        <div id="carrinhoPage">

            <SiteHeader/>

            <main id="Carrinho">

                <div id="titulo">
                    <h1>Carrinho</h1>
                </div>

                <div className="ItensCarrinho">
                    {(carrinho.items).map((item) => (
                        <div key={item._id} className="item-card">
                            <img src={item.imageUrl} alt={item.name} className="item-image" />
                            <h2>{item.name}</h2>
                            <h1>R${item.price}</h1>
                            <h3>Quantidade: {item.quantity}</h3>
                            <h3 onClick={()=>{removeItemsOfCart(item._id)}}>-</h3>
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