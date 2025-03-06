
import { 
  Transaction, 
  Refund, 
  Dispute, 
  BankReconciliation, 
  PaymentMethod 
} from '@/lib/data/paymentTypes';

// Sample transactions for development/testing
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_1234',
    userId: 'user_1',
    amount: 29.99,
    currency: 'USD',
    paymentMethod: 'credit_card',
    status: 'completed',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:35:00Z',
    novelId: 'novel_123'
  },
  {
    id: 'txn_2345',
    userId: 'user_2',
    amount: 19.99,
    currency: 'USD',
    paymentMethod: 'pix',
    status: 'completed',
    createdAt: '2023-05-16T14:20:00Z',
    updatedAt: '2023-05-16T14:25:00Z',
    novelId: 'novel_456'
  },
  {
    id: 'txn_3456',
    userId: 'user_1',
    amount: 39.99,
    currency: 'USD',
    paymentMethod: 'credit_card',
    status: 'failed',
    createdAt: '2023-05-17T09:15:00Z',
    updatedAt: '2023-05-17T09:20:00Z',
    novelId: 'novel_789'
  }
];

// Sample refunds
export const mockRefunds: Refund[] = [
  {
    id: 'ref_1234',
    transactionId: 'txn_1000',
    userId: 'user_1',
    amount: 29.99,
    currency: 'USD',
    reason: 'Customer request',
    status: 'completed',
    createdAt: '2023-05-18T11:30:00Z',
    updatedAt: '2023-05-18T11:45:00Z',
    processedById: 'admin_1'
  }
];

// Sample disputes
export const mockDisputes: Dispute[] = [
  {
    id: 'dsp_1234',
    transactionId: 'txn_2000',
    userId: 'user_2',
    reason: 'Item not as described',
    evidence: 'Customer provided screenshots showing discrepancy',
    status: 'open',
    createdAt: '2023-05-19T13:45:00Z',
    updatedAt: '2023-05-19T13:50:00Z'
  }
];

// Sample bank reconciliations
export const mockReconciliations: BankReconciliation[] = [
  {
    id: 'rec_1234',
    bankStatementId: 'stmt_1',
    transactionId: 'txn_1234',
    status: 'matched',
    bankAmount: 29.99,
    systemAmount: 29.99,
    createdAt: '2023-05-20T09:00:00Z',
    updatedAt: '2023-05-20T09:10:00Z'
  },
  {
    id: 'rec_2345',
    bankStatementId: 'stmt_1',
    transactionId: '',
    status: 'unmatched',
    bankAmount: 49.99,
    systemAmount: 0,
    createdAt: '2023-05-20T09:00:00Z',
    updatedAt: '2023-05-20T09:10:00Z'
  }
];
