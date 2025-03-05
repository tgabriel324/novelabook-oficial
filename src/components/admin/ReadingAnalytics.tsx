
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Eye, UserCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dados mockados para demonstração
const mockReadingData = [
  { day: 'Seg', reads: 120, avgTime: 15, completionRate: 68 },
  { day: 'Ter', reads: 150, avgTime: 18, completionRate: 72 },
  { day: 'Qua', reads: 180, avgTime: 22, completionRate: 75 },
  { day: 'Qui', reads: 135, avgTime: 17, completionRate: 70 },
  { day: 'Sex', reads: 210, avgTime: 25, completionRate: 82 },
  { day: 'Sáb', reads: 290, avgTime: 35, completionRate: 88 },
  { day: 'Dom', reads: 320, avgTime: 40, completionRate: 85 },
];

const popularGenres = [
  { name: 'Fantasia', value: 35 },
  { name: 'Romance', value: 25 },
  { name: 'Ficção Científica', value: 15 },
  { name: 'Mistério', value: 12 },
  { name: 'Aventura', value: 8 },
  { name: 'Outros', value: 5 },
];

const userAgeDistribution = [
  { ageGroup: '13-17', percentage: 15 },
  { ageGroup: '18-24', percentage: 35 },
  { ageGroup: '25-34', percentage: 28 },
  { ageGroup: '35-44', percentage: 12 },
  { ageGroup: '45+', percentage: 10 },
];

const deviceUsage = [
  { device: 'Mobile', percentage: 68 },
  { device: 'Desktop', percentage: 25 },
  { device: 'Tablet', percentage: 7 },
];

const ReadingAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7dias");
  
  // Cores para os gráficos
  const colors = {
    primary: "#7e69ab",
    secondary: "#e9c763",
    tertiary: "#4ade80",
    quaternary: "#f87171",
    background: "#f8f9fa"
  };
  
  const pieColors = [
    colors.primary,
    colors.secondary,
    colors.tertiary,
    colors.quaternary,
    "#a3a3a3",
    "#cbd5e1"
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Análise de Leitura</h1>
          <p className="text-muted-foreground">Monitoramento detalhado de engajamento e hábitos de leitura</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Exportar Relatório</Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Total de Leituras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,405</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+12.5%</span> vs. período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Tempo Médio de Leitura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5 min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+8.2%</span> vs. período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="h-4 w-4 mr-2 text-primary" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">77%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+5.3%</span> vs. período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2 text-primary" />
              Visualizações por Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium">-1.2%</span> vs. período anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Atividade de Leitura</CardTitle>
            <CardDescription>Estatísticas diárias de leitura {timeRange === "7dias" ? "nos últimos 7 dias" : timeRange === "30dias" ? "nos últimos 30 dias" : timeRange === "90dias" ? "nos últimos 90 dias" : "do último ano"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reads">
              <TabsList className="mb-4">
                <TabsTrigger value="reads">Leituras</TabsTrigger>
                <TabsTrigger value="time">Tempo Médio</TabsTrigger>
                <TabsTrigger value="completion">Taxa de Conclusão</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reads" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockReadingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value} leituras`, 'Quantidade']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="reads" fill={colors.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="time" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockReadingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value} min`, 'Tempo Médio']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="avgTime" stroke={colors.secondary} strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="completion" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockReadingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Taxa de Conclusão']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="completionRate" stroke={colors.tertiary} strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gêneros Mais Populares</CardTitle>
            <CardDescription>Distribuição de leituras por gênero</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularGenres}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {popularGenres.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentagem']}
                  contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Perfil dos Leitores</CardTitle>
            <CardDescription>Informações demográficas e de uso</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="age">
              <TabsList className="mb-4">
                <TabsTrigger value="age">Faixa Etária</TabsTrigger>
                <TabsTrigger value="device">Dispositivos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="age" className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userAgeDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="ageGroup" type="category" stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentagem']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="percentage" fill={colors.quaternary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="device" className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentagem']}
                      contentStyle={{ backgroundColor: colors.background, borderColor: '#e5e7eb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReadingAnalytics;
