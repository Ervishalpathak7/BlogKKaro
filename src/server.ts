/**
 * @copyright 2025 Vishal Pathak
 * @license Apache-2.0
 */

// node_modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';

// custom_modules
import config from '@/configs';
import logger from '@/lib/winston';
import rateLimiter from '@/configs/rateLimit';
import { connectDb, disconnectDb } from '@/configs/mongoose';
import router from '@/routes';

// initialise the app with express
const app = express();

// Server instance
let server: ReturnType<typeof app.listen>;

// cors configuration
app.use(
  cors({
    origin(origin, callback) {
      if (
        config.ENV === 'development' ||
        !origin ||
        config.WHITELIST_OGIGIN.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Cors not allowed origin : ${origin}`), false);
        logger.warn(`Cors not allowed origin : ${origin}`);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Enable Json and url-encoded data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable cookie-parsing
app.use(cookieParser());

// Enable compression for response bodies
app.use(
  compression({
    threshold: 1024,
  })
);

// Enable security headers
app.use(helmet());

// Enable Rate limiting
app.use(rateLimiter);

// Register routes
app.use('/api', router);

// Start the server with immidiately invoked async function (IIFE)
( async () => {
  try {
    // connect database
    await connectDb();
    server = app.listen(config.PORT, () => {
      logger.info(`Server started running on http://localhost:${config.PORT}`);
    });
  } catch (error) {}
})();

// Handle gracefull shutdown
const handleGracefulShutdown = async () => {
  try {
    logger.warn('Server is shutting down gracefully...');
    // Stop accepting new connections
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.error('Error while closing server:', err);
          return reject(err);
        }
        resolve();
      });
    });
    // Disconnect database
    await disconnectDb();
    logger.info('Shutdown complete..');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', handleGracefulShutdown); // Ctrl + C
process.on('SIGTERM', handleGracefulShutdown); // Termination signal 
