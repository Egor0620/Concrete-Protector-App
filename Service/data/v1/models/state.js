'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'states';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, allowNull: false},
            countryid: {type: Sequelize.UUID},
            state: {type: Sequelize.STRING}
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

    return{
        Model: model
    };
};