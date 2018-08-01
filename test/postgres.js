process.env.NODE_ENV = "postgres";
const db = require("../test_helpers/database");
const User = require('../test_helpers/User');

const Collection = db.bookshelf.Collection.extend({model: User});
const userCollection = Collection.forge([
    {
        name: "bob",
        foo: "bar",
        age: 20
    },
    {
        name: "joe",
        foo: "bar",
        age: 20
    }
]);

describe("postgres bulk save", function(){
    const Users = db.bookshelf.Collection.extend({model: User});
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

    it("should return full collection", async () =>{
        await db.refresh();
        db.bookshelf.plugin(require("bookshelf-column-cache"));
        let hasError = false;
        try {
            let users = await UserCollection.bulkSave();
            expect(users.length).equal(2);
            expect(typeof users !== "boolean").true;
            expect(Array.isArray(users)).true;
        } catch (e) {
            hasError = true;
        }
        expect(hasError).to.be.false
    });

});