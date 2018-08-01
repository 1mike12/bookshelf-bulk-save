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

    it("should throw error when column cache not on", async () =>{
        let hasError = false;

        try {
            await userCollection.bulkSave();
        } catch (e) {
            hasError = true;
        }
        expect(hasError).to.be.true
    });

    it("ColumnCache should work", async () =>{
        db.bookshelf.plugin(require("bookshelf-column-cache"));
        let hasError = false;

        try {
            let boolean = await userCollection.bulkSave();
            expect(boolean).true;
            let newUsers2 = await User.fetchAll();
            expect(newUsers2.length).equal(2);
        } catch (e) {
            hasError = true;
        }
        expect(hasError).to.be.false;
    });

    it("should return empty array when nothing to insert", async () =>{
        db.bookshelf.plugin(require("bookshelf-column-cache"));
        let emptyCollection = Collection.forge([]);
        let result = await emptyCollection.bulkSave();
        expect(result).true
    });

    it("should insert", async () =>{
        db.bookshelf.plugin(require("bookshelf-column-cache"));

        let users = Collection.forge([{name: "bob"}]);
        let result = await users.bulkSave();
        expect(result).true

        let bob = await User.where("name", "bob").fetch();
        expect(bob.get("name")).equal("bob")
    });
});