const db = require("../test_helpers/database");
const User = require('../test_helpers/User');

before(async () =>{
    await db.latestMigrations();
});

describe("plugin", function(){
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

    it("should throw error when column cache not on", async () =>{
        let hasError = false;

        try {
            await UserCollection.bulkSave();
        } catch (e) {
            hasError = true;
        }
        expect(hasError).to.be.true
    });

    it("ColumnCache should work", async () =>{
        db.bookshelf.plugin(require("bookshelf-column-cache"));
        let hasError = false;

        try {
            let boolean = await UserCollection.bulkSave();
            expect(boolean).true;
            let newUsers2 = await User.fetchAll();
            expect(newUsers2.length).equal(2);
        } catch (e) {
            hasError = true;
        }
        expect(hasError).to.be.false;

    });
});