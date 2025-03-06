
import { useState, useEffect } from 'react';
import { PaymentDetails, Transaction, PaymentMethod } from '@/lib/data/paymentTypes';

// Mock or API service for transactions
const fetchTransactionsFromAPI = async (): Promise<Transaction[]> => {
  // In a real app, this would call an API
  return [
    {
      id: 'tx_123456',
      userId: 'user_1',
      amount: 29.99,
      currency: 'BRL',
      paymentMethod: 'credit_card',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tx_234567',
      userId: 'user_2',
      amount: 19.99,
      currency: 'BRL',
      paymentMethod: 'pix',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

// Types for the hook
export interface TransactionFilters {
  status?: Transaction['status'];
  amount?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  paymentMethod?: PaymentMethod;
  search?: string;
}

interface TransactionSort {
  field: keyof Transaction;
  direction: 'asc' | 'desc';
}

export interface UseTransactionsOptions {
  initialFilters?: TransactionFilters;
  initialSort?: TransactionSort;
  pageSize?: number;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  sort: TransactionSort;
  setSort: (sort: TransactionSort) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  refetch: () => Promise<void>;
  processPayment: (details: PaymentDetails) => Promise<Transaction | null>;
  cancelTransaction: (transactionId: string) => Promise<boolean>;
  requestRefund: (transactionId: string, amount: number, reason: string) => Promise<boolean>;
}

// The hook
export const useTransactions = (options: UseTransactionsOptions = {}): UseTransactionsReturn => {
  const {
    initialFilters = {},
    initialSort = { field: 'createdAt', direction: 'desc' },
    pageSize = 10
  } = options;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const [sort, setSort] = useState<TransactionSort>(initialSort);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTransactionsFromAPI();
      
      // Apply filters
      let filteredData = [...data];
      
      if (filters.status) {
        filteredData = filteredData.filter(tx => tx.status === filters.status);
      }
      
      if (filters.amount?.min !== undefined) {
        filteredData = filteredData.filter(tx => tx.amount >= (filters.amount?.min || 0));
      }
      
      if (filters.amount?.max !== undefined) {
        filteredData = filteredData.filter(tx => tx.amount <= (filters.amount?.max || Infinity));
      }
      
      if (filters.dateRange?.from) {
        const fromDate = new Date(filters.dateRange.from).getTime();
        filteredData = filteredData.filter(tx => new Date(tx.createdAt).getTime() >= fromDate);
      }
      
      if (filters.dateRange?.to) {
        const toDate = new Date(filters.dateRange.to).getTime();
        filteredData = filteredData.filter(tx => new Date(tx.createdAt).getTime() <= toDate);
      }
      
      if (filters.paymentMethod) {
        filteredData = filteredData.filter(tx => tx.paymentMethod === filters.paymentMethod);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(tx => 
          tx.id.toLowerCase().includes(searchLower) || 
          tx.userId.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      filteredData.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sort.direction === 'asc' 
            ? aValue.getTime() - bValue.getTime() 
            : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
      });
      
      // Calculate pagination
      const totalItems = filteredData.length;
      setTotalPages(Math.ceil(totalItems / pageSize));
      
      // Apply pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTransactions(paginatedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch transactions when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [JSON.stringify(filters), JSON.stringify(sort), page]);

  // Refetch transactions
  const refetch = async () => {
    await fetchTransactions();
  };

  // Process a new payment
  const processPayment = async (details: PaymentDetails): Promise<Transaction | null> => {
    // In a real app, this would call an API
    try {
      // Mock processing a payment
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        userId: 'current_user', // In a real app, this would be the current user's ID
        amount: details.amount,
        currency: details.currency,
        paymentMethod: details.method,
        status: 'processing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state (in a real app, this would come from the API response)
      setTransactions(prev => [newTransaction, ...prev]);
      
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process payment'));
      return null;
    }
  };

  // Cancel a transaction
  const cancelTransaction = async (transactionId: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId 
            ? { ...tx, status: 'failed', updatedAt: new Date().toISOString() } 
            : tx
        )
      );
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel transaction'));
      return false;
    }
  };

  // Request a refund
  const requestRefund = async (transactionId: string, amount: number, reason: string): Promise<boolean> => {
    try {
      // Find the transaction
      const transaction = transactions.find(tx => tx.id === transactionId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      // Check if transaction can be refunded
      if (transaction.status !== 'completed') {
        throw new Error('Only completed transactions can be refunded');
      }
      
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId 
            ? { ...tx, status: 'refunded', updatedAt: new Date().toISOString() } 
            : tx
        )
      );
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to request refund'));
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    refetch,
    processPayment,
    cancelTransaction,
    requestRefund
  };
};
