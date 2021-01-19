import knex from 'knex';
import { CONNECTION_DB, CONNECTION_DB_DEV } from '../config/connection-db';

const configDB = process.env.IS_PRODUCTION ? CONNECTION_DB : CONNECTION_DB_DEV;

const connection = knex({
    ...configDB
});

export default connection;