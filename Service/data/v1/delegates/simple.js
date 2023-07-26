/**
 * Created by tbbates on 12/17/14.
 */
'use strict';

module.exports = function (objectType) {
    var Q = require('q'),
        base = require('./base')(),
        uuid = require('node-uuid');


    function SearchMethod() {
        return {
            byId: {where: {id: 'need to supply the id'}},
            byName: {where: {name: 'need to supply the name'}}
        };
    }

    function generate(app, req) {

        var deferred = Q.defer(),
            changePerson = req.user.person; // person making the changes
        try {
            save(app, req.body, changePerson, true)
                .then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
        }

        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    function update(app, req) {

        var deferred = Q.defer(),
            changePerson = req.user.person; // person making the changes
        try {
            save(app, req.body, changePerson, false)
                .then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
        }

        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    function save(app, body, changePerson, isNew) {
        var deferred = Q.defer(),
            model = {},
            actionDate = new Date();
        try {
            var source = body; //JSON.parse(body);

            base.PopulateDefaults(source, model, actionDate, changePerson, isNew);
            populate(source, model, isNew);


            var itemsToSave = [];
            var sourceData = [];
            base.BuildSaveArray(itemsToSave, sourceData, build(app, model, isNew), model);

            Q.all(itemsToSave)
                .then(function (data) {
                    app.db.Sequelize.transaction(function (t) {

                        var finalbuild = [];
                        for (var i = 0; i < data.length; i++) {
                            finalbuild.push(base.SaveEntity(data[i], sourceData[i], t));
                        }
                        Q.all(finalbuild)
                            .then(
                            function (newmodel) {
                                t.commit()
                                    .error(function (error) {
                                        deferred.reject({message : error, code : 500 });
                                    });
                                t.done(function () {
                                    deferred.resolve(newmodel[0]);
                                });
                            },
                            function (msg) {
                                t.rollback();
                                deferred.reject(msg);
                            });
                    });
                })
                .fail(function (error) {
                    return deferred.reject(error);
                });
            //

        }
        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    function remove(app, req) {
        var deferred = Q.defer(),
            err = new Error();

        if (!req.params) {
            err = new Error('req missing parameters');
            err.code = 420;
            throw  err;
        }

        if (!req.params.id) {
            err = new Error('req missing parameters');
            err.code = 420;
            throw  err;
        }

        try {
            var objectModel = require('./../models/simple')(app.db, objectType).Model();

            var criteria = new SearchMethod().byId;
            criteria.where.id = req.params.id;

            base.RemoveEntity(objectModel, criteria)
                .then(function () {
                    return deferred.resolve(req.params.id);
                },
                function (error) {
                    return deferred.reject(error);
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    function populate(source, model, isNew) {

        if (isNew) {
            model.id = uuid.v4();
        }
        else {
            model.id = source.id;
        }

        if (source.name) {
            model.name = source.name;
        }

    }

    function search(app, req) {
        var deferred = Q.defer(),
            body = req.body;

        try {

            var criteria;
            if (!(body.criteria instanceof Object)) {
                criteria = JSON.parse(body.criteria);
            }
            else {
                criteria = body.criteria;
            }

            var ids = base.GetSearchCriteria(criteria, 'id');
            var names = base.GetSearchCriteria(criteria, 'name');
            var objectModel = require('./../models/simple')(app.db, objectType).Model();

            var modelCriteria = {};
            modelCriteria.where = {};
            if (ids.id && ids.id.length > 0) {
                modelCriteria.where.id = ids.id;
            }
            if (names.name && names.name.length > 0) {
                modelCriteria.where.name = names.name;
            }

            base.GetEntities(objectModel, modelCriteria)
                .then(function (searchresults) {
                    searchresults = base.FixSqlResult((searchresults));
                    searchresults = _.sortBy(searchresults, 'name');

                    for (var i in searchresults) {
                        if (searchresults[i].addedby == req.user.person) {
                            searchresults[i].isMine = true;
                        }
                    }

                    return deferred.resolve(searchresults);
                })
                .fail(function (error) {
                    return deferred.reject(error);
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    function build(app, source, isNew) {
        var deferred = Q.defer(),
            errors = [],
            model = require('./../models/simple')(app.db, objectType).Model();


        if (!source) {
            return deferred.reject({message : 'source ' + objectType + ' missing', code : 420 });
        }

        if (isNew && !source.id) {
            return deferred.reject({message : 'source ' + objectType + ' id missing', code : 420 });
        }

        try {

            var criteria = new SearchMethod().byId;
            criteria.where.id = source.id;

            base.GetEntity(model, criteria, true)
                .then(function (buildResult) {

                    if (!source.name && isNew) {
                        errors.push('missing name');
                    } else if (source.name && source.name.length === 0) {
                        errors.push('missing name');
                    } else {
                        buildResult.name = source.name;
                        buildResult.hasChanges = true;
                    }

                    base.VerifyDefaults(source, buildResult, errors, isNew);

                    if (errors.length === 0) {
                        return deferred.resolve(buildResult);
                    } else {
                        return deferred.reject({message : JSON.stringify(errors.join(', ')), code : 500 });
                    }
                })
                .fail(function (error) {
                    return deferred.reject(error);
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 500 });
        }

        return deferred.promise;
    }

    return {
        Build: build,
        Populate: populate,
        Generate: generate,
        Update: update,
        Remove: remove,
        Search: search
    };
};