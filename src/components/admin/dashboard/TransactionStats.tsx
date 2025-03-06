
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction, Dispute, Refund, BankReconciliation } from '@/lib/data/paymentTypes';

interface TransactionStatsProps {
  transactions: Transaction[];
  refunds: Refund[];
  disputes: Dispute[];
  reconciliations: BankReconciliation[];
}

const TransactionStats: React.FC<TransactionStatsProps> = ({
  transactions,
  refunds,
  disputes,
  reconciliations
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reembolsos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{refunds.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Disputas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{disputes.length}</p>
          {disputes.filter(d => d.status === 'open').length > 0 && (
            <Badge variant="destructive" className="mt-2">
              {disputes.filter(d => d.status === 'open').length} abertas
            </Badge>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Conciliação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{reconciliations.length}</p>
          {reconciliations.filter(r => r.status === 'unmatched').length > 0 && (
            <Badge variant="outline" className="mt-2">
              {reconciliations.filter(r => r.status === 'unmatched').length} não conciliados
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;
