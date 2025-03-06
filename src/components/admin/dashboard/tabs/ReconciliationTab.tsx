
import React from 'react';
import { Transaction, BankReconciliation } from '@/lib/data/paymentTypes';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface ReconciliationTabProps {
  reconciliations: BankReconciliation[];
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setReconciliationDialogOpen: (open: boolean) => void;
}

const ReconciliationTab: React.FC<ReconciliationTabProps> = ({ 
  reconciliations, 
  handleFileUpload, 
  setReconciliationDialogOpen 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conciliação Bancária</CardTitle>
        <CardDescription>
          Concilie transações com extratos bancários
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Importar Extrato</h3>
            <p className="text-sm text-gray-500">Importe um arquivo CSV ou OFX de extrato bancário</p>
          </div>
          <div>
            <Input
              type="file"
              className="hidden"
              id="bank-statement"
              accept=".csv,.ofx"
              onChange={handleFileUpload}
            />
            <label htmlFor="bank-statement">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Importar Arquivo</span>
              </Button>
            </label>
          </div>
        </div>
        
        {reconciliations.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Extrato</TableHead>
                  <TableHead>Valor Banco</TableHead>
                  <TableHead>Valor Sistema</TableHead>
                  <TableHead>Diferença</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliations.map((reconciliation) => (
                  <TableRow key={reconciliation.id}>
                    <TableCell className="font-mono text-xs">{reconciliation.id}</TableCell>
                    <TableCell className="font-mono text-xs">{reconciliation.bankStatementId}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(reconciliation.bankAmount)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(reconciliation.systemAmount)}
                    </TableCell>
                    <TableCell>
                      {reconciliation.discrepancyAmount !== undefined ? (
                        <span className={reconciliation.discrepancyAmount === 0 ? 'text-green-500' : 'text-red-500'}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(reconciliation.discrepancyAmount)}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        reconciliation.status === 'matched' 
                          ? 'bg-green-500' 
                          : reconciliation.status === 'partial_match' 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }>
                        {reconciliation.status === 'matched' && 'Conciliado'}
                        {reconciliation.status === 'partial_match' && 'Parcial'}
                        {reconciliation.status === 'unmatched' && 'Não Conciliado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {reconciliation.status === 'unmatched' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReconciliationDialogOpen(true)}
                        >
                          Conciliar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum dado de conciliação</h3>
            <p className="text-gray-500 mb-4">
              Importe um arquivo de extrato bancário para começar a conciliação.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReconciliationTab;
