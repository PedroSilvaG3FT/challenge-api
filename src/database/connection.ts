import knex from 'knex';
import { CONNECTION_DB } from '../config/connection-db';

const connection = knex({
    ...CONNECTION_DB
});

export default connection;