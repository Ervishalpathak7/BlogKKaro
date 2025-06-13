import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';
import config from '@/config';
import logger from '@/lib/winston';

// Connection options for mongodb
const connectOptions : ConnectOptions = {
    appName : config.APP_NAME,
    dbName : config.DB_NAME,
    serverApi : {
        version : '1',
        strict : true,
        deprecationErrors : true
    },
    serverSelectionTimeoutMS : 5000
}

// Mongodb Connection
export const connectDb = async (): Promise<void> => {
  if (!config.MONGO_URI) throw new Error('No mongodb uri in configuration');
  try {
    await mongoose.connect(config.MONGO_URI , connectOptions);
    logger.info(`MongoDB connected successfully`)
  } catch (error) {
    logger.error(`Error connecting MongoDB ` , error);
    throw error;
  }
};

// Disconnect mongodb 
export const disconnectDb = async () : Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.warn(`MongoDB disconnected successfully`);
    } catch (error) {
        logger.error(`error disconnecting MongoDB ` , error);
        throw error;
    }
}

// Watch for runtime errors
mongoose.connection.on('error', (error) => {
  logger.error('🔥 Mongoose runtime error:', error);
});

