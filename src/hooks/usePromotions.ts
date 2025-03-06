
import { useState } from 'react';
import { Coupon, SpecialOffer, VolumeDiscount, DiscountType } from '@/lib/data/paymentTypes';

// Dados fictícios para demonstração
const mockCoupons: Coupon[] = [
  {
    id: "coupon_welcome",
    code: "BEMVINDO20",
    description: "20% de desconto na primeira compra",
    discountType: "percentage",
    discountValue: 20,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    usageLimit: 1000,
    currentUsage: 345,
    isActive: true,
    restriction: "first_time_purchase",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "coupon_summer",
    code: "VERAO2023",
    description: "R$15 de desconto em compras acima de R$50",
    discountType: "fixed_amount",
    discountValue: 15,
    currency: "BRL",
    minPurchaseAmount: 50,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    usageLimit: 500,
    currentUsage: 123,
    isActive: true,
    restriction: "minimum_purchase",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "coupon_fantasy",
    code: "FANTASIA30",
    description: "30% de desconto em novelas de fantasia selecionadas",
    discountType: "percentage",
    discountValue: 30,
    maxDiscountAmount: 50,
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    usageLimit: 200,
    currentUsage: 87,
    isActive: true,
    restriction: "specific_novel",
    restrictionValues: ["1", "3", "5", "8"],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockSpecialOffers: SpecialOffer[] = [
  {
    id: "offer_weekend",
    name: "Promoção de Fim de Semana",
    description: "25% de desconto em todas as novelas",
    discountType: "percentage",
    discountValue: 25,
    startDate: new Date(Date.now()).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    bannerImage: "https://via.placeholder.com/800x200/9b87f5/ffffff?text=Promocao+Fim+de+Semana",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "offer_romance",
    name: "Mês do Romance",
    description: "20% de desconto em novelas de romance",
    discountType: "percentage",
    discountValue: 20,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    targetNovelIds: ["2", "4", "7"],
    bannerImage: "https://via.placeholder.com/800x200/9b87f5/ffffff?text=Mes+do+Romance",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockVolumeDiscounts: VolumeDiscount[] = [
  {
    id: "volume_2plus",
    name: "2+ Novelas: 10% OFF",
    description: "Compre 2 ou mais novelas e ganhe 10% de desconto",
    minQuantity: 2,
    discountPercentage: 10,
    isActive: true,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "volume_5plus",
    name: "5+ Novelas: 20% OFF",
    description: "Compre 5 ou mais novelas e ganhe 20% de desconto",
    minQuantity: 5,
    discountPercentage: 20,
    isActive: true,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "volume_10plus",
    name: "10+ Novelas: 30% OFF",
    description: "Compre 10 ou mais novelas e ganhe 30% de desconto",
    minQuantity: 10,
    discountPercentage: 30,
    isActive: true,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const usePromotions = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>(mockSpecialOffers);
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscount[]>(mockVolumeDiscounts);

  // CRUD para cupons
  const getCoupons = () => coupons;
  
  const getCouponByCode = (code: string) => {
    return coupons.find(coupon => coupon.code === code && coupon.isActive);
  };

  const createCoupon = (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coupon_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCoupons([...coupons, newCoupon]);
    return newCoupon;
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    const updatedCoupons = coupons.map(coupon => 
      coupon.id === id 
        ? { ...coupon, ...updates, updatedAt: new Date().toISOString() } 
        : coupon
    );
    setCoupons(updatedCoupons);
    return updatedCoupons.find(coupon => coupon.id === id);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
  };

  const validateCoupon = (code: string, userId: string, novelId?: string, purchaseAmount?: number) => {
    const coupon = getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, message: "Cupom não encontrado ou inativo" };
    }
    
    // Verificar se está dentro do período de validade
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    
    if (now < startDate || now > endDate) {
      return { valid: false, message: "Cupom fora do período de validade" };
    }
    
    // Verificar limite de uso
    if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
      return { valid: false, message: "Limite de uso do cupom atingido" };
    }
    
    // Verificar restrições
    if (coupon.restriction === "first_time_purchase") {
      // Aqui simularia verificar se usuário já fez compras antes
      // Para demonstração, vamos simular que o usuário 'user_current' já fez compras
      if (userId === "user_current") {
        return { valid: false, message: "Cupom válido apenas para primeira compra" };
      }
    }
    
    if (coupon.restriction === "minimum_purchase" && purchaseAmount) {
      if (purchaseAmount < (coupon.minPurchaseAmount || 0)) {
        return {
          valid: false,
          message: `Valor mínimo de compra não atingido (R$${coupon.minPurchaseAmount?.toFixed(2)})`
        };
      }
    }
    
    if (coupon.restriction === "specific_novel" && novelId) {
      if (!coupon.restrictionValues?.includes(novelId)) {
        return { valid: false, message: "Cupom não válido para este item" };
      }
    }
    
    return { valid: true, coupon };
  };

  const applyCoupon = (
    code: string, 
    purchaseAmount: number, 
    userId: string, 
    novelId?: string
  ) => {
    const validation = validateCoupon(code, userId, novelId, purchaseAmount);
    
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }
    
    const coupon = validation.coupon as Coupon;
    let discountAmount = 0;
    
    if (coupon.discountType === "percentage") {
      discountAmount = (purchaseAmount * coupon.discountValue) / 100;
      
      // Aplicar limite máximo de desconto se existir
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === "fixed_amount") {
      discountAmount = coupon.discountValue;
      
      // Garantir que o desconto não seja maior que o valor da compra
      if (discountAmount > purchaseAmount) {
        discountAmount = purchaseAmount;
      }
    }
    
    // Incrementar uso do cupom
    updateCoupon(coupon.id, { currentUsage: coupon.currentUsage + 1 });
    
    return {
      success: true,
      discountAmount,
      finalAmount: purchaseAmount - discountAmount,
      coupon
    };
  };

  // CRUD para ofertas especiais
  const getActiveSpecialOffers = (novelId?: string) => {
    const now = new Date().toISOString();
    
    return specialOffers.filter(offer => {
      const isActive = offer.isActive && 
                       offer.startDate <= now && 
                       offer.endDate >= now;
      
      if (!isActive) return false;
      
      // Se um novelId for fornecido, verificar se a oferta se aplica
      if (novelId && offer.targetNovelIds) {
        return offer.targetNovelIds.includes(novelId);
      }
      
      return true;
    });
  };

  const createSpecialOffer = (offer: Omit<SpecialOffer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOffer: SpecialOffer = {
      ...offer,
      id: `offer_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSpecialOffers([...specialOffers, newOffer]);
    return newOffer;
  };

  const updateSpecialOffer = (id: string, updates: Partial<SpecialOffer>) => {
    const updatedOffers = specialOffers.map(offer => 
      offer.id === id 
        ? { ...offer, ...updates, updatedAt: new Date().toISOString() } 
        : offer
    );
    setSpecialOffers(updatedOffers);
    return updatedOffers.find(offer => offer.id === id);
  };

  const deleteSpecialOffer = (id: string) => {
    setSpecialOffers(specialOffers.filter(offer => offer.id !== id));
  };

  const applySpecialOffer = (novelId: string, price: number) => {
    const activeOffers = getActiveSpecialOffers(novelId);
    
    if (activeOffers.length === 0) {
      return { hasDiscount: false, originalPrice: price, finalPrice: price };
    }

    // Encontrar a melhor oferta (maior desconto)
    let bestOffer: SpecialOffer | null = null;
    let highestDiscount = 0;
    
    for (const offer of activeOffers) {
      let currentDiscount = 0;
      
      if (offer.discountType === "percentage") {
        currentDiscount = (price * offer.discountValue) / 100;
      } else if (offer.discountType === "fixed_amount") {
        currentDiscount = offer.discountValue;
      }
      
      if (currentDiscount > highestDiscount) {
        highestDiscount = currentDiscount;
        bestOffer = offer;
      }
    }
    
    if (bestOffer) {
      return {
        hasDiscount: true,
        originalPrice: price,
        finalPrice: price - highestDiscount,
        discountAmount: highestDiscount,
        offer: bestOffer
      };
    }
    
    return { hasDiscount: false, originalPrice: price, finalPrice: price };
  };

  // CRUD para descontos por volume
  const getVolumeDiscounts = () => {
    return volumeDiscounts.filter(discount => 
      discount.isActive && 
      new Date(discount.startDate) <= new Date() && 
      new Date(discount.endDate) >= new Date()
    );
  };

  const createVolumeDiscount = (discount: Omit<VolumeDiscount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDiscount: VolumeDiscount = {
      ...discount,
      id: `volume_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setVolumeDiscounts([...volumeDiscounts, newDiscount]);
    return newDiscount;
  };

  const updateVolumeDiscount = (id: string, updates: Partial<VolumeDiscount>) => {
    const updatedDiscounts = volumeDiscounts.map(discount => 
      discount.id === id 
        ? { ...discount, ...updates, updatedAt: new Date().toISOString() } 
        : discount
    );
    setVolumeDiscounts(updatedDiscounts);
    return updatedDiscounts.find(discount => discount.id === id);
  };

  const deleteVolumeDiscount = (id: string) => {
    setVolumeDiscounts(volumeDiscounts.filter(discount => discount.id !== id));
  };

  const applyVolumeDiscount = (quantity: number, totalPrice: number) => {
    const activeDiscounts = getVolumeDiscounts();
    
    if (activeDiscounts.length === 0) {
      return { 
        hasDiscount: false, 
        originalPrice: totalPrice, 
        finalPrice: totalPrice 
      };
    }

    // Encontrar o melhor desconto aplicável
    let applicableDiscount: VolumeDiscount | null = null;
    
    // Ordenar por quantidade mínima decrescente para pegar o maior desconto aplicável
    const sortedDiscounts = [...activeDiscounts].sort((a, b) => 
      b.minQuantity - a.minQuantity
    );
    
    for (const discount of sortedDiscounts) {
      if (quantity >= discount.minQuantity) {
        applicableDiscount = discount;
        break;
      }
    }
    
    if (applicableDiscount) {
      const discountAmount = (totalPrice * applicableDiscount.discountPercentage) / 100;
      const finalPrice = totalPrice - discountAmount;
      
      return {
        hasDiscount: true,
        originalPrice: totalPrice,
        finalPrice,
        discountAmount,
        discount: applicableDiscount
      };
    }
    
    return { 
      hasDiscount: false, 
      originalPrice: totalPrice, 
      finalPrice: totalPrice 
    };
  };

  return {
    // Cupons
    coupons,
    getCoupons,
    getCouponByCode,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    applyCoupon,
    
    // Ofertas especiais
    specialOffers,
    getActiveSpecialOffers,
    createSpecialOffer,
    updateSpecialOffer,
    deleteSpecialOffer,
    applySpecialOffer,
    
    // Descontos por volume
    volumeDiscounts,
    getVolumeDiscounts,
    createVolumeDiscount,
    updateVolumeDiscount,
    deleteVolumeDiscount,
    applyVolumeDiscount
  };
};
