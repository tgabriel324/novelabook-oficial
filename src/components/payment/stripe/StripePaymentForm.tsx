
import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Novel } from "@/lib/data/types";
import { toast } from "sonner";
import { PurchaseReceipt } from "@/lib/data/paymentTypes";
import StripeCardElement from "./StripeCardElement";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createPaymentIntent, confirmCardPayment, saveCardForFutureUse, generateStripeReceipt } from "@/services/payment/stripeService";

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
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Create payment intent when component mounts
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        if (novel.price) {
          const { clientSecret, paymentIntentId } = await createPaymentIntent(novel.price);
          setClientSecret(clientSecret);
          setPaymentIntentId(paymentIntentId);
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Erro ao iniciar o processamento do pagamento. Tente novamente.");
      }
    };

    fetchPaymentIntent();
  }, [novel.price]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setCardError("");

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create billing details
      const billingDetails = {
        name: customerName || "Cliente NovelBook",
        email: customerEmail || "cliente@exemplo.com"
      };

      // Confirm payment with 3D Secure if required
      const { error, paymentIntent } = await confirmCardPayment(
        clientSecret,
        cardElement,
        billingDetails
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Handle saving card if user opted in
        if (saveCard) {
          try {
            await saveCardForFutureUse("customer_mock_id", cardElement, billingDetails);
            toast.success("Cartão salvo com sucesso para futuras compras!");
          } catch (saveError) {
            console.error("Error saving card:", saveError);
            toast.error("Pagamento processado, mas não foi possível salvar o cartão");
          }
        }
        
        // Generate receipt
        const receipt = generateStripeReceipt(novel, paymentIntentId, "user_current");
        
        toast.success("Pagamento processado com sucesso!");
        onSuccess(receipt);
      } else {
        toast.error("Falha no processamento do pagamento. Status: " + (paymentIntent?.status || "desconhecido"));
        onError();
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro ao processar o pagamento.");
      setCardError(error.message || "Erro no processamento. Tente novamente mais tarde.");
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
      <div className="space-y-2">
        <Label htmlFor="name">Nome no cartão</Label>
        <input
          id="name"
          type="text"
          placeholder="Nome como está no cartão"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
      </div>
      
      <StripeCardElement onChange={handleCardChange} />
      
      {cardError && (
        <div className="text-sm text-red-500 mt-2">{cardError}</div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="save-card" 
          checked={saveCard} 
          onCheckedChange={(checked) => setSaveCard(checked as boolean)} 
        />
        <Label htmlFor="save-card">Salvar cartão para compras futuras</Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={!stripe || !clientSecret || isProcessing}
      >
        {isProcessing ? "Processando..." : `Pagar ${novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}
      </Button>
    </form>
  );
};

export default StripePaymentForm;
