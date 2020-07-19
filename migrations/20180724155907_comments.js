const Comment = require("../test_helpers/Comment")

module.exports = {
    up: (knex, Promise) =>{
        return knex.schema.createTableIfNotExists(Comment.TABLE_NAME, function(table){
            table.string("uuid")
            table.string("comment");
        });
    },
    down: (knex, Promise) =>{
        return knex.schema.dropTableIfExists(Comment.TABLE_NAME)
    }
};