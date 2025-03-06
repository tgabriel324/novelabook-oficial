
import { 
  Transaction, 
  Refund, 
  Dispute, 
  BankReconciliation,
  PaymentMethod,
  Coupon,
  SpecialOffer,
  VolumeDiscount
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

export interface RefundFilters {
  status?: Refund['status'];
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface DisputeFilters {
  status?: Dispute['status'];
  fromDate?: string;
  toDate?: string;
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

export interface ReconciliationResolution {
  reconciliationId: string;
  reason: string;
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

export interface CouponRequest {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  currency?: string;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  restriction: 'none' | 'first_time_purchase' | 'specific_novel' | 'minimum_purchase';
  restrictionValues?: string[];
}

export interface SpecialOfferRequest {
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  startDate: string;
  endDate: string;
  targetNovelIds?: string[];
  bannerImage?: string;
}

export interface VolumeDiscountRequest {
  name: string;
  description: string;
  minQuantity: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}
