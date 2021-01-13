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
        host: 'mysql742.umbler.com',
        user: 'test-sa',
        password: 'Laranja10',
        database: 'challenge-bd-tes'
    }
});

export default connection;