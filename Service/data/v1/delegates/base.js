/**
 * Created by tbbates on 7/18/14.
 */
'use strict';
module.exports = function () {
    var Q = require('q'),
        uuid = require('node-uuid'),
        postal = require('postal');

    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

    function guidSearchFormat(ids){
        var result = [];

        _.each(ids, function(id){
            var innerResult = '\'{0}\''.format(id);
            if(_.where(result, innerResult).length === 0){
                result.push(innerResult);
            }
        });
        return result;
    }

    function fixSqlResult(sqlResult){
        return JSON.parse(JSON.stringify(sqlResult));
    }


    /*
     * This will return an entity, if build is specified a new non persisted model will be returned, otherwise the promise is rejected
     * @param entity
     * @param criteria
     * @param build
     * @returns {promiseAndHandler.promise|*|promise|Promise._progressUnchecked.promise|PromiseResolver.promise|module.exports.Reduction.promise}
     */
    function getEntity(entity, criteria, build) {
        var deferred = Q.defer();
        try {
            entity
                .find(
                criteria
            )
                .success(function (searchResult) {
                    if (!searchResult) {
                        if (!build) {
                            return deferred.reject({message : 'no model can be found matching the criteria: ' + JSON.stringify(criteria), code : 404 });
                        }
                        var newEntity = entity.build();
                        return deferred.resolve(newEntity);
                    }
                    return deferred.resolve(searchResult);
                })
                .error(function (e) {
                    return deferred.reject({message : e, code : 500 });
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 500 });
        }
        return deferred.promise;
    }

    function getEntityModels(app, entity, sql) {
        var deferred = Q.defer();
        try {

            app.db.Sequelize.query(sql, entity)
                .error(function (error) {
                    return deferred.reject(error);
                })
                .success(function (results) {
                    return deferred.resolve(results);
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 500 });
        }
        return deferred.promise;
    }

    /*
     * This will remove an entity, otherwise the promise is rejected
     * @param entity
     * @param criteria
     * @param build
     * @returns {promiseAndHandler.promise|*|promise|Promise._progressUnchecked.promise|PromiseResolver.promise|module.exports.Reduction.promise}
     */
    function deleteEntity(entity, criteria) {
        var deferred = Q.defer();
        try {
            entity
                .find(
                criteria
            )
                .success(function (searchResult) {
                    if (searchResult) {
                        searchResult.destroy()
                            .success(function (removed) {
                                return deferred.resolve(removed);
                            });
                    }
                    else {
                        return deferred.reject({message : 'entity not found', code : 404 });
                    }

                })
                .error(function (e) {
                    return deferred.reject({message : e, code : 500 });
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 500 });
        }
        return deferred.promise;
    }

    /*
     * This will return an entity, if build is specified a new non persisted model will be returned, otherwise the promise is rejected
     * @param entity
     * @param criteria
     * @returns {promiseAndHandler.promise|*|promise|Promise._progressUnchecked.promise|PromiseResolver.promise|module.exports.Reduction.promise}
     */
    function getEntites(entity, criteria) {
        var deferred = Q.defer(),
            innerCriteria = criteria || {};
        try {
            entity
                .findAll(
                innerCriteria
            )
                .success(function (searchResult) {
                    return deferred.resolve(searchResult);
                })
                .error(function (e) {
                    return deferred.reject({message : e, code : 500 });
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 500 });
        }
        return deferred.promise;
    }

    function populate(source, model) {

    }


    /*
     * @param source - this is the body of the post/put
     * @param destination - this is the DTO
     * @param actionDate - date that action is happening
     * @param changePerson - who is making the change
     * @param isNew - is this a new object (i.e. an insert)?
     */
    function populateDefaults(source, destination, actionDate, changePerson, isNew) {

        if (isNew) {
            if (!destination.id || destination.id.length === 0) {
                destination.id = uuid.v4();
            }

            destination.status = 1;
            destination.added = actionDate;
            destination.addedby = changePerson;
        } else {
            if (source.id && source.id.length !== 0) {
                destination.id = source.id;
            }


            if (source.status) {
                destination.status = source.status;
            }
            if (source.version) {
                destination.version = source.version;
            }

        }
        destination.changed = actionDate;
        destination.changedby = changePerson;

    }

    /*
     * Populates an entity from a service call
     * @param source = form/body that was posted
     * @param destination = the entity
     * @param isNew = is the entity new
     * @param errors = the errors
     */
    function verifyDefaults(source, destination, errors, isNew) {
        if (isNew) {

            if (!source.id) {
                errors.push('missing id');
            } else {
                destination.id = source.id;
            }

            if (!source.status) {
                errors.push('missing status');
            } else {
                destination.status = source.status;
            }

            if (source.added) {
                destination.added = source.added;
            }

            if (source.addedby) {
                destination.addedby = source.addedby;
            }

            if (source.changed) {
                destination.changed = source.changed;
            }
            if (source.changedby) {
                destination.changedby = source.changedby;
            }
        }

        if (destination.status) {
            if (!source.status && isNew) {
                destination.status = 0;
            } else if (source.status) {
                destination.status = source.status;
                destination.hasChanges = true;
            }
        }
        var versionProcessed = false;
        if (isNew) {
            destination.version = 0;
        }
        else {
            if (!source.version) {
                if (parseInt(source.version, 10) === 0) {
                    destination.version = parseInt(destination.version, 10);
                }
                else {
                    errors.push('missing version');
                }
                versionProcessed = true;

            }
            if (!versionProcessed && (source.version && source.version.length === 0)) {
                errors.push('missing version');
                versionProcessed = true;
            }
            if (!versionProcessed && (source.version && source.version.length !== 0)) {
                destination.version = parseInt(source.version, 10);

                if (destination.version > source.version) {
                    errors.push('Another user has updated the model');
                }
                versionProcessed = true;
            }
        }
    }

    /* Saves the model
     * @param model    Sequelize data model for data being saved (REQUIRED!)
     * @param src      Source data to be saved;
     * @param t        Database transaction to  wrap in (OPTIONAL).
     * @returns {*}
     */
    function save(model, src, t) {
        // Initialize
        var deferred = Q.defer(),
            transaction = {};

        if (t) {
            transaction = {transaction: t};
        }
        if (!model) {
            return deferred.reject({message : 'model object missing', code : 420 });
        }
        if (!src) {
            return deferred.reject({message : 'source object missing', code : 420 });
        }

        if (!src.id) {
            return deferred.reject({message : 'missing id, not able to insert or update', code : 420 });
        }

        try {


            model.save(model, transaction)
                .then(
                function (saveddata) {
                    deferred.resolve(saveddata);
                },
                function (failure) {
                    return deferred.reject({message : failure.message || failure, code : 500 });
                }
            );
        } catch (e) {
            return deferred.reject({message : e, code : 500 });
        }

        return deferred.promise;
    }

    function getCriteria(source, criteria) {
        var options = _.pluck(source, criteria);
        var resultArray = [];

        for (var name in options) {
            var value = options[name];
            if (value) {
                if (options.hasOwnProperty(name)) {
                    resultArray.push(value);
                }
            }
        }
        return resultArray;
    }

    function getSearchCriteria(source, searchCriteria) {

        var resultArray = getCriteria(source, searchCriteria);
        var result = {};

        if (resultArray.length !== 0) {
            result[searchCriteria] = resultArray;
        }
        else {
            result = '';
        }

        return result;
    }

    function buildWhere(property, items, operator) {

        //http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format?lq=1
        var result = '';
        for (var i = 0; i < items.length; i++) {
            if (result.length !== 0) {
                result += ' OR ';
            }
            var val = items[i].trim();
            if (val !== '') {
                //result += " (personid = '" + val + "') ";
                result += '({0} {1} "{2}")'.format(property, operator, val);
            }
        }

        return result;
    }

    function buildSaveArray(itemsToSave, dtoItems, entity, dto) {
        itemsToSave.push(entity);
        dtoItems.push(dto);
    }
/*
    channel = postal.channel(objectType)
    function listener() {
        if (channel.bus.subscriptions && channel.bus.subscriptions.team) {
            return;
        }
        channel.subscribe(objectType + '.updated', function (data) {
            console.log(objectType + ' updated', data);
        });

        channel.subscribe(objectType + '.created', function (data) {
            console.log(objectType + ' created', data);
        });

    }
*/
    function subscribe(objectType, subscriptions){
        var channel = postal.channel();
        if(channel.bus.subscriptions[objectType]){
            return;
        }

        _.each(subscriptions, function(sub){
           channel.subscribe(sub.type, sub.delegate);
        });

    }

    function publish(objectType, type, data){
        var channel = postal.channel();
        channel.publish(type, data);
    }

    function ownership(app, person, objectType) {
        var model = require('./../models/' + objectType)(app.db).Model();
        var sql = [
            'select a.* from ' + objectType + ' a where a.addedby = \'{0}\''.format(person)
        ].join();
        return getEntityModels(app, model, sql);
    }

    function teamMembership(app, person, objectType, permission) {
        var model = require('./../models/' + objectType)(app.db).Model();
        var sql = [
            'select  a.* from ' + objectType + ' a inner join team b on a.addedby = b.addedby where  b.personid = \'{0}\' and b.permission & {1} > 0'.format(person, permission)
        ].join();
        return getEntityModels(app, model, sql);
    }
/*
    function membership(app, changeUser, addedby, permission) {
        var model = require('./../models/' + objectType)(app.db).Model();
        var person = changeUser;
        var sql = 'select * from ' + objectType + ' where personid = \'{0}\' and permission & {1} > 0 and addedby =\'{2}\' '.format(person, permission, addedby);
        return base.GetEntityModels(app, model, sql);
    }
    */
    return {
        GetEntity: getEntity,
        GetEntities: getEntites,
        GetEntityModels: getEntityModels,
        VerifyDefaults: verifyDefaults,
        PopulateDefaults: populateDefaults,
        Populate: populate,
        SaveEntity: save,
        GetSearchCriteria: getSearchCriteria,
        GetCriteria: getCriteria,
        BuildWhere: buildWhere,
        BuildSaveArray: buildSaveArray,
        RemoveEntity: deleteEntity,
        GuidSearchFormat : guidSearchFormat,
        FixSqlResult : fixSqlResult,
        Subscribe: subscribe,
        Publish: publish,
        TeamMembership: teamMembership,
        Ownership: ownership
    };
};
