
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Banknote, QrCode } from "lucide-react";
import { toast } from "sonner";
import { PaymentMethod, CardDetails, PurchaseReceipt } from "@/lib/data/paymentTypes";
import { Novel } from "@/lib/data/types";
import PurchaseReceiptComponent from "./PurchaseReceipt";
import StripeProvider from "./stripe/StripeProvider";
import StripePaymentForm from "./stripe/StripePaymentForm";

interface PaymentFormProps {
  novel: Novel;
  onPaymentComplete: (success: boolean) => void;
}

const PaymentForm = ({ novel, onPaymentComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null);

  const handleCardDetailsChange = (field: keyof CardDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

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
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-gray-200 p-6 rounded-lg mb-4">
                <QrCode size={150} className="text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Escaneie o QR Code com seu aplicativo de banco para pagar via Pix.
                <br />
                O pagamento será confirmado automaticamente.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="boleto">
            <div className="flex flex-col items-center py-6">
              <Banknote size={64} className="text-primary mb-4" />
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={() => toast.success("Boleto gerado e copiado para a área de transferência!")}
              >
                Gerar e Copiar Código de Barras
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Pague este boleto em qualquer banco ou casa lotérica.
                <br />
                O pagamento pode levar até 3 dias úteis para ser confirmado.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {paymentMethod !== 'credit_card' && (
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={isProcessing}
            onClick={handlePayment}
          >
            {isProcessing ? "Processando..." : `Pagar ${novel.price?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PaymentForm;
