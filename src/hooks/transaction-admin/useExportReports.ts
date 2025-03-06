
import { useState } from 'react';
import { Transaction } from '@/lib/data/paymentTypes';
import { ExportOptions, ComparativeAnalysisRequest } from './types';
import { useToast } from '@/hooks/use-toast';
import { 
  exportTransactionsToCSV, 
  exportTransactionsToPDF,
  generateComparativeAnalysis 
} from '@/services/admin/transactionAdminService';

export const useExportReports = () => {
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const exportToCSV = (transactions: Transaction[]) => {
    try {
      // Simulate export progress
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
      
      // Generate CSV
      const csvContent = exportTransactionsToCSV(transactions);
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after download
      setTimeout(() => {
        clearInterval(interval);
        setExportProgress(0);
        toast({
          title: "Exportação concluída",
          description: `${transactions.length} transações exportadas com sucesso`,
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

  const exportToPDF = async (transactions: Transaction[]) => {
    try {
      // Simulate export progress
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
      
      // Generate PDF
      const pdfBlob = await exportTransactionsToPDF(transactions);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.pdf`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after download
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

  const generateAnalysis = (
    transactions: Transaction[],
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

  // Add compareTransactions as an alias for generateAnalysis for backward compatibility
  const compareTransactions = (params: ComparativeAnalysisRequest) => {
    return generateAnalysis(
      [], // This will be filled with actual transactions in useTransactionAdmin
      params.periodStart,
      params.periodEnd,
      params.previousPeriodStart,
      params.previousPeriodEnd
    );
  };

  return {
    exportProgress,
    exportToCSV,
    exportToPDF,
    generateAnalysis,
    compareTransactions
  };
};
