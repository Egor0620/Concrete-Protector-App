/**
 * Created by tbbates on 5/11/15.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'contracttemplate';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            name: {type: Sequelize.STRING},
            termid: {type: Sequelize.UUID},
            headerid: {type: Sequelize.UUID},
            footerid: {type: Sequelize.UUID},
            type: {type: Sequelize.STRING},
            layoutid: {type: Sequelize.UUID}
        };
        dto = _.merge(dto, db.BaseEntity.addFields);
        dto = _.merge(dto, db.BaseEntity.changeFields);
        dto = _.merge(dto, db.BaseEntity.versionFields);
        dto = _.merge(dto, db.BaseEntity.statusFields);
        dto = _.merge(dto, db.BaseEntity.removeFields);
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

    return {
        Model: model
    };
};