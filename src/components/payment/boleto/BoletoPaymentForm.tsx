
import { Banknote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BoletoPaymentFormProps {
  amount: number;
  onSubmit: () => void;
  isProcessing: boolean;
}

const BoletoPaymentForm = ({ amount, onSubmit, isProcessing }: BoletoPaymentFormProps) => {
  return (
    <div className="flex flex-col items-center py-6">
      <Banknote size={64} className="text-primary mb-4" />
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => toast.success("Boleto gerado e copiado para a área de transferência!")}
      >
        Gerar e Copiar Código de Barras
      </Button>
      <p className="text-center text-sm text-muted-foreground mb-4">
        Pague este boleto em qualquer banco ou casa lotérica.
        <br />
        O pagamento pode levar até 3 dias úteis para ser confirmado.
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

export default BoletoPaymentForm;
