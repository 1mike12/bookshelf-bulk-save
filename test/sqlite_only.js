const db = require("../test_helpers/database");
const User = require('../test_helpers/User');

beforeEach(async () =>{
    await db.refresh();
});

describe("plugin", function(){
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


    it("should return empty array when nothing to insert", async () =>{
        let emptyCollection = Collection.forge([]);
        let result = await emptyCollection.bulkSave();
        expect(result).true
    });

    it("should insert", async () =>{
        let users = Collection.forge([{name: "bob"}]);
        let result = await users.bulkSave();
        expect(result).true

        let bob = await User.where("name", "bob").fetch();
        expect(bob.get("name")).equal("bob")
    });
});