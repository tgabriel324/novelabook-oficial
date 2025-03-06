
import { useState } from 'react';
import { Transaction } from '@/lib/data/paymentTypes';
import { TransactionFilters } from './types';
import { filterTransactions } from './utils';

export const useTransactionFiltering = (initialTransactions: Transaction[]) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const applyFilters = (filters: TransactionFilters): Transaction[] => {
    return filterTransactions(transactions, filters);
  };

  return {
    transactions,
    setTransactions,
    applyFilters
  };
};
