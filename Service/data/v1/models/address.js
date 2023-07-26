/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
module.exports = function (db) {
    var dto = {},
        tableName = 'address';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            personid: {type: Sequelize.UUID},
            address1: {type: Sequelize.STRING},
            address2: {type: Sequelize.STRING},
            city: {type: Sequelize.STRING},
            state: {type: Sequelize.STRING},
            zip: {type: Sequelize.STRING},
            type: {type: Sequelize.STRING},
            primary: {type: Sequelize.BOOLEAN}
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
                hooks: db.BaseEntity.links
            });
    }

    init();

    return{
        Model: model
    };
};