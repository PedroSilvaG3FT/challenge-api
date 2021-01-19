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
        host: 'mysql742.umbler.com',
        port: '41890',
        user: 'challenge-dev',
        password: 'Laranja10',
        database: 'challenge-bd-dev'
    }
}