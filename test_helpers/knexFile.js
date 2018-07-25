
module.exports = {
    test: {
        client: 'sqlite3',
        connection: {
            filename: ":memory:"
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: true

    },
    postgres: {
        client: 'pg',
        connection: {
            charset: 'utf8',
            host: "localhost",
            port: "5432",
            user: "mike",
            password: "123",
            database: "bookshelf_bulk_insert"
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: true
    },
    development: {
        client: 'sqlite3',
        connection: {
            filename: ":memory:"
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: true

    },
};