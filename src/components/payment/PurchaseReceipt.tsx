
import { PurchaseReceipt as PurchaseReceiptType } from "@/lib/data/paymentTypes";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import TelegramShareButton from "@/components/sharing/TelegramShareButton";

interface PurchaseReceiptProps {
  receipt: PurchaseReceiptType;
  onClose?: () => void;
}

const PurchaseReceipt = ({ receipt, onClose }: PurchaseReceiptProps) => {
  const date = new Date(receipt.purchaseDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDownload = () => {
    toast.success("Recibo salvo em seus downloads");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center border-b pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-primary">
          <Check className="h-5 w-5" />
          Compra Confirmada
        </CardTitle>
        <CardDescription>
          Recibo de compra #{receipt.id.substring(0, 8)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Título:</span>
            <span className="font-medium">{receipt.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-medium">
              {receipt.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método:</span>
            <span className="font-medium capitalize">
              {receipt.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
               receipt.paymentMethod === 'debit_card' ? 'Cartão de Débito' : 
               receipt.paymentMethod === 'pix' ? 'PIX' : 'Boleto'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-medium ${receipt.paymentStatus === 'completed' ? 'text-green-600' : 
              receipt.paymentStatus === 'pending' ? 'text-amber-600' : 
              receipt.paymentStatus === 'failed' ? 'text-red-600' : 'text-blue-600'}`}>
              {receipt.paymentStatus === 'completed' ? 'Aprovado' : 
               receipt.paymentStatus === 'pending' ? 'Pendente' : 
               receipt.paymentStatus === 'failed' ? 'Falhou' : 'Reembolsado'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Recibo
          </Button>
          <TelegramShareButton
            text={`Acabei de adquirir "${receipt.title}" no NovelBook! Venha conferir também!`}
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </TelegramShareButton>
        </div>
        {onClose && (
          <Button 
            className="w-full" 
            onClick={onClose}
          >
            Ir para Biblioteca
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PurchaseReceipt;
