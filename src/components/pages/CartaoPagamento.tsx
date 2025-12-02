import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import api from "../../api/api";
import "../../cssComponents/pages/CartaoPagamento.css";
import { useNavigate } from "react-router-dom";

// Estilo interno dos inputs do Stripe (para combinar com seu CSS)
const CARD_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function CartaoPagamento() {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // Melhor controle de estado
  const [total, setTotal] = useState(0);

  // Formatador de Moeda
  const formatarMoeda = (valor:any) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  useEffect(() => {
    async function buscarItensDoCarrinho() {
      try {
        const res = await api.get('/private/ShowItemsInCart');
        setTotal(res.data.total);
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        setStatus({ type: "error", message: "Erro ao carregar valor do pedido." });
      }
    }
    buscarItensDoCarrinho();
  }, []);

  const pagar = async (e:any) => {
    e.preventDefault(); // Previne reload se estiver dentro de um form
    if (!stripe || !elements) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // 1. Criar Intent no Backend
      const { data } = await api.post("/private/criar-pagamento-cartao", { total }); // Enviei o total, caso seu back precise confirmar
      const { clientSecret } = data;

      

      // 2. Confirmar no Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            // Se tiver dados do usuário, adicione aqui (nome, email) para reduzir fraude
            // name: 'Nome do Cliente'
          }
        },

      });

      if (result.error) {
        setStatus({ type: "error", message: result.error.message! });
      } else if (result.paymentIntent?.status === "succeeded") {
        setStatus({ type: "success", message: "Pagamento aprovado com sucesso!" });
        // Aqui você pode redirecionar o usuário ou limpar o carrinho
      }

      navigate("/HomePage");

    } catch (err) {
      const { data } = await api.post("/private/criar-pagamento-cartao", { total });
      console.log(data)
      setStatus({ type: "error", message: "Erro de conexão ao processar pagamento." });
    }

    setLoading(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        
        {/* Cabeçalho do Cartão */}
        <div className="payment-header">
          <h3>Detalhes do Pagamento</h3>
          <div className="payment-total">
            <span>Total a pagar</span>
            <h2>{formatarMoeda(total)}</h2>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={pagar} className="payment-form">
          
          <div className="input-group">
            <label htmlFor="card-number">Número do Cartão</label>
            <div className="stripe-input-wrapper">
              <CardNumberElement id="card-number" options={CARD_OPTIONS} />
            </div>
          </div>

          <div className="row">
            <div className="input-group col">
              <label htmlFor="card-expiry">Validade</label>
              <div className="stripe-input-wrapper">
                <CardExpiryElement id="card-expiry" options={CARD_OPTIONS} />
              </div>
            </div>

            <div className="input-group col">
              <label htmlFor="card-cvc">CVC</label>
              <div className="stripe-input-wrapper">
                <CardCvcElement id="card-cvc" options={CARD_OPTIONS} />
              </div>
            </div>
          </div>

          {/* Feedback de Erro/Sucesso */}
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          <button type="submit" className="pay-button" disabled={loading || !stripe}>
            {loading ? (
              <span className="spinner"></span> 
            ) : (
              `Pagar ${formatarMoeda(total)}`
            )}
          </button>
          
          <div className="secure-badge">
            <small>🔒 Pagamento 100% seguro via Stripe</small>
          </div>
        </form>
      </div>
    </div>
  );
}