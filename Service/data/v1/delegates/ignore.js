/**
 * Created by tbbates on 5/26/15.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'ignore';

var ignore = function ignore() {

    function init() {
        listener();
    }

    function listener() {
        /*
         channel.subscribe(objectType + '.created', function (data) {
         console.log(objectType + '.created' + JSON.stringify(data));
         });

         channel.subscribe(objectType + '.updated', function (data) {
         console.log(objectType + '.updated' + JSON.stringify(data));
         });
         */
    }

    init();
};

_.mixin({
    'findByValues': function (collection, property, values) {
        return _.filter(collection, function (item) {
            return _.contains(values, item[property]);
        });
    }
});

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

    if (source.fid) {
        model.fid = source.fid;
    }

    if (source.type) {
        model.type = source.type;
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

                if (!source.fid && isNew) {
                    errors.push('missing fid');
                } else if (source.fid && source.fid.length === 0) {
                    errors.push('missing fid');
                } else {
                    buildResult.fid = source.fid;
                }

                if (!source.type && isNew) {
                    errors.push('missing type');
                } else if (source.type && source.type.length === 0) {
                    errors.push('missing type');
                } else {
                    buildResult.type = source.type;
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

function search(app, req) {
    var deferred = Q.defer();
    var user = req.user.person;
    var body = req.body;
    var criteria;
    var queries = [];
    var hints = {
        searchType: 'use',
        populate: false,
        ignoreType: ''
    };
    try {

        if (!(body.criteria instanceof Object)) {
            criteria = JSON.parse(body.criteria);
        }
        else {
            criteria = body.criteria;
        }

        if (body.hints) {
            if (!(body.hints instanceof Object)) {
                hints = JSON.parse(body.hints);
            }
            else {
                hints = body.hints;
            }
        } else {
            return deferred.reject({message: 'hints not specified', code: 400});
        }

        if (hints.ignoreType === '') {
            return deferred.reject({message: 'ignore type not specified', code: 400});
        }


        var ignoreModel = require('./../models/' + objectType)(app.db).Model();
        var ignoreQuery = 'select a.* from ' + objectType + ' a where a.addedby = \'{0}\' and a.type = \'{1}\''.format(user, hints.ignoreType);
        queries.push(base.GetEntityModels(app, ignoreModel, ignoreQuery));
        if (hints.searchType === 'maintain') {
            var manager = require('./simple')(hints.ignoreType);

            var fakeReq = {};
            fakeReq.body = {
                criteria: {},
                searchType: 'use',
                hints: {
                    searchType: 'use'
                },
                user: {
                    person: req.user.person
                }
            };

            queries.push(manager.Search(app, fakeReq));

        }

        // if the search type is use, only return the ignores
        // if the search type is maintain, we need to return all of the ignored types as well as the ignore data
        // so that the use can choose to add or remove ignored items
        Q.all(queries)
            .then(function (queryResults) {
                queryResults = base.FixSqlResult((queryResults));
                if (hints.searchType === 'use') {
                    return deferred.resolve(queryResults[0]);
                }
                var searchResults = [];
                _.each(queryResults[1], function (ignoreType) {
                    var ignPrime = _.where(queryResults[0], {fid: ignoreType.id});
                    var thisIgnore = {};
                    if (ignPrime.length === 0) {
                        thisIgnore.fid = ignoreType.id;
                        thisIgnore.name = ignoreType.name;
                        thisIgnore.type = hints.ignoreType;
                        thisIgnore.primeId = 0;
                    } else {
                        thisIgnore = ignPrime[0];
                        thisIgnore.name = ignoreType.name;
                        thisIgnore.primeId = thisIgnore.id;
                        thisIgnore.checked = true;
                    }
                    searchResults.push(thisIgnore);

                });

                searchResults = _.sortBy(searchResults, 'name');

                return deferred.resolve(searchResults);

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

ignore.instance = null;
ignore.prototype.Populate = populate;
ignore.prototype.Build = build;
ignore.prototype.Search = search;
ignore.prototype.Remove = remove;
ignore.prototype.Update = update;
ignore.prototype.Generate = generate;

if (ignore.callee !== ignore.getInstance) {
    throw new Error('This object cannot be instantiated');
}

ignore.getInstance = function () {
    if (this.instance === null) {
        this.instance = new ignore();
    }
    return this.instance;
};
module.exports = ignore.getInstance();

