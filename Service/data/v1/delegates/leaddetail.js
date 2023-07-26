/**
 * Created by tbbates on 7/14/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'leaddetail';

var leaddetail = function leaddetail() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byLeadId: {where: {leadid: 'need to supply the lead id'}}
    };
}

function populate(source, model, isNew) {

    if (isNew) {
        model.id = uuid.v4();
    }
    else {
        model.id = source.id;
    }

    if (source.leadid) {
        model.leadid = source.leadid;
    }

    if (source.email) {
        model.email = source.email;
    }

    if (source.besttimetocall) {
        model.besttimetocall = source.besttimetocall;
    }

    if (source.hearaboutus) {
        model.hearaboutus = source.hearaboutus;
    }

    if (source.howcanwehelp) {
        model.howcanwehelp = source.howcanwehelp;
    }

}
leaddetail.prototype.Populate = populate;

function build(app, source, isNew) {
    var deferred = Q.defer(),
        errors = [],
        criteria = new SearchMethod().byId,
        leadDetailModel = require('./../models/' + objectType)(app.db).Model();


    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {
        criteria.where.id = source.id;
        base.GetEntity(leadDetailModel, criteria, true)
            .then(function (leaddetail) {
                if (isNew) {
                    if (!source.leadid) {
                        errors.push('missing leadid');
                    } else {
                        leaddetail.leadid = source.leadid;
                    }
                }

                if (source.email) {
                    leaddetail.email = source.email;
                } else {
                    leaddetail.email = '';
                }

                if (source.besttimetocall) {
                    leaddetail.besttimetocall = source.besttimetocall;
                }
                else {
                    leaddetail.besttimetocall = '';
                }

                if (source.hearaboutus) {
                    leaddetail.hearaboutus = source.hearaboutus;
                } else {
                    leaddetail.hearaboutus = '';
                }

                if (source.howcanwehelp) {
                    leaddetail.howcanwehelp = source.howcanwehelp;
                } else {
                    leaddetail.howcanwehelp = '';
                }

                base.VerifyDefaults(source, leaddetail, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(leaddetail);
                } else {
                    return deferred.reject({message: JSON.stringify(errors.join(', ')), code: 500});
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
leaddetail.prototype.Build = build;

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
leaddetail.prototype.Generate = generate;

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
leaddetail.prototype.Update = update;

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
leaddetail.prototype.Remove = remove;

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
        var leadids = base.GetSearchCriteria(criteria, 'leadid');
        var objectModel = require('./../models/' + objectType)(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }
        if (leadids.leadid && leadids.leadid.length > 0) {
            modelCriteria.where.leadid = leadids.leadid;
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
leaddetail.prototype.Search = search;

leaddetail.instance = null;

if (leaddetail.callee !== leaddetail.getInstance) {
    throw new Error('This object cannot be instantiated');
}

leaddetail.getInstance = function () {
    if (this.instance === null) {
        this.instance = new leaddetail();
    }
    return this.instance;
};
module.exports = leaddetail.getInstance();