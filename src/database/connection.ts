import knex from 'knex';

const connection = knex({
    client: 'mysql',
    connection: {
        host: 'challenge90.mysql.database.azure.com',
        user: 'challenge@challenge90',
        password: 'Laranja10',
        database: 'challenge90-dev'
    }
});

export default connection;