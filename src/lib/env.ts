// Environment variables management
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',

  // NextAuth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',

  // API Keys (for financial integrations)
  BANK_API_KEY: process.env.BANK_API_KEY || '',
  INSURANCE_API_KEY: process.env.INSURANCE_API_KEY || '',

  // Cloud Storage
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',

  // Blockchain (optional)
  BLOCKCHAIN_RPC_URL: process.env.BLOCKCHAIN_RPC_URL || '',

  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const isDev = () => env.NODE_ENV === 'development';
export const isProd = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';

// Required env vars check
export const checkRequiredEnvVars = () => {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
  ];

  const missing = required.filter(key => !env[key as keyof typeof env]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
