/**
 * Created by tbbates on 7/22/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    objectType = 'projectdetailstyle';

var projectdetailstyle = function projectdetailstyle() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byProjectDetailId: {where: {projectdetailid: 'need to supply the project detail id'}},
        byIngreientDetailId: {where: {projectdetailid: 'need to supply the project detail id'}}
    };
}

function populate(source, model) {


    if (source.id) {
        model.id = source.id;
    }

    if (source.ingredientid) {
        model.ingredientid = source.ingredientid;
    }

    if (source.projectdetailid) {
        model.projectdetailid = source.projectdetailid;
    }

    if (source.colorid) {
        model.colorid = source.colorid;
    }

    if (source.patternid) {
        model.patternid = source.patternid;
    }

    if (source.contractorprice) {
        model.contractorprice = source.contractorprice;
    }

}
projectdetailstyle.prototype.Populate = populate;

function build(app, source, isNew) {
    var deferred = Q.defer(),
        errors = [],
        objectModel = require('./../models/' + objectType)(app.db).Model();

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {
        var criteria = new SearchMethod().byId;
        criteria.where.id = source.id;
        base.GetEntity(objectModel, criteria, true)
            .then(function (model) {

                if (isNew && source.id) {
                    model.id = source.id;
                }

                if (isNew && source.ingredientid) {
                    model.ingredientid = source.ingredientid;
                }

                if (isNew && source.projectdetailid) {
                    model.projectdetailid = source.projectdetailid;
                }

                if (source.colorid) {
                    model.colorid = source.colorid;
                }
                if (source.patternid) {
                    model.patternid = source.patternid;
                }

                if (source.contractorprice) {
                    model.contractorprice = source.contractorprice;
                }

                base.VerifyDefaults(source, model, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(model);
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
projectdetailstyle.prototype.Build = build;

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
projectdetailstyle.prototype.Generate = generate;

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
projectdetailstyle.prototype.Update = update;

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
projectdetailstyle.prototype.Remove = remove;

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
        var ingredients = base.GetSearchCriteria(criteria, 'ingredientid');
        var projectdetails = base.GetSearchCriteria(criteria, 'projectdetailid');
        var objectModel = require('./../models/' + objectType)(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }
        if (ingredients.ingredientid && ingredients.ingredientid.length > 0) {
            modelCriteria.where.ingredientid = ingredients.ingredientid;
        }
        if (projectdetails.projectdetailid && projectdetails.projectdetailid.length > 0) {
            modelCriteria.where.projectdetailid = projectdetails.projectdetailid;
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
projectdetailstyle.prototype.Search = search;

projectdetailstyle.instance = null;

if (projectdetailstyle.callee !== projectdetailstyle.getInstance) {
    throw new Error('This object cannot be instantiated');
}

projectdetailstyle.getInstance = function () {
    if (this.instance === null) {
        this.instance = new projectdetailstyle();
    }
    return this.instance;
};
module.exports = projectdetailstyle.getInstance();