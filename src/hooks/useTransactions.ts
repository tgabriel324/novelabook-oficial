
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Transaction, 
  Refund, 
  Dispute, 
  BankReconciliation,
  PaymentMethod
} from '@/lib/data/paymentTypes';

// Dados fictícios para demonstração
const mockTransactions: Transaction[] = [
  {
    id: "tx_123456",
    userId: "user_1",
    amount: 19.90,
    currency: "BRL",
    paymentMethod: "credit_card",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    novelId: "1"
  },
  {
    id: "tx_234567",
    userId: "user_2",
    amount: 15.90,
    currency: "BRL",
    paymentMethod: "pix",
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    novelId: "2"
  },
  {
    id: "tx_345678",
    userId: "user_3",
    amount: 22.90,
    currency: "BRL",
    paymentMethod: "boleto",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    novelId: "3"
  },
  {
    id: "tx_456789",
    userId: "user_4",
    amount: 12.90,
    currency: "BRL",
    paymentMethod: "credit_card",
    status: "refunded",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    novelId: "4",
    refundId: "ref_123"
  },
  {
    id: "tx_567890",
    userId: "user_5",
    amount: 17.90,
    currency: "BRL",
    paymentMethod: "credit_card",
    status: "disputed",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    novelId: "5"
  }
];

const mockRefunds: Refund[] = [
  {
    id: "ref_123",
    transactionId: "tx_456789",
    userId: "user_4",
    amount: 12.90,
    currency: "BRL",
    reason: "Cliente desistiu da compra",
    status: "completed",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    processedById: "admin_1"
  }
];

const mockDisputes: Dispute[] = [
  {
    id: "dsp_123",
    transactionId: "tx_567890",
    userId: "user_5",
    reason: "Não reconhece a compra",
    evidence: "Screenshot de comunicação com cliente",
    status: "under_review",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: "Cliente entrou em contato alegando não reconhecer a compra. Aguardando mais informações."
  }
];

