
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Download, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  ListFilter
} from "lucide-react";
import { useReports, useSales } from "@/hooks/useAdminData";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

const Reports = () => {
  const { reportData, stats } = useReports();
  const { sales } = useSales();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeChartType, setActiveChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  
  // Data para gráfico de categorias
  const categoryData = [
    { name: 'Fantasia', value: 120 },
    { name: 'Romance', value: 85 },
    { name: 'Aventura', value: 70 },
    { name: 'Sci-Fi', value: 55 },
    { name: 'Mistério', value: 40 },
    { name: 'Horror', value: 30 }
  ];

  // Data para gráfico de dispositivos
  const deviceData = [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 25 },
    { name: 'Tablet', value: 10 }
  ];

  // Filtrar dados do relatório com base no intervalo de data
  const getFilteredReportData = () => {
    // Em um sistema real, isso filtraria dados com base no intervalo
    return reportData;
  };

  // Formatar número como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar número com separadores
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Obter cor com base no crescimento
  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  // Obter ícone de crescimento
  const getGrowthIcon = (value: number) => {
    return value >= 0 ? '↑' : '↓';
  };

  // Exportar relatório
  const handleExportReport = (format: 'pdf' | 'csv' | 'excel') => {
    alert(`Exportando relatório em formato ${format}...`);
    // Em uma aplicação real, isso geraria e baixaria o arquivo
  };

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Analise o desempenho da plataforma e vendas.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            <div className={`flex items-center mt-1 text-sm ${getGrowthColor(stats.revenueGrowth)}`}>
              {getGrowthIcon(stats.revenueGrowth)} {Math.abs(stats.revenueGrowth)}%
              <span className="text-muted-foreground ml-1">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
            <div className={`flex items-center mt-1 text-sm ${getGrowthColor(stats.userGrowth)}`}>
              {getGrowthIcon(stats.userGrowth)} {Math.abs(stats.userGrowth)}%
              <span className="text-muted-foreground ml-1">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Novelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalNovels)}</div>
            <div className={`flex items-center mt-1 text-sm ${getGrowthColor(stats.novelGrowth)}`}>
              {getGrowthIcon(stats.novelGrowth)} {Math.abs(stats.novelGrowth)}%
              <span className="text-muted-foreground ml-1">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className={`flex items-center mt-1 text-sm ${getGrowthColor(stats.conversionGrowth)}`}>
              {getGrowthIcon(stats.conversionGrowth)} {Math.abs(stats.conversionGrowth)}%
              <span className="text-muted-foreground ml-1">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="col-span-3 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Desempenho de Vendas</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={activeChartType === 'bar' ? 'bg-muted' : ''}
                  onClick={() => setActiveChartType('bar')}
                >
                  <BarChart2 size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={activeChartType === 'line' ? 'bg-muted' : ''}
                  onClick={() => setActiveChartType('line')}
                >
                  <LineChartIcon size={16} />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                >
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                  <option value="quarter">Último Trimestre</option>
                  <option value="year">Último Ano</option>
                </select>
              </div>
            </div>
            <CardDescription>Comparação de vendas, receita e novos usuários</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              {activeChartType === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFilteredReportData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'revenue') return formatCurrency(value as number);
                      return formatNumber(value as number);
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Vendas" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="revenue" name="Receita (R$)" fill="#82ca9d" />
                    <Bar yAxisId="right" dataKey="users" name="Novos Usuários" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {activeChartType === 'line' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getFilteredReportData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'revenue') return formatCurrency(value as number);
                      return formatNumber(value as number);
                    }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" name="Vendas" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Receita (R$)" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="users" name="Novos Usuários" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle>Principais Categorias</CardTitle>
            <CardDescription>Distribuição de vendas por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} vendas`, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>Vendas Recentes</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <PieChartIcon size={16} />
              <span>Dispositivos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vendas Recentes</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportReport('pdf')}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportReport('csv')}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>CSV</span>
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Venda</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Novela</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.slice(0, 10).map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono text-xs">{sale.id}</TableCell>
                    <TableCell>{sale.user.name}</TableCell>
                    <TableCell>{sale.novel.title}</TableCell>
                    <TableCell>{formatCurrency(sale.price)}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={sale.status === 'completed' ? 'secondary' : sale.status === 'refunded' ? 'destructive' : 'outline'}
                        className={sale.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="devices">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Dispositivos Utilizados</CardTitle>
                  <CardDescription>Distribuição de acessos por tipo de dispositivo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value}% (${(percent * 100).toFixed(0)}%)`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Navegadores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Chrome</span>
                        <span className="font-semibold">64%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Safari</span>
                        <span className="font-semibold">22%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Firefox</span>
                        <span className="font-semibold">8%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Edge</span>
                        <span className="font-semibold">4%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '4%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Outros</span>
                        <span className="font-semibold">2%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '2%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sistemas Operacionais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Android</span>
                        <span className="font-semibold">52%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>iOS</span>
                        <span className="font-semibold">35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Windows</span>
                        <span className="font-semibold">10%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>macOS</span>
                        <span className="font-semibold">3%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '3%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
