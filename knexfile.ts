import path from "path";
import { CONNECTION_DB, CONNECTION_DB_DEV } from "./src/config/connection-db";

// const CONFIG_DB = process.env.IS_PRODUCTION ? CONNECTION_DB : CONNECTION_DB_DEV;

module.exports = {
  ...CONNECTION_DB,

  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
  useNullAsDefault: true,
};
