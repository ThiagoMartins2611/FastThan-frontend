import { useEffect, useState } from "react";
import api from "../../api/api";
import SiteHeader from "../siteDivision/SiteHeader";
import SiteFooter from "../siteDivision/SiteFooter";
import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity: number;
}

interface Carrinho {
  userId: string;
  userName: string; 
  items: Item[];
  dataAtualizacao: Date | null;
  total: number;
}

function Carrinhos() {
  const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    async function buscarCarrinhos() {
      

      try {
        const res = await api.get("/private/ShowCart");
        if (Array.isArray(res.data.carts)) {
          setCarrinhos(res.data.carts);
        } else {
          console.warn("Resposta inesperada da API:", res.data);
        }
      } catch (error) {
        navigate("/HomePage");
      } finally {
        setLoading(false);
      }
    }

    buscarCarrinhos();
  }, []);

  if (loading) {
    return (
      <div id="carrinhoPage">
        <SiteHeader />
        <main id="Carrinho">
          <h2>Carregando carrinhos...</h2>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div id="carrinhoPage">
      
      <SiteHeader />

      <main id="Carrinho">
        <div id="titulo">
          <h1>📦 Carrinhos dos Usuários</h1>
        </div>

        {carrinhos.length === 0 ? (
          <div className="carrinho-vazio">
            <p>Nenhum carrinho encontrado 😢</p>
          </div>
        ) : (
          carrinhos.map((carrinho, index) => (
            <div key={index} className="carrinho-card">
              <h2>
                🧍 Usuário: {carrinho.userName || carrinho.userId}
              </h2>
              <p>
                Última atualização:{" "}
                {carrinho.dataAtualizacao
                  ? new Date(carrinho.dataAtualizacao).toLocaleString()
                  : "Não informado"}
              </p>

              {carrinho.items.length === 0 ? (
                <p>Este carrinho está vazio.</p>
              ) : (
                <div className="lista-itens-carrinho">
                  {carrinho.items.map((item) => (
                    <div key={item._id} className="item-carrinho-linha">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="item-imagem-carrinho"
                      />

                      <div className="item-info-carrinho">
                        <h3>{item.name}</h3>
                        <p className="descricao-carrinho">
                          {item.description}
                        </p>
                      </div>

                      <div className="item-preco-unitario">
                        <span className="label-preco">Preço Un.</span>
                        <p className="preco-carrinho">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="item-quantidade">
                        <span className="label-quantidade">Qtd</span>
                        <p>{item.quantity}</p>
                      </div>

                      <div className="item-subtotal">
                        <span className="label-subtotal">Subtotal</span>
                        <p className="subtotal-carrinho">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="total-carrinho">
                <strong>Total:</strong> R$ {carrinho.total.toFixed(2)}
              </div>

              <hr className="divisor-carrinho" />
            </div>
          ))
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default Carrinhos;
