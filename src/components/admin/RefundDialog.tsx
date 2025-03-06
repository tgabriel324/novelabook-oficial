
import { Transaction } from "@/lib/data/paymentTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface RefundDialogProps {
  transaction: Transaction;
  onRefund: (amount: number, reason: string) => void;
  onCancel: () => void;
}

const RefundDialog = ({ transaction, onRefund, onCancel }: RefundDialogProps) => {
  const [amount, setAmount] = useState(transaction.amount);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = () => {
    setError("");
    
    if (!amount || amount <= 0) {
      setError("O valor do reembolso deve ser maior que zero");
      return;
    }
    
    if (amount > transaction.amount) {
      setError("O valor do reembolso não pode ser maior que o valor da transação");
      return;
    }
    
    if (!reason.trim()) {
      setError("É necessário informar um motivo para o reembolso");
      return;
    }
    
    onRefund(amount, reason);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: transaction.currency
    }).format(value);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Reembolso</DialogTitle>
          <DialogDescription>
            Processando reembolso para a transação #{transaction.id.substring(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Reembolso</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              step="0.01"
              min="0"
              max={transaction.amount}
            />
            <p className="text-sm text-muted-foreground">
              Valor máximo: {formatCurrency(transaction.amount)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do Reembolso</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Informe o motivo do reembolso"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!amount || !reason.trim() || amount > transaction.amount}
          >
            Processar Reembolso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
