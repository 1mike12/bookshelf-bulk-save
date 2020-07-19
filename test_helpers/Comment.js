const bookshelf = require("../test_helpers/database").bookshelf;

class Comment extends bookshelf.Model {

    initialize() {
        this.on("creating", model => {
            model.set("uuid", "example-uuid")
        })

        this.on("updating", model=> {
            model.set("comment", model.get("comment") + "-updated")
        })
    }

    get tableName() {return "comments"}
    get idAttribute(){
        return "uuid"
    }
}
Comment.TABLE_NAME = 'comments';
module.exports = Comment