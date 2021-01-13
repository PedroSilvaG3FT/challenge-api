import path from 'path';

module.exports = {
    client: 'mysql',
    connection: {
        host: 'mysql742.umbler.com',
        user: 'challenge90-sa',
        password: 'Laranja10',
        database: 'challenge90-bd'
    },
    
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};