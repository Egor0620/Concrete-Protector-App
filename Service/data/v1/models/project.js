'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'project';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            leadid: {type: Sequelize.UUID},
            install: {type: Sequelize.STRING},
            completed: {type: Sequelize.STRING},
            designconsult: {type: Sequelize.STRING},
            addressid: {type: Sequelize.UUID},
            projectstatus: {type: Sequelize.STRING}
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