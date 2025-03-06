
import { useState } from 'react';
import { Transaction, Refund } from '@/lib/data/paymentTypes';
import { RefundRequest, RefundFilters } from './types';
import { generateUniqueId } from './utils';
import { useToast } from '@/hooks/use-toast';
import { processRefund } from '@/services/admin/transactionAdminService';

export const useRefundManagement = ({ 
  refunds, 
  setRefunds, 
  transactions, 
  setTransactions 
}: { 
  refunds: Refund[], 
  setRefunds: React.Dispatch<React.SetStateAction<Refund[]>>,
  transactions: Transaction[], 
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<RefundFilters>({});
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

  const filterRefunds = (filters: RefundFilters): Refund[] => {
    setActiveFilters(filters);
    
    return refunds.filter(refund => {
      let match = true;
      
      if (filters.status && refund.status !== filters.status) {
        match = false;
      }
      
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        const refundDate = new Date(refund.createdAt);
        if (refundDate < fromDate) {
          match = false;
        }
      }
      
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        const refundDate = new Date(refund.createdAt);
        if (refundDate > toDate) {
          match = false;
        }
      }
      
      if (filters.minAmount !== undefined && refund.amount < filters.minAmount) {
        match = false;
      }
      
      if (filters.maxAmount !== undefined && refund.amount > filters.maxAmount) {
        match = false;
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const idMatch = refund.id.toLowerCase().includes(searchLower);
        const transactionMatch = refund.transactionId.toLowerCase().includes(searchLower);
        const userMatch = refund.userId.toLowerCase().includes(searchLower);
        const reasonMatch = refund.reason.toLowerCase().includes(searchLower);
        
        if (!idMatch && !transactionMatch && !userMatch && !reasonMatch) {
          match = false;
        }
      }
      
      return match;
    });
  };

  const getFilteredRefunds = () => {
    return filterRefunds(activeFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    return refunds;
  };

  return {
    isLoading,
    createRefund,
    filterRefunds,
    getFilteredRefunds,
    clearFilters,
    activeFilters
  };
};
