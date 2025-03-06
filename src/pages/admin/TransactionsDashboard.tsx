
import React from 'react';
import TransactionDashboard from '@/components/admin/TransactionDashboard';

const TransactionsDashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Painel de Transações</h1>
      <TransactionDashboard />
    </div>
  );
};

export default TransactionsDashboardPage;
