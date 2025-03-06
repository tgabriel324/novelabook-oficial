
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import ComparativeAnalysisChart from "@/components/admin/ComparativeAnalysisChart";

interface AnalysisSectionProps {
  compareTransactions: (params: {
    periodStart: string;
    periodEnd: string;
    previousPeriodStart: string;
    previousPeriodEnd: string;
  }) => any;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ compareTransactions }) => {
  const [analysisPeriods, setAnalysisPeriods] = useState({
    currentStart: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    currentEnd: format(new Date(), 'yyyy-MM-dd'),
    previousStart: format(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    previousEnd: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  });

  const analysisData = compareTransactions({
    periodStart: analysisPeriods.currentStart,
    periodEnd: analysisPeriods.currentEnd,
    previousPeriodStart: analysisPeriods.previousStart,
    previousPeriodEnd: analysisPeriods.previousEnd
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Análise Comparativa</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Período Atual - Início</label>
          <Input 
            type="date" 
            value={analysisPeriods.currentStart}
            onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, currentStart: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Período Atual - Fim</label>
          <Input 
            type="date" 
            value={analysisPeriods.currentEnd}
            onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, currentEnd: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Período Anterior - Início</label>
          <Input 
            type="date" 
            value={analysisPeriods.previousStart}
            onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, previousStart: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Período Anterior - Fim</label>
          <Input 
            type="date" 
            value={analysisPeriods.previousEnd}
            onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, previousEnd: e.target.value }))}
          />
        </div>
      </div>
      
      {analysisData && (
        <div className="h-64">
          <ComparativeAnalysisChart data={analysisData} />
        </div>
      )}
    </div>
  );
};

export default AnalysisSection;
