
import React from 'react';
import { useTransactionAdmin } from '@/hooks/useTransactionAdmin';
import TransactionDashboard from '@/components/admin/TransactionDashboard';

const TransactionsDashboardPage = () => {
  const transactionAdmin = useTransactionAdmin();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Painel de Transações</h1>
      <TransactionDashboard {...transactionAdmin} />
    </div>
  );
};

export default TransactionsDashboardPage;
