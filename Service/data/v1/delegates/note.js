/**
 * Created by tbbates on 1/12/15
 */
'use strict';

var Q = require('q'),
    base = require('./base')(),
    objectType = 'note';

var note = function note() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byName: {where: {name: 'need to supply the name'}}
    };
}

function populate(source, model, isNew) {


    if (isNew && source.id) {
        model.id = source.id;
    }

    if (isNew && source.fid) {
        model.fid = source.fid;
    }

    if (source.body) {
        model.body = source.body;
    }

}
note.prototype.Populate = populate;

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
            .then(function (note) {

                if (isNew) {
                    if (!source.fid) {
                        errors.push('missing fid');
                    } else {
                        note.fid = source.fid;
                    }
                }


                if (source.body) {
                    note.body = source.body;
                }

                base.VerifyDefaults(source, note, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(note);
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
note.prototype.Build= build;

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
note.prototype.Generate = generate;

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
note.prototype.Update = update;

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

        var ids = base.GetSearchCriteria(criteria, 'id'),
            fids = base.GetSearchCriteria(criteria, 'fid'),
            model = require('./../models/' + objectType)(app.db).Model();

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }
        if (fids.fid && fids.fid.length > 0) {
            modelCriteria.where.fid = fids.fid;
        }

        base.GetEntities(model, modelCriteria)
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
note.prototype.Search = search;

note.instance = null;

if (note.callee !== note.getInstance) {
    throw new Error('This object cannot be instantiated');
}

note.getInstance = function () {
    if (this.instance === null) {
        this.instance = new note();
    }
    return this.instance;
};
module.exports = note.getInstance();