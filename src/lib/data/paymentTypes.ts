
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  paymentIntentId?: string;
  transactionId?: string;
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
  paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionDetails?: {
    paymentProcessor?: string;
    transactionId?: string;
    paymentIntentId?: string;
  };
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
  | 'setup_intent.failed';

export type PixWebhookEvent =
  | 'pix.created'
  | 'pix.received'
  | 'pix.expired';

export type BoletoWebhookEvent =
  | 'boleto.generated'
  | 'boleto.paid'
  | 'boleto.expired';

export interface WebhookPayload {
  id: string;
  type: StripeWebhookEvent | PixWebhookEvent | BoletoWebhookEvent;
  data: {
    object: any;
  };
  created: number;
}
