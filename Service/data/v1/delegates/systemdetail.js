/**
 * Created by tbbates on 7/22/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'systemdetail';

var systemdetail = function systemdetail() {

    function init() {
        listener();
    }

    function listener() {

    }

    init();
};


function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}}
    };
}

function populate(source, model, isNew) {

    if (isNew) {
        model.id = uuid.v4();
    }
    else {
        model.id = source.id;
    }

    if (source.systemid) {
        model.systemid = source.systemid;
    }

    if (source.extra) {
        model.extra = source.extra;
    }
    if (source.factor) {
        model.factor = source.factor;
    }

    if (source.price) {
        model.price = source.price;
    }
    if (source.ingredientid) {
        model.ingredientid = source.ingredientid;
    }

}
systemdetail.prototype.Populate = populate;

function build(app, source, isNew) {
    var deferred = Q.defer();
    var errors = [];
    var criteria = new SearchMethod().byId;
    var systemModel = require('./../models/' + objectType)(app.db).Model();


    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {
        criteria.where.id = source.id;
        base.GetEntity(systemModel, criteria, true)
            .then(function (systemdetail) {

                if (isNew) {
                    if (!source.systemid) {
                        errors.push('missing system id');
                    } else {
                        systemdetail.systemid = source.systemid;
                    }

                    if (!source.ingredientid) {
                        errors.push('missing ingredient id');
                    } else {
                        systemdetail.ingredientid = source.ingredientid;
                    }


                    if (!source.extra) {
                        systemdetail.extra = '';
                    } else {
                        systemdetail.extra = source.extra;
                    }
                    if (!source.factor) {
                        systemdetail.factor = 1;
                    } else {
                        systemdetail.factor = source.factor;
                    }

                    if (!source.price) {
                        systemdetail.price = 1;
                    } else {
                        systemdetail.price = source.price;
                    }
                }
                else {
                    if (source.systemid) {
                        systemdetail.systemid = source.systemid;
                    }

                    if (source.ingredientid) {
                        systemdetail.ingredientid = source.ingredientid;
                    }

                    if (source.extra) {
                        systemdetail.extra = source.extra;
                    }

                    if (source.factor) {
                        systemdetail.factor = source.factor;
                    }

                    if (source.price) {
                        systemdetail.price = source.price;
                    }

                }


                base.VerifyDefaults(source, systemdetail, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(systemdetail);
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
systemdetail.prototype.Build = build;

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
systemdetail.prototype.Generate = generate;

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
systemdetail.prototype.Update = update;

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
systemdetail.prototype.Remove = remove;

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
        var systemids = base.GetSearchCriteria(criteria, 'systemid');
        var ingredientids = base.GetSearchCriteria(criteria, 'ingredientid');
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

        if (systemids.systemid && systemids.systemid.length > 0) {
            modelCriteria.where.systemid = systemids.systemid;
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
systemdetail.prototype.Search = search;

systemdetail.instance = null;

if (systemdetail.callee !== systemdetail.getInstance) {
    throw new Error('This object cannot be instantiated');
}

systemdetail.getInstance = function () {
    if (this.instance === null) {
        this.instance = new systemdetail();
    }
    return this.instance;
};
module.exports = systemdetail.getInstance();