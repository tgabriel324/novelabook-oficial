
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PixPaymentFormProps {
  amount: number;
  onSubmit: () => void;
  isProcessing: boolean;
}

const PixPaymentForm = ({ amount, onSubmit, isProcessing }: PixPaymentFormProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="bg-gray-200 p-6 rounded-lg mb-4">
        <QrCode size={150} className="text-primary" />
      </div>
      <p className="text-center text-sm text-muted-foreground mb-4">
        Escaneie o QR Code com seu aplicativo de banco para pagar via Pix.
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
