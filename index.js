const DIALECTS_WITH_FULL_RETURN = new Set(["pg", "oracledb", "mssql"]);

module.exports = function (Bookshelf){
    Bookshelf.Collection = Bookshelf.Collection.extend({
        /**
         * @return {Promise<Array|Boolean>} returns array of JSON values of inserted items. Or true for databases that do not support return values
         */
        bulkSave: async function (){
            if(!Bookshelf.ColumnCache) throw new Error("plugin bookshelf-column-cache not found. Did you install it and add it?");
            if(this.models.length === 0) {
                if(DIALECTS_WITH_FULL_RETURN.has(Bookshelf.knex.client.config.client)) {
                    return [];
                } else {
                    return true;
                }
            }
            const tableName = this.model.prototype.tableName;
            const whiteListSet = await Bookshelf.ColumnCache.getColumnsForTable(tableName);

            let toInsert = [];
            let toUpdate = [];
            for (let i = 0; i < this.models.length; i++) {
                let currentModel = this.models[i];
                let attributes = currentModel.attributes;
                for (let key in attributes) {
                    if(!whiteListSet.has(key)) {
                        //for some reason attributes obj has no hasOwnProperty method ???!?
                        delete attributes[key];
                    }
                }
                toInsert.push(attributes)
            }
            let res = await Bookshelf.knex(tableName).insert(toInsert).returning("*");

            //only certain datbases return full data on rows, which we need to construct new collection.
            if(DIALECTS_WITH_FULL_RETURN.has(Bookshelf.knex.client.config.client)) {
                const collection = this.forgeCollection(res)
                return collection;
            } else {
                return true;
            }

        },
        forgeCollection: function (jsonArray){
            const Collection = Bookshelf.Collection.extend({
                model: this
            });
            if(jsonArray) {
                return Collection.forge(jsonArray)
            }
            return Collection.forge();
        }
    })
};