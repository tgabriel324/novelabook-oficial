
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalysisData {
  currentPeriod: {
    start: string;
    end: string;
    total: number;
    volume: number;
    successRate: number;
    byMethod: Record<string, number>;
  };
  previousPeriod: {
    start: string;
    end: string;
    total: number;
    volume: number;
    successRate: number;
    byMethod: Record<string, number>;
  };
  comparison: {
    transactionGrowth: number;
    volumeGrowth: number;
    successRateChange: number;
  };
}

const ComparativeAnalysisChart: React.FC<{ data: AnalysisData }> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };
  
  const prepareChartData = () => {
    // Combine data for the chart
    const chartData = [
      {
        name: 'Transações',
        atual: data.currentPeriod.total,
        anterior: data.previousPeriod.total,
      },
      {
        name: 'Volume (R$)',
        atual: data.currentPeriod.volume / 100, // Scale down for the chart
        anterior: data.previousPeriod.volume / 100,
      },
      {
        name: 'Taxa de Sucesso (%)',
        atual: data.currentPeriod.successRate,
        anterior: data.previousPeriod.successRate,
      }
    ];
    
    // Add payment methods
    const allMethods = new Set([
      ...Object.keys(data.currentPeriod.byMethod),
      ...Object.keys(data.previousPeriod.byMethod)
    ]);
    
    allMethods.forEach(method => {
      chartData.push({
        name: `Método: ${method}`,
        atual: data.currentPeriod.byMethod[method] || 0,
        anterior: data.previousPeriod.byMethod[method] || 0,
      });
    });
    
    return chartData;
  };
  
  const barColors = {
    atual: "#2563eb",    // Blue
    anterior: "#9ca3af"  // Gray
  };
  
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-center">
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Crescimento de Transações</h4>
          <p className={`text-xl font-bold ${data.comparison.transactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.comparison.transactionGrowth.toFixed(1)}%
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Crescimento de Volume</h4>
          <p className={`text-xl font-bold ${data.comparison.volumeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.comparison.volumeGrowth.toFixed(1)}%
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Mudança na Taxa de Sucesso</h4>
          <p className={`text-xl font-bold ${data.comparison.successRateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.comparison.successRateChange.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="text-xs text-center mb-2">
        <span className="text-blue-600 font-medium">
          Período Atual: {formatDate(data.currentPeriod.start)} até {formatDate(data.currentPeriod.end)}
        </span>
        <span className="mx-2">vs.</span>
        <span className="text-gray-600 font-medium">
          Período Anterior: {formatDate(data.previousPeriod.start)} até {formatDate(data.previousPeriod.end)}
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={prepareChartData()}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'atual' || name === 'anterior') {
                return [value, name === 'atual' ? 'Atual' : 'Anterior'];
              }
              return [value, name];
            }}
          />
          <Legend
            payload={[
              { value: 'Atual', type: 'square', color: barColors.atual },
              { value: 'Anterior', type: 'square', color: barColors.anterior }
            ]}
          />
          <Bar dataKey="atual" fill={barColors.atual} name="Atual" />
          <Bar dataKey="anterior" fill={barColors.anterior} name="Anterior" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparativeAnalysisChart;
