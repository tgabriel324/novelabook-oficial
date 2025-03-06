
import {
  Customer,
  SavedCard,
  Transaction,
  PaymentIntent,
  PaymentEvent
} from "@/lib/data/databaseTypes";

// Simulated in-memory database collections
const customers: Customer[] = [];
const savedCards: SavedCard[] = [];
const transactions: Transaction[] = [];
const paymentIntents: PaymentIntent[] = [];
const paymentEvents: PaymentEvent[] = [];

// Customer service
export const customerService = {
  async create(data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const customer: Customer = {
      id: `cust_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    customers.push(customer);
    return customer;
  },

  async getById(id: string): Promise<Customer | undefined> {
    return customers.find(customer => customer.id === id);
  },

  async getByUserId(userId: string): Promise<Customer | undefined> {
    return customers.find(customer => customer.userId === userId);
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer | undefined> {
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) return undefined;
    
    customers[index] = { ...customers[index], ...data };
    return customers[index];
  }
};

// Saved card service
export const savedCardService = {
  async create(data: Omit<SavedCard, 'id' | 'createdAt'>): Promise<SavedCard> {
    const card: SavedCard = {
      id: `card_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    savedCards.push(card);
    
    // If this card is set as default, update other cards
    if (card.isDefault) {
      savedCards.forEach(c => {
        if (c.id !== card.id && c.customerId === card.customerId) {
          c.isDefault = false;
        }
      });
    }
    
    return card;
  },

  async getByCustomerId(customerId: string): Promise<SavedCard[]> {
    return savedCards.filter(card => card.customerId === customerId);
  },

  async getById(id: string): Promise<SavedCard | undefined> {
    return savedCards.find(card => card.id === id);
  },

  async update(id: string, data: Partial<SavedCard>): Promise<SavedCard | undefined> {
    const index = savedCards.findIndex(card => card.id === id);
    if (index === -1) return undefined;
    
    savedCards[index] = { ...savedCards[index], ...data };
    
    // If this card is now default, update other cards
    if (data.isDefault) {
      savedCards.forEach(c => {
        if (c.id !== id && c.customerId === savedCards[index].customerId) {
          c.isDefault = false;
        }
      });
    }
    
    return savedCards[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = savedCards.findIndex(card => card.id === id);
    if (index === -1) return false;
    
    savedCards.splice(index, 1);
    return true;
  }
};

// Transaction service
export const transactionService = {
  async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.push(transaction);
    return transaction;
  },

  async getById(id: string): Promise<Transaction | undefined> {
    return transactions.find(transaction => transaction.id === id);
  },

  async getByCustomerId(customerId: string): Promise<Transaction[]> {
    return transactions.filter(transaction => transaction.customerId === customerId);
  },

  async update(id: string, data: Partial<Transaction>): Promise<Transaction | undefined> {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) return undefined;
    
    transactions[index] = { 
      ...transactions[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return transactions[index];
  }
};

// Payment intent service
export const paymentIntentService = {
  async create(data: Omit<PaymentIntent, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentIntent> {
    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    paymentIntents.push(paymentIntent);
    return paymentIntent;
  },

  async getById(id: string): Promise<PaymentIntent | undefined> {
    return paymentIntents.find(intent => intent.id === id);
  },

  async getByClientSecret(clientSecret: string): Promise<PaymentIntent | undefined> {
    return paymentIntents.find(intent => intent.clientSecret === clientSecret);
  },

  async update(id: string, data: Partial<PaymentIntent>): Promise<PaymentIntent | undefined> {
    const index = paymentIntents.findIndex(intent => intent.id === id);
    if (index === -1) return undefined;
    
    paymentIntents[index] = { 
      ...paymentIntents[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return paymentIntents[index];
  }
};

// Payment event service
export const paymentEventService = {
  async create(data: Omit<PaymentEvent, 'id' | 'createdAt'>): Promise<PaymentEvent> {
    const event: PaymentEvent = {
      id: `evt_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    paymentEvents.push(event);
    return event;
  },

  async getByTransactionId(transactionId: string): Promise<PaymentEvent[]> {
    return paymentEvents.filter(event => event.transactionId === transactionId);
  }
};

// Export all services
export const dbService = {
  customers: customerService,
  savedCards: savedCardService,
  transactions: transactionService,
  paymentIntents: paymentIntentService,
  paymentEvents: paymentEventService
};
