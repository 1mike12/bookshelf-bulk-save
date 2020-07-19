const db = require("../test_helpers/database");
const User = require('../test_helpers/User');
const Comment = require("../test_helpers/Comment");

before(async () => {
    await db.refresh();
});

describe("plugin", function () {
    const UserCollection = db.bookshelf.Collection.extend({model: User});
    const CommentCollection = db.bookshelf.Collection.extend({model: Comment});

    it("should return empty array when nothing to insert", async () => {
        let emptyCollection = UserCollection.forge([]);
        let result = await emptyCollection.bulkSave();
        expect(result).true
    });

    it("should insert", async () => {
        let users = UserCollection.forge([{name: "bob", age: 20}]);
        let result = await users.bulkSave();
        expect(result).true

        let bob = await User.where("name", "bob").fetch();
        expect(bob.get("name")).equal("bob")
    });

    it("should trigger creating when custom id attribute not present", async () => {
        const commentCollection = CommentCollection.forge([
            {comment: "foo"},
        ]);
        let saved = await commentCollection.bulkSave()
        let c = await Comment.where({comment: "foo"}).fetch()
        expect(c.get("uuid")).equal("example-uuid")
    })

    it("should trigger updating when custom id attribute present", async () => {
        const commentCollection = CommentCollection.forge([
            {comment: "foo", uuid: "123"},
        ]);
        let saved = await commentCollection.bulkSave()
        let c = await Comment.where({uuid: "123"}).fetch()
        expect(c.get("comment")).equal("foo-updated")
    })
});