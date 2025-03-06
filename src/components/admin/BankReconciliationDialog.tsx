
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
import { Upload, Search, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface BankReconciliationDialogProps {
  transactions: Transaction[];
  reconciliations: BankReconciliation[];
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReconcile: (reconciliationId: string, transactionId: string) => void;
  onClose: () => void;
}

const BankReconciliationDialog = ({
  transactions,
  reconciliations,
  onImportFile,
  onReconcile,
  onClose
}: BankReconciliationDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Valor Sistema</TableHead>
                  <TableHead>Valor Banco</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <p>Importe um extrato bancário para começar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reconciliations.map((reconciliation) => (
                    <TableRow key={reconciliation.id}>
                      <TableCell>{reconciliation.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {formatCurrency(reconciliation.systemAmount || 0)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(reconciliation.bankAmount)}
                      </TableCell>
                      <TableCell>
                        {reconciliation.status === 'matched' ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            <span>Conciliado</span>
                          </div>
                        ) : reconciliation.status === 'partial_match' ? (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Parcial</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-500">
                            <XCircle className="h-4 w-4" />
                            <span>Não Conciliado</span>
                          </div>
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
                            onClick={() => {
                              // Abrir modal de seleção de transação
                              const transaction = transactions.find(t => 
                                Math.abs(t.amount - reconciliation.bankAmount) < 0.01
                              );
                              
                              if (transaction) {
                                onReconcile(reconciliation.id, transaction.id);
                              }
                            }}
                          >
                            Conciliar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Transações do Sistema</h4>
            <div className="rounded-md border">
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
                  {transactions.filter(filterTransactions).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>
                        {formatDateTime(transaction.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Encontrar reconciliação correspondente
                            const reconciliation = reconciliations.find(r =>
                              r.status === 'unmatched' &&
                              Math.abs(r.bankAmount - transaction.amount) < 0.01
                            );
                            
                            if (reconciliation) {
                              onReconcile(reconciliation.id, transaction.id);
                            }
                          }}
                        >
                          Conciliar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankReconciliationDialog;
