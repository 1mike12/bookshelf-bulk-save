const DIALECTS_WITH_FULL_RETURN = ["pg", "oracledb", "mssql"];

module.exports = function (Bookshelf){
    Bookshelf.Collection = Bookshelf.Collection.extend({
        /**
         * @return {Promise<Array|Boolean>} returns array of JSON values of inserted items. Or true for databases that do not support return values
         */
        bulkSave: async function (){
            const IS_FULL_RETURN_DIALECT = DIALECTS_WITH_FULL_RETURN.includes(Bookshelf.knex.client.config.client)
            if(this.models.length === 0) {
                if(IS_FULL_RETURN_DIALECT) {
                    return [];
                } else {
                    return true;
                }
            }
            const tableName = this.model.prototype.tableName;
            if (tableName === undefined) throw new Error("no table name defined on model")

            //['created_at', null]
            let hasTimestamps = this.model.prototype.hasTimestamps;
            let createdAtName;
            let updatedAtName;

            if (hasTimestamps === true){
                createdAtName = "created_at"
                updatedAtName = "updated_at"
            } else if (Array.isArray(hasTimestamps)){
                createdAtName = hasTimestamps[0]
                updatedAtName = hasTimestamps[1]
            }

            let toInsert = [];
            let toUpdate = [];
            const now = new Date()
            for (let i = 0; i < this.models.length; i++) {
                let currentModel = this.models[i];
                let idName = currentModel.idAttribute
                let attributes = currentModel.attributes;

                //set timestamps
                if (hasTimestamps !== false && Array.isArray(hasTimestamps)){
                    if (createdAtName) attributes[createdAtName] = now
                    if (updatedAtName) attributes[updatedAtName] = now
                }

                //creating new
                if (attributes[idName] === undefined){
                    await currentModel.triggerThen("creating", currentModel)
                    toInsert.push(attributes)
                }
                //updating existing
                else {
                    await currentModel.triggerThen("updating", currentModel)
                    toUpdate.push(attributes)
                }
                await currentModel.triggerThen("saving", currentModel)

            }
            let insertedJson = []
            if (toInsert.length > 0){
                insertedJson = await Bookshelf.knex(tableName).insert(toInsert).returning("*");
            }

            let updatedJson = []
            if (toUpdate.length > 0){
                throw new Error("bulk updating not supported")
            }

            //only certain datbases return full data on rows, which we need to construct new collection.
            if (IS_FULL_RETURN_DIALECT){
                if (this.models.length !== insertedJson.length) throw new Error("to insert and inserted array not same length")
                for (let i = 0; i< this.models.length; i++){
                    const model = this.models[i];
                    await model.triggerThen("saved", model)
                    model.set(insertedJson[i])
                }
                return this
            } else {
                return true;
            }

        },
        forgeCollection : function(json){
            const Collection = Bookshelf.Collection.extend({
                model: this.model
            });
            if (json) {
                return Collection.forge(json)
            }
            return Collection.forge();
        }
    })
};