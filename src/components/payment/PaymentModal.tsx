
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentForm from "./PaymentForm";
import { Novel } from "@/lib/data/types";
import { useNavigate } from "react-router-dom";

interface PaymentModalProps {
  novel: Novel;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ novel, isOpen, onClose }: PaymentModalProps) => {
  const navigate = useNavigate();
  
  const handlePaymentComplete = (success: boolean) => {
    onClose();
    
    if (success) {
      // Redirecionaria para a biblioteca se o pagamento fosse bem-sucedido
      setTimeout(() => {
        navigate("/biblioteca");
      }, 1500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comprar Novela</DialogTitle>
          <DialogDescription>
            Complete o pagamento para adicionar "{novel.title}" à sua biblioteca.
          </DialogDescription>
        </DialogHeader>
        <PaymentForm novel={novel} onPaymentComplete={handlePaymentComplete} />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
