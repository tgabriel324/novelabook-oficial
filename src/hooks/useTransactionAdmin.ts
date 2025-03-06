
import { useState } from "react";
import { Transaction, Dispute, Refund, BankReconciliation } from "@/lib/data/paymentTypes";
import { 
  useTransactionFiltering
} from "@/hooks/transaction-admin/useTransactionFiltering";
import {
  useRefundManagement
} from "@/hooks/transaction-admin/useRefundManagement";
import {
  useDisputeManagement
} from "@/hooks/transaction-admin/useDisputeManagement";
import {
  useBankReconciliation
} from "@/hooks/transaction-admin/useBankReconciliation";
import {
  useExportReports
} from "@/hooks/transaction-admin/useExportReports";

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

  // Combine all hooks
  const { filterTransactions } = useTransactionFiltering({ transactions });
  
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
    reconcileManually 
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

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  return {
    transactions,
    refunds,
    disputes,
    reconciliations,
    isLoading,
    exportProgress,
    filterTransactions,
    createRefund,
    respondToDisputeRequest,
    importBankStatementFile,
    reconcileManually,
    exportToCSV,
    exportToPDF,
    compareTransactions
  };
};
