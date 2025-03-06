
import { 
  PaymentMethod, 
  CardDetails, 
  PixDetails, 
  BoletoDetails,
  PurchaseReceipt 
} from "@/lib/data/paymentTypes";
import { 
  PaymentProcessingResponse,
  Transaction
} from "@/lib/data/databaseTypes";
import { Novel } from "@/lib/data/types";
import { dbService } from "../database/dbService";
import { 
  createPaymentIntent as createStripePaymentIntent,
  confirmCardPayment,
  saveCardForFutureUse,
  generateStripeReceipt 
} from "../payment/stripeService";
import {
  generatePixPayment,
  checkPixPaymentStatus,
  generatePixReceipt
} from "../payment/pixService";
import {
  generateBoleto,
  checkBoletoStatus,
  generateBoletoReceipt
} from "../payment/boletoService";
import { encryptData, decryptData } from "./securityService";

// Constants for encryption
const PAYMENT_DATA_ENCRYPTION_KEY = "mock-encryption-key-for-payment-data";

// Process a credit card payment
export const processCardPayment = async (
  novel: Novel,
  userId: string,
  cardDetails: CardDetails
): Promise<PaymentProcessingResponse> => {
  try {
    console.log(`Processing card payment for novel ${novel.id} by user ${userId}`);
    
    // Get or create customer
    let customer = await dbService.customers.getByUserId(userId);
    if (!customer) {
      customer = await dbService.customers.create({
        userId,
        email: cardDetails.cardHolder,
        name: cardDetails.cardHolder,
      });
    }
    
    // Create a payment intent with Stripe
    const { clientSecret, paymentIntentId } = await createStripePaymentIntent(novel.price || 0);
    
    // Create payment intent in our database
    const paymentIntent = await dbService.paymentIntents.create({
      customerId: customer.id,
      amount: novel.price || 0,
      currency: "BRL",
      status: "requires_confirmation",
      clientSecret,
      paymentMethod: "credit_card",
      stripePaymentIntentId: paymentIntentId,
      metadata: {
        novelId: novel.id,
        novelTitle: novel.title
      }
    });
    
    // Create a transaction record
    const transaction = await dbService.transactions.create({
      customerId: customer.id,
      novelId: novel.id,
      amount: novel.price || 0,
      currency: "BRL",
      paymentMethod: "credit_card",
      status: "pending",
      stripePaymentIntentId: paymentIntentId,
      metadata: {
        paymentIntentId: paymentIntent.id
      }
    });
    
    // Encrypt sensitive card data for logging purposes
    const encryptedCardData = encryptData({
      last4: cardDetails.cardNumber.slice(-4),
      cardHolder: cardDetails.cardHolder
    }, PAYMENT_DATA_ENCRYPTION_KEY);
    
    // Log payment event
    await dbService.paymentEvents.create({
      transactionId: transaction.id,
      type: "payment_intent.created",
      status: "pending",
      data: {
        paymentIntentId,
        encryptedCardData
      }
    });
    
    return {
      success: true,
      transactionId: transaction.id,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.clientSecret,
      status: "requires_confirmation",
      message: "Pagamento iniciado, confirmação necessária"
    };
  } catch (error) {
    console.error("Error processing card payment:", error);
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Falha ao processar pagamento com cartão"
    };
  }
};

