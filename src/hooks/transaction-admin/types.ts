
import { 
  Transaction, 
  Refund, 
  Dispute, 
  BankReconciliation,
  PaymentMethod
} from '@/lib/data/paymentTypes';

export interface TransactionFilters {
  status?: Transaction['status'];
  paymentMethod?: Transaction['paymentMethod'];
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: string;
  searchTerm?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
  adminId: string;
}

export interface DisputeResponse {
  disputeId: string;
  response: string;
  evidence: string[];
}

export interface ReconciliationMatch {
  reconciliationId: string;
  transactionId: string;
}

export interface ComparativeAnalysisRequest {
  periodStart: string;
  periodEnd: string;
  previousPeriodStart: string;
  previousPeriodEnd: string;
}

export interface ExportOptions {
  filteredTransactions?: Transaction[];
  format: 'csv' | 'pdf';
}
