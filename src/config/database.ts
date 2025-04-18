import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { MONGODB_URI } from './config';

const connectDB = async (): Promise<void> => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      // These are recommended options for MongoDB Atlas
      retryWrites: true,
      w: 'majority',
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error during MongoDB connection closure', err as Error);
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error('Error connecting to MongoDB', error as Error);
    process.exit(1);
  }
};

export default connectDB;