
import { useState } from "react";
import { 
  Transaction, 
  Dispute, 
  Refund, 
  BankReconciliation,
  Coupon,
  SpecialOffer,
  VolumeDiscount
} from "@/lib/data/paymentTypes";
import { useTransactionFiltering } from "@/hooks/transaction-admin/useTransactionFiltering";
import { useRefundManagement } from "@/hooks/transaction-admin/useRefundManagement";
import { useDisputeManagement } from "@/hooks/transaction-admin/useDisputeManagement";
import { useBankReconciliation } from "@/hooks/transaction-admin/useBankReconciliation";
import { useExportReports } from "@/hooks/transaction-admin/useExportReports";
import { useDiscountManagement } from "@/hooks/transaction-admin/useDiscountManagement";
import { TransactionFilters } from "@/hooks/transaction-admin/types";

// Main hook that combines all transaction admin hooks
export const useTransactionAdmin = () => {
  // Mock data - in a real app this would come from an API
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_123456789",
      userId: "user_123",
      amount: 29.99,
      currency: "BRL",
      paymentMethod: "credit_card",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_987654321",
      userId: "user_456",
      amount: 49.99,
      currency: "BRL",
      paymentMethod: "pix",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [refunds, setRefunds] = useState<Refund[]>([
    {
      id: "ref_123456",
      transactionId: "tx_123456789",
      userId: "user_123",
      amount: 29.99,
      currency: "BRL",
      reason: "Customer request",
      status: "completed",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: "disp_123456",
      transactionId: "tx_987654321",
      userId: "user_456",
      reason: "Product not as described",
      evidence: "Email correspondence",
      status: "open",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>([
    {
      id: "rec_123456",
      bankStatementId: "stmt_123456",
      transactionId: "tx_123456789",
      status: "matched",
      bankAmount: 29.99,
      systemAmount: 29.99,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Mock data for discounts
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "coupon_123456",
      code: "WELCOME10",
      description: "10% de desconto na primeira compra",
      discountType: "percentage",
      discountValue: 10,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: 100,
      currentUsage: 45,
      isActive: true,
      restriction: "first_time_purchase",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "coupon_789012",
      code: "SUMMER20",
      description: "Promoção de verão: R$20 de desconto",
      discountType: "fixed_amount",
      discountValue: 20,
      currency: "BRL",
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      minPurchaseAmount: 50,
      usageLimit: 200,
      currentUsage: 87,
      isActive: true,
      restriction: "minimum_purchase",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscount[]>([]);

  // Combine all hooks with the correct parameters
  const { applyFilters, filterTransactions } = useTransactionFiltering({ transactions });
  
  const { createRefund } = useRefundManagement({ 
    refunds, 
    setRefunds, 
    transactions, 
    setTransactions 
  });
  
  const { respondToDisputeRequest } = useDisputeManagement({ 
    disputes, 
    setDisputes 
  });
  
  const { 
    importBankStatementFile, 
    reconcileManually,
    resolveDiscrepancy,
    importProgress
  } = useBankReconciliation({ 
    reconciliations, 
    setReconciliations, 
    transactions 
  });
  
  const { 
    exportToCSV, 
    exportToPDF, 
    exportProgress, 
    compareTransactions 
  } = useExportReports();
  
  const {
    isLoading: discountLoading,
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    createSpecialOffer,
    updateSpecialOffer,
    toggleOfferStatus,
    createVolumeDiscount,
    updateVolumeDiscount,
    toggleVolumeDiscountStatus
  } = useDiscountManagement({
    coupons,
    setCoupons,
    specialOffers,
    setSpecialOffers,
    volumeDiscounts,
    setVolumeDiscounts
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Function to filter transactions based on criteria
  const filterTransactionsWithCriteria = (filters: TransactionFilters): Transaction[] => {
    return filterTransactions(filters); // Using the alias provided by useTransactionFiltering
  };

  return {
    // Data
    transactions,
    refunds,
    disputes,
    reconciliations,
    coupons,
    specialOffers,
    volumeDiscounts,
    
    // Status
    isLoading: isLoading || discountLoading,
    exportProgress,
    importProgress,
    
    // Transaction functions
    filterTransactions: filterTransactionsWithCriteria,
    
    // Refund functions
    createRefund,
    
    // Dispute functions
    respondToDisputeRequest,
    
    // Reconciliation functions
    importBankStatementFile,
    reconcileManually,
    resolveDiscrepancy,
    
    // Export functions
    exportToCSV,
    exportToPDF,
    compareTransactions,
    
    // Discount functions
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    createSpecialOffer,
    updateSpecialOffer,
    toggleOfferStatus,
    createVolumeDiscount,
    updateVolumeDiscount,
    toggleVolumeDiscountStatus
  };
};
