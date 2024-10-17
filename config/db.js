import { Sequelize } from "sequelize";
import config from "./config.js";

const environment='development'
const configEnv=config[environment]

const sequelize = new Sequelize(configEnv.database, configEnv.username, configEnv.password, {
    host: configEnv.host,
    dialect: configEnv.dialect,
  });
  
  export default sequelize;