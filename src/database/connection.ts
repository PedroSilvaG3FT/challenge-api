import knex from "knex";
import { CONNECTION_DB, CONNECTION_DB_DEV } from "../config/connection-db";

const CONFIG_DB = process.env.IS_PRODUCTION ? CONNECTION_DB : CONNECTION_DB_DEV;

const connection = knex({ ...CONNECTION_DB_DEV });

export default connection;
