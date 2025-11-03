import dotenv from 'dotenv';

// Load .env file
dotenv.config({ path: '.env' });

// Export variables individually
export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || '';


export const JWT_SECRET: string = process.env.JWT_SECRET!;

export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN! || '1h';

// Bcrypt salt rounds
export const BCRYPT_SALT_ROUNDS: number = parseInt(process.env.BCRYPT_SALT_ROUNDS! || '10', 10);
