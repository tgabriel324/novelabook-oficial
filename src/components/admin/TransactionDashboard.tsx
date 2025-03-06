
import React, { useState } from 'react';
import { useTransactionAdmin } from '@/hooks/useTransactionAdmin';
import { Transaction, Dispute } from '@/lib/data/paymentTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import RefundDialog from "./RefundDialog";
import DisputeResponseDialog from "./DisputeResponseDialog";
import BankReconciliationDialog from "./BankReconciliationDialog";

// Import refactored components
import TransactionStats from './dashboard/TransactionStats';
import AnalysisSection from './dashboard/AnalysisSection';
import TransactionsTab from './dashboard/tabs/TransactionsTab';
import RefundsTab from './dashboard/tabs/RefundsTab';
import DisputesTab from './dashboard/tabs/DisputesTab';
import ReconciliationTab from './dashboard/tabs/ReconciliationTab';

const TransactionDashboard: React.FC = () => {
  const {
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
  } = useTransactionAdmin();

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [reconciliationDialogOpen, setReconciliationDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    fromDate: '',
    toDate: '',
    searchTerm: '',
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined
  });

  const filteredTransactions = filterTransactions({
    status: filters.status as any,
    paymentMethod: filters.paymentMethod as any,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    searchTerm: filters.searchTerm,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importBankStatementFile(file);
    }
  };

  const handleOpenRefundDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundDialogOpen(true);
  };

  const handleOpenDisputeDialog = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDisputeDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Transações</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => exportToCSV(filteredTransactions)} 
            disabled={isLoading || filteredTransactions.length === 0}
            variant="outline"
          >
            Exportar CSV
          </Button>
          <Button 
            onClick={() => exportToPDF(filteredTransactions)}
            disabled={isLoading || filteredTransactions.length === 0}
            variant="default"
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      {exportProgress > 0 && (
        <div className="mb-4">
          <p className="text-sm mb-1">Exportando...</p>
          <Progress value={exportProgress} className="h-2" />
        </div>
      )}

      <TransactionStats 
        transactions={transactions}
        refunds={refunds}
        disputes={disputes}
        reconciliations={reconciliations}
      />

      <AnalysisSection compareTransactions={compareTransactions} />

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="refunds">Reembolsos</TabsTrigger>
          <TabsTrigger value="disputes">Disputas</TabsTrigger>
          <TabsTrigger value="reconciliation">Conciliação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <TransactionsTab 
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onOpenRefundDialog={handleOpenRefundDialog}
          />
        </TabsContent>
        
        <TabsContent value="refunds">
          <RefundsTab refunds={refunds} />
        </TabsContent>
        
        <TabsContent value="disputes">
          <DisputesTab 
            disputes={disputes} 
            onOpenDisputeDialog={handleOpenDisputeDialog} 
          />
        </TabsContent>
        
        <TabsContent value="reconciliation">
          <ReconciliationTab 
            reconciliations={reconciliations}
            handleFileUpload={handleFileUpload}
            setReconciliationDialogOpen={setReconciliationDialogOpen}
          />
        </TabsContent>
      </Tabs>

      {selectedTransaction && refundDialogOpen && (
        <RefundDialog 
          transaction={selectedTransaction}
          onRefund={(amount, reason) => {
            createRefund({
              transactionId: selectedTransaction.id,
              amount,
              reason,
              adminId: 'admin_user'
            });
            setRefundDialogOpen(false);
          }}
          onCancel={() => setRefundDialogOpen(false)}
        />
      )}

      {selectedDispute && disputeDialogOpen && (
        <DisputeResponseDialog
          dispute={selectedDispute}
          onSubmit={(response, evidence) => {
            respondToDisputeRequest({
              disputeId: selectedDispute.id,
              response,
              evidence
            });
            setDisputeDialogOpen(false);
          }}
          onCancel={() => setDisputeDialogOpen(false)}
        />
      )}

      {reconciliationDialogOpen && (
        <BankReconciliationDialog
          transactions={transactions}
          reconciliations={reconciliations}
          onImportFile={handleFileUpload}
          onReconcile={(reconciliationId, transactionId) => {
            reconcileManually({
              reconciliationId,
              transactionId
            });
            setReconciliationDialogOpen(false);
          }}
          onClose={() => setReconciliationDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionDashboard;
