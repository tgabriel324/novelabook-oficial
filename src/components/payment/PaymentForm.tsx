
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PaymentFormProps {
  novel: Novel;
  onPaymentComplete: (success: boolean) => void;
}

const PaymentForm = ({ novel, onPaymentComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulação de processamento de pagamento para métodos não-Stripe
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% de chance de sucesso para simular
      
      if (success) {
        // Criar recibo de compra
        const newReceipt: PurchaseReceipt = {
          id: `purchase_${Date.now()}`,
          userId: "user_current",
          novelId: novel.id,
          title: novel.title,
          price: novel.price || 0,
          purchaseDate: new Date().toISOString(),
          paymentMethod: paymentMethod,
          paymentStatus: 'completed'
        };
        
        setReceipt(newReceipt);
        setShowReceipt(true);
        toast.success(`Pagamento de ${novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} processado com sucesso!`);
      } else {
        toast.error("Falha no processamento do pagamento. Por favor, tente novamente.");
        onPaymentComplete(false);
      }
      
      setIsProcessing(false);
    }, 2000);
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
            <StripeProvider>
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
