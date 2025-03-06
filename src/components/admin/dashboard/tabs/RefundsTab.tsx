
import React from 'react';
import { Refund } from '@/lib/data/paymentTypes';
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

interface RefundsTabProps {
  refunds: Refund[];
}

const RefundsTab: React.FC<RefundsTabProps> = ({ refunds }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reembolsos</CardTitle>
        <CardDescription>
          Acompanhe todos os reembolsos realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Transação</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhum reembolso encontrado
                  </TableCell>
                </TableRow>
              ) : (
                refunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-mono text-xs">{refund.id}</TableCell>
                    <TableCell className="font-mono text-xs">{refund.transactionId}</TableCell>
                    <TableCell>{refund.userId}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: refund.currency
                      }).format(refund.amount)}
                    </TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>
                      <Badge className={refund.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {refund.status === 'completed' ? 'Completado' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RefundsTab;
