import { Sequelize } from "sequelize"; 
import config from "./config.js"; // Importing database config

const environment = 'development'; 
const configEnv = config[environment]; // Selecting config for the current environment

// Initializing Sequelize with database details from the config
const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  {
    host: configEnv.host,
    dialect: configEnv.dialect
  }
);

export default sequelize; // Exporting Sequelize instance
