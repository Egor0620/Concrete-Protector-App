/**
 * Created by tbbates on 12/17/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'ingredientpattern';


var ingredientpattern = function ingredientpattern() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byIngredientId: {where: {ingredientid: 'need to supply the ingredient id'}},
        byPatternId: {where: {patternid: 'need to supply the pattern id'}},
        byStatus: {where: {status: 'need to supply the status'}}
    };
}

function populate(source, model, isNew) {

    if (isNew) {
        model.id = uuid.v4();
    }
    else {
        model.id = source.id;
    }

    if (source.ingredientid) {
        model.ingredientid = source.ingredientid;
    }
    if (source.patternid) {
        model.patternid = source.patternid;
    }

}
ingredientpattern.prototype.Populate = populate;

function build(app, source, isNew) {
    var deferred = Q.defer(),
        errors = [],
        model = require('./../models/' + objectType)(app.db).Model();

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {

        var criteria = new SearchMethod().byId;
        criteria.where.id = source.id;

        base.GetEntity(model, criteria, true)
            .then(function (buildResult) {

                if (!source.ingredientid && isNew) {
                    errors.push('missing ingredient id');
                } else if (source.ingredientid && source.ingredientid.length === 0) {
                    errors.push('missing ingredient id');
                } else {
                    buildResult.ingredientid = source.ingredientid;
                    buildResult.hasChanges = true;
                }
                if (!source.patternid && isNew) {
                    errors.push('missing  pattern id');
                } else if (source.patternid && source.patternid.length === 0) {
                    errors.push('missing pattern id');
                } else {
                    buildResult.patternid = source.patternid;
                    buildResult.hasChanges = true;
                }


                base.VerifyDefaults(source, buildResult, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(buildResult);
                } else {
                    return deferred.reject({message: JSON.stringify(errors.join(', ')), code: 500});
                }
            })
            .fail(function (error) {
                return deferred.reject(error);
            });
    }
    catch (e) {
        return deferred.reject({message: e, code: 500});
    }

    return deferred.promise;
}
ingredientpattern.prototype.Build = build;

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
                                    deferred.reject({message: error, code: 500});
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
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
ingredientpattern.prototype.Save = save;

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
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
ingredientpattern.prototype.Generate = generate;

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
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
ingredientpattern.prototype.Update = update;

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
        var objectModel = require('./../models/' + objectType)(app.db).Model();

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
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
ingredientpattern.prototype.Remove = remove;

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
        var ingredientids = base.GetSearchCriteria(criteria, 'ingredientid');
        var patternids = base.GetSearchCriteria(criteria, 'patternid');
        var statuses = base.GetSearchCriteria(criteria, 'status');
        var objectModel = require('./../models/' + objectType)(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }
        if (ingredientids.ingredientid && ingredientids.ingredientid.length > 0) {
            modelCriteria.where.ingredientid = ingredientids.ingredientid;
        }
        if (patternids.patternid && patternids.patternid.length > 0) {
            modelCriteria.where.patternid = patternids.patternid;
        }

        if (statuses.status && statuses.status.length > 0) {
            modelCriteria.where.status = statuses.status;
        }

        base.GetEntities(objectModel, modelCriteria)
            .then(function (searchresults) {
                return deferred.resolve(searchresults);
            })
            .fail(function (error) {
                return deferred.reject(error);
            });
    }
    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
ingredientpattern.prototype.Search = search;

ingredientpattern.instance = null;

if (ingredientpattern.callee !== ingredientpattern.getInstance) {
    throw new Error('This object cannot be instantiated');
}

ingredientpattern.getInstance = function () {
    if (this.instance === null) {
        this.instance = new ingredientpattern();
    }
    return this.instance;
};
module.exports = ingredientpattern.getInstance();