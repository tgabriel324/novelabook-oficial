
import { AES, enc } from 'crypto-js';

// Mock secret key for demonstration
// In a real app, this would be securely stored in environment variables
const DEFAULT_SECRET_KEY = "novelbook-payment-system-secret-key";

/**
 * Encrypts data using AES encryption
 * @param data Data to encrypt
 * @param secretKey Secret key for encryption
 * @returns Encrypted string
 */
export const encryptData = (data: any, secretKey = DEFAULT_SECRET_KEY): string => {
  try {
    const jsonString = JSON.stringify(data);
    return AES.encrypt(jsonString, secretKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypts data using AES encryption
 * @param encryptedData Encrypted string
 * @param secretKey Secret key for decryption
 * @returns Decrypted data
 */
export const decryptData = <T = any>(encryptedData: string, secretKey = DEFAULT_SECRET_KEY): T => {
  try {
    const bytes = AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(enc.Utf8);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Creates a hash for the provided data
 * @param data Data to hash
 * @returns Hashed string
 */
export const hashData = (data: string): string => {
  // In a real app, we would use a proper hashing algorithm
  // This is a simplified version for demonstration
  return Array.from(data)
    .reduce((hash, char) => {
      return (((hash << 5) - hash) + char.charCodeAt(0)) | 0;
    }, 0)
    .toString(16);
};

/**
 * Generates a secure random token of specified length
 * @param length Length of token
 * @returns Random token string
 */
export const generateSecureToken = (length = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  
  // In a real app, we would use crypto.getRandomValues()
  // This is a simplified version for demonstration
  for (let i = 0; i < length; i++) {
    randomValues[i] = Math.floor(Math.random() * chars.length);
  }
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length);
  }
  
  return result;
};

/**
 * Validates if a token has expired
 * @param createdAt ISO string date when token was created
 * @param expiresInMinutes Minutes until token expires
 * @returns Boolean indicating if token is still valid
 */
export const isTokenValid = (createdAt: string, expiresInMinutes = 60): boolean => {
  const tokenDate = new Date(createdAt).getTime();
  const currentDate = new Date().getTime();
  const expirationTime = tokenDate + (expiresInMinutes * 60 * 1000);
  
  return currentDate < expirationTime;
};

// Anti-fraud simple check (in a real system this would be much more sophisticated)
export const performFraudCheck = (
  transactionData: {
    amount: number;
    customerId: string;
    paymentMethod: string;
    ip?: string;
    userAgent?: string;
  }
): { passed: boolean; riskScore: number; reason?: string } => {
  // Simple risk scoring logic (for demonstration only)
  let riskScore = 0;
  
  // Check transaction amount
  if (transactionData.amount > 1000) {
    riskScore += 20; // Higher amounts increase risk
  }
  
  // Check IP address (mock check)
  if (transactionData.ip && transactionData.ip.startsWith('192.168')) {
    riskScore += 10; // Example of IP-based risk factor
  }
  
  // Determine result
  if (riskScore > 50) {
    return {
      passed: false,
      riskScore,
      reason: 'High risk transaction detected'
    };
  }
  
  return {
    passed: true,
    riskScore
  };
};
