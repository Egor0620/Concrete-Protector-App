/**
 * Created by tbbates on 5/12/15.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    objectType = 'contract',
    teamDelegate = require('./team'),
    contractAccess = teamDelegate.Permission.ReadContract | teamDelegate.Permissions.EditContract,
    fullAccess =
        teamDelegate.Permissions.ReadSystem |
        teamDelegate.Permissions.EditSystem |
        teamDelegate.Permissions.ReadPerson |
        teamDelegate.Permissions.EditPerson |
        teamDelegate.Permissions.ReadFinancial |
        teamDelegate.Permissions.EditFinancial |
        teamDelegate.Permissions.ReadContract |
        teamDelegate.Permissions.EditContract;

var project = function project() {
};

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

    if (source.signatureid) {
        model.signatureid = source.signatureid;
    }

    if (source.signaturedate) {
        model.signaturedate = source.signaturedate;
    }

    if (source.templateid) {
        model.templateid = source.templateid;
    }

    if (source.termid) {
        model.termid = source.termid;
    }

    if (source.headerid) {
        model.headerid = source.headerid;
    }

    if (source.footerid) {
        model.footerid = source.footerid;
    }

    if (source.projectid) {
        model.projectid = source.projectid;
    }

    if (source.price) {
        model.price = source.price;
    }

    if (source.discount) {
        model.discount = source.discount;
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
            .then(function (contract) {

                if (source.signatureid) {
                    contract.signatureid = source.signatureid;
                } else {
                    contract.signatureid = null;
                }

                if (source.signaturedate) {
                    contract.signaturedate = source.signaturedate;
                } else {
                    contract.signaturedate = null;
                }

                if (!source.templateid && isNew) {
                    errors.push('missing template');
                } else {
                    contract.templateid = source.templateid;
                }

                if (!source.termid && isNew) {
                    errors.push('missing term');
                } else {
                    contract.termid = source.termid;
                }

                if (source.headerid) {
                    contract.headerid = source.headerid;
                } else {
                    contract.headerid = null;
                }

                if (source.footerid) {
                    contract.footerid = source.footerid;
                } else {
                    contract.footerid = null;
                }

                if (!source.projectid && isNew) {
                    errors.push('missing project');
                } else {
                    contract.projectid = source.projectid;
                }

                if (!source.price && isNew) {
                    errors.push('missing price');
                } else {
                    contract.price = source.price;
                }

                if (!source.discount && isNew) {
                    errors.push('missing project');
                } else {
                    contract.discount = source.discount;
                }

                base.VerifyDefaults(source, contract, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(contract);
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
    var deferred = Q.defer();
        var body = req.body;
        var criteria = {};
        var baseTeams = [];
        var hints = {
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
                //baseTeams.push(leadDelegate.Ownership(app, req));
                baseTeams.push(base.Ownership(app, req.user.person, objectType));
            }
            if (
                _.contains(req.user.roles, 'subscriber') === true ||
                _.contains(req.user.roles, 'concreteprotector') === true ||
                _.contains(req.user.roles, 'administrator') === true
            ) {
                baseTeams.push(base.TeamMembership(app, req.user.person, objectType, contractAccess));
            }
        }
        // we are getting the contract templates so that we can check at the end to make sure the
        // results are for contract templates that the user has access to use
        Q.all(baseTeams)
            .then(function (contractTemplateResults) {
                contractTemplateResults = base.FixSqlResult((contractTemplateResults));
                var contractTemplates = [];

                //get the unique searchresults
                _.each(contractTemplateResults, function (innerResult) {
                    _.each(innerResult, function (contractTemplate) {
                        if (_.where(contractTemplates, {'id': contractTemplate.id}).length === 0) {
                            contractTemplates.push(contractTemplate);

                        }
                    });
                });


                var ids = base.GetSearchCriteria(criteria, 'id');
                var projectids = base.GetSearchCriteria(criteria, 'projectid');
                /*
                 if (ids.length === 0) {
                 return deferred.reject('missing search criteria');
                 }
                 */

                var pc = {where: {}};
                var contractTemplateModel = require('./../models/' + objectType)(app.db).Model();

                if (projectids.projectid && projectids.projectid.length > 0) {
                    pc.where.projectid = projectids.projectid;
                }

                if (ids.id && ids.id.length > 0) {
                    pc.where.id = ids.id;
                }


                var queries = [];
                queries.push(base.GetEntities(contractTemplateModel, pc));

                Q.all(queries)
                    .then(function (queryResults) {
                        queryResults = base.FixSqlResult(queryResults);

                        var possibleResults = [];

                        // only get the results we have access to use
                        _.each(contractTemplates, function (lead) {
                            var projects = _.where(queryResults[0], {leadid: lead.id});
                            _.each(projects, function (project) {
                                if (_.where(possibleResults, {'id': project.id}).length === 0) {
                                    possibleResults.push(project);
                                }
                            });
                        });
                        deferred.resolve(possibleResults);
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

function search(app, req) {
    var deferred = Q.defer();
    try {
        innerSearch(app, req)
            .then(function (data) {
                // Get a list of the add users to see if they have permission to view contract info
                // innerSearch already make sure that the user has access to view the contract template
                var results = [],
                    suspect = [],
                    person = req.user.person;

                // if the adduser is the person requesting the data, then add it to the results
                _.each(data, function (contracttemplate) {
                    contracttemplate.permission = 0;
                    if (contracttemplate.addedby === person) {
                        contracttemplate.permission = fullAccess;
                        results.push(contracttemplate);
                    } else {
                        suspect.push(contracttemplate);
                    }
                });

                if (suspect.length === 0) {
                    return deferred.resolve(results);
                }

                var users = [];

                _.each(suspect, function (contractTemplate) {
                    users.push(teamDelegate.Membership(app, person, contractTemplate.addedby, contractAccess));
                });

                Q.all(users)
                    .then(function (membership) {
                        membership = base.FixSqlResult(membership);
                        _.each(suspect, function (project, i) {
                            project.permission = 0;
                            if (membership[i]) {
                                var thisMembership = membership[i];
                                project.permission = thisMembership.permission;
                            }
                            results.push(project);
                        });
                    }, function (failure) {
                        return deferred.reject(failure);
                    });


                return deferred.resolve(data);
            }, function (error) {
                return deferred.reject(error);
            });
    }
    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}

function sendTo(app, req) {
    var deferred = Q.defer();

    var subject = req.body.subject;
    var to = req.body.emailTo;
    var emailBody = req.body.htmlBody;
    var emailer = require('../../../modules/emailer')();

    emailer.sendHtmlEmailViaMailGun(app, "noreply@coatingsestimator.com", to, subject, emailBody);
    deferred.resolve({messge:'contract has been sent to ' + to});

    return deferred.promise;
}

project.prototype.Populate = populate;
project.prototype.Build = build;
project.prototype.Generate = generate;
project.prototype.Update = update;
project.prototype.Search = search;
project.prototype.SendTo = sendTo;
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