const mockBankReconciliations: BankReconciliation[] = [
  {
    id: "rec_123",
    bankStatementId: "bank_stmt_1",
    transactionId: "tx_123456",
    status: "matched",
    bankAmount: 19.90,
    systemAmount: 19.90,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rec_124",
    bankStatementId: "bank_stmt_2",
    transactionId: "tx_234567",
    status: "matched",
    bankAmount: 15.90,
    systemAmount: 15.90,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rec_125",
    bankStatementId: "bank_stmt_3",
    transactionId: "",
    status: "unmatched",
    bankAmount: 29.90,
    systemAmount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>(mockBankReconciliations);

  // Funções para transações
  const getTransactions = (
    userId?: string, 
    status?: Transaction['status'], 
    startDate?: string, 
    endDate?: string,
    paymentMethod?: PaymentMethod
  ) => {
    let filtered = transactions;
    
    if (userId) {
      filtered = filtered.filter(tx => tx.userId === userId);
    }
    
    if (status) {
      filtered = filtered.filter(tx => tx.status === status);
    }
    
    if (startDate) {
      filtered = filtered.filter(tx => tx.createdAt >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(tx => tx.createdAt <= endDate);
    }
    
    if (paymentMethod) {
      filtered = filtered.filter(tx => tx.paymentMethod === paymentMethod);
    }
    
    return filtered;
  };

  const getTransactionById = (id: string) => {
    return transactions.find(tx => tx.id === id);
  };

  const createTransaction = (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTransactions([...transactions, newTransaction]);
    return newTransaction;
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    const updatedTransactions = transactions.map(tx => {
      if (tx.id === id) {
        return {
          ...tx,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return tx;
    });
    
    setTransactions(updatedTransactions);
    return updatedTransactions.find(tx => tx.id === id);
  };

  // Funções para reembolsos
  const getRefunds = (userId?: string, status?: Refund['status']) => {
    let filtered = refunds;
    
    if (userId) {
      filtered = filtered.filter(ref => ref.userId === userId);
    }
    
    if (status) {
      filtered = filtered.filter(ref => ref.status === status);
    }
    
    return filtered;
  };

  const getRefundById = (id: string) => {
    return refunds.find(ref => ref.id === id);
  };

  const createRefund = (refund: Omit<Refund, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Verificar se a transação existe e pode ser reembolsada
    const transaction = transactions.find(tx => tx.id === refund.transactionId);
    
    if (!transaction) {
      throw new Error("Transação não encontrada");
    }
    
    if (transaction.status !== "completed") {
      throw new Error("Apenas transações concluídas podem ser reembolsadas");
    }
    
    if (transaction.status === "refunded") {
      throw new Error("Esta transação já foi reembolsada");
    }
    
    if (refund.amount > transaction.amount) {
      throw new Error("O valor do reembolso não pode ser maior que o valor da transação");
    }
    
    const newRefund: Refund = {
      ...refund,
      id: `ref_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setRefunds([...refunds, newRefund]);
    
    // Atualizar o status da transação
    updateTransactionStatus(transaction.id, "refunded");
    
    return newRefund;
  };

  const updateRefundStatus = (id: string, status: Refund['status']) => {
    const updatedRefunds = refunds.map(ref => {
      if (ref.id === id) {
        return {
          ...ref,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return ref;
    });
    
    setRefunds(updatedRefunds);
    return updatedRefunds.find(ref => ref.id === id);
  };

  // Funções para disputas
  const getDisputes = (status?: Dispute['status']) => {
    if (status) {
      return disputes.filter(dsp => dsp.status === status);
    }
    return disputes;
  };

  const getDisputeById = (id: string) => {
    return disputes.find(dsp => dsp.id === id);
  };

  const createDispute = (dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Verificar se a transação existe
    const transaction = transactions.find(tx => tx.id === dispute.transactionId);
    
    if (!transaction) {
      throw new Error("Transação não encontrada");
    }
    
    const newDispute: Dispute = {
      ...dispute,
      id: `dsp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setDisputes([...disputes, newDispute]);
    
    // Atualizar o status da transação
    updateTransactionStatus(transaction.id, "disputed");
    
    return newDispute;
  };

  const updateDisputeStatus = (id: string, status: Dispute['status'], notes?: string) => {
    const updatedDisputes = disputes.map(dsp => {
      if (dsp.id === id) {
        return {
          ...dsp,
          status,
          adminNotes: notes || dsp.adminNotes,
          updatedAt: new Date().toISOString(),
          ...(status === 'won' || status === 'lost' ? { resolvedAt: new Date().toISOString() } : {})
        };
      }
      return dsp;
    });
    
    setDisputes(updatedDisputes);
    const updatedDispute = updatedDisputes.find(dsp => dsp.id === id);
    
    // Se a disputa foi resolvida, atualizar o status da transação
    if (updatedDispute && (status === 'won' || status === 'lost')) {
      const transactionStatus = status === 'won' ? "completed" : "chargeback";
      const transaction = transactions.find(tx => tx.id === updatedDispute.transactionId);
      
      if (transaction) {
        updateTransactionStatus(transaction.id, transactionStatus);
      }
    }
    
    return updatedDispute;
  };

  // Funções para conciliação bancária
  const getReconciliations = (status?: BankReconciliation['status']) => {
    if (status) {
      return reconciliations.filter(rec => rec.status === status);
    }
    return reconciliations;
  };

  const createReconciliation = (rec: Omit<BankReconciliation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReconciliation: BankReconciliation = {
      ...rec,
      id: `rec_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setReconciliations([...reconciliations, newReconciliation]);
    return newReconciliation;
  };

  const matchReconciliation = (id: string, transactionId: string) => {
    const recItem = reconciliations.find(rec => rec.id === id);
    const transaction = transactions.find(tx => tx.id === transactionId);
    
    if (!recItem) {
      throw new Error("Item de conciliação não encontrado");
    }
    
    if (!transaction) {
      throw new Error("Transação não encontrada");
    }
    
    const updatedReconciliations = reconciliations.map(rec => {
      if (rec.id === id) {
        const discrepancyAmount = 
          Math.abs(rec.bankAmount - transaction.amount) > 0.01 
            ? rec.bankAmount - transaction.amount 
            : undefined;
        
        return {
          ...rec,
          transactionId,
          systemAmount: transaction.amount,
          status: discrepancyAmount ? "partial_match" : "matched",
          discrepancyAmount,
          updatedAt: new Date().toISOString()
        };
      }
      return rec;
    });
    
    setReconciliations(updatedReconciliations);
    return updatedReconciliations.find(rec => rec.id === id);
  };

  const resolveReconciliationDiscrepancy = (
    id: string, 
    reason: string, 
    adminId: string
  ) => {
    const updatedReconciliations = reconciliations.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          discrepancyReason: reason,
          resolvedById: adminId,
          resolvedAt: new Date().toISOString(),
          status: "matched",
          updatedAt: new Date().toISOString()
        };
      }
      return rec;
    });
    
    setReconciliations(updatedReconciliations);
    return updatedReconciliations.find(rec => rec.id === id);
  };

  // Estatísticas e relatórios
  const getTransactionStats = (
    startDate?: string, 
    endDate?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) => {
    let filtered = transactions;
    
    if (startDate) {
      filtered = filtered.filter(tx => tx.createdAt >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(tx => tx.createdAt <= endDate);
    }
    
    const completed = filtered.filter(tx => tx.status === "completed");
    const refunded = filtered.filter(tx => tx.status === "refunded");
    const disputed = filtered.filter(tx => tx.status === "disputed");
    
    const totalAmount = completed.reduce((sum, tx) => sum + tx.amount, 0);
    const refundedAmount = refunded.reduce((sum, tx) => sum + tx.amount, 0);
    const disputedAmount = disputed.reduce((sum, tx) => sum + tx.amount, 0);
    
    const byMethod = {
      credit_card: filtered.filter(tx => tx.paymentMethod === "credit_card").length,
      pix: filtered.filter(tx => tx.paymentMethod === "pix").length,
      boleto: filtered.filter(tx => tx.paymentMethod === "boleto").length,
      debit_card: filtered.filter(tx => tx.paymentMethod === "debit_card").length
    };
    
    // Criar agrupamento por período (simplificado)
    const timeSeriesData: Array<{
      period: string;
      count: number;
      amount: number;
    }> = [];
    
    // Este é um exemplo simplificado - em uma implementação real,
    // você usaria bibliotecas como date-fns para manipulação de datas
    // e agrupamento adequado por dia/semana/mês
    
    return {
      total: {
        count: filtered.length,
        amount: totalAmount
      },
      completed: {
        count: completed.length,
        amount: totalAmount
      },
      refunded: {
        count: refunded.length,
        amount: refundedAmount
      },
      disputed: {
        count: disputed.length,
        amount: disputedAmount
      },
      netAmount: totalAmount - refundedAmount,
      byMethod,
      timeSeries: timeSeriesData
    };
  };

  // Exportação de dados
  const exportTransactionsCSV = (
    startDate?: string, 
    endDate?: string,
    statuses?: Transaction['status'][]
  ) => {
    let filtered = transactions;
    
    if (startDate) {
      filtered = filtered.filter(tx => tx.createdAt >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(tx => tx.createdAt <= endDate);
    }
    
    if (statuses && statuses.length > 0) {
      filtered = filtered.filter(tx => statuses.includes(tx.status));
    }
    
    // Aqui apenas simulamos a exportação - em uma implementação real,
    // você geraria um arquivo CSV adequado
    toast.success(`${filtered.length} transações exportadas para CSV`);
    
    return {
      success: true,
      count: filtered.length,
      data: "csv_data_here" // Em uma implementação real, este seria o conteúdo CSV
    };
  };

  return {
    // Transações
    transactions,
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransactionStatus,
    
    // Reembolsos
    refunds,
    getRefunds,
    getRefundById,
    createRefund,
    updateRefundStatus,
    
    // Disputas
    disputes,
    getDisputes,
    getDisputeById,
    createDispute,
    updateDisputeStatus,
    
    // Conciliação bancária
    reconciliations,
    getReconciliations,
    createReconciliation,
    matchReconciliation,
    resolveReconciliationDiscrepancy,
    
    // Estatísticas e exportação
    getTransactionStats,
    exportTransactionsCSV
  };
};
