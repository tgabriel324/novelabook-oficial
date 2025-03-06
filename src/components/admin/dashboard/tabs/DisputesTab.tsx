
import React from 'react';
import { Dispute } from '@/lib/data/paymentTypes';
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

interface DisputesTabProps {
  disputes: Dispute[];
  onOpenDisputeDialog: (dispute: Dispute) => void;
}

const DisputesTab: React.FC<DisputesTabProps> = ({ disputes, onOpenDisputeDialog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disputas</CardTitle>
        <CardDescription>
          Gerencie disputas e chargebacks
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
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhuma disputa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-mono text-xs">{dispute.id}</TableCell>
                    <TableCell className="font-mono text-xs">{dispute.transactionId}</TableCell>
                    <TableCell>{dispute.userId}</TableCell>
                    <TableCell>{dispute.reason}</TableCell>
                    <TableCell>
                      <Badge className={
                        dispute.status === 'open' 
                          ? 'bg-red-500' 
                          : dispute.status === 'under_review' 
                            ? 'bg-yellow-500' 
                            : dispute.status === 'won' 
                              ? 'bg-green-500' 
                              : 'bg-gray-500'
                      }>
                        {dispute.status === 'open' && 'Aberta'}
                        {dispute.status === 'under_review' && 'Em análise'}
                        {dispute.status === 'won' && 'Ganha'}
                        {dispute.status === 'lost' && 'Perdida'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {dispute.status === 'open' && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenDisputeDialog(dispute)}
                        >
                          Responder
                        </Button>
                      )}
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

export default DisputesTab;
