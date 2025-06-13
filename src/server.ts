// node_modules
import express from 'express';
import cors, { CorsOptions } from 'cors';

// custom_modules
import config from '@/config';
import logger from '@/config/winston';

// initialise the app with express
const app = express();

// cors configuration
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.ENV === 'development' ||
      !origin ||
      config.WHITELIST_OGIGIN.includes(origin)
    ) {
      callback(null, true);
    } else {
        callback(new Error(`Cors not allowed origin : ${origin}`) , false);
        logger.warn(`Cors not allowed origin : ${origin}`);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions));

(async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`Server started running on http://localhost:${config.PORT}`);
    });
  } catch (error) {}
})();
