import api from "../../api/api";
import { useState } from "react";
import '../../cssComponents/tipos de cards/CadastrarItems.css'
import { useNavigate } from "react-router-dom";

function CadastrarItens() {
   
    const [mensagem, setMensagem] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        imageUrl: "",
        description: "",
    });
    const navigate = useNavigate();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const limparFormulario = () => {
        setFormData({
            name: "",
            price: "",
            imageUrl: "",
            description: "",
        });
    };

    async function cadastrar(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const dataToSend = {
            name: formData.name,
            price: parseFloat(formData.price.replace(',', '.')), 
            imageUrl: formData.imageUrl,
            description: formData.description
        };

        if (isNaN(dataToSend.price)) {
             setMensagem("O preço não é um número válido.");
             return; 
        }

        try {
            const res = await api.post("/private/AddItemsForSale", dataToSend);

            if (res.status === 401) {
                console.log(res.data.mensagem);
            }
            console.log(res);

            if (res.status === 200) {
                setMensagem("Item cadastrado com sucesso!");
                limparFormulario(); 
            }

            navigate('/HomePage'); 

        } catch (error) {
            console.error(error);
            setMensagem("Erro ao cadastrar item. Verifique os dados e tente novamente.");
        }
    }

    return (
        <div className="cadastroCard">
            <h1>Cadastrar Itens</h1>
            <form onSubmit={cadastrar}>
                <div>
                    <label>Nome do item:</label>
                    <input 
                        name="name" 
                        type="text" 
                        placeholder="Ex: Calculadora Mágica" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Preço:</label>
                    <input 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        placeholder="Ex: 99.90" 
                        required 
                        value={formData.price} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Imagem (URL):</label>
                    <input 
                        name="imageUrl" 
                        type="text" 
                        placeholder="https://..." 
                        required 
                        value={formData.imageUrl} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Descrição:</label>
                    <textarea 
                        name="description" 
                        placeholder="Digite uma breve descrição..." 
                        required
                        value={formData.description} 
                        onChange={handleChange} 
                    ></textarea>
                </div>

                <button type="submit">Cadastrar</button>
            </form>

            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}

export default CadastrarItens;