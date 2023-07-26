/**
 * Created by tbbates on 1/3/15.
 */
'use strict';


var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'teamsystem';

var teamsystem = function teamsystem() {

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
        byTeamId: {where: {teamid: 'need to supply the team id'}},
        bySystemId: {where: {systemid: 'need to supply the system id'}},
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

    if (source.teamid) {
        model.teamid = source.teamid;
    }
    if (source.systemid) {
        model.systemid = source.systemid;
    }

}
teamsystem.prototype.Populate = populate;

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

                if (!source.teamid && isNew) {
                    errors.push('missing team id');
                } else if (source.teamid && source.teamid.length === 0) {
                    errors.push('missing team id');
                } else {
                    buildResult.teamid = source.teamid;
                    buildResult.hasChanges = true;
                }
                if (!source.systemid && isNew) {
                    errors.push('missing  system id');
                } else if (source.systemid && source.systemid.length === 0) {
                    errors.push('missing system id');
                } else {
                    buildResult.systemid = source.systemid;
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
teamsystem.prototype.Build = build;

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
teamsystem.prototype.Generate = generate;

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
teamsystem.prototype.Update = update;

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
teamsystem.prototype.Remove = remove;

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
        var teamids = base.GetSearchCriteria(criteria, 'teamid');
        var systemids = base.GetSearchCriteria(criteria, 'systemid');
        var statuses = base.GetSearchCriteria(criteria, 'status');
        var objectModel = require('./../models/' + objectType)(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }
        if (teamids.teamid && teamids.teamid.length > 0) {
            modelCriteria.where.teamid = teamids.teamid;
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
teamsystem.prototype.Search = search;

function shareNewSystem(app, req, data) {

    var deferred = Q.defer(),
        changePerson = req.user.person,
        teamDelegate = require('./team')(),
        actionDate = new Date();
    try {
        var newReq = {
            'body': {
                'criteria': {}
            },
            'user': {
                'person': changePerson
            }
        };
        // get my teams
        teamDelegate.Search(app, newReq)
            .then(function (searchResult) {
                // for each team add a teamsystem
                var itemsToSave = [];
                var sourceData = [];

                _.each(searchResult, function (team) {
                    //
                    var source = {
                            systemid: data.id,
                            teamid: team.id
                        },

                        model = {};

                    base.PopulateDefaults(source, model, actionDate, changePerson, true);
                    populate(source, model, true);
                    base.BuildSaveArray(itemsToSave, sourceData, build(app, model, true), model);

                });
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
teamsystem.prototype.ShareNewSystem = shareNewSystem;

function shareNewTeam(app, req, data) {

    var deferred = Q.defer(),
        changePerson = req.user.person,
        system = require('./system')(),
        actionDate = new Date();
    try {

        var newReq = {
            'body': {
                'criteria': {}
            },
            'user': {
                'person': changePerson
            }
        };

        var searches = [];
        searches.push(system.Membership(app, newReq));
        searches.push(system.Ownership(app, newReq));
        // get my teams
        Q.all(searches)
            .then(function (searchResult) {


                var result = [];


                _.each(searchResult, function (innerResult) {
                    _.each(innerResult, function (system) {
                        if (_.where(result, {'id': system.id}).length === 0) {
                            result.push(system);
                        }

                    });
                });

                // for each team add a teamsystem
                var itemsToSave = [];
                var sourceData = [];

                _.each(result, function (system) {
                    //
                    var source = {
                            systemid: system.id,
                            teamid: data.id
                        },

                        model = {};

                    base.PopulateDefaults(source, model, actionDate, changePerson, true);
                    populate(source, model, true);
                    base.BuildSaveArray(itemsToSave, sourceData, build(app, model, true), model);

                });

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
teamsystem.prototype.ShareNewTeam = shareNewTeam;

teamsystem.instance = null;

if (teamsystem.callee !== teamsystem.getInstance) {
    throw new Error('This object cannot be instantiated');
}

teamsystem.getInstance = function () {
    if (this.instance === null) {
        this.instance = new teamsystem();
    }
    return this.instance;
};
module.exports = teamsystem.getInstance();