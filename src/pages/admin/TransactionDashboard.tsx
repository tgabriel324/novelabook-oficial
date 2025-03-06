
import { useState } from "react";
import { useTransactionAdmin } from "@/hooks/useTransactionAdmin";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  FileDown, 
  Banknote, 
  RefreshCw, 
  FileText, 
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  ArrowDownUp,
  DollarSign
} from "lucide-react";
import { Transaction, Refund, Dispute } from "@/lib/data/paymentTypes";
import ComparativeAnalysisChart from "@/components/admin/ComparativeAnalysisChart";
import RefundDialog from "@/components/admin/RefundDialog";
import DisputeResponseDialog from "@/components/admin/DisputeResponseDialog";
import BankReconciliationDialog from "@/components/admin/BankReconciliationDialog";

// Status de transação para badge
const statusConfig: Record<Transaction['status'], { label: string; variant: "default" | "outline" | "secondary" | "destructive" | "success" }> = {
  "pending": { label: "Pendente", variant: "secondary" },
  "processing": { label: "Processando", variant: "secondary" },
  "completed": { label: "Concluído", variant: "success" },
  "failed": { label: "Falhou", variant: "destructive" },
  "refunded": { label: "Reembolsado", variant: "outline" },
  "disputed": { label: "Disputado", variant: "destructive" },
  "chargeback": { label: "Chargeback", variant: "destructive" }
};

// Badge customizada com variante "success"
const CustomBadge = ({ variant, children }: { variant: string; children: React.ReactNode }) => {
  if (variant === "success") {
    return (
      <Badge className="bg-green-500 hover:bg-green-600">{children}</Badge>
    );
  }
  return <Badge variant={variant as any}>{children}</Badge>;
};

// Formatar método de pagamento
const formatPaymentMethod = (method: Transaction['paymentMethod']) => {
  switch (method) {
    case "credit_card": return "Cartão de Crédito";
    case "debit_card": return "Cartão de Débito";
    case "pix": return "PIX";
    case "boleto": return "Boleto";
    default: return method;
  }
};

