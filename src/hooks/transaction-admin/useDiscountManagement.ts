
import { useState } from 'react';
import { Coupon, SpecialOffer, VolumeDiscount } from '@/lib/data/paymentTypes';
import { CouponRequest, SpecialOfferRequest, VolumeDiscountRequest } from './types';
import { useToast } from '@/hooks/use-toast';

export const useDiscountManagement = ({
  coupons,
  setCoupons,
  specialOffers,
  setSpecialOffers,
  volumeDiscounts,
  setVolumeDiscounts
}: {
  coupons: Coupon[],
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>,
  specialOffers: SpecialOffer[],
  setSpecialOffers: React.Dispatch<React.SetStateAction<SpecialOffer[]>>,
  volumeDiscounts: VolumeDiscount[],
  setVolumeDiscounts: React.Dispatch<React.SetStateAction<VolumeDiscount[]>>
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Coupon management
  const createCoupon = async (couponData: CouponRequest) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCoupon: Coupon = {
        id: `coupon_${Date.now()}`,
        code: couponData.code,
        description: couponData.description,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        currency: couponData.currency,
        minPurchaseAmount: couponData.minPurchaseAmount,
        maxDiscountAmount: couponData.maxDiscountAmount,
        startDate: couponData.startDate,
        endDate: couponData.endDate,
        usageLimit: couponData.usageLimit,
        currentUsage: 0,
        isActive: true,
        restriction: couponData.restriction,
        restrictionValues: couponData.restrictionValues,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCoupons(prev => [newCoupon, ...prev]);
      
      toast({
        title: "Cupom criado",
        description: `O cupom ${couponData.code} foi criado com sucesso`,
      });
      
      return newCoupon;
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o cupom",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCoupon = async (id: string, couponData: Partial<CouponRequest>) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCoupons(prev => 
        prev.map(coupon => {
          if (coupon.id === id) {
            return {
              ...coupon,
              ...couponData,
              updatedAt: new Date().toISOString()
            };
          }
          return coupon;
        })
      );
      
      toast({
        title: "Cupom atualizado",
        description: "O cupom foi atualizado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cupom",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCouponStatus = async (id: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCoupons(prev => 
        prev.map(coupon => {
          if (coupon.id === id) {
            return {
              ...coupon,
              isActive: !coupon.isActive,
              updatedAt: new Date().toISOString()
            };
          }
          return coupon;
        })
      );
      
      toast({
        title: "Status alterado",
        description: "O status do cupom foi alterado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao alterar status do cupom:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do cupom",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Special offers management
  const createSpecialOffer = async (offerData: SpecialOfferRequest) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOffer: SpecialOffer = {
        id: `offer_${Date.now()}`,
        name: offerData.name,
        description: offerData.description,
        discountType: offerData.discountType,
        discountValue: offerData.discountValue,
        startDate: offerData.startDate,
        endDate: offerData.endDate,
        isActive: true,
        targetNovelIds: offerData.targetNovelIds,
        bannerImage: offerData.bannerImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSpecialOffers(prev => [newOffer, ...prev]);
      
      toast({
        title: "Oferta criada",
        description: `A oferta ${offerData.name} foi criada com sucesso`,
      });
      
      return newOffer;
    } catch (error) {
      console.error("Erro ao criar oferta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a oferta",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpecialOffer = async (id: string, offerData: Partial<SpecialOfferRequest>) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSpecialOffers(prev => 
        prev.map(offer => {
          if (offer.id === id) {
            return {
              ...offer,
              ...offerData,
              updatedAt: new Date().toISOString()
            };
          }
          return offer;
        })
      );
      
      toast({
        title: "Oferta atualizada",
        description: "A oferta foi atualizada com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar oferta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a oferta",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfferStatus = async (id: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSpecialOffers(prev => 
        prev.map(offer => {
          if (offer.id === id) {
            return {
              ...offer,
              isActive: !offer.isActive,
              updatedAt: new Date().toISOString()
            };
          }
          return offer;
        })
      );
      
      toast({
        title: "Status alterado",
        description: "O status da oferta foi alterado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao alterar status da oferta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da oferta",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Volume discounts management
  const createVolumeDiscount = async (discountData: VolumeDiscountRequest) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDiscount: VolumeDiscount = {
        id: `volume_${Date.now()}`,
        name: discountData.name,
        description: discountData.description,
        minQuantity: discountData.minQuantity,
        discountPercentage: discountData.discountPercentage,
        isActive: true,
        startDate: discountData.startDate,
        endDate: discountData.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setVolumeDiscounts(prev => [newDiscount, ...prev]);
      
      toast({
        title: "Desconto por volume criado",
        description: `O desconto ${discountData.name} foi criado com sucesso`,
      });
      
      return newDiscount;
    } catch (error) {
      console.error("Erro ao criar desconto por volume:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o desconto por volume",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVolumeDiscount = async (id: string, discountData: Partial<VolumeDiscountRequest>) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVolumeDiscounts(prev => 
        prev.map(discount => {
          if (discount.id === id) {
            return {
              ...discount,
              ...discountData,
              updatedAt: new Date().toISOString()
            };
          }
          return discount;
        })
      );
      
      toast({
        title: "Desconto atualizado",
        description: "O desconto por volume foi atualizado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar desconto por volume:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o desconto por volume",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVolumeDiscountStatus = async (id: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVolumeDiscounts(prev => 
        prev.map(discount => {
          if (discount.id === id) {
            return {
              ...discount,
              isActive: !discount.isActive,
              updatedAt: new Date().toISOString()
            };
          }
          return discount;
        })
      );
      
      toast({
        title: "Status alterado",
        description: "O status do desconto por volume foi alterado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao alterar status do desconto por volume:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do desconto por volume",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    // Coupon methods
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    // Special offer methods
    createSpecialOffer,
    updateSpecialOffer,
    toggleOfferStatus,
    // Volume discount methods
    createVolumeDiscount,
    updateVolumeDiscount,
    toggleVolumeDiscountStatus
  };
};
