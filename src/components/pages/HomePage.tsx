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
  price: number;
  imageUrl: string;
  description: string;
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
  const [ activeEdit, setActiveEdit ] = useState ( false )
  const [itemParaEditar, setItemParaEditar] = useState<Item | null>(null);
  const [logado, setLogado] = useState(false);
  const [msgButtons, setMsgButtons] = useState<{[key: string]: string}>({});

  function confirmar(itemId: string) {
    setItemParaApagar(itemId);
    setActivePopUp(true);
  }

  function naoApagar() {
    setActivePopUp(false);
    setItemParaApagar(null);
  }

  async function apagarItem(itemId: any) {
    try {
      const res = await api.post("/private/DeleteItem", {DeletedItemId:itemId});

      if (res.status === 200) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        setActivePopUp(false);
        setItemParaApagar(null);
        setMensagem ( "Item apagado com sucesso!" );
        setError(false);
      } else {
        setMensagem ( "Erro ao apagar o item. Tente novamente." );
        setError(true);
      }
    } catch (error) {
      setMensagem ( "Item não foi apagado. Ocorreu um erro inesperado." );
      setError(true);
    }
  }

  async function alterarItem(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!itemParaEditar) return;

      const itemEdit = { 
        _id:itemParaEditar._id, 
        name:itemParaEditar.name, 
        price:itemParaEditar.price, 
        imageUrl:itemParaEditar.imageUrl, 
        description:itemParaEditar.description 
      };

      const res = await api.put("/private/UpdateItem", itemEdit);

      if (res.status === 200) {
        setItems((prev) => prev.map((i) => (i._id === itemParaEditar._id ? itemParaEditar : i)));
        setActiveEdit(false);
        setItemParaEditar(null);
        setMensagem ( "Item atualizado com sucesso!" );
        setError(false);
      }
    } catch (error) {
      setMensagem ( "Erro ao editar item. Tente novamente." );
      setError(true);
    }
  }

  async function addCarrinho(itemId:string) {
    try {
      const quantityItem = 1;
      const res = await api.post('/private/AddItemsInCart', {itemId, quantityItem});

      if(res.status == 201) {
        setMsgButtons((prev) => ({
          ...prev,
          [itemId]: res.data.mensagem
        }));
      } else {
        setMensagem(res.data.mensagem);
        setError(true);
      }

    } catch (error) {
      setMensagem ( "Erro ao se comunicar com o servidor" );
      setError(true);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedPayload = jwtDecode<Usuario>(token);
      setUsuario(decodedPayload);
      setLogado(true);
    } else {
      setLogado(false);
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
  }, []);

  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => {
      setMensagem("");
      setError(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [mensagem]);

  return (
    <>
    <div id="Home">
      <SiteHeader />

      {error && mensagem && (
        <div id="popupErro">
          {mensagem}
        </div>
      )}

      {activeEdit && itemParaEditar && (
        <div id="editArea">
          <div id="editForm">
            <h2>Editar Item</h2>

            <form onSubmit={alterarItem}>
              <label>Nome:</label>
              <input
                type="text"
                value={itemParaEditar.name}
                onChange={(e) =>
                  setItemParaEditar({ ...itemParaEditar, name: e.target.value })
                }
              />

              <label>Descrição:</label>
              <input
                type="text"
                value={itemParaEditar.description}
                onChange={(e) =>
                  setItemParaEditar({ ...itemParaEditar, description: e.target.value })
                }
              />

              <label>Preço:</label>
              <input
                type="number"
                value={itemParaEditar.price}
                onChange={(e) =>
                  setItemParaEditar({ ...itemParaEditar, price: Number(e.target.value) })
                }
              />

              <label>URL da Imagem:</label>
              <input
                type="text"
                value={itemParaEditar.imageUrl}
                onChange={(e) =>
                  setItemParaEditar({ ...itemParaEditar, imageUrl: e.target.value })
                }
              />

              <button type="submit">Salvar Alterações</button>
              <button type="button" onClick={() => setActiveEdit(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <main id="HomePage">

        <div className="items-container">

        
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              <h2>{item.name}</h2>
              <h1>R${item.price}</h1>

              {(logado && !usuario.adm) &&(
                <div id="adicionarCarrinho">
                  <button className="btn-carrinho" onClick={()=>{addCarrinho(item._id)}}>
                    { msgButtons[item._id] ?? "Adicionar no carrinho" }
                  </button>
                </div>
              )}

              {usuario.adm && (
                <div id="editarEapagar">
                  <img
                    onClick={() => { setItemParaEditar(item); setActiveEdit(true); }}
                    src={pencil}
                    alt="editar"
                    id="editar"
                  />

                  <img
                    onClick={() => confirmar(item._id)}
                    src={trash}
                    alt="apagar"
                    id="apagar"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {activePopUp && (
          <div id="areaConfirm">
            <div id="confirm">
              <h2>Gostaria mesmo de apagar esse item?</h2>
              <button onClick={() => apagarItem(itemParaApagar)}>Sim</button>
              <button onClick={naoApagar}>Não</button>
            </div>
          </div>
        )}

      </main>

      <SiteFooter />
    </div>
    </>
  );
}

export default HomePage;
