import { useEffect, useState } from "react"
import api from "../../api/api"
import SiteHeader from "../siteDivision/SiteHeader";
import SiteFooter from "../siteDivision/SiteFooter";
import '../../cssComponents/pages/CarrinhoPage.css'
import { useNavigate } from "react-router-dom";

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
    userName: string;
    items: Item[];
    dataAtualizacao: Date | null;
    total:number;
}

function calcularTotal(items: Item[]) {
    return items.reduce((acc, it) => acc + it.price * it.quantity, 0);
}

function CarrinhoPage(){

    const navigate = useNavigate();

    const [carrinho, setCarrinho] = useState<Carrinho>({
        userId: "",
        userName: "",
        items: [],
        dataAtualizacao: null,
        total: 0
    });
    const [ordenacao, setOrdenacao] = useState("");

  
    useEffect(()=>{

        async function buscarItensDoCarrinho(){
            try {
                const res = await api.get('/private/ShowItemsInCart')
                if(res.status == 401){
                    console.log("Carrinho não encontrado")
                }

                setCarrinho(res.data)

            } catch (error) {
                console.log("Carrinho não encontrado ou erro ao conectar com o servidor")
            }
        }

        buscarItensDoCarrinho()

    }, [])


    async function removeItemsOfCart(itemId:string) {
        
        try {
            // Atualiza no backend
                try {
                    await api.post("/private/removeItemofCart", { itemId });
                } catch (err) {
                    console.log("Rota removeItemofCart falhou ou não existe:", err);
                }

                // Atualiza localmente de forma imutável
                const novosItems = carrinho.items.filter((item) => item._id !== itemId);
                const novoTotal = calcularTotal(novosItems);

                setCarrinho((prev) => ({ ...prev, items: novosItems, total: novoTotal }));
            
            } catch (error) {
                console.error("Erro ao remover item:", error);
            }
        
    }


    async function atualizarQuantidade(itemId: string, novaQuantidade: number) {
        if (novaQuantidade < 1) return;

        try {
        // Atualiza no backend (se houver rota)
        const res = await api.post("/private/UpdateQuantityofCart", { itemId, quantity: novaQuantidade });
        // Atualiza no estado local
        const novoCarrinho = { ...carrinho };
        const itemIndex = novoCarrinho.items.findIndex((i) => i._id === itemId);

        if (itemIndex !== -1) {
            novoCarrinho.items[itemIndex].quantity = novaQuantidade;
            novoCarrinho.total = novoCarrinho.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
            );
            setCarrinho(novoCarrinho);
        }
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
        }
        
    }

    function ordenarCarrinho(criterio: string) {
        setOrdenacao(criterio);

        const itensOrdenados = [...carrinho.items];

        switch (criterio) {
        case "maisCaro":
            itensOrdenados.sort((a, b) => b.price - a.price);
            break;
        case "maisBarato":
            itensOrdenados.sort((a, b) => a.price - b.price);
            break;
        case "maiorQtd":
            itensOrdenados.sort((a, b) => b.quantity - a.quantity);
            break;
        case "menorQtd":
            itensOrdenados.sort((a, b) => a.quantity - b.quantity);
            break;
        default:
            break; // mantém ordem atual
        }

        setCarrinho((prev) => ({ ...prev, items: itensOrdenados }));
    }

    async function apagarCarrinho() {
        const confirmar = confirm("Tem certeza que deseja apagar todo o carrinho?");
        if (!confirmar) return;



        try {

            const res = await api.delete("/private/eraseCart");

            if(res.status === 401){
                alert(res.data.mensagem);
            }
            // Limpa o estado local
            setCarrinho({
                userId: "",
                userName: "",
                items: [],
                dataAtualizacao: null,
                total: 0,
            });

            alert(res.data.mensagem);
        } catch (error) {
            console.error("Erro ao apagar carrinho:", error);
            alert("Erro ao apagar o carrinho.");
        }
  }

   

    
    return(
        <div id="carrinhoPage">
        <SiteHeader />

        <main id="Carrinho">
            <div id="titulo">
            <h1>🛒 Seu Carrinho</h1>
            </div>

            {carrinho.items.length === 0 ? (
            <div className="carrinho-vazio">
                <p>Seu carrinho está vazio 😢</p>
                <button onClick={() => navigate("/HomePage")} className="voltar-compras">
                Continuar Comprando
                </button>
            </div>
            ) : (
            <>
                {/* 🔽 Seletor de ordenação */}
                <div className="ordenar-container">
                <label htmlFor="ordenar">Ordenar por:</label>
                <select
                    id="ordenar"
                    value={ordenacao}
                    onChange={(e) => ordenarCarrinho(e.target.value)}
                >
                    <option value="default">Padrão</option>
                    <option value="maisCaro">Mais caro</option>
                    <option value="maisBarato">Mais barato</option>
                    <option value="maiorQtd">Maior quantidade</option>
                    <option value="menorQtd">Menor quantidade</option>
                </select>
                </div>

                <div className="lista-itens-carrinho">
                {carrinho.items.map((item) => (
                    <div key={item._id} className="item-carrinho-linha">
                    <img src={item.imageUrl} alt={item.name} className="item-imagem-carrinho" />

                    <div className="item-info-carrinho">
                        <h2>{item.name}</h2>
                        <p className="descricao-carrinho">{item.description}</p>
                    </div>

                    <div className="item-preco-unitario">
                        <span className="label-preco">Preço Un.</span>
                        <p className="preco-carrinho">R$ {item.price.toFixed(2)}</p>
                    </div>

                    <div className="item-quantidade">
                        <span className="label-quantidade">Quantidade</span>
                        <div className="quantidade-container-carrinho">
                        <button
                            className="botao-qtd"
                            onClick={() => atualizarQuantidade(item._id, item.quantity - 1)}
                        >
                            -
                        </button>
                        <span className="quantidade">{item.quantity}</span>
                        <button
                            className="botao-qtd"
                            onClick={() => atualizarQuantidade(item._id, item.quantity + 1)}
                        >
                            +
                        </button>
                        </div>
                    </div>

                    <div className="item-subtotal">
                        <span className="label-subtotal">Subtotal</span>
                        <p className="subtotal-carrinho">
                        R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>

                    <div className="item-acoes-carrinho">
                        <button
                        className="remover-item-btn"
                        onClick={() => removeItemsOfCart(item._id)}
                        >
                        ❌
                        </button>
                    </div>
                    </div>
                ))}
                </div>

                <div className="resumo-compra-container">
                <div className="total-carrinho">
                    <span className="total-label">Total:</span>
                    <span className="total-valor">R$ {carrinho.total.toFixed(2)}</span>
                </div>


                <button className="finalizar-compra-btn" onClick={()=>{
                    navigate("/finalizar-compra")
                }}>Finalizar Compra</button>

                <button
                  className="apagar-carrinho-btn"
                  onClick={apagarCarrinho}
                  style={{
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    marginLeft: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Apagar Carrinho
                </button>   

                </div>
            </>
            )}
        </main>

      <SiteFooter />
    </div>
    )
}

export default CarrinhoPage