const TransactionDashboard = () => {
  const {
    transactions,
    refunds,
    disputes,
    reconciliations,
    isLoading,
    exportProgress,
    filterTransactions,
    createRefund,
    respondToDisputeRequest,
    importBankStatementFile,
    reconcileManually,
    exportToCSV,
    exportToPDF,
    compareTransactions
  } = useTransactionAdmin();
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
    minAmount: "",
    maxAmount: "",
    searchTerm: ""
  });

  // Estado para análise comparativa
  const [comparativePeriod, setComparativePeriod] = useState({
    current: {
      start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    previous: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 1, 1)).toISOString().split('T')[0],
      end: new Date(new Date().setDate(0)).toISOString().split('T')[0]
    }
  });
  
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [showReconciliationDialog, setShowReconciliationDialog] = useState(false);
  const [showComparativeDialog, setShowComparativeDialog] = useState(false);
  
  // Aplicar filtros às transações
  const filteredTransactions = filterTransactions({
    status: filters.status ? filters.status as Transaction['status'] : undefined,
    paymentMethod: filters.paymentMethod ? filters.paymentMethod as Transaction['paymentMethod'] : undefined,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
    maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
    searchTerm: filters.searchTerm
  });
  
  // Gerar análise comparativa
  const analysisData = compareTransactions(
    comparativePeriod.current.start,
    comparativePeriod.current.end,
    comparativePeriod.previous.start,
    comparativePeriod.previous.end
  );
  
  // Handler para alterar filtros
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler para resetar filtros
  const resetFilters = () => {
    setFilters({
      status: "",
      paymentMethod: "",
      fromDate: "",
      toDate: "",
      minAmount: "",
      maxAmount: "",
      searchTerm: ""
    });
  };
  
  // Handler para exportar transações
  const handleExportTransactions = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(filteredTransactions);
    } else {
      exportToPDF(filteredTransactions);
    }
  };
  
  // Handler para upload de extrato bancário
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importBankStatementFile(file);
    }
  };
  
  // Formatador de moeda
  const formatCurrency = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  // Formatador de data/hora
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Transações</h1>
            <p className="text-muted-foreground">
              Gerencie transações, reembolsos, disputas e conciliação bancária
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="gap-2"
            >
              <Filter size={16} />
              Filtros
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileDown size={16} />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Exportar Transações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExportTransactions('csv')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportTransactions('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              onClick={() => setShowReconciliationDialog(true)}
              className="gap-2"
            >
              <Banknote size={16} />
              Conciliação Bancária
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowComparativeDialog(true)}
              className="gap-2"
            >
              <ArrowDownUp size={16} />
              Análise Comparativa
            </Button>
          </div>
        </div>
        
        {exportProgress > 0 && (
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>Exportando transações...</span>
              <span>{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="w-full" />
          </div>
        )}
        
        {showFilterDrawer && (
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle>Filtros de Transação</CardTitle>
              <CardDescription>
                Refine a lista de transações usando os filtros abaixo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                      <SelectItem value="disputed">Disputado</SelectItem>
                      <SelectItem value="chargeback">Chargeback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                  <Select
                    value={filters.paymentMethod}
                    onValueChange={(value) => handleFilterChange('paymentMethod', value)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Todos os métodos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os métodos</SelectItem>
                      <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="search">Busca</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="ID, usuário ou novela"
                      className="pl-8"
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromDate">Data Inicial</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="toDate">Data Final</Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Valor Mínimo</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      placeholder="0,00"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Valor Máximo</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      placeholder="0,00"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Limpar Filtros
              </Button>
              <Button onClick={() => setShowFilterDrawer(false)}>
                Aplicar Filtros
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Transações</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transações encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions">
              <TabsList className="mb-4">
                <TabsTrigger value="transactions">Transações</TabsTrigger>
                <TabsTrigger value="refunds">Reembolsos</TabsTrigger>
                <TabsTrigger value="disputes">Disputas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Search size={24} className="mb-2" />
                              <p>Nenhuma transação encontrada com os filtros atuais</p>
                              <Button 
                                variant="link" 
                                size="sm" 
                                onClick={resetFilters}
                                className="mt-2"
                              >
                                Limpar filtros
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {transaction.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{transaction.userId.substring(0, 8)}...</TableCell>
                            <TableCell>
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </TableCell>
                            <TableCell>
                              {formatPaymentMethod(transaction.paymentMethod)}
                            </TableCell>
                            <TableCell>
                              <CustomBadge variant={statusConfig[transaction.status].variant}>
                                {statusConfig[transaction.status].label}
                              </CustomBadge>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(transaction.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedTransaction(transaction);
                                      setShowRefundDialog(true);
                                    }}
                                    disabled={
                                      transaction.status === 'refunded' || 
                                      transaction.status === 'failed' ||
                                      transaction.status === 'pending'
                                    }
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reembolsar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      // Ver detalhes da transação
                                    }}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="refunds">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Transação</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refunds.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <RefreshCw size={24} className="mb-2" />
                              <p>Nenhum reembolso encontrado</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        refunds.map((refund) => (
                          <TableRow key={refund.id}>
                            <TableCell className="font-medium">
                              {refund.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{refund.transactionId.substring(0, 8)}...</TableCell>
                            <TableCell>
                              {formatCurrency(refund.amount, refund.currency)}
                            </TableCell>
                            <TableCell>{refund.reason.substring(0, 20)}...</TableCell>
                            <TableCell>
                              <Badge variant={
                                refund.status === 'completed' ? 'default' :
                                refund.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {refund.status === 'completed' ? 'Concluído' :
                                 refund.status === 'pending' ? 'Pendente' : 'Falhou'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(refund.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <FileText size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="disputes">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Transação</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <AlertTriangle size={24} className="mb-2" />
                              <p>Nenhuma disputa encontrada</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        disputes.map((dispute) => (
                          <TableRow key={dispute.id}>
                            <TableCell className="font-medium">
                              {dispute.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{dispute.transactionId.substring(0, 8)}...</TableCell>
                            <TableCell>{dispute.reason.substring(0, 30)}...</TableCell>
                            <TableCell>
                              <Badge variant={
                                dispute.status === 'won' ? 'default' :
                                dispute.status === 'lost' ? 'destructive' :
                                dispute.status === 'under_review' ? 'secondary' : 'outline'
                              }>
                                {dispute.status === 'won' ? 'Ganha' :
                                 dispute.status === 'lost' ? 'Perdida' :
                                 dispute.status === 'under_review' ? 'Em Análise' : 'Aberta'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(dispute.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedDispute(dispute);
                                      setShowDisputeDialog(true);
                                    }}
                                    disabled={
                                      dispute.status === 'won' || 
                                      dispute.status === 'lost'
                                    }
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Responder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      // Ver detalhes da disputa
                                    }}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {analysisData && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Análise Comparativa</CardTitle>
              <CardDescription>
                Comparando dados de {formatDateTime(analysisData.currentPeriod.start).split(' ')[0]} a {formatDateTime(analysisData.currentPeriod.end).split(' ')[0]} 
                com período anterior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-lg">
                  <DollarSign className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">
                    {formatCurrency(analysisData.currentPeriod.volume)}
                  </h3>
                  <p className="text-sm text-muted-foreground">Volume de Transações</p>
                  <div className={`mt-2 flex items-center ${
                    analysisData.comparison.volumeGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analysisData.comparison.volumeGrowth >= 0 ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {analysisData.comparison.volumeGrowth >= 0 ? '+' : ''}
                      {analysisData.comparison.volumeGrowth.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-lg">
                  <CreditCard className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">
                    {analysisData.currentPeriod.total}
                  </h3>
                  <p className="text-sm text-muted-foreground">Quantidade de Transações</p>
                  <div className={`mt-2 flex items-center ${
                    analysisData.comparison.transactionGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analysisData.comparison.transactionGrowth >= 0 ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {analysisData.comparison.transactionGrowth >= 0 ? '+' : ''}
                      {analysisData.comparison.transactionGrowth.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">
                    {analysisData.currentPeriod.successRate.toFixed(2)}%
                  </h3>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <div className={`mt-2 flex items-center ${
                    analysisData.comparison.successRateChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analysisData.comparison.successRateChange >= 0 ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {analysisData.comparison.successRateChange >= 0 ? '+' : ''}
                      {analysisData.comparison.successRateChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Aqui entra o componente de gráfico */}
              <div className="h-80">
                <ComparativeAnalysisChart data={analysisData} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Diálogo de Reembolso */}
      {showRefundDialog && selectedTransaction && (
        <RefundDialog
          transaction={selectedTransaction}
          onRefund={(amount, reason) => {
            createRefund(
              selectedTransaction.id,
              amount,
              reason,
              "admin_user_123" // ID do admin atual
            );
            setShowRefundDialog(false);
          }}
          onCancel={() => setShowRefundDialog(false)}
        />
      )}
      
      {/* Diálogo de Resposta a Disputas */}
      {showDisputeDialog && selectedDispute && (
        <DisputeResponseDialog
          dispute={selectedDispute}
          onSubmit={(response, evidence) => {
            respondToDisputeRequest(selectedDispute.id, response, evidence);
            setShowDisputeDialog(false);
          }}
          onCancel={() => setShowDisputeDialog(false)}
        />
      )}
      
      {/* Diálogo de Conciliação Bancária */}
      {showReconciliationDialog && (
        <BankReconciliationDialog
          transactions={transactions}
          reconciliations={reconciliations}
          onImportFile={handleFileUpload}
          onReconcile={reconcileManually}
          onClose={() => setShowReconciliationDialog(false)}
        />
      )}
      
      {/* Diálogo de Análise Comparativa */}
      {showComparativeDialog && (
        <Dialog open={showComparativeDialog} onOpenChange={setShowComparativeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Análise Comparativa</DialogTitle>
              <DialogDescription>
                Configure os períodos para comparação de transações
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Período Atual</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="currentStart">Início</Label>
                    <Input
                      id="currentStart"
                      type="date"
                      value={comparativePeriod.current.start}
                      onChange={(e) => setComparativePeriod(prev => ({
                        ...prev,
                        current: {
                          ...prev.current,
                          start: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="currentEnd">Fim</Label>
                    <Input
                      id="currentEnd"
                      type="date"
                      value={comparativePeriod.current.end}
                      onChange={(e) => setComparativePeriod(prev => ({
                        ...prev,
                        current: {
                          ...prev.current,
                          end: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Período Anterior</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="previousStart">Início</Label>
                    <Input
                      id="previousStart"
                      type="date"
                      value={comparativePeriod.previous.start}
                      onChange={(e) => setComparativePeriod(prev => ({
                        ...prev,
                        previous: {
                          ...prev.previous,
                          start: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="previousEnd">Fim</Label>
                    <Input
                      id="previousEnd"
                      type="date"
                      value={comparativePeriod.previous.end}
                      onChange={(e) => setComparativePeriod(prev => ({
                        ...prev,
                        previous: {
                          ...prev.previous,
                          end: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={() => setShowComparativeDialog(false)}>
                Aplicar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransactionDashboard;
