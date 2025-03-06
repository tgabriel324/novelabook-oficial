
import { useState } from 'react';
import { Transaction } from '@/lib/data/paymentTypes';
import { TransactionFilters } from './types';
import { filterTransactions as filterTransactionsUtil } from './utils';

export const useTransactionFiltering = ({ transactions }: { transactions: Transaction[] }) => {
  const applyFilters = (filters: TransactionFilters): Transaction[] => {
    return filterTransactionsUtil(transactions, filters);
  };

  return {
    applyFilters,
    filterTransactions: applyFilters  // Alias for backward compatibility
  };
};
