
import { useState } from 'react';
import { Transaction, Refund } from '@/lib/data/paymentTypes';
import { RefundRequest } from './types';
import { generateUniqueId } from './utils';
import { useToast } from '@/hooks/use-toast';
import { processRefund } from '@/services/admin/transactionAdminService';

export const useRefundManagement = (
  initialTransactions: Transaction[],
  initialRefunds: Refund[]
) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [refunds, setRefunds] = useState<Refund[]>(initialRefunds);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createRefund = async ({
    transactionId,
    amount,
    reason,
    adminId
  }: RefundRequest) => {
    setIsLoading(true);
    
    try {
      const result = await processRefund(transactionId, amount, reason);
      
      if (result.success && result.refundId) {
        // Find the corresponding transaction
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (!transaction) {
          toast({
            title: "Erro",
            description: "Transação não encontrada",
            variant: "destructive"
          });
          setIsLoading(false);
          return null;
        }
        
        // Create refund object
        const newRefund: Refund = {
          id: result.refundId,
          transactionId,
          userId: transaction.userId,
          amount,
          currency: transaction.currency,
          reason,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          processedById: adminId
        };
        
        // Update refunds list
        setRefunds([newRefund, ...refunds]);
        
        // Update related transaction
        const updatedTransactions = transactions.map(t => {
          if (t.id === transactionId) {
            return {
              ...t,
              status: 'refunded' as Transaction['status'],
              updatedAt: new Date().toISOString(),
              refundId: result.refundId
            };
          }
          return t;
        });
        
        setTransactions(updatedTransactions);
        
        toast({
          title: "Sucesso",
          description: "Reembolso processado com sucesso",
        });
        
        return newRefund;
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao criar reembolso:", error);
      toast({
        title: "Erro",
        description: "Falha ao processar reembolso",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    setTransactions,
    refunds,
    setRefunds,
    isLoading,
    createRefund
  };
};
