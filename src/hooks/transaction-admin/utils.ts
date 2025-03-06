
import { Transaction, Refund, Dispute } from "@/lib/data/paymentTypes";
import { TransactionFilters, RefundFilters, DisputeFilters } from "./types";

export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter(transaction => {
    let match = true;
    
    if (filters.status && transaction.status !== filters.status) {
      match = false;
    }
    
    if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) {
      match = false;
    }
    
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      const transactionDate = new Date(transaction.createdAt);
      if (transactionDate < fromDate) {
        match = false;
      }
    }
    
    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      const transactionDate = new Date(transaction.createdAt);
      if (transactionDate > toDate) {
        match = false;
      }
    }
    
    if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
      match = false;
    }
    
    if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
      match = false;
    }
    
    if (filters.userId && transaction.userId !== filters.userId) {
      match = false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const idMatch = transaction.id.toLowerCase().includes(searchLower);
      const userMatch = transaction.userId.toLowerCase().includes(searchLower);
      
      if (!idMatch && !userMatch) {
        match = false;
      }
    }
    
    return match;
  });
};

export const filterRefunds = (
  refunds: Refund[],
  filters: RefundFilters
): Refund[] => {
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

export const filterDisputes = (
  disputes: Dispute[],
  filters: DisputeFilters
): Dispute[] => {
  return disputes.filter(dispute => {
    let match = true;
    
    if (filters.status && dispute.status !== filters.status) {
      match = false;
    }
    
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      const disputeDate = new Date(dispute.createdAt);
      if (disputeDate < fromDate) {
        match = false;
      }
    }
    
    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      const disputeDate = new Date(dispute.createdAt);
      if (disputeDate > toDate) {
        match = false;
      }
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const idMatch = dispute.id.toLowerCase().includes(searchLower);
      const transactionMatch = dispute.transactionId.toLowerCase().includes(searchLower);
      const userMatch = dispute.userId.toLowerCase().includes(searchLower);
      const reasonMatch = dispute.reason.toLowerCase().includes(searchLower);
      
      if (!idMatch && !transactionMatch && !userMatch && !reasonMatch) {
        match = false;
      }
    }
    
    return match;
  });
};

export const formatCurrency = (amount: number, currency: string = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};
