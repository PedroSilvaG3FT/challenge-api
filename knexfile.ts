import path from 'path';
import { CONNECTION_DB } from './src/config/connection-db';

module.exports = {
    ...CONNECTION_DB,
    
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};