// Confirm a credit card payment
export const confirmCardPaymentProcess = async (
  clientSecret: string,
  paymentMethodId: string,
  saveCard: boolean = false,
  userId: string
): Promise<PaymentProcessingResponse> => {
  try {
    // Get payment intent from our database
    const paymentIntent = await dbService.paymentIntents.getByClientSecret(clientSecret);
    if (!paymentIntent) {
      throw new Error("Payment intent not found");
    }
    
    // Get transaction
    const transactions = await dbService.transactions.getByCustomerId(paymentIntent.customerId);
    const transaction = transactions.find(t => 
      t.metadata?.paymentIntentId === paymentIntent.id
    );
    
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    
    // Simulate confirming the payment with the payment processor
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update payment intent status
    await dbService.paymentIntents.update(paymentIntent.id, {
      status: "succeeded"
    });
    
    // Update transaction status
    await dbService.transactions.update(transaction.id, {
      status: "completed"
    });
    
    // Log payment event
    await dbService.paymentEvents.create({
      transactionId: transaction.id,
      type: "payment_intent.succeeded",
      status: "completed",
      data: {
        paymentIntentId: paymentIntent.id
      }
    });
    
    // Save card for future use if requested
    if (saveCard) {
      const customer = await dbService.customers.getById(paymentIntent.customerId);
      if (customer) {
        // Save a simulated card to our database
        await dbService.savedCards.create({
          customerId: customer.id,
          last4: "4242", // Example last 4 digits
          brand: "visa",
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          stripePaymentMethodId: paymentMethodId
        });
      }
    }
    
    return {
      success: true,
      transactionId: transaction.id,
      status: "completed",
      message: "Pagamento processado com sucesso",
      receiptUrl: `/receipts/${transaction.id}`
    };
  } catch (error) {
    console.error("Error confirming card payment:", error);
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Falha ao confirmar pagamento com cartão"
    };
  }
};

// Process a PIX payment
export const processPixPayment = async (
  novel: Novel,
  userId: string
): Promise<PaymentProcessingResponse> => {
  try {
    console.log(`Processing PIX payment for novel ${novel.id} by user ${userId}`);
    
    // Get or create customer
    let customer = await dbService.customers.getByUserId(userId);
    if (!customer) {
      customer = await dbService.customers.create({
        userId,
        email: "customer@example.com", // In a real app, we'd have this data
        name: "Customer Name",
      });
    }
    
    // Generate PIX payment details
    const pixDetails = await generatePixPayment(novel.price || 0, novel.id, userId);
    
    // Create a transaction record
    const transaction = await dbService.transactions.create({
      customerId: customer.id,
      novelId: novel.id,
      amount: novel.price || 0,
      currency: "BRL",
      paymentMethod: "pix",
      status: "pending",
      pixTransactionId: pixDetails.transactionId,
      metadata: {
        pixKey: pixDetails.key,
        expiresAt: pixDetails.expiresAt
      }
    });
    
    // Log payment event
    await dbService.paymentEvents.create({
      transactionId: transaction.id,
      type: "payment_intent.created",
      status: "pending",
      data: {
        pixKey: pixDetails.key,
        expiresAt: pixDetails.expiresAt
      }
    });
    
    return {
      success: true,
      transactionId: transaction.id,
      status: "pending",
      message: "Pagamento via PIX iniciado, aguardando confirmação",
      redirectUrl: `/payment/pix/${transaction.id}`
    };
  } catch (error) {
    console.error("Error processing PIX payment:", error);
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Falha ao processar pagamento via PIX"
    };
  }
};

// Process a Boleto payment
export const processBoletoPayment = async (
  novel: Novel,
  userId: string,
  customerInfo: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    }
  }
): Promise<PaymentProcessingResponse> => {
  try {
    console.log(`Processing Boleto payment for novel ${novel.id} by user ${userId}`);
    
    // Get or create customer
    let customer = await dbService.customers.getByUserId(userId);
    if (!customer) {
      customer = await dbService.customers.create({
        userId,
        email: customerInfo.email,
        name: customerInfo.name,
      });
    }
    
    // Generate Boleto details
    const boletoDetails = await generateBoleto(
      novel.price || 0,
      novel.id,
      userId,
      customerInfo
    );
    
    // Create a transaction record
    const transaction = await dbService.transactions.create({
      customerId: customer.id,
      novelId: novel.id,
      amount: novel.price || 0,
      currency: "BRL",
      paymentMethod: "boleto",
      status: "pending",
      boletoTransactionId: boletoDetails.transactionId,
      metadata: {
        boletoCode: boletoDetails.code,
        expiresAt: boletoDetails.expiresAt,
        boletoUrl: boletoDetails.url
      }
    });
    
    // Log payment event
    await dbService.paymentEvents.create({
      transactionId: transaction.id,
      type: "payment_intent.created",
      status: "pending",
      data: {
        boletoCode: boletoDetails.code,
        expiresAt: boletoDetails.expiresAt
      }
    });
    
    return {
      success: true,
      transactionId: transaction.id,
      status: "pending",
      message: "Boleto gerado com sucesso, aguardando pagamento",
      redirectUrl: `/payment/boleto/${transaction.id}`
    };
  } catch (error) {
    console.error("Error processing Boleto payment:", error);
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Falha ao gerar boleto"
    };
  }
};

