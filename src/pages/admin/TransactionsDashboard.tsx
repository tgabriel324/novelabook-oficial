
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  Download,
  Search,
  ArrowUpDown,
  DollarSign,
  AlertCircle,
  RefreshCcw,
  CreditCard,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { PaymentMethod, Transaction } from "@/lib/data/paymentTypes";

const TransactionsDashboard = () => {
  const { 
    transactions,
    getTransactionStats,
    exportTransactionsCSV, 
    getTransactions,
    updateTransactionStatus,
    disputes,
    reconciliations
  } = useTransactions();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterMethod, setFilterMethod] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const stats = getTransactionStats();

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
    disputed: "bg-orange-100 text-orange-800",
    processing: "bg-blue-100 text-blue-800",
    chargeback: "bg-red-100 text-red-800"
  };

  const paymentMethodIcons: Record<PaymentMethod, JSX.Element> = {
    credit_card: <CreditCard size={16} />,
    debit_card: <CreditCard size={16} />,
    pix: <RefreshCcw size={16} />,
    boleto: <AlertCircle size={16} />
  };

  const filteredTransactions = transactions.filter(tx => {
    let matches = true;
    
    if (filterStatus && tx.status !== filterStatus) {
      matches = false;
    }
    
    if (filterMethod && tx.paymentMethod !== filterMethod) {
      matches = false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesId = tx.id.toLowerCase().includes(searchLower);
      const matchesUserId = tx.userId.toLowerCase().includes(searchLower);
      matches = matches && (matchesId || matchesUserId);
    }
    
    if (startDate && tx.createdAt < startDate) {
      matches = false;
    }
    
    if (endDate && tx.createdAt > endDate) {
      matches = false;
    }
    
    return matches;
  });

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    exportTransactionsCSV(startDate, endDate);
  };

  const handleMarkAsComplete = (id: string) => {
    updateTransactionStatus(id, "completed");
    toast.success("Status da transação atualizado para 'Concluído'");
  };

  const handleRefund = (id: string) => {
    // Em uma implementação real, abriria um modal de confirmação
    toast.info("Funcionalidade de reembolso não implementada neste exemplo");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestão de Transações</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download size={16} />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.count}</div>
            <p className="text-xs text-muted-foreground">
              Valor total: {stats.total.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed.count}</div>
            <p className="text-xs text-muted-foreground">
              Valor: {stats.completed.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reembolsos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.refunded.count}</div>
            <p className="text-xs text-muted-foreground">
              Valor: {stats.refunded.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disputas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.disputed.count}</div>
            <p className="text-xs text-muted-foreground">
              {disputes.length} disputas pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Painel de Transações</CardTitle>
          <CardDescription>
            Gerencie todas as transações da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="refunds">Reembolsos</TabsTrigger>
              <TabsTrigger value="disputes">Disputas</TabsTrigger>
              <TabsTrigger value="reconciliation">Conciliação</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por ID ou usuário"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="w-[160px]">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="failed">Falha</SelectItem>
                          <SelectItem value="refunded">Reembolsado</SelectItem>
                          <SelectItem value="disputed">Em disputa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-[160px]">
                      <Select value={filterMethod} onValueChange={setFilterMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                          <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="boleto">Boleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate">Data Inicial</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Data Final</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-end ml-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterStatus("");
                        setFilterMethod("");
                        setSearchTerm("");
                        setStartDate("");
                        setEndDate("");
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">ID da Transação</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Data
                            <ArrowUpDown size={14} className="ml-1" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Valor
                            <ArrowUpDown size={14} className="ml-1" />
                          </div>
                        </TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>{tx.userId}</TableCell>
                          <TableCell>
                            {format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            {tx.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {paymentMethodIcons[tx.paymentMethod]}
                              <span>
                                {tx.paymentMethod === "credit_card" && "Cartão de Crédito"}
                                {tx.paymentMethod === "debit_card" && "Cartão de Débito"}
                                {tx.paymentMethod === "pix" && "PIX"}
                                {tx.paymentMethod === "boleto" && "Boleto"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[tx.status] || ""}>
                              {tx.status === "completed" && "Concluído"}
                              {tx.status === "pending" && "Pendente"}
                              {tx.status === "failed" && "Falha"}
                              {tx.status === "refunded" && "Reembolsado"}
                              {tx.status === "disputed" && "Em disputa"}
                              {tx.status === "processing" && "Processando"}
                              {tx.status === "chargeback" && "Chargeback"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {tx.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsComplete(tx.id)}
                                >
                                  Completar
                                </Button>
                              )}
                              {tx.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRefund(tx.id)}
                                >
                                  Reembolsar
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                Detalhes
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {paginatedTransactions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            Nenhuma transação encontrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {pageCount > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="text-sm">
                      Página {currentPage} de {pageCount}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                      disabled={currentPage === pageCount}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="refunds">
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Gestão de Reembolsos</h3>
                  <p className="mt-1">Não implementado neste exemplo</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="disputes">
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Gestão de Disputas</h3>
                  <p className="mt-1">Não implementado neste exemplo</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reconciliation">
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Conciliação Bancária</h3>
                  <p className="mt-1">Não implementado neste exemplo</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsDashboard;
