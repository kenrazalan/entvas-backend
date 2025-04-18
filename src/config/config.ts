import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3001;

// MongoDB
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/entvas';

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;

// Logging
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'; 