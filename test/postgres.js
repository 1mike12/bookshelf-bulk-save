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

before(async ()=> await db.refresh())
describe("postgres bulk save", function (){
    const Users = db.bookshelf.Collection.extend({model: User});
    const UserCollection = Users.forge([
        {
            name: "bob",
            age: 20
        },
        {
            name: "joe",
            age: 21
        }
    ]);

    it("should return full collection", async () => {
        let users = await UserCollection.bulkSave();
        expect(users.length).equal(2);
        expect(typeof users !== "boolean").equals(true);
    });

});