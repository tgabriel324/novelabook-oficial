
import { Banknote, Copy, Check, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { generateBoleto, checkBoletoStatus } from "@/services/payment/boletoService";
import { BoletoDetails } from "@/lib/data/paymentTypes";

interface BoletoPaymentFormProps {
  amount: number;
  onSubmit: (transactionId: string) => void;
  isProcessing: boolean;
}

const BoletoPaymentForm = ({ amount, onSubmit, isProcessing }: BoletoPaymentFormProps) => {
  const [copied, setCopied] = useState(false);
  const [boletoDetails, setBoletoDetails] = useState<BoletoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChecking, setStatusChecking] = useState(false);
  
  // Form fields for boleto generation
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Generate boleto when form is submitted
  const handleGenerateBoleto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const details = await generateBoleto(amount, "novel_temp", "user_current", {
        name,
        cpf,
        email,
        address: {
          street,
          number,
          neighborhood,
          city,
          state,
          zipCode
        }
      });
      
      setBoletoDetails(details);
      setFormSubmitted(true);
      toast.success("Boleto gerado com sucesso!");
      
      // Start polling for payment status
      startPolling(details.transactionId);
    } catch (err) {
      console.error("Error generating boleto:", err);
      setError("Erro ao gerar boleto. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Function to start polling for payment status
  const startPolling = (transactionId: string) => {
    // Start checking payment status periodically (every 30 seconds)
    const checkStatus = async () => {
      try {
        setStatusChecking(true);
        const result = await checkBoletoStatus(transactionId);
        
        if (result.status === "completed") {
          toast.success("Pagamento do boleto confirmado!");
          onSubmit(transactionId);
        }
      } catch (err) {
        console.error("Error checking boleto status:", err);
      } finally {
        setStatusChecking(false);
      }
    };
    
    // Check immediately and then every 30 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    
    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  };

  const handleCopyBoletoCode = () => {
    if (!boletoDetails) return;
    
    navigator.clipboard.writeText(boletoDetails.code);
    setCopied(true);
    toast.success("Código de barras copiado para a área de transferência!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadBoleto = () => {
    if (!boletoDetails?.url) return;
    
    // In a real application, this would download a PDF
    window.open(boletoDetails.url, '_blank');
    toast.success("Boleto sendo baixado...");
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (!formSubmitted) {
    return (
      <form onSubmit={handleGenerateBoleto} className="space-y-4 py-4">
        <h3 className="text-lg font-medium">Dados para Geração do Boleto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input 
              id="cpf" 
              value={cpf} 
              onChange={(e) => setCpf(e.target.value)} 
              placeholder="123.456.789-00"
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <h4 className="text-md font-medium">Endereço</h4>
        
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input 
            id="street" 
            value={street} 
            onChange={(e) => setStreet(e.target.value)} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input 
              id="number" 
              value={number} 
              onChange={(e) => setNumber(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input 
              id="neighborhood" 
              value={neighborhood} 
              onChange={(e) => setNeighborhood(e.target.value)} 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input 
              id="city" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input 
              id="state" 
              value={state} 
              onChange={(e) => setState(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input 
              id="zipCode" 
              value={zipCode} 
              onChange={(e) => setZipCode(e.target.value)} 
              placeholder="12345-678"
              required 
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={loading}
        >
          {loading ? "Gerando Boleto..." : "Gerar Boleto"}
        </Button>
      </form>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
          <div className="bg-gray-300 h-36 w-full rounded-lg"></div>
          <div className="bg-gray-300 h-10 w-full rounded"></div>
          <div className="bg-gray-300 h-20 w-full rounded"></div>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Gerando boleto...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => setFormSubmitted(false)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6">
      <Banknote size={64} className="text-primary mb-4" />
      
      <Card className="w-full mb-4">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Código de Barras</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  value={boletoDetails?.code || ""}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyBoletoCode}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Valor</Label>
                <div className="font-medium">
                  {amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Vencimento</Label>
                <div className="font-medium">
                  {boletoDetails ? formatExpirationDate(boletoDetails.expiresAt) : "--/--/----"}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Beneficiário</Label>
              <div className="font-medium">NovelBook Shop</div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Pagador</Label>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">CPF: {cpf}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col space-y-2 w-full mb-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleDownloadBoleto}
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Boleto PDF
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleCopyBoletoCode}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copiar Código de Barras
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mb-4">
        Pague este boleto em qualquer banco ou casa lotérica.
        <br />
        O pagamento pode levar até 3 dias úteis para ser confirmado.
        <br />
        Vencimento: {boletoDetails ? formatExpirationDate(boletoDetails.expiresAt) : "--/--/----"}
      </p>
      
      <Button 
        className="w-full" 
        disabled={isProcessing || statusChecking}
        onClick={() => boletoDetails && onSubmit(boletoDetails.transactionId)}
      >
        {isProcessing || statusChecking ? "Verificando pagamento..." : `Finalizar Pedido`}
      </Button>
    </div>
  );
};

export default BoletoPaymentForm;
