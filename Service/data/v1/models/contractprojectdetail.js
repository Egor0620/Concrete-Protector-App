/**
 * Created by tbbates on 5/11/15.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'contractprojectdetail';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            contractprojectid: {type: Sequelize.UUID},
            projectid: {type: Sequelize.UUID},
            projectdetailid: {type: Sequelize.UUID},
            projectdetailversion: {type: Sequelize.INTEGER},
            systemid: {type: Sequelize.UUID},
            systemversion: {type: Sequelize.INTEGER},
            systemname: {type: Sequelize.STRING},
            area: {type: Sequelize.STRING},
            systemsneeded: {type: Sequelize.STRING},
            arealength: {type: Sequelize.STRING},
            areawidth: {type: Sequelize.STRING},
            saleprice: {type: Sequelize.STRING}
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