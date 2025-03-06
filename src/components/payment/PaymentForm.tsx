
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Banknote, QrCode } from "lucide-react";
import { toast } from "sonner";
import { PaymentMethod, PurchaseReceipt } from "@/lib/data/paymentTypes";
import { Novel } from "@/lib/data/types";
import PurchaseReceiptComponent from "./PurchaseReceipt";
import StripeProvider from "./stripe/StripeProvider";
import StripePaymentForm from "./stripe/StripePaymentForm";
import PixPaymentForm from "./pix/PixPaymentForm";
import BoletoPaymentForm from "./boleto/BoletoPaymentForm";
import { generatePixReceipt } from "@/services/payment/pixService";
import { generateBoletoReceipt } from "@/services/payment/boletoService";
import { createPaymentIntent } from "@/services/payment/stripeService";

interface PaymentFormProps {
  novel: Novel;
  onPaymentComplete: (success: boolean) => void;
}

const PaymentForm = ({ novel, onPaymentComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  
  // Get Stripe client secret when component mounts
  useEffect(() => {
    const fetchClientSecret = async () => {
      if (novel.price && paymentMethod === 'credit_card') {
        try {
          const { clientSecret } = await createPaymentIntent(novel.price);
          setClientSecret(clientSecret);
        } catch (error) {
          console.error("Error fetching client secret:", error);
          toast.error("Erro ao iniciar o processamento do pagamento");
        }
      }
    };
    
    fetchClientSecret();
  }, [novel.price, paymentMethod]);

  const handlePayment = async (transactionId: string) => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create receipt based on payment method
      let paymentReceipt: PurchaseReceipt;
      
      if (paymentMethod === 'pix') {
        paymentReceipt = generatePixReceipt(novel, transactionId, "user_current");
      } else {
        paymentReceipt = generateBoletoReceipt(novel, transactionId, "user_current");
      }
      
      setReceipt(paymentReceipt);
      setShowReceipt(true);
      toast.success(`Pagamento de ${novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} processado com sucesso!`);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Falha no processamento do pagamento. Por favor, tente novamente.");
      onPaymentComplete(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeSuccess = (receipt: PurchaseReceipt) => {
    setReceipt(receipt);
    setShowReceipt(true);
  };

  const handleStripeError = () => {
    onPaymentComplete(false);
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    onPaymentComplete(true);
  };

  if (showReceipt && receipt) {
    return <PurchaseReceiptComponent receipt={receipt} onClose={handleReceiptClose} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Finalizar Compra</CardTitle>
        <CardDescription>
          {novel.title} - {novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="card" onClick={() => setPaymentMethod('credit_card')}>
              <CreditCard className="h-4 w-4 mr-2" />
              Cartão
            </TabsTrigger>
            <TabsTrigger value="pix" onClick={() => setPaymentMethod('pix')}>
              <QrCode className="h-4 w-4 mr-2" />
              Pix
            </TabsTrigger>
            <TabsTrigger value="boleto" onClick={() => setPaymentMethod('boleto')}>
              <Banknote className="h-4 w-4 mr-2" />
              Boleto
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4">
            <StripeProvider clientSecret={clientSecret}>
              <StripePaymentForm 
                novel={novel} 
                onSuccess={handleStripeSuccess} 
                onError={handleStripeError} 
              />
            </StripeProvider>
          </TabsContent>
          
          <TabsContent value="pix">
            <PixPaymentForm 
              amount={novel.price || 0} 
              onSubmit={handlePayment} 
              isProcessing={isProcessing} 
            />
          </TabsContent>
          
          <TabsContent value="boleto">
            <BoletoPaymentForm 
              amount={novel.price || 0} 
              onSubmit={handlePayment} 
              isProcessing={isProcessing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
