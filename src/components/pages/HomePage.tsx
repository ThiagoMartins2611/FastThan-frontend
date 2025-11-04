import SiteFooter from "../siteDivision/SiteFooter.tsx";
import SiteHeader from "../siteDivision/SiteHeader.tsx";
import api from "../../api/api.ts";
import { useEffect, useState } from "react";
import "../../cssComponents/pages/HomePage.css";
import pencil from "../../images/pencil.svg";
import trash from "../../images/trash.svg";
import { jwtDecode } from "jwt-decode";

interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: number;
}

interface Usuario {
  _id: string;
  name: string;
  age: number;
  email: string;
  key: string;
  adm: boolean;
}

function HomePage() {
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [usuario, setUsuario] = useState<Usuario>({
    _id: "",
    name: "",
    age: 0,
    email: "",
    key: "",
    adm: false,
  });

  const [activePopUp, setActivePopUp] = useState(false);
  const [itemParaApagar, setItemParaApagar] = useState<string | null>(null);

  function confirmar(itemId: string) {
    console.log(itemId)
    setItemParaApagar(itemId);
    setActivePopUp(true);
  }

  function naoApagar() {
    setActivePopUp(false);
    setItemParaApagar(null);
  }

  async function apagarItem(itemId: any) {
    try {
        console.log(itemId)
      const DeletedItemId = itemId;
      const res = await api.post("/private/DeleteItem", {DeletedItemId});

      if (res.status === 200) {
        console.log("Item apagado com sucesso");
    
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        setActivePopUp(false);
        setItemParaApagar(null);
      } else {
        alert("Erro ao apagar o item. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao apagar item:", error);
      alert("Item não foi apagado. Ocorreu um erro inesperado.");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedPayload = jwtDecode<Usuario>(token);
      setUsuario(decodedPayload);
    }

    async function puxarItens() {
      try {
        const res = await api.get("/public/ShowItems");
        setMensagem("Itens carregados com sucesso!");
        setItems(res.data);
        setError(false);
      } catch (error) {
        console.error(error);
        setMensagem("Erro ao carregar os itens.");
        setError(true);
      }
    }

    puxarItens();
  }, []);

  return (
    <>
      <SiteHeader />

      <main id="HomePage">

        <div className="items-container">
          {error && <div className="error-message">{mensagem}</div>}

          {items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              <h2>{item.name}</h2>
              <h1>{item.price}</h1>

              {usuario.adm && (
                <div id="editarEapagar">
                  <img src={pencil} alt="editar" id="editar" />
                  <img
                    onClick={() => {
                        confirmar(item._id)
                        console.log(item._id)
                    }}
                    src={trash}
                    alt="apagar"
                    id="apagar"
                  />
                </div>
              )}
            </div>
          ))
          
          }
        </div>

        {activePopUp && (
          <div id="areaConfirm">
            <div id="confirm">
              <h2>Gostaria mesmo de apagar esse item?</h2>
              <button
                onClick={() => apagarItem(itemParaApagar)}
              >
                Sim
              </button>
              <button onClick={naoApagar}>Não</button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}

export default HomePage;
