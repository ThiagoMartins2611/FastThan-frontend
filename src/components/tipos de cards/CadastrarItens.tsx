import api from "../../api/api";
import { useState } from "react";
import '../../cssComponents/tipos de cards/CadastrarItems.css'
import { useNavigate } from "react-router-dom";

function CadastrarItens() {
    // 1. Estados para gerenciar a mensagem de feedback e os valores do formulário
    const [mensagem, setMensagem] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        price: "", // Mantemos como string no estado para lidar com o input type="number"
        imageUrl: "",
        description: "",
    });
    const navigate = useNavigate();

    // 2. Função para atualizar o estado quando o input muda
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 3. Função para limpar o formulário
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

        // Conversão para o formato correto antes de enviar
        const dataToSend = {
            name: formData.name,
            // Certifique-se de que a conversão para float é segura
            price: parseFloat(formData.price.replace(',', '.')), 
            imageUrl: formData.imageUrl,
            description: formData.description
        };

        // Validação básica para evitar NaN no preço
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
                // 4. CHAMADA PARA LIMPAR O FORMULÁRIO APÓS O SUCESSO
                limparFormulario(); 
            }

            // O redirecionamento após 2 segundos (opcional) ou remoção
            // para permitir que a mensagem de sucesso seja vista.
            // Se você quer redirecionar *imediatamente*, mantenha assim:
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
                        value={formData.name} // Valor controlado
                        onChange={handleChange} // Handler de mudança
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
                        value={formData.price} // Valor controlado
                        onChange={handleChange} // Handler de mudança
                    />
                </div>

                <div>
                    <label>Imagem (URL):</label>
                    <input 
                        name="imageUrl" 
                        type="text" 
                        placeholder="https://..." 
                        required 
                        value={formData.imageUrl} // Valor controlado
                        onChange={handleChange} // Handler de mudança
                    />
                </div>

                <div>
                    <label>Descrição:</label>
                    <textarea 
                        name="description" 
                        placeholder="Digite uma breve descrição..." 
                        required
                        value={formData.description} // Valor controlado
                        onChange={handleChange} // Handler de mudança
                    ></textarea>
                </div>

                <button type="submit">Cadastrar</button>
            </form>

            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}

export default CadastrarItens;