const DIALECTS_WITH_FULL_RETURN = new Set(["pg", "oracledb", "mssql"]);

module.exports = function (Bookshelf){
    Bookshelf.Collection = Bookshelf.Collection.extend({
        /**
         * @return {Promise<Array|Boolean>} returns array of JSON values of inserted items. Or true for databases that do not support return values
         */
        bulkSave: async function (){
            if(this.models.length === 0) {
                if(DIALECTS_WITH_FULL_RETURN.has(Bookshelf.knex.client.config.client)) {
                    return this.forgeCollection();
                } else {
                    return true;
                }
            }
            const tableName = this.model.prototype.tableName;
            //['created_at', null]
            let hasTimestamps = this.model.prototype.hasTimestamps;
            let createdAtName;
            let updatedAtName;

            if (hasTimestamps === true){
                createdAtName = "created_at"
                updatedAtName = "updated_at"
            } else if (Array.isArray(hasTimestamps)){
                let createdAtName = hasTimestamps[0]
                let updatedAtName = hasTimestamps[1]
            }

            let toInsert = [];
            let toUpdate = [];
            const now = new Date()
            for (let i = 0; i < this.models.length; i++) {
                let currentModel = this.models[i];
                let attributes = currentModel.attributes;
                if (hasTimestamps !== false && Array.isArray(hasTimestamps)){

                    if (createdAtName) attributes[createdAtName] = now
                    if (updatedAtName) attributes[updatedAtName] = now
                }
                //todo: need to check the idAttribute incase overriden default id
                if (attributes.id === undefined){
                    await currentModel.triggerThen("creating", currentModel)
                }
                toInsert.push(attributes)
            }
            let res = await Bookshelf.knex(tableName).insert(toInsert).returning("*");

            //only certain datbases return full data on rows, which we need to construct new collection.
            if (DIALECTS_WITH_FULL_RETURN.has(Bookshelf.knex.client.config.client)){
                return this.forgeCollection(res);
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