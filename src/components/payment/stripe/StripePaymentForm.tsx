
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Novel } from "@/lib/data/types";
import { toast } from "sonner";
import { PaymentMethod, PurchaseReceipt } from "@/lib/data/paymentTypes";
import StripeCardElement from "./StripeCardElement";

interface StripePaymentFormProps {
  novel: Novel;
  onSuccess: (receipt: PurchaseReceipt) => void;
  onError: () => void;
}

const StripePaymentForm = ({ novel, onSuccess, onError }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe ainda não está carregado
      return;
    }

    setIsProcessing(true);
    setCardError("");

    // Em um ambiente de produção, você chamaria sua API para criar uma PaymentIntent
    // e enviaria o client_secret para o frontend
    
    // Simulação do processo de pagamento para demonstração
    try {
      // Simular um delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 90% de chance de sucesso para simular a transação
      const success = Math.random() > 0.1;
      
      if (success) {
        // Criar recibo de compra
        const newReceipt: PurchaseReceipt = {
          id: `purchase_${Date.now()}`,
          userId: "user_current",
          novelId: novel.id,
          title: novel.title,
          price: novel.price || 0,
          purchaseDate: new Date().toISOString(),
          paymentMethod: 'credit_card' as PaymentMethod,
          paymentStatus: 'completed'
        };
        
        toast.success("Pagamento processado com sucesso!");
        onSuccess(newReceipt);
      } else {
        toast.error("Falha no processamento do pagamento. Por favor, tente novamente.");
        setCardError("Erro no processamento. Verifique os dados do cartão.");
        onError();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar o pagamento.");
      setCardError("Erro no processamento. Tente novamente mais tarde.");
      onError();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StripeCardElement onChange={handleCardChange} />
      
      {cardError && (
        <div className="text-sm text-red-500 mt-2">{cardError}</div>
      )}
      
      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processando..." : `Pagar ${novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}
      </Button>
    </form>
  );
};

export default StripePaymentForm;
