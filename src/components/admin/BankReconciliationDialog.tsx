import { Transaction, BankReconciliation } from "@/lib/data/paymentTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Upload, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Info
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BankReconciliationDialogProps {
  transactions: Transaction[];
  reconciliations: BankReconciliation[];
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReconcile: (reconciliationId: string, transactionId: string) => void;
  onResolveDiscrepancy?: (reconciliationId: string, reason: string) => void;
  onClose: () => void;
}

const BankReconciliationDialog = ({
  transactions,
  reconciliations,
  onImportFile,
  onReconcile,
  onResolveDiscrepancy,
  onClose
}: BankReconciliationDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReconciliation, setSelectedReconciliation] = useState<BankReconciliation | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [discrepancyReason, setDiscrepancyReason] = useState("");
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  const filterTransactions = (transaction: Transaction) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(term) ||
      transaction.userId.toLowerCase().includes(term) ||
      transaction.amount.toString().includes(term)
    );
  };
  
  const handleTransactionSelection = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };
  
  const handleReconciliationSelection = (reconciliation: BankReconciliation) => {
    setSelectedReconciliation(reconciliation);
  };
  
  const matchAndReconcile = () => {
    if (selectedReconciliation && selectedTransaction) {
      onReconcile(selectedReconciliation.id, selectedTransaction.id);
      setSelectedReconciliation(null);
      setSelectedTransaction(null);
    }
  };
  
  const handleResolveDiscrepancy = () => {
    if (selectedReconciliation && onResolveDiscrepancy && discrepancyReason) {
      onResolveDiscrepancy(selectedReconciliation.id, discrepancyReason);
      setSelectedReconciliation(null);
      setDiscrepancyReason("");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conciliação Bancária</DialogTitle>
          <DialogDescription>
            Importe seu extrato bancário e reconcilie as transações
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="w-full md:w-auto">
              <label 
                htmlFor="bank-statement" 
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
              >
                <Upload className="h-4 w-4" />
                <span>Importar Extrato</span>
                <input
                  id="bank-statement"
                  type="file"
                  className="hidden"
                  accept=".csv,.ofx"
                  onChange={onImportFile}
                />
              </label>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="p-4 bg-muted/20 border-b">
              <h3 className="font-medium">Entradas do Extrato Bancário</h3>
              <p className="text-sm text-muted-foreground">
                Selecione uma entrada não conciliada para fazer a correspondência manual
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Valor Banco</TableHead>
                  <TableHead>Valor Sistema</TableHead>
                  <TableHead>Diferença</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <p>Importe um extrato bancário para começar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reconciliations.map((reconciliation) => {
                    const isSelected = selectedReconciliation?.id === reconciliation.id;
                    return (
                      <TableRow 
                        key={reconciliation.id}
                        className={isSelected ? "bg-muted/30" : undefined}
                        onClick={() => reconciliation.status === 'unmatched' && handleReconciliationSelection(reconciliation)}
                        style={reconciliation.status === 'unmatched' ? { cursor: 'pointer' } : undefined}
                      >
                        <TableCell>{reconciliation.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          {formatCurrency(reconciliation.bankAmount)}
                        </TableCell>
                        <TableCell>
                          {reconciliation.systemAmount ? formatCurrency(reconciliation.systemAmount) : "-"}
                        </TableCell>
                        <TableCell>
                          {reconciliation.discrepancyAmount !== undefined ? (
                            <span className={reconciliation.discrepancyAmount < 0.01 ? 'text-green-500' : 'text-red-500'}>
                              {formatCurrency(reconciliation.discrepancyAmount)}
                            </span>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          {reconciliation.status === 'matched' ? (
                            <Badge variant="default" className="bg-green-500">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Conciliado</span>
                              </div>
                            </Badge>
                          ) : reconciliation.status === 'partial_match' ? (
                            <Badge variant="default" className="bg-yellow-500">
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Parcial</span>
                              </div>
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <div className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                <span>Não Conciliado</span>
                              </div>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(reconciliation.createdAt)}
                        </TableCell>
                        <TableCell>
                          {reconciliation.status === 'unmatched' && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!!selectedReconciliation && selectedReconciliation.id !== reconciliation.id}
                            >
                              Selecionar
                            </Button>
                          )}
                          {reconciliation.status === 'partial_match' && onResolveDiscrepancy && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReconciliationSelection(reconciliation)}
                                  >
                                    <Info className="h-4 w-4 mr-1" />
                                    Resolver
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Resolver discrepância de valores</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {reconciliation.status === 'matched' && reconciliation.transactionId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver Transação
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {selectedReconciliation && (
            <div className="rounded-md border p-4 bg-blue-50">
              <h3 className="font-medium mb-2">Entrada Selecionada</h3>
              <p>
                <span className="font-medium">ID:</span> {selectedReconciliation.id}
              </p>
              <p>
                <span className="font-medium">Valor do Banco:</span> {formatCurrency(selectedReconciliation.bankAmount)}
              </p>
              <p>
                <span className="font-medium">Data:</span> {formatDateTime(selectedReconciliation.createdAt)}
              </p>
              
              {selectedReconciliation.status === 'partial_match' && onResolveDiscrepancy && (
                <div className="mt-4">
                  <Label htmlFor="discrepancy-reason">Motivo da Discrepância</Label>
                  <Input
                    id="discrepancy-reason"
                    value={discrepancyReason}
                    onChange={(e) => setDiscrepancyReason(e.target.value)}
                    placeholder="Explique a razão da diferença de valores"
                    className="mt-1"
                  />
                  <Button 
                    className="mt-2" 
                    disabled={!discrepancyReason}
                    onClick={handleResolveDiscrepancy}
                  >
                    Resolver Discrepância
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div>
            <div className="p-4 bg-muted/20 border-b border-x border-t rounded-t-md">
              <h3 className="font-medium">Transações do Sistema</h3>
              <p className="text-sm text-muted-foreground">
                Selecione uma transação para conciliar com a entrada bancária selecionada
              </p>
            </div>
            <div className="rounded-b-md border-b border-x">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(filterTransactions).map((transaction) => {
                    const isSelected = selectedTransaction?.id === transaction.id;
                    const isSuggestedMatch = selectedReconciliation && 
                      Math.abs(selectedReconciliation.bankAmount - transaction.amount) < 0.01;
                    
                    return (
                      <TableRow 
                        key={transaction.id}
                        className={
                          isSelected 
                            ? "bg-muted/30" 
                            : isSuggestedMatch 
                              ? "bg-green-50" 
                              : undefined
                        }
                        onClick={() => selectedReconciliation && handleTransactionSelection(transaction)}
                        style={selectedReconciliation ? { cursor: 'pointer' } : undefined}
                      >
                        <TableCell>{transaction.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>
                          {formatDateTime(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          {selectedReconciliation && (
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              disabled={!selectedReconciliation}
                              onClick={() => handleTransactionSelection(transaction)}
                            >
                              {isSelected ? "Selecionada" : "Selecionar"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              disabled={!selectedReconciliation || !selectedTransaction}
              onClick={matchAndReconcile}
            >
              Conciliar Selecionados
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankReconciliationDialog;
