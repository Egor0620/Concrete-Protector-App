/**
 * Created by tbbates on 5/11/15.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'contract';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            signatureid: {type: Sequelize.UUID},
            signaturedate: {type: Sequelize.UUID},
            templateid: {type: Sequelize.UUID},
            termid: {type: Sequelize.UUID},     // added term, header and footer ids to the contract
            headerid: {type: Sequelize.UUID},   // so that in the event the template changes
            footerid: {type: Sequelize.UUID},   // contracts can be recreated with the original source
            projectid: {type: Sequelize.UUID},
            price: {type: Sequelize.FLOAT},
            discount: {type: Sequelize.FLOAT},
            version: {type: Sequelize.BIGINT}

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

    return{
        Model: model
    };
};