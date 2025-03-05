
import React, { useState } from "react";
import { useReports, useSales, useUsers, useNovels } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  AreaChart,
  LineChart
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { 
  LineChart as LineChartIcon, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  Download, 
  FileCog,
  DollarSign,
  Users as UsersIcon,
  BookOpen 
} from "lucide-react";

const Reports = () => {
  const { reportData, stats } = useReports();
  const { sales } = useSales();
  const { users } = useUsers();
  const { novels } = useNovels();
  
  const [selectedPeriod, setSelectedPeriod] = useState("last30");
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };
  
  // Filter data based on selected period
  const getFilteredData = () => {
    switch (selectedPeriod) {
      case "last7":
        return reportData.slice(-7);
      case "last30":
        return reportData.slice(-30);
      case "last90":
        return reportData.slice(-90);
      case "lastYear":
        return reportData.slice(-365);
      default:
        return reportData.slice(-30);
    }
  };
  
  const filteredData = getFilteredData();
  
  // Sales data for pie chart
  const statusData = [
    { name: "Concluídas", value: sales.filter(s => s.status === "completed").length },
    { name: "Pendentes", value: sales.filter(s => s.status === "pending").length },
    { name: "Reembolsadas", value: sales.filter(s => s.status === "refunded").length },
  ];
  
  // Colors for pie chart
  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];
  
  // Best selling novels
  const bestSellingNovels = [...novels]
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 5);
  
  // Most active users
  const mostActiveUsers = [...users]
    .sort((a, b) => (b.reads || 0) - (a.reads || 0))
    .slice(0, 5);
  
  // Recent sales
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  // Export report
  const handleExportReport = () => {
    alert("Exportação de relatório iniciada!");
    // In a real app, this would generate and download a CSV/PDF
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize estatísticas e relatórios detalhados da plataforma.
          </p>
        </div>
        <div className="flex gap-4">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Últimos 7 dias</SelectItem>
              <SelectItem value="last30">Últimos 30 dias</SelectItem>
              <SelectItem value="last90">Últimos 90 dias</SelectItem>
              <SelectItem value="lastYear">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`${stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.revenueGrowth >= 0 ? '+' : ''}{formatPercentage(stats.revenueGrowth)}
              </span>{' '}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`${stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.userGrowth >= 0 ? '+' : ''}{formatPercentage(stats.userGrowth)}
              </span>{' '}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Novelas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalNovels}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`${stats.novelGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.novelGrowth >= 0 ? '+' : ''}{formatPercentage(stats.novelGrowth)}
              </span>{' '}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <FileCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats.conversionRate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`${stats.conversionGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.conversionGrowth >= 0 ? '+' : ''}{formatPercentage(stats.conversionGrowth)}
              </span>{' '}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChartIcon className="h-4 w-4 mr-2" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center">
            <LineChartIcon className="h-4 w-4 mr-2" /> Vendas
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2" /> Usuários
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Receita e Usuários</CardTitle>
                <CardDescription>
                  Visão geral da receita e novos usuários ao longo do tempo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AreaChart 
                    data={filteredData}
                    index="period"
                    categories={["revenue", "users"]}
                    colors={["green", "blue"]}
                    valueFormatter={(value) => 
                      typeof value === 'number' ? value.toLocaleString('pt-BR') : value
                    }
                    yAxisWidth={65}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Novelas Mais Vendidas</CardTitle>
                <CardDescription>
                  As 5 novelas com mais vendas na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <BarChart 
                    data={bestSellingNovels.map(novel => ({
                      name: novel.title,
                      value: novel.purchases
                    }))}
                    index="name"
                    categories={["value"]}
                    colors={["blue"]}
                    valueFormatter={(value) => 
                      typeof value === 'number' ? value.toString() : value
                    }
                    yAxisWidth={30}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status das Vendas</CardTitle>
                <CardDescription>
                  Distribuição de vendas por status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} vendas`, ""]}
                        labelFormatter={() => ""}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas ao Longo do Tempo</CardTitle>
              <CardDescription>
                Volume de vendas e receita por período.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart 
                  data={filteredData}
                  index="period"
                  categories={["sales", "revenue"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value) => 
                    typeof value === 'number' ? value.toLocaleString('pt-BR') : value
                  }
                  yAxisWidth={65}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>
                Últimas transações realizadas na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Novela</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Método</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.user.name}</TableCell>
                      <TableCell>{sale.novel.title}</TableCell>
                      <TableCell>{formatCurrency(sale.price)}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                          sale.status === 'refunded' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {sale.status === 'completed' ? 'Concluída' :
                           sale.status === 'refunded' ? 'Reembolsada' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>
                Novos usuários registrados ao longo do tempo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart 
                  data={filteredData}
                  index="period"
                  categories={["users"]}
                  colors={["blue"]}
                  valueFormatter={(value) => 
                    typeof value === 'number' ? value.toString() : value.toString()
                  }
                  yAxisWidth={40}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Usuários Mais Ativos</CardTitle>
              <CardDescription>
                Usuários com mais leituras na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right">Leituras</TableHead>
                    <TableHead className="text-right">Compras</TableHead>
                    <TableHead>Desde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostActiveUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'author' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {user.role === 'admin' ? 'Admin' :
                           user.role === 'author' ? 'Autor' : 'Usuário'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{user.reads || 0}</TableCell>
                      <TableCell className="text-right">{user.purchased || 0}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
