
import { useState } from 'react';
import { SubscriptionPlan, Subscription, SubscriptionInvoice, SubscriptionStatus } from '@/lib/data/paymentTypes';

// Dados fictícios para demonstração
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan_basic",
    name: "Plano Básico",
    description: "Acesso a até 10 novelas por mês",
    price: 19.90,
    currency: "BRL",
    interval: "month",
    features: ["10 novelas por mês", "Acesso a conteúdo exclusivo", "Sem propagandas"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "plan_standard",
    name: "Plano Padrão",
    description: "Acesso a até 30 novelas por mês",
    price: 39.90,
    currency: "BRL",
    interval: "month",
    features: ["30 novelas por mês", "Acesso a conteúdo exclusivo", "Sem propagandas", "Downloads para leitura offline"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "plan_premium",
    name: "Plano Premium",
    description: "Acesso ilimitado a todas as novelas",
    price: 69.90,
    currency: "BRL",
    interval: "month",
    features: ["Novelas ilimitadas", "Acesso a conteúdo exclusivo", "Sem propagandas", "Downloads para leitura offline", "Lançamentos antecipados"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "plan_annual",
    name: "Plano Anual",
    description: "Acesso ilimitado por um ano com 20% de desconto",
    price: 599.90,
    currency: "BRL",
    interval: "year",
    features: ["Novelas ilimitadas", "Acesso a conteúdo exclusivo", "Sem propagandas", "Downloads para leitura offline", "Lançamentos antecipados", "20% de economia"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: "sub_123456",
    userId: "user_current",
    planId: "plan_basic",
    status: "active",
    currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "credit_card"
  }
];

const mockInvoices: SubscriptionInvoice[] = [
  {
    id: "inv_123456",
    subscriptionId: "sub_123456",
    userId: "user_current",
    amount: 19.90,
    currency: "BRL",
    status: "paid",
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv_234567",
    subscriptionId: "sub_123456",
    userId: "user_current",
    amount: 19.90,
    currency: "BRL",
    status: "paid",
    dueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>(mockInvoices);

  // CRUD para planos de assinatura
  const getPlans = () => plans;
  
  const getPlanById = (id: string) => {
    return plans.find(plan => plan.id === id);
  };

  const createPlan = (plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPlans([...plans, newPlan]);
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    const updatedPlans = plans.map(plan => 
      plan.id === id 
        ? { ...plan, ...updates, updatedAt: new Date().toISOString() } 
        : plan
    );
    setPlans(updatedPlans);
    return updatedPlans.find(plan => plan.id === id);
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  // Gerenciamento de assinaturas
  const getSubscriptions = (userId?: string) => {
    if (userId) {
      return subscriptions.filter(sub => sub.userId === userId);
    }
    return subscriptions;
  };

  const getSubscriptionById = (id: string) => {
    return subscriptions.find(sub => sub.id === id);
  };

  const createSubscription = (
    userId: string, 
    planId: string, 
    paymentMethod: Subscription['paymentMethod']
  ) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error("Plano não encontrado");
    }

    const periodEnd = new Date();
    if (plan.interval === 'month') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (plan.interval === 'year') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else if (plan.interval === 'week') {
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else if (plan.interval === 'day') {
      periodEnd.setDate(periodEnd.getDate() + 1);
    }

    const newSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: "active" as SubscriptionStatus,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod
    };

    setSubscriptions([...subscriptions, newSubscription]);

    // Criar fatura inicial
    const newInvoice: SubscriptionInvoice = {
      id: `inv_${Date.now()}`,
      subscriptionId: newSubscription.id,
      userId,
      amount: plan.price,
      currency: plan.currency,
      status: "paid",
      dueDate: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setInvoices([...invoices, newInvoice]);
    return newSubscription;
  };

  const cancelSubscription = (id: string, cancelImmediately: boolean = false) => {
    const updatedSubscriptions = subscriptions.map(sub => {
      if (sub.id === id) {
        if (cancelImmediately) {
          return { ...sub, status: "canceled" as SubscriptionStatus, updatedAt: new Date().toISOString() };
        } else {
          return { ...sub, cancelAtPeriodEnd: true, updatedAt: new Date().toISOString() };
        }
      }
      return sub;
    });
    
    setSubscriptions(updatedSubscriptions);
    return updatedSubscriptions.find(sub => sub.id === id);
  };

  const reactivateSubscription = (id: string) => {
    const updatedSubscriptions = subscriptions.map(sub => {
      if (sub.id === id && sub.cancelAtPeriodEnd) {
        return { ...sub, cancelAtPeriodEnd: false, updatedAt: new Date().toISOString() };
      }
      return sub;
    });
    
    setSubscriptions(updatedSubscriptions);
    return updatedSubscriptions.find(sub => sub.id === id);
  };

  // Gerenciamento de faturas
  const getInvoices = (userId?: string, subscriptionId?: string) => {
    let filtered = invoices;
    
    if (userId) {
      filtered = filtered.filter(inv => inv.userId === userId);
    }
    
    if (subscriptionId) {
      filtered = filtered.filter(inv => inv.subscriptionId === subscriptionId);
    }
    
    return filtered;
  };

  const generateNewInvoice = (subscription: Subscription) => {
    const plan = plans.find(p => p.id === subscription.planId);
    if (!plan) {
      throw new Error("Plano não encontrado");
    }

    const newInvoice: SubscriptionInvoice = {
      id: `inv_${Date.now()}`,
      subscriptionId: subscription.id,
      userId: subscription.userId,
      amount: plan.price,
      currency: plan.currency,
      status: "open",
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setInvoices([...invoices, newInvoice]);
    return newInvoice;
  };

  const payInvoice = (id: string) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: "paid",
          paidAt: new Date().toISOString()
        };
      }
      return inv;
    });
    
    setInvoices(updatedInvoices);
    return updatedInvoices.find(inv => inv.id === id);
  };

  // Renovação de assinaturas
  const processRenewal = (subscriptionId: string) => {
    const subscription = subscriptions.find(sub => sub.id === subscriptionId);
    if (!subscription) {
      throw new Error("Assinatura não encontrada");
    }

    if (subscription.cancelAtPeriodEnd) {
      // Cancelar assinatura no final do período
      const updatedSubscriptions = subscriptions.map(sub => {
        if (sub.id === subscriptionId) {
          return { ...sub, status: "canceled" as SubscriptionStatus, updatedAt: new Date().toISOString() };
        }
        return sub;
      });
      
      setSubscriptions(updatedSubscriptions);
      return { renewed: false, reason: "cancelAtPeriodEnd" };
    }

    // Simular processamento de pagamento
    const plan = plans.find(p => p.id === subscription.planId);
    if (!plan) {
      throw new Error("Plano não encontrado");
    }

    // Gerar nova fatura
    const newInvoice = generateNewInvoice(subscription);
    
    // Simular pagamento bem-sucedido
    payInvoice(newInvoice.id);

    // Atualizar período da assinatura
    const newPeriodStart = new Date();
    const newPeriodEnd = new Date();

    if (plan.interval === 'month') {
      newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
    } else if (plan.interval === 'year') {
      newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
    } else if (plan.interval === 'week') {
      newPeriodEnd.setDate(newPeriodEnd.getDate() + 7);
    } else if (plan.interval === 'day') {
      newPeriodEnd.setDate(newPeriodEnd.getDate() + 1);
    }

    const updatedSubscriptions = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return {
          ...sub,
          currentPeriodStart: newPeriodStart.toISOString(),
          currentPeriodEnd: newPeriodEnd.toISOString(),
          status: "active" as SubscriptionStatus,
          updatedAt: new Date().toISOString(),
          latestInvoiceId: newInvoice.id
        };
      }
      return sub;
    });
    
    setSubscriptions(updatedSubscriptions);
    return { 
      renewed: true, 
      subscription: updatedSubscriptions.find(sub => sub.id === subscriptionId),
      invoice: newInvoice
    };
  };

  return {
    // Planos
    plans,
    getPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    
    // Assinaturas
    subscriptions,
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    cancelSubscription,
    reactivateSubscription,
    
    // Faturas
    invoices,
    getInvoices,
    generateNewInvoice,
    payInvoice,
    
    // Renovação
    processRenewal
  };
};
