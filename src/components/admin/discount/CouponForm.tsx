
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Coupon } from "@/lib/data/paymentTypes";
import { CouponRequest } from "@/hooks/transaction-admin/types";
import { AlertTriangle } from "lucide-react";

interface CouponFormProps {
  onSubmit: (data: CouponRequest) => void;
  onCancel: () => void;
  initialData?: Coupon;
  isEdit?: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEdit = false
}) => {
  const form = useForm<CouponRequest>({
    defaultValues: initialData ? {
      code: initialData.code,
      description: initialData.description,
      discountType: initialData.discountType,
      discountValue: initialData.discountValue,
      currency: initialData.currency,
      minPurchaseAmount: initialData.minPurchaseAmount,
      maxDiscountAmount: initialData.maxDiscountAmount,
      startDate: initialData.startDate.substring(0, 10),
      endDate: initialData.endDate.substring(0, 10),
      usageLimit: initialData.usageLimit,
      restriction: initialData.restriction,
      restrictionValues: initialData.restrictionValues,
    } : {
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      restriction: 'none',
    }
  });

  const handleSubmit = (data: CouponRequest) => {
    onSubmit(data);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Cupom' : 'Criar Novo Cupom'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Edite os detalhes do cupom de desconto' 
              : 'Adicione um novo cupom de desconto para seus clientes'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do Cupom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="DESCONTO10" 
                      {...field} 
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormDescription>
                    Código que o cliente usará para aplicar o desconto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do cupom" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Desconto</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentual (%)</SelectItem>
                        <SelectItem value="fixed_amount">Valor Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Desconto</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step={form.watch('discountType') === 'percentage' ? "1" : "0.01"}
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch('discountType') === 'fixed_amount' && (
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || 'BRL'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BRL">Real (BRL)</SelectItem>
                        <SelectItem value="USD">Dólar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Uso</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="Ilimitado se vazio"
                      {...field}
                      value={field.value || ''}
                      onChange={e => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Número máximo de vezes que este cupom pode ser usado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="restriction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restrição</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a restrição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sem restrição</SelectItem>
                      <SelectItem value="first_time_purchase">Primeira compra</SelectItem>
                      <SelectItem value="specific_novel">Novelas específicas</SelectItem>
                      <SelectItem value="minimum_purchase">Valor mínimo de compra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch('restriction') === 'minimum_purchase' && (
              <FormField
                control={form.control}
                name="minPurchaseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo de Compra</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {form.watch('discountType') === 'percentage' && (
              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Máximo de Desconto</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Sem limite se vazio"
                        {...field}
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Limite máximo para o desconto percentual
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEdit ? 'Salvar Alterações' : 'Criar Cupom'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponForm;
