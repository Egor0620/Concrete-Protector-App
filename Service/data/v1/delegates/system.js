/**
 * Created by tbbates on 7/22/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'system',
    teamDelegate = require('./team');

var system = function system() {

    function init() {
        listener();
    }

    function listener() {

    }

    init();
};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
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

    if (source.name) {
        model.name = source.name;
    }

    if (source.saleprice) {
        model.saleprice = source.saleprice;
    }

    if (typeof(source.share) != "undefined" && source.share != null) {
        model.share = source.share;
    }
}

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

                if (!source.name && isNew) {
                    errors.push('missing name');
                } else if (source.name && source.name.length === 0) {
                    errors.push('missing name');
                } else {
                    buildResult.name = source.name;
                }

                if (!source.saleprice && isNew) {
                    errors.push('missing sale price');
                } else if (source.saleprice && source.saleprice.length === 0) {
                    errors.push('missing sale price');
                } else {
                    buildResult.saleprice = source.saleprice;
                }


                if (typeof(source.share) != "undefined" && source.share != null) {
                    buildResult.share = source.share;
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

function globalSystems(app) {
    var model = require('./../models/' + objectType)(app.db).Model();
    var sql = [
        'select  a.* from system a where a.share = true'
    ].join();
    return base.GetEntityModels(app, model, sql);
}

function ownership(app, req) {
    var person = req.user.person;
    var model = require('./../models/' + objectType)(app.db).Model();
    var sql = [
        'select a.* from system a where a.addedby = \'{0}\''.format(person)
    ].join();
    return base.GetEntityModels(app, model, sql);
}

function membership(app, req) {
    var person = req.user.person;
    var model = require('./../models/' + objectType)(app.db).Model();
    var permission = teamDelegate.Permissions.ReadSystem;
    var sql = [
        'select  a.* from system a inner join team b on a.addedby = b.addedby where  b.personid = \'{0}\' and b.permission & {1} > 0'.format(person, permission)
    ].join();
    return base.GetEntityModels(app, model, sql);
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
                teamDelegate.EntityPermission(app, data[0], changePerson, isNew, teamDelegate.Permissions.EditSystem)
                    .then(function (permissionResult) {
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
                    }, function (error) {
                        deferred.reject(error);
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
        changePerson = req.user.person;

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
        var objectModel = require('./../models/system')(app.db).Model();

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

function search(app, req) {
    var deferred = Q.defer(),
        body = req.body;

    try {
        var criteria;
            var searchType = 'use';
            var baseTeams = [];
            var populate = [];

        if (!body.searchType) {
            return deferred.reject('missing search type');
        }

        if (body.searchType) {
            var bs = body.searchType;
            if(bs.type){
                searchType = bs.type;
            }
            //'populate' :['ingredient']
            if (bs.populate && bs.populate.length > 0) {
                populate = bs.populate;
            }
        }
        if (!(body.criteria instanceof Object)) {
            criteria = JSON.parse(body.criteria);
        }
        else {
            criteria = body.criteria;
        }

        if (searchType === 'use') {
            if (_.contains(req.user.roles, 'user') === true) {
                baseTeams.push(globalSystems(app, req));
            }
            criteria.push({'status': '1'});
            if (
                _.contains(req.user.roles, 'subscriber') === true ||
                _.contains(req.user.roles, 'concreteprotector') === true ||
                _.contains(req.user.roles, 'administrator') === true
            )
            {
                baseTeams.push(globalSystems(app, req));
                baseTeams.push(ownership(app, req));
                baseTeams.push(membership(app, req));
                //baseTeams.push(v1a(app, req));
            }
        }
        if (searchType === 'count') {
            baseTeams.push(ownership(app, req));
        }

        if (searchType === 'maintain') {
            baseTeams.push(ownership(app, req));
            baseTeams.push(membership(app, req));

            if (
                _.contains(req.user.roles, 'concreteprotector') === true ||
                _.contains(req.user.roles, 'administrator') === true
            ) {
                baseTeams.push(globalSystems(app, req));

            }
            if (
                _.contains(req.user.roles, 'subscriber') === true
            ) {
                baseTeams.push(ownership(app, req));
                //baseTeams.push(membership(app, req));
            }
        }

        Q.all(baseTeams)
            .then(function (searchResult) {
                searchResult = base.FixSqlResult((searchResult));

                searchResult = _.sortBy(searchResult, 'name');
                var result = [];

                if (searchType == "count")
                {
                    return deferred.resolve(searchResult.length);
                }

                //get the unique searchresults
                _.each(searchResult, function (innerResult) {
                    _.each(innerResult, function (system) {
                        if (_.where(result, {'id': system.id}).length === 0) {
                            if (system.addedby == req.user.person) {
                                system.isMine = true;
                            }

                            result.push(system);
                        }
                    });
                });


                var ids = base.GetSearchCriteria(criteria, 'id');
                var names = base.GetSearchCriteria(criteria, 'name');
                var statuses = base.GetSearchCriteria(criteria, 'status');
                var shares = base.GetSearchCriteria(criteria, 'share');


                var modelCriteria = {};
                modelCriteria.where = {};
                var final = false;
                if (final === false && ids.id && ids.id.length > 0) {
                    result = _.findByValues(result, 'id', ids.id);
                    final = true;
                }

                if (final === false && names.name && names.name.length > 0) {
                    result = _.findByValues(result, 'name', names.name);
                    final = true;
                }

                if (final === false && statuses.status && statuses.status.length > 0) {
                    result = _.findByValues(result, 'status', statuses.status);
                    final = true;
                }

                if (final === false && shares.share && shares.share.length > 0) {
                    result = _.findByValues(result, 'share', shares.share);
                    final = true;
                }

                // remove ignored
                var manager = require('./simple')('ignore');

                var fakeReq = {};
                fakeReq.body = {
                    criteria: {},
                    searchType: 'use',
                    hints: {
                        searchType: 'use'
                    },
                    user: {
                        person: req.user.person
                    },
                    oldSearchType: searchType
                };

                manager.Search(app, fakeReq)
                    .then(function(ignoreSource){
                        // populate system details if requested

                        var ignoreList = _.pluck(ignoreSource,'fid');

                        // 1. if ids were part of the criteria, remove them from the ignoreList if they are present
                        // 2. whwatever is left of the ignore list remove items from results if they are in the ignore list

                        if(ids.id && ids.id.length > 0){
                            _.each(ids.id, function(id){
                                _.pull(ignoreList, id);
                            });
                        }

                        if(ignoreList.length > 0){
                            _.each(ignoreList, function(ig) {
                                _.remove(result, { 'id': ig });
                            });
                        }

                        if (populate.indexOf('ingredient') > -1) {
                            var systemDetailModel = require('./../models/systemdetail')(app.db).Model();


                            //var systemDetailSql = 'select a.* from ' + systemDetailModel.tableName + ' a where systemid in (' + base.GuidSearchFormat(_.pluck(result, 'id')) + ')';
                            var systemDetailModelCritera = {where: {systemid: _.pluck(result, 'id')}};
                            base.GetEntities(systemDetailModel, systemDetailModelCritera)
                                // get system details
                                //base.GetEntityModels(app, systemDetailModel, systemDetailSql)
                                .then(function (systemdetails) {
                                    systemdetails = base.FixSqlResult((systemdetails));


                                    var ingredientModel = require('./../models/ingredient')(app.db).Model();
                                    //var ingredientSql = 'select a.* from ' + ingredientModel.tableName + ' a where id in (' + base.GuidSearchFormat(_.pluck(systemdetails, 'ingredientid')) + ')';
                                    // add the ingredients to the systems

                                    var ingredientModelCritera = {where: {id: _.pluck(systemdetails, 'ingredientid')}};
                                    base.GetEntities(ingredientModel, ingredientModelCritera)
                                        //base.GetEntityModels(app, ingredientModel, ingredientSql)
                                        .then(function (ingredientResults) {
                                            ingredientResults = base.FixSqlResult(ingredientResults);
                                            // set the system details ingredient, there is only one ingredient per system detail
                                            _.each(result, function (system) {
                                                var ingredients = [];

                                                var det = _.where(systemdetails, {'systemid': system.id});

                                                _.each(det, function (systemdetail) {
                                                    var ingredient = _.clone(_.where(ingredientResults, {'id': systemdetail.ingredientid})[0]);
                                                    ingredient.extra = systemdetail.extra;
                                                    ingredient.factor = systemdetail.factor;
                                                    ingredient.price = systemdetail.price;

                                                    ingredients.push(ingredient);
                                                });
                                                system.ingredients = ingredients;
                                            });

                                            var iids = _.pluck(ingredientResults, 'id');
                                            var ingredientdetailsearches = [];
                                            var ingredientcolormodel = require('./../models/ingredientcolor')(app.db).Model();
                                            var ingredientpatternmodel = require('./../models/ingredientpattern')(app.db).Model();


                                            var ingredientCritera = {where: {ingredientid: iids}};

                                            ingredientdetailsearches.push(base.GetEntities(ingredientcolormodel, ingredientCritera));
                                            ingredientdetailsearches.push(base.GetEntities(ingredientpatternmodel, ingredientCritera));

                                            //ingredientdetailsearches.push( //base.GetEntityModels(app, ingredientpatternmodel, 'select a.* from ' + ingredientpatternmodel.tableName + ' a where ingredientid in (' + base.GuidSearchFormat(iids) + ')'));

                                            Q.all(ingredientdetailsearches)
                                                .then(function (icpresults) {
                                                    icpresults = base.FixSqlResult(icpresults);
                                                    // set the system details ingredients colors & patterns


                                                    var colorids = _.pluck(icpresults[0], 'colorid');
                                                    var patternids = _.pluck(icpresults[1], 'patternid');

                                                    var colormodel = require('./../models/simple')(app.db, 'color').Model();
                                                    var patternmodel = require('./../models/simple')(app.db, 'pattern').Model();


                                                    var patterncolorsearches = [];
                                                    // var colormodelsql = 'select a.* from ' + colormodel.tableName + ' a where id in (' + base.GuidSearchFormat(colorids) + ')';
                                                    // var patternmodelsql = 'select a.* from ' + patternmodel.tableName + ' a where id in (' + base.GuidSearchFormat(patternids) + ')';

                                                    patterncolorsearches.push(base.GetEntities(colormodel, {where: {id: colorids}}));
                                                    patterncolorsearches.push(base.GetEntities(patternmodel, {where: {id: patternids}}));

                                                    Q.all(patterncolorsearches)
                                                        .then(function (patterncolorsearchesresults) {
                                                            patterncolorsearchesresults = base.FixSqlResult(patterncolorsearchesresults);

                                                            var colors = patterncolorsearchesresults[0];
                                                            var patterns = patterncolorsearchesresults[1];

                                                            //
                                                            _.each(result, function (system) {
                                                                _.each(system.ingredients, function (ingredient) {
                                                                    var ingredientcolors = [];
                                                                    var ingredientpatterns = [];
                                                                    var colorsearch = _.where(icpresults[0], {'ingredientid': ingredient.id});
                                                                    _.each(colorsearch, function (search) {
                                                                        var innerColor = _.where(colors, {'id': search.colorid})[0];
                                                                        ingredientcolors.push(innerColor);
                                                                    });
                                                                    var patternsearch = _.where(icpresults[1], {'ingredientid': ingredient.id});
                                                                    _.each(patternsearch, function (search) {
                                                                        var innerPattern = _.where(patterns, {'id': search.patternid})[0];
                                                                        ingredientpatterns.push(innerPattern);
                                                                    });
                                                                    ingredient.colors = ingredientcolors;
                                                                    ingredient.patterns = ingredientpatterns;

                                                                });
                                                            });


                                                            // set the system details ingredients
                                                            // set the system details ingredients colors & patterns
                                                            _.each(result, function (system) {
                                                                _.each(system.systemdetails, function (systemdetail) {
                                                                    systemdetail.ingredient = {
                                                                        'ingredientcolors': _.where(icpresults[0], {'ingredientid': systemdetail.ingredientid}),
                                                                        'ingredientpatterns': _.where(icpresults[1], {'ingredientid': systemdetail.ingredientid})
                                                                    };
                                                                    _.each(systemdetail.ingredient, function (ingredient) {
                                                                        _.each(ingredient.ingredientcolors, function (ingredientcolor) {
                                                                            ingredientcolor.color = _.where(colors, {'id': ingredientcolor.colorid})[0];
                                                                        });
                                                                        _.each(ingredient.ingredientpatterns, function (ingredientpattern) {
                                                                            ingredientpattern.pattern = _.where(patterns, {'id': ingredientpattern.patternid})[0];
                                                                        });

                                                                    });
                                                                });
                                                            });

                                                            return deferred.resolve(result);

                                                        })
                                                        .fail(function (error) {
                                                            return deferred.reject(error);
                                                        });


                                                })
                                                .fail(function (error) {
                                                    return deferred.reject(error);
                                                });


                                        })
                                        .fail(function (error) {
                                            return deferred.reject(error);
                                        });
                                })
                                .fail(function (error) {
                                    return deferred.reject(error);
                                });
                        }
                        else {
                            return deferred.resolve(result);
                        }

                    },function(error){
                        return deferred.reject(error);
                    });

            })
            .fail(function (error) {
                return deferred.reject(error);
            });

    }

    catch
        (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}

system.prototype.Search = search;
system.prototype.Remove = remove;
system.prototype.Populate = populate;
system.prototype.Build = build;
system.prototype.Generate = generate;
system.prototype.Update = update;

system.instance = null;

if (system.callee !== system.getInstance) {
    throw new Error('This object cannot be instantiated');
}

system.getInstance = function () {
    if (this.instance === null) {
        this.instance = new system();
    }
    return this.instance;
};
module.exports = system.getInstance();
