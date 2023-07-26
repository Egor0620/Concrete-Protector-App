/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'projectdetail';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            projectid: {type: Sequelize.UUID},
            systemid: {type: Sequelize.UUID},
            area: {type: Sequelize.STRING},
            name: {type: Sequelize.STRING},
            arealength: {type: Sequelize.STRING},
            areawidth: {type: Sequelize.STRING},
            saleprice:{type: Sequelize.STRING},
            contractprice:{type: Sequelize.STRING},
            removed: {type: Sequelize.BOOLEAN}
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