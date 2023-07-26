'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'countries';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID},
            country: {type: Sequelize.STRING}
        };
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