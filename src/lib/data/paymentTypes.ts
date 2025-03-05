
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

// Novo tipo para armazenar marcadores
export interface Bookmark {
  id: string;
  userId: string;
  novelId: string;
  chapterId: string;
  title: string;
  position: number; // Posição percentual na página (0-100)
  createdAt: string;
}

// Novo tipo para armazenar notas do usuário
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

// Novo tipo para armazenar conteúdo offline
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
