
import { useState } from 'react';
import { BankReconciliation, Transaction } from '@/lib/data/paymentTypes';
import { ReconciliationMatch } from './types';

interface BankReconciliationProps {
  reconciliations: BankReconciliation[];
  setReconciliations: React.Dispatch<React.SetStateAction<BankReconciliation[]>>;
  transactions: Transaction[];
}

export const useBankReconciliation = ({
  reconciliations,
  setReconciliations,
  transactions
}: BankReconciliationProps) => {
  const [importProgress, setImportProgress] = useState(0);

  const importBankStatementFile = (file: File) => {
    // Simulate file processing with a progress indicator
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // In a real application, this would parse the file and match transactions
    setTimeout(() => {
      clearInterval(interval);
      setImportProgress(100);
      
      // Mock new reconciliations
      const newReconciliation: BankReconciliation = {
        id: `rec_${Date.now()}`,
        bankStatementId: `stmt_${Date.now()}`,
        transactionId: "", // To be matched manually
        status: "unmatched",
        bankAmount: 49.99,
        systemAmount: 0, // Will be set when matched
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setReconciliations(prev => [...prev, newReconciliation]);
    }, 3000);
  };

  const reconcileManually = (reconciliationData: ReconciliationMatch) => {
    const { reconciliationId, transactionId } = reconciliationData;
    
    // Find the corresponding transaction
    const matchedTransaction = transactions.find(t => t.id === transactionId);
    
    if (matchedTransaction) {
      // Update the reconciliation record with the correct status value
      setReconciliations(prev => 
        prev.map(r => 
          r.id === reconciliationId 
            ? {
                ...r,
                transactionId,
                // Use "partial_match" instead of "discrepancy" when amounts don't match
                status: Math.abs(r.bankAmount - matchedTransaction.amount) < 0.01 ? "matched" : "partial_match",
                systemAmount: matchedTransaction.amount,
                updatedAt: new Date().toISOString()
              } 
            : r
        )
      );
    }
  };

  return {
    importBankStatementFile,
    reconcileManually,
    importProgress
  };
};
