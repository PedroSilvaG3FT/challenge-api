import path from 'path';
import { CONNECTION_DB, CONNECTION_DB_DEV } from './src/config/connection-db';

console.log(process.env.IS_PRODUCTION);

const configDB = process.env.IS_PRODUCTION ? CONNECTION_DB : CONNECTION_DB_DEV;

console.log(configDB);

module.exports = {
    ...configDB,
    
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};