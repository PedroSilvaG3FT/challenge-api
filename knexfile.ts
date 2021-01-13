import path from 'path';

module.exports = {
    // client: 'sqlite3',
    // connection: {
    //     filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    // },
    client: 'mysql',
    connection: {
        host: 'challenge90.mysql.database.azure.com',
        user: 'challenge@challenge90',
        password: 'Laranja10',
        database: 'challenge90-dev'
    },
    
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};