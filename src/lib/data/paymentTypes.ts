
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface PixDetails {
  key: string;
  expiresAt: string;
}

export interface BoletoDetails {
  code: string;
  expiresAt: string;
  url: string;
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
}
