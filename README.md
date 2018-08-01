# Bookshelf Bulk Save
This plugin works with Bookshelf.js, available here http://bookshelfjs.org.

Bookshelf natively does not come with a bulk insert option. Instead the only option is to use `invokeThen("save")` on collections. The underlying knex library does however have bulk inserts.

This does not run updates, as bulk updates are not supported natively by knex.

This plugin adds a `bulkSave()` method to Collection objects. If your db dialect supports it, it will also return a new Collection with the updated ids for any new models you save, similar to how `save()` on a single model returns the updated model. As of writing this is (pg, mssql, oracledb). Otherwise it will simply return true on successful insert.

All models are cleaned of any column names that aren't in the relevant table. It does this by relying on [bookshelf-column-cache](https://github.com/1mike12/bookshelf-column-cache) to check for a whitelist of valid column names.

requires es6 syntax to work.

## Installation
``` javascript
npm install bookshelf-bulk-insert bookshelf-column-cache
```
Then in your bookshelf configuration:
``` javascript
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-column-cache');
bookshelf.plugin(require('bookshelf-bulk-insert');
```

Usage
``` javascript
//migration
module.exports = {
    up: (knex, Promise) =>{
        return knex.schema.createTableIfNotExists("users", function(table){
            table.increments();
            table.string("name");
        });
    },
    down: (knex, Promise) =>{
        return knex.schema.dropTableIfExists("users")
    }
};

//to insert
const Users = bookshelf.Collection.extend({model: User});
const UserCollection = Users.forge([
    {
        name: "bob",
        foo: "bar"
    },
    {
        name: "joe",
        foo: "bar"
    }
]);

let users = await UserCollection.bulkSave();

//if using one of the supported dialects that returns inserted rows
//users = [{id: 1, name: "bob}, {id:2, name: "joe"}]


```
