/**
 * Created by tbbates on 7/19/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'lead',
    teamDelegate = require('./team');

var lead = function lead() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byPersonId: {where: {personid: 'need to supply the personid'}}
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

}

function build(app, source, isNew) {
    var deferred = Q.defer(),
        errors = [],
        criteria = new SearchMethod().byId,
        model = require('./../models/' + objectType)(app.db).Model();

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {
        criteria.where.id = source.id;
        base.GetEntity(model, criteria, true)
            .then(function (lead) {

                if (!source.personid && isNew) {
                    errors.push('missing person');
                } else if (source.personid && source.personid.length === 0) {
                    errors.push('missing person');
                } else {
                    lead.personid = source.personid;
                    lead.hasChanges = true;
                }

                base.VerifyDefaults(source, lead, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(lead);
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
        base.PopulateDefaults(body, model, actionDate, changePerson, isNew);

        if (isNew) {
            model.personid = body.personid;
        }


        var itemsToSave = [];
        var sourceData = [];
        base.BuildSaveArray(itemsToSave, sourceData, build(app, model, isNew), model);

        //Set the id = to the person if the lead is new, Leads really are people, may refactor this in the future
        // TODO: refactor lead to a person as they are really one in the same...
        if (isNew) {
            model.id = model.personid;
        }

        Q.all(itemsToSave)

            .then(function (data) {
                teamDelegate.EntityPermission(app, data[0], changePerson, isNew, teamDelegate.Permissions.EditPerson)
                    .then(function (permissionResult) {
                        app.db.Sequelize.transaction(function (t) {
                            var finalbuild = [];
                            for (var i = 0; i < data.length; i++) {
                                finalbuild.push(base.SaveEntity(data[i], sourceData[i], t));
                            }
                            Q.all(finalbuild)
                                .then(
                                function () {
                                    t.commit()
                                        .error(function (error) {
                                            deferred.reject({message: error, code: 500});
                                        });
                                    t.done(function () {
                                        deferred.resolve(model);
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
    var deferred = Q.defer();

    try {
        var personLead = require('./../models/' + objectType)(app.db).Model();

        var criteria = new SearchMethod().byId;
        criteria.where.id = req.params.id;

        base.RemoveEntity(personLead, criteria)
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

function search(app, req, next) {
    var deferred = Q.defer(),
        body = req.body,
        criteria,
        baseTeams = [],
        hints = {
            searchType: 'use',
            populate: false
        };


    try {
        if (!(body.criteria instanceof Object)) {
            criteria = JSON.parse(body.criteria);
        } else {
            criteria = body.criteria;
        }

        if (!(body.hints instanceof Object)) {
            hints = JSON.parse(body.hints);
        }
        else {
            hints = body.hints;
        }

        if (hints.status) {
            criteria.push({status: hints.status});
        }

        /*
         if (body.hint) {
         var ih = {};
         if (!(body.hint instanceof Object)) {
         ih = JSON.parse(body.hint);
         }
         else {
         ih = body.hint;
         }

         if(ih.mode){
         hint.mode = ih.mode;
         }
         if(ih.populate){
         hint.populate = ih.populate;
         }
         if(ih.criteria){
         hint.criteria = ih.criteria;
         }
         if(ih.status){
         hint.criteria.push({'status': ih.status});
         }

         }
         else {
         var err = new Error('missing permission message');
         err.code = 420;
         return next(err);
         }
         */
        if (hints.searchType === 'use' || hints.searchType === 'maintain') {
            if (_.contains(req.user.roles, 'user') === true) {
                baseTeams.push(ownership(app, req));
            }
            if (
                _.contains(req.user.roles, 'subscriber') === true ||
                _.contains(req.user.roles, 'concreteprotector') === true ||
                _.contains(req.user.roles, 'administrator') === true
            ) {
                baseTeams.push(membership(app, req));
                baseTeams.push(ownership(app, req));
            }
        }


        Q.all(baseTeams)
            .then(function (searchResult) {
                searchResult = base.FixSqlResult((searchResult));
                var result = [];

                //get the unique searchresults
                _.each(searchResult, function (innerResult) {
                    _.each(innerResult, function (lead) {
                        if (_.where(result, {'id': lead.id}).length === 0) {
                            result.push(lead);
                        }
                    });
                });

                var ids = base.GetSearchCriteria(criteria, 'id');
                var statuses = base.GetSearchCriteria(criteria, 'status');

                var modelCriteria = {};
                modelCriteria.where = {};
                var final = false;
                if (final === false && ids.id && ids.id.length > 0) {
                    result = _.findByValues(result, 'id', ids.id);
                    final = true;
                }
                if (final === false && statuses.status && statuses.status.length > 0) {
                    result = _.findByValues(result, 'status', statuses.status);
                    final = true;
                }

                if (!hints.populate) {
                    return deferred.resolve(result);
                }

                var personModel = require('./../models/person')(app.db).Model();
                var leadDetailModel = require('./../models/leaddetail')(app.db).Model();
                var phoneModel = require('./../models/phone')(app.db).Model();


                var populateQueries = [];
                populateQueries.push(base.GetEntities(personModel, {where: {id: _.pluck(result, 'personid')}}));
                populateQueries.push(base.GetEntities(phoneModel, {where: {personid: _.pluck(result, 'personid')}}));
                populateQueries.push(base.GetEntities(leadDetailModel, {where: {leadid: _.pluck(result, 'personid')}}));
                Q.all(populateQueries)
                    .then(function (queryResults) {
                        queryResults = base.FixSqlResult(queryResults);

                        var people = queryResults[0];
                        var phones = queryResults[1];
                        var leaddetail = queryResults[2];

                        _.each(result, function (lead) {
                            var person = _.where(people, {id: lead.personid})[0];
                            if (!person) {
                                person = {};
                            }
                            lead.person = person;

                            var phone = _.where(phones, {personid: lead.personid});
                            if (phone.length > 0) {
                                if (phone.length === 1) {
                                    lead.phone = phone[0];
                                }
                                else {
                                    var possiblePhone = _.where(phone, {'primary': true});
                                    if (possiblePhone.length > 0) {
                                        lead.phone = possiblePhone[0];
                                    }
                                    else {
                                        lead.phone = phone[0];
                                    }
                                }
                            }

                            if (!lead.phone) {
                                lead.phone = {};
                            }
                            var detail = _.where(leaddetail, {leadid: lead.personid})[0];
                            if (!detail) {
                                detail = {};
                            }
                            lead.detail = detail;
                        });
                        deferred.resolve(result);
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

function ownership(app, req) {
    var person = req.user.person;
    var model = require('./../models/' + objectType)(app.db).Model();
    var sql = [
        'select a.* from ' + objectType + ' a where a.addedby = \'{0}\''.format(person)
    ].join();
    return base.GetEntityModels(app, model, sql);
}

function membership(app, req) {
    var person = req.user.person;
    var model = require('./../models/' + objectType)(app.db).Model();
    var permission = teamDelegate.Permissions.ReadPerson;
    var sql = [
        'select  a.* from ' + objectType + ' a inner join team b on a.addedby = b.addedby where  b.personid = \'{0}\' and b.permission & {1} > 0'.format(person, permission)
    ].join();
    return base.GetEntityModels(app, model, sql);
}

lead.prototype.Search = search;
lead.prototype.Remove = remove;
lead.prototype.Update = update;
lead.prototype.Populate = populate;
lead.prototype.Build= build;
lead.prototype.Generate = generate;
lead.prototype.Ownership = ownership;
lead.prototype.Membership = membership;

lead.instance = null;

if (lead.callee !== lead.getInstance) {
    throw new Error('This object cannot be instantiated');
}

lead.getInstance = function () {
    if (this.instance === null) {
        this.instance = new lead();
    }
    return this.instance;
};
module.exports = lead.getInstance();