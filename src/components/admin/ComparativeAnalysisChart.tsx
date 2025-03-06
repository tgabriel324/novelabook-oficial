
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
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

interface ComparativeAnalysisChartProps {
  data: ChartData;
}

const ComparativeAnalysisChart = ({ data }: ComparativeAnalysisChartProps) => {
  // Preparar dados para o gráfico
  const chartData = [
    {
      name: 'Volume',
      atual: data.currentPeriod.volume,
      anterior: data.previousPeriod.volume,
    },
    {
      name: 'Quantidade',
      atual: data.currentPeriod.total,
      anterior: data.previousPeriod.total,
    },
    {
      name: 'Taxa de Sucesso',
      atual: data.currentPeriod.successRate,
      anterior: data.previousPeriod.successRate,
    },
  ];

  // Formatador para valores do tooltip
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Taxa de Sucesso') {
      return `${value.toFixed(2)}%`;
    } else if (name === 'Volume') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
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
          formatter={formatTooltipValue}
          labelStyle={{ color: 'black' }}
        />
        <Legend />
        <Bar dataKey="atual" name="Período Atual" fill="#2563eb" />
        <Bar dataKey="anterior" name="Período Anterior" fill="#94a3b8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComparativeAnalysisChart;
