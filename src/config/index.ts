
// node_modules
import { configDotenv } from "dotenv";

configDotenv();

const config = {
    PORT : process.env.PORT || 3000,
}

export default config;