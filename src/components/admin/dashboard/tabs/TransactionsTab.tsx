
import React from 'react';
import { Transaction } from '@/lib/data/paymentTypes';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import TransactionFilters from '../TransactionFilters';

interface TransactionsTabProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: {
    status: string;
    paymentMethod: string;
    fromDate: string;
    toDate: string;
    searchTerm: string;
    minAmount?: number;
    maxAmount?: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onOpenRefundDialog: (transaction: Transaction) => void;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({
  transactions,
  filteredTransactions,
  filters,
  onFilterChange,
  onOpenRefundDialog
}) => {
  const getStatusColor = (status: Transaction['status']) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-purple-500';
      case 'disputed': return 'bg-orange-500';
      case 'chargeback': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
        <CardDescription>
          Visualize e gerencie todas as transações do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionFilters filters={filters} onFilterChange={onFilterChange} />
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: transaction.currency
                      }).format(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {transaction.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                      {transaction.paymentMethod === 'debit_card' && 'Cartão de Débito'}
                      {transaction.paymentMethod === 'pix' && 'PIX'}
                      {transaction.paymentMethod === 'boleto' && 'Boleto'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status === 'completed' && 'Completado'}
                        {transaction.status === 'pending' && 'Pendente'}
                        {transaction.status === 'processing' && 'Processando'}
                        {transaction.status === 'failed' && 'Falhou'}
                        {transaction.status === 'refunded' && 'Reembolsado'}
                        {transaction.status === 'disputed' && 'Disputado'}
                        {transaction.status === 'chargeback' && 'Chargeback'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {transaction.status === 'completed' && (
                          <Button
                            size="sm" 
                            variant="outline"
                            onClick={() => onOpenRefundDialog(transaction)}
                          >
                            Reembolsar
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          {filteredTransactions.length} de {transactions.length} transações
        </p>
      </CardFooter>
    </Card>
  );
};

export default TransactionsTab;
