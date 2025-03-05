
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertTriangle, Smartphone, Laptop, Tablet, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Dados mockados para demonstração
const compatibilityData = [
  { 
    device: 'Chrome (Desktop)',
    version: '115+',
    os: 'Windows/macOS/Linux',
    status: 'passed',
    issues: [],
  },
  { 
    device: 'Firefox (Desktop)',
    version: '110+',
    os: 'Windows/macOS/Linux',
    status: 'passed',
    issues: [],
  },
  { 
    device: 'Safari (Desktop)',
    version: '16+',
    os: 'macOS',
    status: 'warning',
    issues: ['Animações lentas na transição entre páginas'],
  },
  { 
    device: 'Edge (Desktop)',
    version: '110+',
    os: 'Windows',
    status: 'passed',
    issues: [],
  },
  { 
    device: 'Chrome (Mobile)',
    version: '115+',
    os: 'Android',
    status: 'passed',
    issues: [],
  },
  { 
    device: 'Safari (Mobile)',
    version: '16+',
    os: 'iOS',
    status: 'warning',
    issues: ['Problemas de scroll em páginas longas'],
  },
  { 
    device: 'Samsung Internet',
    version: '20+',
    os: 'Android',
    status: 'failed',
    issues: ['Formulário de pagamento não funciona corretamente', 'Botões de ação não respondem em alguns casos'],
  },
];

const featureCompatibility = [
  { feature: 'Leitor Offline', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'Compartilhamento', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'Notificações Push', chrome: true, firefox: true, safari: false, edge: true, android: true, ios: false },
  { feature: 'Modo Escuro', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'Pagamentos', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'Marcadores', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'Notas', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'Áudio', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
  { feature: 'WebP Images', chrome: true, firefox: true, safari: true, edge: true, android: true, ios: true },
];

const CompatibilityTester = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<typeof compatibilityData>([]);
  
  const runCompatibilityTest = () => {
    setIsRunningTest(true);
    setTestProgress(0);
    setTestResults([]);
    
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunningTest(false);
          setTestResults(compatibilityData);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Desktop')) {
      return <Laptop className="h-4 w-4" />;
    } else if (device.includes('Mobile')) {
      return <Smartphone className="h-4 w-4" />;
    } else {
      return <Tablet className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testes de Compatibilidade</h1>
          <p className="text-muted-foreground">Verificação de compatibilidade em diferentes navegadores e dispositivos</p>
        </div>
        <div>
          <Button
            onClick={runCompatibilityTest}
            disabled={isRunningTest}
            className="flex items-center gap-2"
          >
            {isRunningTest ? (
              <>
                <RefreshCcw className="h-4 w-4 animate-spin" />
                Executando Testes...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Executar Testes
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
              <p className="text-xs text-muted-foreground">Testando compatibilidade em diferentes plataformas...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {testResults.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resultados dos Testes</CardTitle>
              <CardDescription>Compatibilidade por navegador e dispositivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Navegador/Dispositivo</TableHead>
                      <TableHead>Versão</TableHead>
                      <TableHead>Sistema</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Problemas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(result.device)}
                            {result.device}
                          </div>
                        </TableCell>
                        <TableCell>{result.version}</TableCell>
                        <TableCell>{result.os}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <span className="capitalize">{result.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {result.issues.length > 0 ? (
                            <Badge variant={result.status === 'warning' ? 'outline' : 'destructive'}>
                              {result.issues.length} {result.issues.length === 1 ? 'problema' : 'problemas'}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                              Nenhum
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes dos Problemas</CardTitle>
                <CardDescription>Lista de problemas encontrados por plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.filter(r => r.issues.length > 0).length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        Não foram encontrados problemas significativos durante os testes.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    testResults.filter(r => r.issues.length > 0).map((result, index) => (
                      <div key={index} className="border rounded-md p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium flex items-center gap-2">
                            {getDeviceIcon(result.device)}
                            {result.device}
                          </div>
                          <Badge variant={result.status === 'warning' ? 'outline' : 'destructive'}>
                            {result.status === 'warning' ? 'Atenção' : 'Falha'}
                          </Badge>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {result.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compatibilidade de Recursos</CardTitle>
                <CardDescription>Status de recursos por plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Recurso</TableHead>
                        <TableHead className="text-center">Chrome</TableHead>
                        <TableHead className="text-center">Firefox</TableHead>
                        <TableHead className="text-center">Safari</TableHead>
                        <TableHead className="text-center">Edge</TableHead>
                        <TableHead className="text-center">Android</TableHead>
                        <TableHead className="text-center">iOS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {featureCompatibility.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{feature.feature}</TableCell>
                          <TableCell className="text-center">
                            {feature.chrome ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {feature.firefox ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {feature.safari ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {feature.edge ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {feature.android ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {feature.ios ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default CompatibilityTester;
