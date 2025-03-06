
import { QrCode, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { generatePixPayment, checkPixPaymentStatus } from "@/services/payment/pixService";
import { PixDetails } from "@/lib/data/paymentTypes";
import { Progress } from "@/components/ui/progress";

interface PixPaymentFormProps {
  amount: number;
  onSubmit: (transactionId: string) => void;
  isProcessing: boolean;
}

const PixPaymentForm = ({ amount, onSubmit, isProcessing }: PixPaymentFormProps) => {
  const [copied, setCopied] = useState(false);
  const [pixDetails, setPixDetails] = useState<PixDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes in seconds
  const [pollInterval, setPollInterval] = useState<number | null>(null);
  const [statusChecking, setStatusChecking] = useState(false);

  // Generate PIX payment when component mounts
  useEffect(() => {
    const generatePix = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await generatePixPayment(amount, "novel_temp", "user_current");
        setPixDetails(details);
        
        // Calculate expiration time
        const expiresAt = new Date(details.expiresAt);
        const now = new Date();
        const secondsLeft = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
        setTimeLeft(Math.max(0, secondsLeft));
        
        // Start polling for payment status
        startPolling(details.transactionId);
      } catch (err) {
        console.error("Error generating PIX:", err);
        setError("Erro ao gerar pagamento PIX. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    generatePix();

    // Cleanup function to clear intervals when component unmounts
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [amount]);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Stop polling when time expires
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, pollInterval]);

  // Function to start polling for payment status
  const startPolling = (transactionId: string) => {
    // Clear any existing interval
    if (pollInterval) {
      clearInterval(pollInterval);
    }

    // Set up new polling interval (every 5 seconds)
    const interval = window.setInterval(async () => {
      try {
        setStatusChecking(true);
        const result = await checkPixPaymentStatus(transactionId);
        
        if (result.status === "completed") {
          // Payment received, stop polling and proceed
          clearInterval(interval);
          setPollInterval(null);
          toast.success("Pagamento PIX recebido com sucesso!");
          onSubmit(transactionId);
        } else if (result.status === "expired") {
          // Payment expired, stop polling
          clearInterval(interval);
          setPollInterval(null);
          setError("O tempo para pagamento expirou. Por favor, gere um novo código PIX.");
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      } finally {
        setStatusChecking(false);
      }
    }, 5000);

    setPollInterval(interval);
  };

  const handleCopyPixKey = () => {
    if (!pixDetails) return;
    
    navigator.clipboard.writeText(pixDetails.key);
    setCopied(true);
    toast.success("Chave PIX copiada para a área de transferência!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleRefresh = async () => {
    // Regenerate PIX payment
    try {
      setLoading(true);
      setError(null);
      
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      
      const details = await generatePixPayment(amount, "novel_temp", "user_current");
      setPixDetails(details);
      
      // Reset expiration timer
      const expiresAt = new Date(details.expiresAt);
      const now = new Date();
      const secondsLeft = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
      setTimeLeft(Math.max(0, secondsLeft));
      
      // Restart polling
      startPolling(details.transactionId);
      
      toast.success("Novo código PIX gerado com sucesso!");
    } catch (err) {
      console.error("Error refreshing PIX:", err);
      setError("Erro ao gerar novo pagamento PIX. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage (100% at start, 0% at expiry)
  const progressPercentage = () => {
    // Assuming initial time is 30 minutes (1800 seconds)
    return (timeLeft / 1800) * 100;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
          <div className="bg-gray-300 h-36 w-36 rounded-lg"></div>
          <div className="bg-gray-300 h-10 w-full rounded"></div>
          <div className="bg-gray-300 h-20 w-full rounded"></div>
          <div className="bg-gray-300 h-10 w-full rounded"></div>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Gerando código PIX...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar Novo Código PIX
        </Button>
      </div>
    );
  }

  if (timeLeft <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-amber-500 mb-4">O código PIX expirou.</div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar Novo Código PIX
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {pixDetails?.qrCodeImage ? (
        <div className="bg-white p-4 rounded-lg mb-4 border">
          <img 
            src={pixDetails.qrCodeImage} 
            alt="QR Code PIX" 
            className="h-36 w-36"
          />
        </div>
      ) : (
        <div className="bg-gray-200 p-6 rounded-lg mb-4">
          <QrCode size={150} className="text-primary" />
        </div>
      )}
      
      <div className="w-full flex items-center space-x-2 mb-4">
        <Input 
          value={pixDetails?.key || ""}
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
      
      <div className="w-full mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Tempo restante:</span>
          <span>{formatTimeLeft()}</span>
        </div>
        <Progress value={progressPercentage()} className="h-2" />
      </div>
      
      <p className="text-center text-sm text-muted-foreground mb-4">
        Escaneie o QR Code com seu aplicativo de banco para pagar via Pix.
        <br />
        Ou copie a chave PIX acima e cole no seu aplicativo.
        <br />
        O pagamento será confirmado automaticamente.
      </p>
      
      <div className="flex flex-col space-y-2 w-full">
        <Button 
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || statusChecking}
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${statusChecking ? 'animate-spin' : ''}`} />
          {statusChecking ? "Verificando pagamento..." : "Gerar Novo Código PIX"}
        </Button>
        
        <Button 
          className="w-full" 
          disabled={isProcessing || statusChecking}
          onClick={() => pixDetails && onSubmit(pixDetails.transactionId)}
        >
          {isProcessing ? "Processando..." : `Pagar ${amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}
        </Button>
      </div>
    </div>
  );
};

export default PixPaymentForm;
