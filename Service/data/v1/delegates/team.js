/**
 * Created by tbbates on 7/22/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'team';

var team = function team() {

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

    if (source.personid) {
        model.personid = source.personid;
    }

    if (source.permission) {
        model.permission = source.permission;
    }
    else {
        model.permission = 0;
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

                if (!source.personid && isNew) {
                    errors.push('missing personid');
                } else if (source.personid && source.personid.length === 0) {
                    errors.push('missing personid');
                } else {
                    buildResult.personid = source.personid;
                }

                if (source.permission) {
                    buildResult.permission = source.permission;
                }
                else {
                    buildResult.permission = 0;
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
        var source = body,
            member = {};

        if (isNew) {
            if (!body.email) {
                return deferred.reject({message: 'missing person', code: 420});
            }
            var accountdelegate = require('./account');
            member.username = body.email;
            accountdelegate.Resolve(app, member)
                .then(function (account) {
                    source.personid = account.id;
                    base.PopulateDefaults(source, model, actionDate, changePerson, isNew);
                    populate(source, model, isNew);
                    //team.Populate(source, model, isNew);

                    var itemsToSave = [];
                    var sourceData = [];
                    base.BuildSaveArray(itemsToSave, sourceData, build(app, model, isNew, changePerson), model);

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

                }, function (error) {
                    deferred.reject(error);
                });
        }
        else {

            base.PopulateDefaults(source, model, actionDate, changePerson, isNew);

            populate(source, model, isNew);

            var itemsToSave = [];
            var sourceData = [];
            base.BuildSaveArray(itemsToSave, sourceData, build(app, model, isNew, changePerson), model);

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

    }
    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}

function ownership(app, req) {
    var person = req.user.person;
    var model = require('./../models/' + objectType)(app.db).Model();
    var sql = 'select * from ' + objectType + ' where addedby = \'{0}\''.format(person);
    return base.GetEntityModels(app, model, sql);
}

function membership(app, changeUser, addedby, permission) {
    var model = require('./../models/' + objectType)(app.db).Model();
    var person = changeUser;
    var sql = 'select * from ' + objectType + ' where personid = \'{0}\' and permission & {1} > 0 and addedby =\'{2}\' '.format(person, permission, addedby);
    return base.GetEntityModels(app, model, sql);
}

function permission(app, req, next) {
    var deferred = Q.defer(),
        body = req.body,
        err = new Error();
    try {

        if (!body.message) {
            err = new Error('missing permission message');
            err.code = 420;
            return next(err);

        }

        var ih = {},
            message = body.message;

        if (!(message instanceof Object)) {
            ih = JSON.parse(message);
        }
        else {
            ih = message;
        }

        if (!ih.permission) {
            err = new Error('missing permission');
            err.code = 420;
            throw  err;
        }

        if (!ih.owner) {
            err = new Error('missing owner');
            err.code = 420;
            throw  err;
        }


        membership(app, req.user.person, ih.owner, ih.permission)
            .then(function (data) {
                if (!data || data.length === 0) {
                    deferred.reject({code: 403, message: 'no access to this entity'});
                }
                deferred.resolve({access: true});

            }, function (error) {
                deferred.reject(error);
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
                //base.Publish(objectType, objectType + '.created', data);
                //Publish(objectType, objectType + '.created', data);
                channel.publish(objectType + '.created', data);

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
                //base.Publish(objectType, objectType + '.updated', data);
                channel.publish(objectType + '.updated', data);
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
    var deferred = Q.defer(),
        body = req.body,
        options = {
            permission: 0,
            searchType: 'use',
            populate: true,
            addedby: req.user.person
        },
        useMembership = false;

    try {

        if (body) {
            var ih = {};
            if (!(body instanceof Object)) {
                ih = JSON.parse(body);
            }
            else {
                ih = body;
            }
            if (ih.permission) {
                useMembership = true;
                options.permission = ih.permission;
            }
            if (ih.mode) {
                options.mode = ih.mode;
            }
            if (ih.addedby) {
                useMembership = true;
                options.addedby = ih.addedby;
            }
        }

        var baseTeams = [];
        if (useMembership) {
            baseTeams.push(membership(app, req.user.person, options.addedby, options.permission));
        }

        baseTeams.push(ownership(app, req));


        Q.all(baseTeams)
            .then(function (searchResult) {
                searchResult = base.FixSqlResult((searchResult[0]));
                if (!options.populate) {
                    return deferred.resolve(searchResult);
                }

                var accountModel = require('./../models/account')(app.db).Model();
                var populateQueries = [];
                populateQueries.push(base.GetEntities(accountModel, {where: {id: _.pluck(searchResult, 'personid')}}));
                //
                Q.all(populateQueries)
                    .then(function (queryResults) {
                        queryResults = base.FixSqlResult(queryResults);

                        var accounts = queryResults[0];
                        _.each(searchResult, function (teammember) {
                            var account = _.where(accounts, {id: teammember.personid})[0];
                            teammember.email = account.username;

                        });
                        return deferred.resolve(searchResult);
                    })
                    .fail(function (error) {
                        return deferred.reject(error);
                    });
                // return deferred.resolve(searchResult);
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

function entityPermission(app, entity, changeUser, isNew, permission) {
    var deferred = Q.defer();
    if (isNew === true) {
        deferred.resolve('save enabled');
    }
    if (entity.addedby === changeUser) {
        deferred.resolve('save enabled');
    }
    // if entity = storage & storagetype = contractlayout & user is admin then save enabled

    try {

        membership(app, changeUser, entity.addedby, permission)
            .then(function (data) {
                if (!data || data.length === 0) {
                    deferred.reject({code: 403, message: 'no access to this entity'});
                }
                deferred.resolve({access: true});

            }, function (error) {
                deferred.reject(error);
            });
    }
    catch (error) {
        deferred.reject(error);
    }
    return deferred.promise;
}

team.instance = null;

team.prototype.Permissions = {
    ReadSystem: 1,
    EditSystem: 2,
    ReadPerson: 4,
    EditPerson: 8,
    ReadFinancial: 16,
    EditFinancial: 32,
    ReadContract: 64,
    EditContract: 128
};
team.prototype.Populate = populate;
team.prototype.Build = build;
team.prototype.EntityPermission = entityPermission;
team.prototype.Search = search;
team.prototype.Remove = remove;
team.prototype.Update = update;
team.prototype.Generate = generate;
team.prototype.Permission = permission;
team.prototype.Membership = membership;
team.prototype.Ownership = ownership;

if (team.callee !== team.getInstance) {
    throw new Error('This object cannot be instantiated');
}

team.getInstance = function () {
    if (this.instance === null) {
        this.instance = new team();
    }
    return this.instance;
};
module.exports = team.getInstance();
