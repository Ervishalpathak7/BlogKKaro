
// node_modules
import { configDotenv } from "dotenv";
import type ms from "ms"

configDotenv();

const config = {
    PORT : process.env.PORT || 3000,
    LOG_LEVEL : process.env.LOG_LEVEL || 'info',
    ENV : process.env.NODE_ENV || 'development',
    WHITELIST_OGIGIN : process.env.WHITET_ORIGIN!,
    MONGO_URI : process.env.MONGO_URI,
    APP_NAME : process.env.APP_NAME || "BlogKaro",
    DB_NAME : process.env.DB_NAME || "blogkaro",
    WHITELIST_EMAILS : process.env.WHITELIST_EMAILS!,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
    JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION as ms.StringValue ,
    JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION as ms.StringValue,
    
}

export default config;