
import { useState } from 'react';
import { Transaction } from '@/lib/data/paymentTypes';
import { TransactionFilters } from './types';
import { filterTransactions as filterTransactionsUtil } from './utils';

export const useTransactionFiltering = ({ transactions }: { transactions: Transaction[] }) => {
  const [activeFilters, setActiveFilters] = useState<TransactionFilters>({});

  const applyFilters = (filters: TransactionFilters): Transaction[] => {
    setActiveFilters(filters);
    return filterTransactionsUtil(transactions, filters);
  };

  const getFilteredTransactions = () => {
    return filterTransactionsUtil(transactions, activeFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    return transactions;
  };

  const getActiveFilters = () => {
    return activeFilters;
  };

  return {
    applyFilters,
    filterTransactions: applyFilters,  // Alias for backward compatibility
    getFilteredTransactions,
    clearFilters,
    getActiveFilters,
    activeFilters
  };
};
