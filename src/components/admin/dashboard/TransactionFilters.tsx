
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionFiltersProps {
  filters: {
    status: string;
    paymentMethod: string;
    fromDate: string;
    toDate: string;
    searchTerm: string;
    minAmount?: number;
    maxAmount?: number;
  };
  onFilterChange: (key: string, value: any) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
      <div>
        <label className="block text-sm mb-1">Status</label>
        <Select 
          value={filters.status} 
          onValueChange={(value) => onFilterChange('status', value)}
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
          onValueChange={(value) => onFilterChange('paymentMethod', value)}
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
          onChange={(e) => onFilterChange('fromDate', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm mb-1">Até</label>
        <Input 
          type="date" 
          value={filters.toDate}
          onChange={(e) => onFilterChange('toDate', e.target.value)}
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Buscar</label>
        <Input 
          type="text" 
          placeholder="ID, usuário ou produto" 
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
