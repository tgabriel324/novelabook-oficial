
import { Transaction } from '@/lib/data/paymentTypes';
import { TransactionFilters } from './types';

// Utility to filter transactions based on criteria
export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  let filtered = [...transactions];
  
  if (filters.status) {
    filtered = filtered.filter(t => t.status === filters.status);
  }
  
  if (filters.paymentMethod) {
    filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod);
  }
  
  if (filters.fromDate) {
    filtered = filtered.filter(t => t.createdAt >= filters.fromDate);
  }
  
  if (filters.toDate) {
    filtered = filtered.filter(t => t.createdAt <= filters.toDate);
  }
  
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter(t => t.amount >= filters.minAmount);
  }
  
  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter(t => t.amount <= filters.maxAmount);
  }
  
  if (filters.userId) {
    filtered = filtered.filter(t => t.userId === filters.userId);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(t => 
      t.id.toLowerCase().includes(term) || 
      t.userId.toLowerCase().includes(term) ||
      (t.novelId && t.novelId.toLowerCase().includes(term))
    );
  }
  
  return filtered;
};

// Generate a unique ID for new records
export const generateUniqueId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};
