/**
 * Created by tbbates on 7/20/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    objectType = 'project',
    leadDelegate = require('./lead'),
    teamDelegate = require('./team');

var project = function project() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byLeadId: {where: {leadid: 'need to supply the leadid'}},
        personLeads: {where: {leadid: 'need to supply person user id', status: [1]}},
        byProjectStatus: {where: {projectstatus: 'need to supply the projetstatus'}}
    };
}

function populate(source, model) {

    if (source.id) {
        model.id = source.id;
    }

    if (source.leadid) {
        model.leadid = source.leadid;
    }

    if (source.addressid) {
        model.addressid = source.addressid;
    }

    if (source.install) {
        model.install = source.install;
    }

    if (source.completed) {
        model.completed = source.completed;
    }

    if (source.designconsult) {
        model.designconsult = source.designconsult;
    }
    if (source.projectstatus) {
        model.projectstatus = source.projectstatus;
    }

}

function build(app, source, isNew) {
    var deferred = Q.defer();
    var errors = [],
        projectModel = require('./../models/' + objectType)(app.db).Model();


    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {
        var criteria = new SearchMethod().byId;
        criteria.where.id = source.id;
        base.GetEntity(projectModel, criteria, true)
            .then(function (project) {

                if (!source.leadid && isNew) {
                    errors.push('missing lead id');
                } else {
                    project.leadid = source.leadid;
                }

                if (source.addressid) {
                    project.addressid = source.addressid;
                }

                if (source.install) {
                    project.install = source.install;
                } else {
                    project.install = null;
                }

                if (source.completed) {
                    project.completed = source.completed;
                } else {
                    project.completed = null;
                }

                if (source.designconsult) {
                    project.designconsult = source.designconsult;
                }
                else {
                    project.designconsult = null;
                }

                if (source.projectstatus) {
                    project.projectstatus = source.projectstatus;
                }

                base.VerifyDefaults(source, project, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(project);
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

function innerSearch(app, req) {
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

        if (hints.searchType === 'use' || hints.searchType === 'maintain') {
            if (_.contains(req.user.roles, 'user') === true) {
                baseTeams.push(leadDelegate.Ownership(app, req));
            }
            if (
                _.contains(req.user.roles, 'subscriber') === true ||
                _.contains(req.user.roles, 'concreteprotector') === true ||
                _.contains(req.user.roles, 'administrator') === true
            ) {
                baseTeams.push(leadDelegate.Membership(app, req));
                baseTeams.push(leadDelegate.Ownership(app, req));
            }
        }
        // we are getting the teams for leads so that we can check at the end to make sure the
        // results are for leads that the user has access to use
        Q.all(baseTeams)
            .then(function (leadResults) {
                leadResults = base.FixSqlResult((leadResults));
                var leads = [];

                //get the unique searchresults
                _.each(leadResults, function (innerResult) {
                    _.each(innerResult, function (lead) {
                        if (_.where(leads, {'id': lead.id}).length === 0) {
                            leads.push(lead);

                        }
                    });
                });



                var ids = base.GetSearchCriteria(criteria, 'id');
                var statuses = base.GetSearchCriteria(criteria, 'status');
                var times = base.GetSearchCriteria(criteria, 'time');
                var leadids = base.GetSearchCriteria(criteria, 'leadid');
                if (ids.length === 0 && times.length === 0 && leadids.length === 0) {
                    return deferred.reject('missing search criteria');
                }


                var pc = {where: {}},
                    projectModel = require('./../models/' + objectType)(app.db).Model();

                if (ids.id && ids.id.length > 0) {
                    pc.where.id = ids.id;
                }
                if (statuses.status && statuses.status.length > 0) {
                    pc.where.status = statuses.status;
                }
                if (leadids.leadid && leadids.leadid.length > 0) {
                    pc.where.leadid = leadids.leadid;
                }


                if (times.time && times.time.length > 0) {
                    var thisTime = times.time[0];
                    pc.where.projectstatus = thisTime;
                }


                var queries = [];
                queries.push(base.GetEntities(projectModel, pc));

                Q.all(queries)
                    .then(function (queryResults) {
                        queryResults = base.FixSqlResult(queryResults);

                        var possibleResults = [];

                        // only get the results we have access to use
                        _.each(leads, function (lead) {
                            var projects = _.where(queryResults[0], {leadid: lead.id});
                            _.each(projects, function (project) {
                                if (_.where(possibleResults, {'id': project.id}).length === 0) {
                                    possibleResults.push(project);
                                }
                            });
                        });

                        if (!hints.populate || possibleResults.length === 0) {
                            deferred.resolve(possibleResults);
                        }
                        else {
                            //populate project details
                            var detailModel = require('./../models/projectdetail')(app.db).Model();
                            var detailStyleModel = require('./../models/projectdetailstyle')(app.db).Model();
                            var addressModel = require('./../models/address')(app.db).Model();
                            var noteModel = require('./../models/note')(app.db).Model();
                            var personModel = require('./../models/person')(app.db).Model();
                            var projectids = _.pluck(possibleResults, 'id');
                            var leadid = _.pluck(possibleResults, 'leadid');

                            var possibleAddresses = _.pluck(possibleResults, 'addressid');
                            var populates = [];

                            populates.push(base.GetEntities(detailModel, {where: {projectid: projectids}}));
                            populates.push(base.GetEntities(addressModel, {where: {id: possibleAddresses}}));
                            populates.push(base.GetEntities(noteModel, {where: {fid: projectids}}));
                            populates.push(base.GetEntities(personModel, {where: {id: leadid}}));

                            //base.GetEntities(detailModel,{where: { projectid : projectids }})
                            Q.all(populates)
                                .then(function (populatesResults) {
                                    populatesResults = base.FixSqlResult(populatesResults);

                                    var projectDetails = populatesResults[0];
                                    var addresses = populatesResults[1];
                                    var notes = populatesResults[2];
                                    var people = populatesResults[3];

                                    _.each(possibleResults, function (project) {
                                        project.details = [];
                                        project.notes = _.where(notes, {fid: project.id});

                                        project.address = _.where(addresses, {id: project.addressid})[0];
                                        project.person = _.where(people, {id: project.leadid})[0];

                                        var possibleDetails = _.where(projectDetails, {projectid: project.id});
                                        project.totalcost = 0;
                                        project.totalarea = 0;
                                        _.each(possibleDetails, function (detail) {
                                            project.totalarea += detail.area;
                                            project.totalcost += (detail.saleprice * detail.area);
                                            project.details.push(detail);
                                        });

                                    });

                                    var projectDetailIds = _.pluck(projectDetails, 'id');
                                    base.GetEntities(detailStyleModel, {where: {projectdetailid: projectDetailIds}})
                                        .then(function (styles) {
                                            styles = base.FixSqlResult(styles);
                                            _.each(possibleResults, function (project) {
                                                _.each(project.details, function (style) {
                                                    var innerStyle = _.where(styles, {'projectdetailid': style.id});
                                                    style.styles = [];
                                                    style.styles = innerStyle;

                                                });
                                            });
                                            deferred.resolve(possibleResults);
                                        }, function (error) {
                                            return deferred.reject(error);
                                        });
                                })
                                .fail(function (error) {
                                    return deferred.reject(error);

                                });
                        }

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

function search(app, req){
    var deferred = Q.defer();
    try{
        innerSearch(app,req)
            .then(function (data) {
                // Get a list of the add users to see if they have permission to view financial info
                // innerSearch already make sure that the user has access to view the lead
                var results = [],
                    suspect = [],
                    person = req.user.person;

                // if the adduser is the person requesting the data, then add it to the results
                _.each(data, function(project){
                    project.permission = 0;
                    if(project.addedby === person){
                        var full =
                            teamDelegate.Permissions.ReadSystem |
                            teamDelegate.Permissions.EditSystem |
                            teamDelegate.Permissions.ReadPerson |
                            teamDelegate.Permissions.EditPerson |
                            teamDelegate.Permissions.ReadFinancial |
                            teamDelegate.Permissions.EditFinancial |
                            teamDelegate.Permissions.ReadContract |
                            teamDelegate.Permissions.EditContract ;
                        project.permission = full;
                        results.push(project);
                    } else{
                        suspect.push(project);
                    }
                });

                if(suspect.length === 0){
                    return deferred.resolve(results);
                }

                var users = [],
                    financial = teamDelegate.Permissions.ReadFinancial |
                        teamDelegate.Permissions.EditFinancial;

                _.each(suspect, function(project){
                    users.push(teamDelegate.Membership(app, person, project.addedby, financial));
                });

                Q.all(users)
                    .then(function(membership){
                        membership = base.FixSqlResult(membership);
                        _.each(suspect, function(project, i){
                            project.permission = 0;
                            if(membership[i]){
                                project.permission = financial;
                            }
                            results.push(project);
                        });


                    }, function(failure){
                        return deferred.reject(failure);
                    });


                return deferred.resolve(data);
            }, function(error){
                return deferred.reject(error);
            });
    }
    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}

project.prototype.Populate = populate;
project.prototype.Build = build;
project.prototype.Generate = generate;
project.prototype.Update = update;
project.prototype.Search = search;
project.instance = null;

if (project.callee !== project.getInstance) {
    throw new Error('This object cannot be instantiated');
}

project.getInstance = function () {
    if (this.instance === null) {
        this.instance = new project();
    }
    return this.instance;
};
module.exports = project.getInstance();