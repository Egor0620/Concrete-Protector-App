/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
/* indent: 2, node:true, nomen: true, maxlen: 80, vars: true*/


module.exports = function (app) {
    var pg = require('pg.js'),
        Sequelize = require('sequelize'),
        uuid = require('node-uuid'),
        config = app.config,
        db = {},
        theApp = {},
        skipProperties = ['id', 'added', 'addedby', 'changed', 'changedby'];

    function init() {
        try {
            theApp = app;
            db = new Sequelize(config.database, config.username, config.password, {
                host:              config.host,
                port:              config.port,
                dialect:           config.dialect,
                dialectModulePath: 'pg.js',
                define:            {
                    freezeTableName: true,
                    timestamps:      false
                }
            });
        }
        catch (e) {
            throw new Error(e);
        }
    }

    var baseEntity = {
        addFields:     {
            added:   {type: Sequelize.DATE, allowNull: false},
            addedby: {type: Sequelize.STRING}
        },
        changeFields:  {
            changed:   {type: Sequelize.DATE, allowNull: false},
            changedby: {type: Sequelize.STRING}
        },
        versionFields: {
            version: {type: Sequelize.INTEGER}
        },
        statusFields:  {
            status: {type: Sequelize.INTEGER}
        },
        removeFields:  {
            removed: {type: Sequelize.BOOLEAN}
        },
        permissionFields: {
            permission: {type: Sequelize.INTEGER}
        },
        links:         {

            //Order of operations
            // (1) beforeValidate(dao, fn)
            // (-) validate
            // (2) afterValidate(dao, fn)
            // (3) beforeBulkCreate(daos, fields, fn) / beforeBulkDestroy(daos, fields, fn) / beforeBulkUpdate(daos, fields, fn)
            // (4) beforeCreate(dao, fn) / beforeDestroy(dao, fn) / beforeUpdate(dao, fn)
            // (-) create / destroy / update
            // (5) afterCreate(dao, fn) / aftreDestroy(dao, fn) / afterUpdate(dao, fn)
            // (6) afterBulkCreate(daos, fields, fn) / afterBulkDestory(daos, fields, fn) / afterBulkUpdate(daos, fields, fn)

            beforeCreate: function (entity, cb) {
                processEntity(entity, cb, this.tableName);
            },
            beforeUpdate: function (entity, cb) {
                processEntity(entity, cb, this.tableName);
            }
        }
    };

    function processEntity(entity, cb, tableName) {

        var action = 'Update',
            setId = uuid.v4(),
            actionDate = new Date(),
            isUpdate = false,
            currentValues = entity.dataValues,
            previousValues = {};

        if (entity.isNewRecord === true) {
            action = 'Create';
            entity.added = actionDate;
        }
        else {
            isUpdate = true;
            entity.version += 1;
            entity.changed = actionDate;
            previousValues = entity.selectedValues;
        }

        for (var name in currentValues) {
            if (currentValues.hasOwnProperty(name)) {
                var skipLog = _.contains(skipProperties, name);
                var newValue = currentValues[name];

                var oldValue = '';
                var shouldUpdate = true;
                if (isUpdate) {
                    oldValue = previousValues[name];
                    shouldUpdate = (newValue !== oldValue);
                }

                if (!skipLog && shouldUpdate) {
                   // saveHistory(tableName, name, entity.id, oldValue, newValue, action, setId, actionDate, entity.addedby);
                    console.log('need to configure history');
                }
            }
        }

        cb();
    }

    function saveHistory(tableName, columnName, fid, oldValue, newValue, action, setId, actionDate, addedBy) {
        var modelHistory = app.entities.modules.history
            .build({
                id:         uuid.v4(),
                tablename:  tableName,
                columnname: columnName,
                fid:        fid,
                oldvalue:   oldValue,
                newvalue:   newValue,
                action:     action,
                setid:      setId,
                added:      actionDate,
                addedby:    addedBy
            });
        modelHistory.save()
            .success(function () {
                // you can now access the currently saved task with the variable anotherTask... nice!
            }).error(function (error) {
                // Ooops, do some error-handling
                console.log('create update history error: ', error);
            });
    }

    init();
    return{
        BaseEntity: baseEntity,
        Sequelize:    db
    };
};
