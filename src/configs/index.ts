
// node_modules
import { configDotenv } from "dotenv";

configDotenv();

const config = {
    PORT : process.env.PORT || 3000,
    LOG_LEVEL : process.env.LOG_LEVEL || 'info',
    ENV : process.env.NODE_ENV || 'development',
    WHITELIST_OGIGIN : process.env.WHITET_ORIGIN!,
    MONGO_URI : process.env.MONGO_URI,
    APP_NAME : process.env.APP_NAME || "BlogKaro",
    DB_NAME : process.env.DB_NAME || "blogkaro",
    
}

export default config;