'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'lead';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            personid: {type: Sequelize.UUID}
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

    var persmissions = {
        'read-write': 1,
        'read-only': 0
    };

    return{
        Model: model,
        Permissions: persmissions
    };
};