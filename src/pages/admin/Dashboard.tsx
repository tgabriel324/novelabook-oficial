
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp, Activity, ShoppingCart, Eye, UserPlus } from "lucide-react";
import { useReports, useActivityLogs } from "@/hooks/useAdminData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { reportData, stats } = useReports();
  const { logs } = useActivityLogs();

  // Cores para os gráficos
  const colors = {
    primary: "#7e69ab",
    secondary: "#e9c763",
    tertiary: "#4ade80",
    quaternary: "#f87171",
    background: "#f8f9fa"
  };

  // Dados para o gráfico de distribuição de categorias
  const categoryData = [
    { name: 'Fantasia', value: 155 },
    { name: 'Romance', value: 210 },
    { name: 'Ficção', value: 98 },
    { name: 'Mistério', value: 87 },
    { name: 'Outros', value: 428 },
  ];

  const pieColors = [
    colors.primary,
    colors.secondary,
    colors.tertiary,
    colors.quaternary,
    "#a3a3a3"
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da plataforma</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats.userGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}%
              </span> no último mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Novelas Publicadas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNovels}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats.novelGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.novelGrowth > 0 ? '+' : ''}{stats.novelGrowth}%
              </span> no último mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats.revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}%
              </span> no último mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats.conversionGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.conversionGrowth > 0 ? '+' : ''}{stats.conversionGrowth}%
              </span> no último mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Dados de Performance</CardTitle>
            <CardDescription>Análise dos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Receita</TabsTrigger>
                <TabsTrigger value="sales">Vendas</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="reads">Leituras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenue" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, 'Receita']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke={colors.primary} strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="sales" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value} vendas`, 'Vendas']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill={colors.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="users" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value} usuários`, 'Usuários']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke={colors.tertiary} strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="reads" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value} leituras`, 'Leituras']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="reads" stroke={colors.quaternary} strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Total de novelas por categoria</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} novelas`, 'Quantidade']}
                  contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Atividade Recente</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs">Ver Tudo</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 max-h-[300px] overflow-auto">
              {logs.map((log) => {
                let icon;
                switch(log.action) {
                  case 'user_blocked':
                  case 'user_role_changed':
                    icon = <Users className="h-5 w-5 text-primary" />;
                    break;
                  case 'novel_published':
                  case 'novel_updated':
                    icon = <BookOpen className="h-5 w-5 text-secondary-foreground" />;
                    break;
                  case 'system_settings_updated':
                    icon = <Activity className="h-5 w-5 text-primary" />;
                    break;
                  default:
                    icon = <Activity className="h-5 w-5 text-primary" />;
                }

                let actionText = '';
                switch(log.action) {
                  case 'user_blocked':
                    actionText = 'bloqueou o usuário';
                    break;
                  case 'user_role_changed':
                    actionText = 'alterou o papel do usuário';
                    break;
                  case 'novel_published':
                    actionText = 'publicou a novela';
                    break;
                  case 'novel_updated':
                    actionText = 'atualizou a novela';
                    break;
                  case 'system_settings_updated':
                    actionText = 'atualizou as configurações';
                    break;
                  default:
                    actionText = 'realizou uma ação';
                }

                return (
                  <li key={log.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {log.user.name} {actionText} {log.entity.name}
                      </p>
                      {log.details && (
                        <p className="text-sm text-muted-foreground truncate">
                          {log.details}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-green-500">+8%</span> em relação a ontem
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leituras Hoje</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">321</div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-green-500">+15%</span> em relação a ontem
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários Hoje</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-green-500">+12%</span> em relação a ontem
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
