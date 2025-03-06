import { useState } from 'react';
import { Transaction, BankReconciliation } from '@/lib/data/paymentTypes';
import { ReconciliationMatch } from './types';
import { generateUniqueId } from './utils';
import { useToast } from '@/hooks/use-toast';
import { importBankStatement } from '@/services/admin/transactionAdminService';

export const useBankReconciliation = ({ 
  reconciliations, 
  setReconciliations, 
  transactions 
}: { 
  reconciliations: BankReconciliation[], 
  setReconciliations: React.Dispatch<React.SetStateAction<BankReconciliation[]>>,
  transactions: Transaction[]
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const importBankStatementFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      const result = await importBankStatement(file);
      
      if (result.success && result.entries && result.statementId) {
        // Create new reconciliation records
        const newReconciliations: BankReconciliation[] = result.entries.map(entry => ({
          id: generateUniqueId('rec'),
          bankStatementId: result.statementId!,
          transactionId: '', // Will be filled during reconciliation
          status: 'unmatched',
          bankAmount: entry.amount,
          systemAmount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        setReconciliations([...newReconciliations, ...reconciliations]);
        
        toast({
          title: "Extrato importado",
          description: `Importados ${result.entries.length} lançamentos para conciliação`,
        });
        
        return {
          statementId: result.statementId,
          entries: result.entries,
          reconciliations: newReconciliations
        };
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao importar extrato:", error);
      toast({
        title: "Erro",
        description: "Falha ao importar arquivo de extrato bancário",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reconcileManually = (
    { reconciliationId, transactionId }: ReconciliationMatch
  ) => {
    // Find reconciliation and transaction
    const reconciliation = reconciliations.find(r => r.id === reconciliationId);
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!reconciliation || !transaction) {
      toast({
        title: "Erro",
        description: "Reconciliação ou transação não encontrada",
        variant: "destructive"
      });
      return null;
    }
    
    // Calculate discrepancy
    const discrepancyAmount = reconciliation.bankAmount !== transaction.amount
      ? reconciliation.bankAmount - transaction.amount
      : undefined;
    
    // Update reconciliation
    const status = discrepancyAmount ? "partial_match" : "matched";
    
    const updatedReconciliations = reconciliations.map(r => {
      if (r.id === reconciliationId) {
        return {
          ...r,
          transactionId,
          systemAmount: transaction.amount,
          status: status as BankReconciliation['status'],
          discrepancyAmount,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    });
    
    setReconciliations(updatedReconciliations);
    
    toast({
      title: "Conciliado",
      description: discrepancyAmount 
        ? `Conciliado com discrepância de ${discrepancyAmount.toFixed(2)}`
        : "Conciliado com sucesso",
    });
    
    return updatedReconciliations.find(r => r.id === reconciliationId);
  };

  return {
    isLoading,
    importBankStatementFile,
    reconcileManually
  };
};
