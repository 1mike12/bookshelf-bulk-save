# Bookshelf Bulk Save
This plugin works with Bookshelf.js, available here http://bookshelfjs.org.

Bookshelf natively does not come with a bulk insert option. Instead the only option is to use `invokeThen("save")` on collections. The underlying knex library does however have bulk inserts.

This does not run updates, as bulk updates are not supported natively by knex.

This plugin adds a `bulkSave()` method to Collection objects. If your db dialect supports it, it will also return the inserted JSON data, similar to how `save()` on a single model returns the updated model. As of writing this is (pg, mssql, oracledb). Otherwise it will simply return `true` on successful insert.

requires es6 syntax to work.

## Installation
``` javascript
npm install bookshelf-bulk-save
```
Then in your bookshelf configuration:
``` javascript
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-bulk-save');
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
