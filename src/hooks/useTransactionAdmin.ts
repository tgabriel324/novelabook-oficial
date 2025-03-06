
import { useState } from 'react';
import { 
  Transaction, 
  Refund, 
  Dispute, 
  BankReconciliation 
} from '@/lib/data/paymentTypes';
import { mockTransactions, mockRefunds, mockDisputes, mockReconciliations } from '@/lib/data/mockData';
import {
  processRefund,
  respondToDispute,
  importBankStatement,
  exportTransactionsToCSV,
  exportTransactionsToPDF,
  generateComparativeAnalysis
} from '@/services/admin/transactionAdminService';
import { useToast } from '@/hooks/use-toast';

// Hook para gerenciamento administrativo de transações
export const useTransactionAdmin = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions || []);
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds || []);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes || []);
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>(mockReconciliations || []);
  const [isLoading, setIsLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  // Filtrar transações
  const filterTransactions = (filters: Partial<{
    status: Transaction['status'],
    paymentMethod: Transaction['paymentMethod'],
    fromDate: string,
    toDate: string,
    minAmount: number,
    maxAmount: number,
    userId: string,
    searchTerm: string
  }>) => {
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

  // Criar um reembolso
  const createRefund = async (
    transactionId: string,
    amount: number,
    reason: string,
    adminId: string
  ) => {
    setIsLoading(true);
    
    try {
      const result = await processRefund(transactionId, amount, reason);
      
      if (result.success && result.refundId) {
        // Encontrar a transação correspondente
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (!transaction) {
          toast({
            title: "Erro",
            description: "Transação não encontrada",
            variant: "destructive"
          });
          setIsLoading(false);
          return null;
        }
        
        // Criar objeto de reembolso
        const newRefund: Refund = {
          id: result.refundId,
          transactionId,
          userId: transaction.userId,
          amount,
          currency: transaction.currency,
          reason,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          processedById: adminId
        };
        
        // Atualizar lista de reembolsos
        setRefunds([newRefund, ...refunds]);
        
        // Atualizar transação relacionada
        const updatedTransactions = transactions.map(t => {
          if (t.id === transactionId) {
            return {
              ...t,
              status: 'refunded',
              updatedAt: new Date().toISOString(),
              refundId: result.refundId
            };
          }
          return t;
        });
        
        setTransactions(updatedTransactions);
        
        toast({
          title: "Sucesso",
          description: "Reembolso processado com sucesso",
        });
        
        return newRefund;
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao criar reembolso:", error);
      toast({
        title: "Erro",
        description: "Falha ao processar reembolso",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Responder a uma disputa
  const respondToDisputeRequest = async (
    disputeId: string,
    response: string,
    evidence: string[]
  ) => {
    setIsLoading(true);
    
    try {
      const result = await respondToDispute(disputeId, response, evidence);
      
      if (result.success) {
        // Atualizar status da disputa
        const updatedDisputes = disputes.map(d => {
          if (d.id === disputeId) {
            return {
              ...d,
              status: 'under_review',
              updatedAt: new Date().toISOString(),
              adminNotes: (d.adminNotes ? d.adminNotes + '\n\n' : '') + 
                `Resposta enviada em ${new Date().toLocaleString()}: ${response}`
            };
          }
          return d;
        });
        
        setDisputes(updatedDisputes);
        
        toast({
          title: "Resposta enviada",
          description: "Sua resposta à disputa foi enviada com sucesso",
        });
        
        return updatedDisputes.find(d => d.id === disputeId);
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao responder disputa:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua resposta",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Importar extrato bancário
  const importBankStatementFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      const result = await importBankStatement(file);
      
      if (result.success && result.entries && result.statementId) {
        // Criar novos registros de conciliação
        const newReconciliations: BankReconciliation[] = result.entries.map(entry => ({
          id: `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          bankStatementId: result.statementId!,
          transactionId: '', // Será preenchido durante a conciliação
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

  // Conciliar manualmente
  const reconcileManually = (reconciliationId: string, transactionId: string) => {
    // Encontrar reconciliação e transação
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
    
    // Calcular discrepância
    const discrepancyAmount = reconciliation.bankAmount !== transaction.amount
      ? reconciliation.bankAmount - transaction.amount
      : undefined;
    
    // Atualizar reconciliação
    const status = discrepancyAmount ? "partial_match" : "matched";
    
    const updatedReconciliations = reconciliations.map(r => {
      if (r.id === reconciliationId) {
        return {
          ...r,
          transactionId,
          systemAmount: transaction.amount,
          status: status as "matched" | "unmatched" | "partial_match",
          discrepancyAmount,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    });
    
    setReconciliations(updatedReconciliations as BankReconciliation[]);
    
    toast({
      title: "Conciliado",
      description: discrepancyAmount 
        ? `Conciliado com discrepância de ${discrepancyAmount.toFixed(2)}`
        : "Conciliado com sucesso",
    });
    
    return updatedReconciliations.find(r => r.id === reconciliationId);
  };

  // Exportar transações para CSV
  const exportToCSV = (filteredTransactions?: Transaction[]) => {
    try {
      const dataToExport = filteredTransactions || transactions;
      
      // Simular progresso de exportação
      setExportProgress(0);
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      // Gerar CSV
      const csvContent = exportTransactionsToCSV(dataToExport);
      
      // Criar blob e link de download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar após download
      setTimeout(() => {
        clearInterval(interval);
        setExportProgress(0);
        toast({
          title: "Exportação concluída",
          description: `${dataToExport.length} transações exportadas com sucesso`,
        });
      }, 2200);
      
      return true;
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast({
        title: "Erro",
        description: "Falha ao exportar transações",
        variant: "destructive"
      });
      setExportProgress(0);
      return false;
    }
  };

  // Exportar transações para PDF
  const exportToPDF = async (filteredTransactions?: Transaction[]) => {
    try {
      const dataToExport = filteredTransactions || transactions;
      
      // Simular progresso de exportação
      setExportProgress(0);
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Gerar PDF
      const pdfBlob = await exportTransactionsToPDF(dataToExport);
      
      // Criar link de download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.pdf`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar após download
      setExportProgress(100);
      setTimeout(() => {
        setExportProgress(0);
        toast({
          title: "Exportação concluída",
          description: `Relatório PDF gerado com sucesso`,
        });
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar relatório PDF",
        variant: "destructive"
      });
      setExportProgress(0);
      return false;
    }
  };

  // Gerar análise comparativa
  const compareTransactions = (
    periodStart: string,
    periodEnd: string,
    previousPeriodStart: string,
    previousPeriodEnd: string
  ) => {
    try {
      return generateComparativeAnalysis(
        transactions,
        periodStart,
        periodEnd,
        previousPeriodStart,
        previousPeriodEnd
      );
    } catch (error) {
      console.error("Erro ao gerar análise comparativa:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar análise comparativa",
        variant: "destructive"
      });
      return null;
    }
  };

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
