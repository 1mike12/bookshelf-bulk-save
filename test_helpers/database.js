const knexFile = require("./knexFile");
const knex = require('knex')(knexFile[process.env.NODE_ENV]);
const bookshelf = require("bookshelf")(knex);
bookshelf.plugin(require("../index"));

class Database {

    static async refresh(terminate = false){
        await Database.rollbackAllMigrations();
        await Database.latestMigrations();
        if (terminate) process.exit(0)
    }

    static async rollbackAllMigrations(){
        const migrate = knex.migrate;
        await migrate.forceFreeMigrationsLock()
        let m = await migrate.currentVersion(knexFile.migrations)
        if (m !== "none"){
            await migrate.rollback(knexFile.migrations)
            await Database.rollbackAllMigrations()
        } else {
            return
        }
    }


    static async latestMigrations(){
        await knex.migrate.latest();
    }
}

Database.knex = knex;
Database.bookshelf = bookshelf;

module.exports = Database;