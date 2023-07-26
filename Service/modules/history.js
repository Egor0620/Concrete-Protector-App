/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'history';

    function init() {
        dto =
        {
            id:         {type: Sequelize.STRING, unique: true, primaryKey: true},
            tablename:  {type: Sequelize.STRING},
            columnname: {type: Sequelize.STRING},
            fid:        {type: Sequelize.STRING},
            oldvalue:   {type: Sequelize.STRING},
            newvalue:   {type: Sequelize.STRING},
            action:     {type: Sequelize.STRING},
            setid:      {type: Sequelize.STRING}
        };
        dto = _.merge(dto, db.BaseEntity.addFields);
    }

    function model() {
        return db.Sequelize.define(
            tableName,
            dto,
            {
                tableName: tableName
            }
        );
    }

    init();

    return{
        Model: model
    };
};