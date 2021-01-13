import knex from 'knex';
import path from 'path';

const connection = knex({
    // client: 'sqlite3',
    // connection: {
    //     filename: path.resolve(__dirname, 'database.sqlite')
    // },
    // useNullAsDefault: true

    client: 'mysql',
    connection: {
        host: 'challenge90.mysql.database.azure.com',
        user: 'challenge@challenge90',
        password: 'Laranja10',
        database: 'challenge90-dev'
    }
});

export default connection;