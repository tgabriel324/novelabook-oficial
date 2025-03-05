
import { useState } from "react";
import { useReports, useSales, useNovels, useUsers } from "@/hooks/useAdminData";
import { ReportData, Sale } from "@/lib/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Download,
  Calendar,
  DollarSign,
  Users,
  ArrowUpDown,
  Search,
  FileText,
  ShoppingCart,
  TrendingUp,
  BookOpen,
  Eye,
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Reports() {
  const { reportData, stats } = useReports();
  const { sales } = useSales();
  const { novels } = useNovels();
  const { users } = useUsers();
  
  const [reportPeriod, setReportPeriod] = useState("year");
  const [salesFilter, setSalesFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price" | "user" | "novel">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Colors for charts
  const chartColors = {
    primary: "#7e69ab",
    secondary: "#e9c763",
    tertiary: "#4ade80",
    quaternary: "#f87171",
    background: "#f8f9fa"
  };

  // Filter report data based on selected period
  const getFilteredReportData = (): ReportData[] => {
    switch (reportPeriod) {
      case "month":
        return reportData.slice(-1);
      case "quarter":
        return reportData.slice(-3);
      case "halfyear":
        return reportData.slice(-6);
      case "year":
      default:
        return reportData;
    }
  };

  // Convert filtered data for charts
  const filteredChartData = getFilteredReportData();

  // Filter sales based on criteria
  const filteredSales = sales
    .filter((sale) => {
      const matchesStatus = salesFilter === "all" || sale.status === salesFilter;
      const matchesSearch = 
        sale.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.novel.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case "price":
          comparison = b.price - a.price;
          break;
        case "user":
          comparison = a.user.name.localeCompare(b.user.name);
          break;
        case "novel":
          comparison = a.novel.title.localeCompare(b.novel.title);
          break;
      }
      
      return sortOrder === "asc" ? comparison * -1 : comparison;
    });

  // Toggle sort order
  const toggleSort = (field: "date" | "price" | "user" | "novel") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case "refunded":
        return <Badge variant="destructive">Reembolsado</Badge>;
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Prepare data for top selling novels chart
  const topSellingNovelsData = novels
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 5)
    .map(novel => ({
      name: novel.title.length > 20 ? novel.title.substring(0, 20) + '...' : novel.title,
      value: novel.purchases
    }));

  // Prepare data for top active users chart
  const topActiveUsersData = users
    .sort((a, b) => (b.reads || 0) - (a.reads || 0))
    .slice(0, 5)
    .map(user => ({
      name: user.name.length > 20 ? user.name.substring(0, 20) + '...' : user.name,
      value: user.reads || 0
    }));

  // Generate quick stats for the current period
  const quickStats = {
    dailySales: sales.filter(s => new Date(s.date) >= subDays(new Date(), 1)).length,
    dailyRevenue: sales
      .filter(s => new Date(s.date) >= subDays(new Date(), 1) && s.status === "completed")
      .reduce((sum, sale) => sum + sale.price, 0),
    monthlySales: sales.filter(s => new Date(s.date) >= subMonths(new Date(), 1)).length,
    monthlyRevenue: sales
      .filter(s => new Date(s.date) >= subMonths(new Date(), 1) && s.status === "completed")
      .reduce((sum, sale) => sum + sale.price, 0),
  };

  // Handle export reports
  const handleExportData = (type: string) => {
    // In a real application, this would generate and download a CSV/PDF file
    console.log(`Exporting ${type} data`);
    alert(`Relatório de ${type} exportado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Visualize e exporte relatórios de vendas e atividade
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={reportPeriod}
            onValueChange={setReportPeriod}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="halfyear">Último Semestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{quickStats.dailySales}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor: R$ {quickStats.dailyRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{quickStats.monthlySales}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor: R$ {quickStats.monthlyRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`font-medium ${stats.conversionGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.conversionGrowth > 0 ? '+' : ''}{stats.conversionGrowth}%
              </span> vs. mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`font-medium ${stats.userGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}%
              </span> novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance de Vendas e Receita</CardTitle>
          <CardDescription>
            Visão detalhada do período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="sales">Vendas</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="reads">Leituras</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, 'Receita']}
                    contentStyle={{ backgroundColor: chartColors.background, borderColor: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="sales" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value) => [`${value} vendas`, 'Vendas']}
                    contentStyle={{ backgroundColor: chartColors.background, borderColor: '#e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="users" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value) => [`${value} usuários`, 'Usuários']}
                    contentStyle={{ backgroundColor: chartColors.background, borderColor: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke={chartColors.tertiary} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="reads" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value) => [`${value} leituras`, 'Leituras']}
                    contentStyle={{ backgroundColor: chartColors.background, borderColor: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="reads" stroke={chartColors.quaternary} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Dados atualizados em {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
              <FileText className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novelas Mais Vendidas</CardTitle>
            <CardDescription>
              Top 5 novelas com maior número de vendas
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topSellingNovelsData}
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip 
                  formatter={(value) => [`${value} vendas`, 'Vendas']}
                  contentStyle={{ backgroundColor: chartColors.background, borderColor: '#e5e7eb' }}
                />
                <Bar dataKey="value" fill={chartColors.primary} radius={[0, 4, 4, 0]}>
                  {topSellingNovelsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`${chartColors.primary}${90 - index * 15}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Mais Ativos</CardTitle>
            <CardDescription>
              Top 5 usuários com maior número de leituras
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topActiveUsersData}
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip 
                  formatter={(value) => [`${value} leituras`, 'Leituras']}
                  contentStyle={{ backgroundColor: chartColors.background, borderColor: '#e5e7eb' }}
                />
                <Bar dataKey="value" fill={chartColors.tertiary} radius={[0, 4, 4, 0]}>
                  {topActiveUsersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`${chartColors.tertiary}${90 - index * 15}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Detalhes de todas as transações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar vendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="flex">
              <Select
                value={salesFilter}
                onValueChange={setSalesFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="ml-2" onClick={() => handleExportData('sales')}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("user")}
                      className="flex items-center"
                    >
                      Usuário
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("novel")}
                      className="flex items-center"
                    >
                      Novela
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("price")}
                      className="flex items-center"
                    >
                      Valor
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("date")}
                      className="flex items-center"
                    >
                      Data
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">#{sale.id}</TableCell>
                      <TableCell>{sale.user.name}</TableCell>
                      <TableCell>{sale.novel.title}</TableCell>
                      <TableCell>R$ {sale.price.toFixed(2)}</TableCell>
                      <TableCell>{renderStatusBadge(sale.status)}</TableCell>
                      <TableCell>{format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma venda encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <span>Mostrando {filteredSales.length} de {sales.length} vendas</span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {sales.filter(s => s.status === "completed").length} concluídas
            </span>
            <span className="h-4 border-r"></span>
            <span>
              {sales.filter(s => s.status === "pending").length} pendentes
            </span>
            <span className="h-4 border-r"></span>
            <span>
              {sales.filter(s => s.status === "refunded").length} reembolsadas
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
