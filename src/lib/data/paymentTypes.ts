
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed' | 'chargeback';
  createdAt: string;
  updatedAt: string;
  paymentIntentId?: string;
  transactionId?: string;
  refundedAmount?: number;
  disputeReason?: string;
  chargebackStatus?: 'opened' | 'under_review' | 'won' | 'lost';
}

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  saveCard?: boolean;
}

export interface PixDetails {
  key: string;
  expiresAt: string;
  qrCodeImage?: string;
  transactionId: string;
}

export interface BoletoDetails {
  code: string;
  expiresAt: string;
  url: string;
  barCodeImage?: string;
  transactionId: string;
}

export interface PurchaseReceipt {
  id: string;
  userId: string;
  novelId: string;
  title: string;
  price: number;
  purchaseDate: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded' | 'disputed';
  transactionDetails?: {
    paymentProcessor?: string;
    transactionId?: string;
    paymentIntentId?: string;
  };
  discountAmount?: number;
  discountType?: 'coupon' | 'volume' | 'special_offer';
  discountCode?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  novelId: string;
  chapterId: string;
  title: string;
  position: number;
  createdAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  novelId: string;
  chapterId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfflineContent {
  id: string;
  userId: string;
  novelId: string;
  chapterId: string;
  title: string;
  content: string;
  coverImage: string;
  downloadedAt: string;
  expiresAt: string;
}

// Tipos de eventos de webhook para pagamentos
export type StripeWebhookEvent = 
  | 'payment_intent.created'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'payment_intent.canceled'
  | 'setup_intent.succeeded'
  | 'setup_intent.failed'
  | 'charge.refunded'
  | 'charge.dispute.created'
  | 'charge.dispute.closed';

export type PixWebhookEvent =
  | 'pix.created'
  | 'pix.received'
  | 'pix.expired'
  | 'pix.refunded';

export type BoletoWebhookEvent =
  | 'boleto.generated'
  | 'boleto.paid'
  | 'boleto.expired'
  | 'boleto.refunded';

export interface WebhookPayload {
  id: string;
  type: StripeWebhookEvent | PixWebhookEvent | BoletoWebhookEvent;
  data: {
    object: any;
  };
  created: number;
}

// Novos tipos para assinaturas
export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export type SubscriptionInterval = 'day' | 'week' | 'month' | 'year';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  paymentMethod: PaymentMethod;
  latestInvoiceId?: string;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

// Novos tipos para promoções e descontos
export type DiscountType = 'percentage' | 'fixed_amount';
export type CouponRestriction = 'none' | 'first_time_purchase' | 'specific_novel' | 'minimum_purchase';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  currency?: string;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  currentUsage: number;
  isActive: boolean;
  restriction: CouponRestriction;
  restrictionValues?: string[]; // IDs de novelas específicas
  createdAt: string;
  updatedAt: string;
}

export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetNovelIds?: string[]; // Novelas específicas em promoção
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolumeDiscount {
  id: string;
  name: string;
  description: string;
  minQuantity: number;
  discountPercentage: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// Novos tipos para entidades relacionadas a transações
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentDetails['status'];
  createdAt: string;
  updatedAt: string;
  novelId?: string;
  subscriptionId?: string;
  refundId?: string;
  couponId?: string;
  offerApplied?: string;
}

export interface Refund {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  processedById?: string; // ID do administrador que processou o reembolso
}

export interface Dispute {
  id: string;
  transactionId: string;
  userId: string;
  reason: string;
  evidence: string;
  status: 'open' | 'under_review' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface BankReconciliation {
  id: string;
  bankStatementId: string;
  transactionId: string;
  status: 'matched' | 'unmatched' | 'partial_match';
  bankAmount: number;
  systemAmount: number;
  discrepancyAmount?: number;
  discrepancyReason?: string;
  resolvedAt?: string;
  resolvedById?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para internacionalização
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
}

export interface CountryTaxConfig {
  countryCode: string;
  countryName: string;
  taxRate: number;
  taxName: string;
  isVatEnabled: boolean;
  requiresTaxId: boolean;
  taxIdFormat?: string;
  isActive: boolean;
}
