'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'addresstype';

    function init() {
        dto =
        {
            addresstype: {type: Sequelize.STRING}
        };
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

    return{
        Model: model
    };
};