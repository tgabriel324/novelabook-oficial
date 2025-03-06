
import { QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface PixPaymentFormProps {
  amount: number;
  onSubmit: () => void;
  isProcessing: boolean;
}

const PixPaymentForm = ({ amount, onSubmit, isProcessing }: PixPaymentFormProps) => {
  const [copied, setCopied] = useState(false);
  const pixKey = "00020126580014br.gov.bcb.pix0136example@email.com.br5204000053039865802BR5913NovelBook Shop6008Sao Paulo62070503***6304E2CA";
  
  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada para a área de transferência!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="bg-gray-200 p-6 rounded-lg mb-4">
        <QrCode size={150} className="text-primary" />
      </div>
      
      <div className="w-full flex items-center space-x-2 mb-4">
        <Input 
          value={pixKey}
          readOnly
          className="font-mono text-xs text-muted-foreground"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleCopyPixKey}
          className="flex-shrink-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mb-4">
        Escaneie o QR Code com seu aplicativo de banco para pagar via Pix.
        <br />
        Ou copie a chave PIX acima e cole no seu aplicativo.
        <br />
        O pagamento será confirmado automaticamente.
      </p>
      <Button 
        className="w-full" 
        disabled={isProcessing}
        onClick={onSubmit}
      >
        {isProcessing ? "Processando..." : `Pagar ${amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}
      </Button>
    </div>
  );
};

export default PixPaymentForm;
