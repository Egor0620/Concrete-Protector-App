/**
 * Created by tbbates on 5/11/15.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'contractprojectdetailingredient';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            signatureid: {type: Sequelize.UUID},
            templateid: {type: Sequelize.UUID},
            termid: {type: Sequelize.UUID},
            headerid: {type: Sequelize.UUID},
            footerid: {type: Sequelize.UUID},
            projectid: {type: Sequelize.UUID},
            price: {type: Sequelize.STRING},
            discount: {type: Sequelize.STRING},
            contractprojectdetailid: {type: Sequelize.UUID},
            projectdetailid: {type: Sequelize.UUID},
            projectdetailversion: {type: Sequelize.INTEGER},
            ingredientid: {type: Sequelize.UUID},
            ingredientversion: {type: Sequelize.INTEGER},
            ingredientname: {type: Sequelize.STRING},
            ingredientcoverage: {type: Sequelize.INTEGER},
            ingredientpurchaseprice: {type: Sequelize.STRING},
            colorid: {type: Sequelize.UUID},
            colorversion: {type: Sequelize.INTEGER},
            colorname: {type: Sequelize.STRING},
            patternid: {type: Sequelize.UUID},
            patternversion: {type: Sequelize.INTEGER},
            patternname: {type: Sequelize.STRING}
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