// Check payment status
export const checkPaymentStatus = async (
  transactionId: string
): Promise<PaymentProcessingResponse> => {
  try {
    const transaction = await dbService.transactions.getById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    
    let status = transaction.status;
    let message = "Status do pagamento obtido com sucesso";
    
    // For pending transactions, check with the payment provider
    if (transaction.status === "pending") {
      if (transaction.paymentMethod === "pix" && transaction.pixTransactionId) {
        const pixStatus = await checkPixPaymentStatus(transaction.pixTransactionId);
        if (pixStatus.status === "completed") {
          status = "completed";
          await dbService.transactions.update(transactionId, { status });
          await dbService.paymentEvents.create({
            transactionId,
            type: "pix.received",
            status: "completed",
            data: { pixStatus }
          });
        } else if (pixStatus.status === "expired") {
          status = "failed";
          await dbService.transactions.update(transactionId, { status });
          await dbService.paymentEvents.create({
            transactionId,
            type: "pix.expired",
            status: "failed",
            data: { pixStatus }
          });
        }
        message = pixStatus.message;
      } 
      else if (transaction.paymentMethod === "boleto" && transaction.boletoTransactionId) {
        const boletoStatus = await checkBoletoStatus(transaction.boletoTransactionId);
        if (boletoStatus.status === "completed") {
          status = "completed";
          await dbService.transactions.update(transactionId, { status });
          await dbService.paymentEvents.create({
            transactionId,
            type: "boleto.paid",
            status: "completed",
            data: { boletoStatus }
          });
        } else if (boletoStatus.status === "expired") {
          status = "failed";
          await dbService.transactions.update(transactionId, { status });
          await dbService.paymentEvents.create({
            transactionId,
            type: "boleto.expired",
            status: "failed",
            data: { boletoStatus }
          });
        }
        message = boletoStatus.message;
      }
    }
    
    return {
      success: true,
      transactionId,
      status,
      message
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Falha ao verificar status do pagamento"
    };
  }
};

// Generate receipt for completed payment
export const generatePaymentReceipt = async (
  transactionId: string
): Promise<PurchaseReceipt | null> => {
  try {
    const transaction = await dbService.transactions.getById(transactionId);
    if (!transaction || transaction.status !== "completed") {
      return null;
    }
    
    // Get novel information
    // In a real app, this would fetch from a database
    const novel: Novel = {
      id: transaction.novelId,
      title: "Novel Title", // Placeholder
      author: { id: "author_id", name: "Author Name" },
      cover: "/placeholder.jpg",
      status: "published",
      price: transaction.amount,
      description: "Description",
      categories: [],
      tags: [],
      reads: 0,
      purchases: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    // Generate receipt based on payment method
    if (transaction.paymentMethod === "credit_card") {
      return generateStripeReceipt(novel, transactionId, transaction.customerId);
    } else if (transaction.paymentMethod === "pix") {
      return generatePixReceipt(novel, transactionId, transaction.customerId);
    } else if (transaction.paymentMethod === "boleto") {
      return generateBoletoReceipt(novel, transactionId, transaction.customerId);
    }
    
    return null;
  } catch (error) {
    console.error("Error generating receipt:", error);
    return null;
  }
};
