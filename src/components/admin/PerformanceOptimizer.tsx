
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Database, 
  HardDrive, 
  PlayCircle, 
  RefreshCcw, 
  Server, 
  Smartphone, 
  Tablet 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const loadTimeData = [
  { page: 'Home', desktop: 0.8, mobile: 1.2 },
  { page: 'Leitor', desktop: 1.1, mobile: 1.8 },
  { page: 'Biblioteca', desktop: 0.9, mobile: 1.5 },
  { page: 'Perfil', desktop: 0.6, mobile: 0.9 },
  { page: 'Loja', desktop: 1.3, mobile: 2.0 },
];

const performanceMetrics = [
  { name: 'CPU', value: 35 },
  { name: 'Memória', value: 48 },
  { name: 'Rede', value: 62 },
  { name: 'Renderização', value: 54 },
  { name: 'I/O', value: 30 },
];

const compatibilityStatus = [
  { device: 'Chrome (Desktop)', status: 'compatível', issues: 0 },
  { device: 'Firefox (Desktop)', status: 'compatível', issues: 0 },
  { device: 'Safari (Desktop)', status: 'compatível', issues: 1 },
  { device: 'Edge (Desktop)', status: 'compatível', issues: 0 },
  { device: 'Chrome (Android)', status: 'compatível', issues: 0 },
  { device: 'Safari (iOS)', status: 'compatível', issues: 2 },
  { device: 'Samsung Internet', status: 'compatível', issues: 1 },
];

const issuesList = [
  { id: 1, description: "Flicker na transição de páginas no Safari iOS", severity: "média", status: "aberta" },
  { id: 2, description: "Carregar mais conteúdo não funciona no Safari Desktop", severity: "baixa", status: "aberta" },
  { id: 3, description: "Scrolling lento em dispositivos Android de baixo desempenho", severity: "alta", status: "em análise" },
  { id: 4, description: "Botões de compra não respondem ao primeiro toque em Samsung Internet", severity: "alta", status: "resolvida" },
  { id: 5, description: "Cache de imagens não está funcionando corretamente", severity: "média", status: "em análise" },
];

// Dados de desempenho ao longo do tempo
const performanceTrend = [
  { date: '07/01', loadTime: 2.1, cpu: 58, memory: 72 },
  { date: '07/08', loadTime: 1.9, cpu: 55, memory: 68 },
  { date: '07/15', loadTime: 1.7, cpu: 50, memory: 65 },
  { date: '07/22', loadTime: 1.5, cpu: 45, memory: 60 },
  { date: '07/29', loadTime: 1.4, cpu: 42, memory: 58 },
  { date: '08/05', loadTime: 1.3, cpu: 40, memory: 55 },
  { date: '08/12', loadTime: 1.2, cpu: 38, memory: 52 },
];

const PerformanceOptimizer = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [showTestResults, setShowTestResults] = useState(false);
  
  const runPerformanceTest = () => {
    setIsRunningTest(true);
    setTestProgress(0);
    setShowTestResults(false);
    
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunningTest(false);
          setShowTestResults(true);
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Otimização de Performance</h1>
          <p className="text-muted-foreground">Análise e melhoria do desempenho da aplicação</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={runPerformanceTest} 
            disabled={isRunningTest}
            className="flex items-center gap-2"
          >
            {isRunningTest ? (
              <>
                <RefreshCcw className="h-4 w-4 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Executar Teste
              </>
            )}
          </Button>
        </div>
      </header>
      
      {isRunningTest && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Progresso do teste</span>
                <span className="text-sm font-medium">{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">Analisando performance da aplicação. Por favor, aguarde...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showTestResults && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Teste concluído com sucesso</AlertTitle>
          <AlertDescription>
            O teste de performance foi finalizado. Veja os resultados abaixo.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {metric.name === 'CPU' && <Cpu className="h-4 w-4 mr-2 text-primary" />}
                {metric.name === 'Memória' && <Server className="h-4 w-4 mr-2 text-primary" />}
                {metric.name === 'Rede' && <Database className="h-4 w-4 mr-2 text-primary" />}
                {metric.name === 'Renderização' && <Smartphone className="h-4 w-4 mr-2 text-primary" />}
                {metric.name === 'I/O' && <HardDrive className="h-4 w-4 mr-2 text-primary" />}
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.value}%</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    metric.value < 40 ? 'bg-green-100 text-green-800' :
                    metric.value < 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {metric.value < 40 ? 'Bom' : metric.value < 60 ? 'Médio' : 'Alto'}
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Tempo Médio de Carregamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.4s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">-0.3s</span> vs. mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Carregamento por Página</CardTitle>
            <CardDescription>Comparativo entre desktop e mobile</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={loadTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis label={{ value: 'Segundos', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}s`, 'Tempo de carregamento']} />
                <Legend />
                <Bar dataKey="desktop" name="Desktop" fill="#7e69ab" />
                <Bar dataKey="mobile" name="Mobile" fill="#e9c763" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Performance</CardTitle>
            <CardDescription>Evolução nas últimas semanas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceTrend}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="loadTime" name="Tempo de carregamento (s)" stroke="#7e69ab" />
                <Line yAxisId="right" type="monotone" dataKey="cpu" name="CPU (%)" stroke="#e9c763" />
                <Line yAxisId="right" type="monotone" dataKey="memory" name="Memória (%)" stroke="#4ade80" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Compatibilidade com Dispositivos</CardTitle>
          <CardDescription>Status de compatibilidade em diferentes navegadores e dispositivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compatibilityStatus.map((item) => (
                <div key={item.device} className="flex items-center p-3 border rounded-md">
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 ${
                    item.issues === 0 ? 'bg-green-500' : item.issues <= 1 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium">{item.device}</div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      {item.issues === 0 ? (
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                      )}
                      {item.issues === 0 
                        ? 'Totalmente compatível' 
                        : `${item.issues} ${item.issues === 1 ? 'problema' : 'problemas'} detectado${item.issues === 1 ? '' : 's'}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Problemas Detectados</CardTitle>
          <CardDescription>Lista de problemas identificados e seu status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {issuesList.map((issue) => (
              <div key={issue.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{issue.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Severidade: <span className={`font-medium ${
                        issue.severity === 'alta' ? 'text-red-600' :
                        issue.severity === 'média' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>{issue.severity}</span>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    issue.status === 'resolvida' ? 'bg-green-100 text-green-800' :
                    issue.status === 'em análise' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {issue.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOptimizer;
