
import { Dispute } from "@/lib/data/paymentTypes";
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
import { AlertTriangle, Upload } from "lucide-react";

interface DisputeResponseDialogProps {
  dispute: Dispute;
  onSubmit: (response: string, evidence: string[]) => void;
  onCancel: () => void;
}

const DisputeResponseDialog = ({ dispute, onSubmit, onCancel }: DisputeResponseDialogProps) => {
  const [response, setResponse] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  const handleSubmit = () => {
    setError("");
    
    if (!response.trim()) {
      setError("É necessário fornecer uma resposta para a disputa");
      return;
    }
    
    onSubmit(response, evidence);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simular upload de arquivos
      const fileNames = Array.from(files).map(file => file.name);
      setEvidence(prev => [...prev, ...fileNames]);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Responder à Disputa</DialogTitle>
          <DialogDescription>
            Respondendo à disputa #{dispute.id.substring(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Motivo da Disputa</Label>
            <p className="text-sm text-muted-foreground">{dispute.reason}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response">Sua Resposta</Label>
            <Input
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Forneça sua resposta à disputa"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Evidências</Label>
            <div className="grid grid-cols-1 gap-2">
              {evidence.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="text-sm">{file}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEvidence(prev => prev.filter((_, i) => i !== index))}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Clique para adicionar evidências
                    </span>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
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
          <Button onClick={handleSubmit} disabled={!response.trim()}>
            Enviar Resposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeResponseDialog;
