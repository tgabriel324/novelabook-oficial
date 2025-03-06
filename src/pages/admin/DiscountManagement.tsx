
import React, { useState } from 'react';
import { useTransactionAdmin } from '@/hooks/useTransactionAdmin';
import { Coupon, SpecialOffer, VolumeDiscount } from '@/lib/data/paymentTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  ToggleLeft, 
  ToggleRight, 
  Trash2,
  Tag,
  Percent,
  DollarSign
} from "lucide-react";
import CouponForm from "@/components/admin/discount/CouponForm";
import { CouponRequest } from "@/hooks/transaction-admin/types";
import { format } from 'date-fns';

const DiscountManagement: React.FC = () => {
  const { 
    coupons, 
    specialOffers, 
    volumeDiscounts,
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    createSpecialOffer,
    updateSpecialOffer,
    toggleOfferStatus,
    createVolumeDiscount,
    updateVolumeDiscount,
    toggleVolumeDiscountStatus,
    isLoading 
  } = useTransactionAdmin();

  const [couponFormOpen, setCouponFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponSearchTerm, setCouponSearchTerm] = useState("");
  
  const handleCreateCoupon = (data: CouponRequest) => {
    createCoupon(data);
    setCouponFormOpen(false);
  };
  
  const handleUpdateCoupon = (data: CouponRequest) => {
    if (selectedCoupon) {
      updateCoupon(selectedCoupon.id, data);
      setSelectedCoupon(null);
    }
  };
  
  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };
  
  const handleToggleCouponStatus = (id: string) => {
    toggleCouponStatus(id);
  };
  
  const filteredCoupons = coupons.filter(coupon => {
    if (!couponSearchTerm) return true;
    
    const term = couponSearchTerm.toLowerCase();
    return (
      coupon.code.toLowerCase().includes(term) ||
      coupon.description.toLowerCase().includes(term)
    );
  });
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };
  
  const formatCurrency = (value: number, currency = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Descontos</h1>
      </div>
      
      <Tabs defaultValue="coupons" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
          <TabsTrigger value="special_offers">Ofertas Especiais</TabsTrigger>
          <TabsTrigger value="volume_discounts">Descontos por Volume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cupons de Desconto</CardTitle>
                  <CardDescription>
                    Gerencie os cupons de desconto para seus clientes
                  </CardDescription>
                </div>
                <Button onClick={() => setCouponFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Cupom
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cupons..."
                    className="pl-8"
                    value={couponSearchTerm}
                    onChange={(e) => setCouponSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Uso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhum cupom encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCoupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-medium">{coupon.code}</TableCell>
                          <TableCell>{coupon.description}</TableCell>
                          <TableCell>
                            {coupon.discountType === 'percentage' ? (
                              <span className="flex items-center">
                                <Percent className="h-4 w-4 mr-1" />
                                {coupon.discountValue}%
                                {coupon.maxDiscountAmount && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (max: {formatCurrency(coupon.maxDiscountAmount)})
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatCurrency(coupon.discountValue, coupon.currency)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {coupon.usageLimit ? (
                              `${coupon.currentUsage} / ${coupon.usageLimit}`
                            ) : (
                              `${coupon.currentUsage} / ∞`
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={coupon.isActive ? "default" : "secondary"}>
                              {coupon.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditCoupon(coupon)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleCouponStatus(coupon.id)}
                              >
                                {coupon.isActive ? (
                                  <ToggleRight className="h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
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
          </Card>
        </TabsContent>
        
        <TabsContent value="special_offers">
          <Card>
            <CardHeader>
              <CardTitle>Ofertas Especiais</CardTitle>
              <CardDescription>
                Configure ofertas especiais com tempo limitado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-8 rounded-md text-center">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ofertas Especiais</h3>
                <p className="text-muted-foreground mb-4">
                  Crie campanhas promocionais com tempo limitado para seus produtos.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Oferta Especial
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volume_discounts">
          <Card>
            <CardHeader>
              <CardTitle>Descontos por Volume</CardTitle>
              <CardDescription>
                Configure descontos baseados na quantidade de itens comprados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-8 rounded-md text-center">
                <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Descontos por Volume</h3>
                <p className="text-muted-foreground mb-4">
                  Incentive compras maiores oferecendo descontos baseados na quantidade.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Desconto por Volume
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {couponFormOpen && (
        <CouponForm
          onSubmit={handleCreateCoupon}
          onCancel={() => setCouponFormOpen(false)}
        />
      )}
      
      {selectedCoupon && (
        <CouponForm
          onSubmit={handleUpdateCoupon}
          onCancel={() => setSelectedCoupon(null)}
          initialData={selectedCoupon}
          isEdit
        />
      )}
    </div>
  );
};

export default DiscountManagement;
