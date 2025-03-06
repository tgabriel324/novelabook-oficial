
import React, { useState } from 'react';
import { useTransactionAdmin } from '@/hooks/useTransactionAdmin';
import { Transaction, Dispute, Refund, BankReconciliation } from '@/lib/data/paymentTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import RefundDialog from "./RefundDialog";
import DisputeResponseDialog from "./DisputeResponseDialog";
import BankReconciliationDialog from "./BankReconciliationDialog";
import ComparativeAnalysisChart from "./ComparativeAnalysisChart";

// Transaction Dashboard component
const TransactionDashboard: React.FC = () => {
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

  // State for dialogs
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [reconciliationDialogOpen, setReconciliationDialogOpen] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    fromDate: '',
    toDate: '',
    searchTerm: '',
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined
  });

  // Apply filters to get filtered transactions
  const filteredTransactions = filterTransactions({
    status: filters.status as any,
    paymentMethod: filters.paymentMethod as any,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    searchTerm: filters.searchTerm,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount
  });

  // State for analysis periods
  const [analysisPeriods, setAnalysisPeriods] = useState({
    currentStart: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    currentEnd: format(new Date(), 'yyyy-MM-dd'),
    previousStart: format(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    previousEnd: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  });

  // Generate analysis data
  const analysisData = compareTransactions({
    periodStart: analysisPeriods.currentStart,
    periodEnd: analysisPeriods.currentEnd,
    previousPeriodStart: analysisPeriods.previousStart,
    previousPeriodEnd: analysisPeriods.previousEnd
  });

  // Transaction status badge color
  const getStatusColor = (status: Transaction['status']) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-purple-500';
      case 'disputed': return 'bg-orange-500';
      case 'chargeback': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle file upload for bank reconciliation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importBankStatementFile(file);
    }
  };

  // Handle opening refund dialog
  const handleOpenRefundDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundDialogOpen(true);
  };

  // Handle opening dispute dialog
  const handleOpenDisputeDialog = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDisputeDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Transações</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => exportToCSV(filteredTransactions)} 
            disabled={isLoading || filteredTransactions.length === 0}
            variant="outline"
          >
            Exportar CSV
          </Button>
          <Button 
            onClick={() => exportToPDF(filteredTransactions)}
            disabled={isLoading || filteredTransactions.length === 0}
            variant="default"
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      {exportProgress > 0 && (
        <div className="mb-4">
          <p className="text-sm mb-1">Exportando...</p>
          <Progress value={exportProgress} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{transactions.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reembolsos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{refunds.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Disputas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{disputes.length}</p>
            {disputes.filter(d => d.status === 'open').length > 0 && (
              <Badge variant="destructive" className="mt-2">
                {disputes.filter(d => d.status === 'open').length} abertas
              </Badge>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conciliação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reconciliations.length}</p>
            {reconciliations.filter(r => r.status === 'unmatched').length > 0 && (
              <Badge variant="outline" className="mt-2">
                {reconciliations.filter(r => r.status === 'unmatched').length} não conciliados
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Análise Comparativa</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Período Atual - Início</label>
            <Input 
              type="date" 
              value={analysisPeriods.currentStart}
              onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, currentStart: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Período Atual - Fim</label>
            <Input 
              type="date" 
              value={analysisPeriods.currentEnd}
              onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, currentEnd: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Período Anterior - Início</label>
            <Input 
              type="date" 
              value={analysisPeriods.previousStart}
              onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, previousStart: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Período Anterior - Fim</label>
            <Input 
              type="date" 
              value={analysisPeriods.previousEnd}
              onChange={(e) => setAnalysisPeriods(prev => ({ ...prev, previousEnd: e.target.value }))}
            />
          </div>
        </div>
        
        {analysisData && (
          <div className="h-64">
            <ComparativeAnalysisChart data={analysisData} />
          </div>
        )}
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="refunds">Reembolsos</TabsTrigger>
          <TabsTrigger value="disputes">Disputas</TabsTrigger>
          <TabsTrigger value="reconciliation">Conciliação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as transações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter row */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                      <SelectItem value="disputed">Disputado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Método</label>
                  <Select 
                    value={filters.paymentMethod} 
                    onValueChange={(value) => handleFilterChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
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
                
                <div>
                  <label className="block text-sm mb-1">De</label>
                  <Input 
                    type="date" 
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Até</label>
                  <Input 
                    type="date" 
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Buscar</label>
                  <Input 
                    type="text" 
                    placeholder="ID, usuário ou produto" 
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Transactions table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhuma transação encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                          <TableCell>{transaction.userId}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: transaction.currency
                            }).format(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                            {transaction.paymentMethod === 'debit_card' && 'Cartão de Débito'}
                            {transaction.paymentMethod === 'pix' && 'PIX'}
                            {transaction.paymentMethod === 'boleto' && 'Boleto'}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status === 'completed' && 'Completado'}
                              {transaction.status === 'pending' && 'Pendente'}
                              {transaction.status === 'processing' && 'Processando'}
                              {transaction.status === 'failed' && 'Falhou'}
                              {transaction.status === 'refunded' && 'Reembolsado'}
                              {transaction.status === 'disputed' && 'Disputado'}
                              {transaction.status === 'chargeback' && 'Chargeback'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {transaction.status === 'completed' && (
                                <Button
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleOpenRefundDialog(transaction)}
                                >
                                  Reembolsar
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                Detalhes
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">
                {filteredTransactions.length} de {transactions.length} transações
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>Reembolsos</CardTitle>
              <CardDescription>
                Acompanhe todos os reembolsos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Transação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refunds.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhum reembolso encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      refunds.map((refund) => (
                        <TableRow key={refund.id}>
                          <TableCell className="font-mono text-xs">{refund.id}</TableCell>
                          <TableCell className="font-mono text-xs">{refund.transactionId}</TableCell>
                          <TableCell>{refund.userId}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: refund.currency
                            }).format(refund.amount)}
                          </TableCell>
                          <TableCell>{refund.reason}</TableCell>
                          <TableCell>
                            <Badge className={refund.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {refund.status === 'completed' ? 'Completado' : 'Pendente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(refund.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Disputas</CardTitle>
              <CardDescription>
                Gerencie disputas e chargebacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Transação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhuma disputa encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-mono text-xs">{dispute.id}</TableCell>
                          <TableCell className="font-mono text-xs">{dispute.transactionId}</TableCell>
                          <TableCell>{dispute.userId}</TableCell>
                          <TableCell>{dispute.reason}</TableCell>
                          <TableCell>
                            <Badge className={
                              dispute.status === 'open' 
                                ? 'bg-red-500' 
                                : dispute.status === 'under_review' 
                                  ? 'bg-yellow-500' 
                                  : dispute.status === 'won' 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-500'
                            }>
                              {dispute.status === 'open' && 'Aberta'}
                              {dispute.status === 'under_review' && 'Em análise'}
                              {dispute.status === 'won' && 'Ganha'}
                              {dispute.status === 'lost' && 'Perdida'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {dispute.status === 'open' && (
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDisputeDialog(dispute)}
                              >
                                Responder
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Conciliação Bancária</CardTitle>
              <CardDescription>
                Concilie transações com extratos bancários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Importar Extrato</h3>
                  <p className="text-sm text-gray-500">Importe um arquivo CSV ou OFX de extrato bancário</p>
                </div>
                <div>
                  <Input
                    type="file"
                    className="hidden"
                    id="bank-statement"
                    accept=".csv,.ofx"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="bank-statement">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Importar Arquivo</span>
                    </Button>
                  </label>
                </div>
              </div>
              
              {reconciliations.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Extrato</TableHead>
                        <TableHead>Valor Banco</TableHead>
                        <TableHead>Valor Sistema</TableHead>
                        <TableHead>Diferença</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliations.map((reconciliation) => (
                        <TableRow key={reconciliation.id}>
                          <TableCell className="font-mono text-xs">{reconciliation.id}</TableCell>
                          <TableCell className="font-mono text-xs">{reconciliation.bankStatementId}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(reconciliation.bankAmount)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(reconciliation.systemAmount)}
                          </TableCell>
                          <TableCell>
                            {reconciliation.discrepancyAmount !== undefined ? (
                              <span className={reconciliation.discrepancyAmount === 0 ? 'text-green-500' : 'text-red-500'}>
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(reconciliation.discrepancyAmount)}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              reconciliation.status === 'matched' 
                                ? 'bg-green-500' 
                                : reconciliation.status === 'partial_match' 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }>
                              {reconciliation.status === 'matched' && 'Conciliado'}
                              {reconciliation.status === 'partial_match' && 'Parcial'}
                              {reconciliation.status === 'unmatched' && 'Não Conciliado'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {reconciliation.status === 'unmatched' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReconciliationDialogOpen(true)}
                              >
                                Conciliar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum dado de conciliação</h3>
                  <p className="text-gray-500 mb-4">
                    Importe um arquivo de extrato bancário para começar a conciliação.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Components */}
      {selectedTransaction && refundDialogOpen && (
        <RefundDialog 
          transaction={selectedTransaction}
          onRefund={(amount, reason) => {
            createRefund({
              transactionId: selectedTransaction.id,
              amount,
              reason,
              adminId: 'admin_user'
            });
            setRefundDialogOpen(false);
          }}
          onCancel={() => setRefundDialogOpen(false)}
        />
      )}

      {selectedDispute && disputeDialogOpen && (
        <DisputeResponseDialog
          dispute={selectedDispute}
          onSubmit={(response, evidence) => {
            respondToDisputeRequest({
              disputeId: selectedDispute.id,
              response,
              evidence
            });
            setDisputeDialogOpen(false);
          }}
          onCancel={() => setDisputeDialogOpen(false)}
        />
      )}

      {reconciliationDialogOpen && (
        <BankReconciliationDialog
          transactions={transactions}
          reconciliations={reconciliations}
          onImportFile={handleFileUpload}
          onReconcile={(reconciliationId, transactionId) => {
            reconcileManually(
              {
                reconciliationId,
                transactionId
              },
              transactions
            );
            setReconciliationDialogOpen(false);
          }}
          onClose={() => setReconciliationDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionDashboard;
