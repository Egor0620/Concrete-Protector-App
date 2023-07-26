/**
 * Created by tbbates on 7/22/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'teamdetail';

var teamdetail = function teamdetail() {

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
        byTeamId: {where: {teamid: 'need to supply the teamid'}},
        allButThisPersonId: {where: {personid: {not: 'need to set id, make sure to set ne'}}}
    };
}

function populate(source, model, isNew) {

    if (isNew) {
        model.id = uuid.v4();
    }
    else {
        model.id = source.id;
    }

    if (source.teamid) {
        model.teamid = source.teamid;
    }

    if (source.personid) {
        model.personid = source.personid;
    }

}
teamdetail.prototype.Populate = populate;

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
                    if (!source.teamid) {
                        errors.push('missing team id');
                    } else {
                        systemdetail.teamid = source.teamid;
                    }

                    if (!source.personid) {
                        errors.push('missing person id');
                    } else {
                        systemdetail.personid = source.personid;
                    }
                }
                else {
                    if (source.teamid) {
                        systemdetail.teamid = source.teamid;
                    }

                    if (source.personid) {
                        systemdetail.personid = source.personid;
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
teamdetail.prototype.Build = build;

function save(app, body, changePerson, isNew) {
    var deferred = Q.defer(),
        actionDate = new Date(),
        accountdelegate = require('./account')();
    try {
        var source = body;


        if (!body.members) {
            return deferred.reject({message: 'missing team members', code: 420});
        }
        var members = body.members;

        if (members.length === 0) {
            return deferred.reject({message: 'missing team members', code: 420});
        }

        // get people to add to team
        var peopleToResolve = [];
        _.each(members, function (member) {
            member.username = member.email;
            peopleToResolve.push(accountdelegate.Resolve(app, member));
        });

        // we now have people
        Q.all(peopleToResolve)
            .then(function (resolvedPeople) {
                // find people to save, we need to find team details for this team that do not have these resolved people

                // ids is the list of accounts
                var criteria = new SearchMethod().byTeamId;
                criteria.where.teamid = source.teamid;
                var objectModel = require('./../models/' + objectType)(app.db).Model();

                base.GetEntities(objectModel, criteria)
                    .then(function (teamDetails) {
                        //now that we have the people to add, let's add them

                        var itemsToSave = [];
                        var sourceData = [];

                        _.each(resolvedPeople, function (person) {
                            if (_.where(teamDetails, {'personid': person.id}).length === 0) {
                                var model = {};
                                var sourceModel = {
                                    teamid: body.teamid,
                                    personid: person.id
                                };
                                base.PopulateDefaults(sourceModel, model, actionDate, changePerson, true);
                                populate(sourceModel, model, true);
                                base.BuildSaveArray(itemsToSave, sourceData, build(app, model, isNew), model);
                            }
                        });

                        //1
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
                                                var lastResult = teamDetails.concat(newmodel);
                                                deferred.resolve(lastResult);
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
//1

                    })
                    .fail(function (error) {
                        return deferred.reject(error);
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
teamdetail.prototype.Generate = generate;

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
teamdetail.prototype.Update = update;

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
teamdetail.prototype.Remove = remove;

function search(app, req) {
    var deferred = Q.defer(),
        body = req.body,
        criteria,
        hints = {
            searchType: 'use',
            populate: false
        };

    try {

        //
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
        }

        if (hints.status) {
            criteria.push({status: hints.status});
        }
        //

        var ids = base.GetSearchCriteria(criteria, 'id');
        var teamids = base.GetSearchCriteria(criteria, 'teamid');
        var statuses = base.GetSearchCriteria(criteria, 'status');
        var objectModel = require('./../models/' + objectType)(app.db).Model();
        var accountModel = require('./../models/account')(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }

        if (teamids.teamid && teamids.teamid.length > 0) {
            modelCriteria.where.teamid = teamids.teamid;
        }

        if (statuses.status && statuses.status.length > 0) {
            modelCriteria.where.status = statuses.status;
        }

        base.GetEntities(objectModel, modelCriteria)
            .then(function (searchresults) {
                if (hints.populate) {
                    var accountIds = _.pluck(searchresults, 'personid'),
                        accountCriteria = {
                            where: {
                                id: accountIds
                            }
                        };

                    base.GetEntities(accountModel, accountCriteria)
                        .then(function (accounts) {
                            var finalTeamDetailResults = [];
                            _.each(searchresults, function (result) {
                                var populatedmember = JSON.parse(JSON.stringify(result));

                                var account = _.where(accounts, {'id': result.personid})[0];
                                populatedmember.email = 'no account';
                                if (account) {
                                    populatedmember.email = account.username;
                                }

                                finalTeamDetailResults.push(populatedmember);
                            });
                            return deferred.resolve(finalTeamDetailResults);
                        })
                        .fail(function (error) {
                            return deferred.reject(error);
                        });

                }
                else {
                    return deferred.resolve(searchresults);
                }

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
teamdetail.prototype.Search = search;

teamdetail.instance = null;

if (teamdetail.callee !== teamdetail.getInstance) {
    throw new Error('This object cannot be instantiated');
}

teamdetail.getInstance = function () {
    if (this.instance === null) {
        this.instance = new teamdetail();
    }
    return this.instance;
};
module.exports = teamdetail.getInstance();