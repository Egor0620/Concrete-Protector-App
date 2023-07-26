'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'person';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            firstname: {type: Sequelize.STRING},
            lastname: {type: Sequelize.STRING},
            company: {type: Sequelize.STRING}
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

    return {
        Model: model
    };
};