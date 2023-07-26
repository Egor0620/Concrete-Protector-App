'use strict';
module.exports = function (db) {
    var dto = {},
    tableName = 'ingredient';
    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            name: {type: Sequelize.STRING},
            coverage: {type: Sequelize.STRING},
            purchaseprice: {type: Sequelize.STRING}
        };
        dto = _.merge(dto, db.BaseEntity.addFields);
        dto = _.merge(dto, db.BaseEntity.changeFields);
        dto = _.merge(dto, db.BaseEntity.versionFields);
        dto = _.merge(dto, db.BaseEntity.statusFields);
    }

    function model() {
        var result = db.Sequelize.define(
            tableName,
            dto,
            {
                tableName: tableName,
                hooks: db.BaseEntity.links
            });
        return result;
    }

    init();

    return {
        Model: model
    };
};