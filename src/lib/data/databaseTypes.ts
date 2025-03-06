
import { PaymentMethod, CardDetails, PixDetails, BoletoDetails } from "./paymentTypes";
import { Novel } from "./types";

export interface Customer {
  id: string;
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  stripeCustomerId?: string;
  savedCards?: SavedCard[];
}

export interface SavedCard {
  id: string;
  customerId: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  stripePaymentMethodId?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  novelId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  stripePaymentIntentId?: string;
  pixTransactionId?: string;
  boletoTransactionId?: string;
}

export interface PaymentIntent {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  stripePaymentIntentId?: string;
}

export interface PaymentEvent {
  id: string;
  transactionId: string;
  type: 'payment_intent.created' | 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'pix.received' | 'pix.expired' | 'boleto.paid' | 'boleto.expired';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  data: Record<string, any>;
}

export interface PaymentProcessingResponse {
  success: boolean;
  transactionId: string;
  paymentIntentId?: string;
  clientSecret?: string;
  status: string;
  message: string;
  redirectUrl?: string;
  receiptUrl?: string;
}
