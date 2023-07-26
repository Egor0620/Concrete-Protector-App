/**
 * Created by tbbates on 7/14/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    objectType = 'person',
    teamDelegate = require('./team'),
    postal = require('postal'),
    channel = postal.channel();

var person = function person() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byPersonId: {where: {personid: 'need to supply the personid'}}
    };
}

function populate(source, model) {

    if (source.id) {
        model.id = source.id;
    }

    if (source.firstname) {
        model.firstname = source.firstname;
    }
    else {
        model.firstname = '';
    }

    if (source.lastname) {
        model.lastname = source.lastname;
    }
    else {
        model.lastname = '';
    }

    if (source.company) {
        model.company = source.company;
    }
    else {
        model.company = '';
    }

}
person.prototype.Populate = populate;

function build(app, source, isNew) {
    var deferred = Q.defer(),
        errors = [],
        personModel = require('./../models/' + objectType)(app.db).Model();

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }


    try {
        var criteria = new SearchMethod().byId;
        criteria.where.id = source.id;
        base.GetEntity(personModel, criteria, true)
            .then(function (person) {

                if (source.firstname) {
                    person.firstname = source.firstname;
                }
                else {
                    person.firstname = '';
                }
                if (source.lastname) {
                    person.lastname = source.lastname;
                }
                else {
                    person.lastname = '';
                }
                if (source.company) {
                    person.company = source.company;
                }
                else {
                    person.company = '';
                }

                base.VerifyDefaults(source, person, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(person);
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
person.prototype.Build = build;

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
                teamDelegate.EntityPermission(app, data[0], changePerson, isNew, teamDelegate.Permissions.EditPerson)
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
        changePerson = req.user.person; // person making the changes
    try {
        save(app, req.body, changePerson, true)
            .then(function (data) {
                deferred.resolve(data);
                var message ={
                    'app': app,
                    'person': data
                };
                channel.publish(objectType+'.generate', message);

            }, function (error) {
                deferred.reject(error);
            });
    }

    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
person.prototype.Generate = generate;

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
person.prototype.Remove = remove;

function update(app, req) {

    var deferred = Q.defer(),
        changePerson = req.user.person; // person making the changes
    try {
        save(app, req.body, changePerson, false)
            .then(function (data) {
                deferred.resolve(data);
                var message ={
                    'app': app,
                    'person': data
                };
                channel.publish(objectType+'.update', message);
            }, function (error) {
                deferred.reject(error);
            });
    }

    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
person.prototype.Update = update;

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
        var objectModel = require('./../models/' + objectType)(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
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
person.prototype.Search = search;

person.instance = null;

if (person.callee !== person.getInstance) {
    throw new Error('This object cannot be instantiated');
}

person.getInstance = function () {
    if (this.instance === null) {
        this.instance = new person();
    }
    return this.instance;
};
module.exports = person.getInstance();

