export const CONNECTION_DB = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}

export const CONNECTION_DB_DEV = {
    client: 'mysql',
    connection: {
        host: 'sql566.main-hosting.eu',
        port: '3306',
        user: 'u371677739_sa',
        password: 'Laranja10',
        database: 'u371677739_challengeBD'
    }
}