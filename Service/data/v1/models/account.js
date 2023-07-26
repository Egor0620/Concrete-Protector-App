/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
module.exports = function (db) {
    var dto = {},
        tableName = 'account';

    function init() {
        dto =
        {
            id:           {type: Sequelize.UUID, unique: true, primaryKey: true},
            username:     {type: Sequelize.STRING, isEmail: true},
            password:     {type: Sequelize.STRING},
            passwordtype: {type: Sequelize.INTEGER}
        };
        dto = _.merge(dto, db.BaseEntity.addFields);
        dto = _.merge(dto, db.BaseEntity.changeFields);
        dto = _.merge(dto, db.BaseEntity.versionFields);
        dto = _.merge(dto, db.BaseEntity.statusFields);
    }

    function model() {
        return db.Sequelize.define(
            tableName,
            dto,
            {
                tableName: tableName,
                hooks:     db.BaseEntity.links
            });
    }

    init();

    return{
        Model: model
    };
};