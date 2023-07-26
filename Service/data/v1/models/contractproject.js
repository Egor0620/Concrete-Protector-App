/**
 * Created by tbbates on 5/11/15.
 */
'use strict';
module.exports = function (db) {
    var dto = {};
    var tableName = 'contractproject';

    function init() {
        dto =
        {
            id: {type: Sequelize.UUID, unique: true, primaryKey: true},
            leadid: {type: Sequelize.UUID},
            leadversion: {type: Sequelize.INTEGER},
            firstname: {type: Sequelize.STRING},
            lastname: {type: Sequelize.STRING},
            company: {type: Sequelize.STRING},
            leaddetailid: {type: Sequelize.UUID},
            leaddetailversion: {type: Sequelize.INTEGER},
            email: {type: Sequelize.STRING},
            besttimetocall: {type: Sequelize.STRING},
            addressid: {type: Sequelize.UUID},
            addressversion: {type: Sequelize.INTEGER},
            address1: {type: Sequelize.STRING},
            address2: {type: Sequelize.STRING},
            city: {type: Sequelize.STRING},
            state: {type: Sequelize.STRING},
            zip: {type: Sequelize.STRING},
            addresstype: {type: Sequelize.STRING},
            phoneid: {type: Sequelize.UUID},
            phoneversion: {type: Sequelize.INTEGER},
            phonenumber: {type: Sequelize.STRING},
            install: {type: Sequelize.DATE},
            completed: {type: Sequelize.DATE},
            designconsult: {type: Sequelize.DATE},
            projectid: {type: Sequelize.INTEGER},
            projectversion: {type: Sequelize.INTEGER},
            contractid: {type: Sequelize.UUID}
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