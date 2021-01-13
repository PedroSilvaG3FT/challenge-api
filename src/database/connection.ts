import knex from 'knex';

const connection = knex({
    client: 'mysql',
    connection: {
        host: 'mysql742.umbler.com',
        user: 'challenge90-sa',
        password: 'Laranja10',
        database: 'challenge90-bd'
    }
});

export default connection;