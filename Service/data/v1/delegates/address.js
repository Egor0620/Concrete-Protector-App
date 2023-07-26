/**
 * Created by tbbates on 7/19/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    objectType = 'address';

var address = function address() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byPersonId: {where: {personid: 'need to supply the personid'}},
        allButThisId: {
            where: {
                personid: 'need to supply the personid',
                id: {ne: 'need to set id, make sure to set ne'}
            }
        }
    };
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
            .then(function (address) {

                if (isNew) {
                    if (!source.personid) {
                        errors.push('missing personid');
                    } else {
                        address.personid = source.personid;
                    }
                }

                if (!source.address1 && isNew) {
                    errors.push('missing address');
                } else if (source.address1 && source.address1.length === 0) {
                    errors.push('missing address');
                } else {
                    address.address1 = source.address1;
                }

                if (source.address2) {
                    address.address2 = source.address2;
                }

                if (!source.city && isNew) {
                    address.city = '';
                } else if (source.city && source.city.length === 0) {
                    address.city = '';
                } else {
                    address.city = source.city;
                }

                if (!source.state && isNew) {
                    address.state = 'OH';
                } else if (source.state && source.state.length === 0) {
                    address.state = 'OH';
                } else {
                    address.state = source.state;
                }

                if (!source.zip && isNew) {
                    address.zip = '00000';
                } else if (source.zip && source.zip.length === 0) {
                    address.zip = '00000';
                } else {
                    address.zip = source.zip;
                }

                if (!source.type && isNew) {
                    address.type = 'main';
                } else if (source.type && source.type.length === 0) {
                    errors.push('missing address type');
                } else {
                    address.type = source.type;
                }

                address.primary = !!(source.primary && source.primary === true);


                base.VerifyDefaults(source, address, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(address);
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
address.prototype.Build = build;

function populate(source, model, isNew) {

    if (isNew) {
        model.personid = source.personid;
    }

    if (source.id) {
        model.id = source.id;
    }

    if (!source.address1 && isNew) {
        model.address1 = '';
    }
    else if (source.address1) {
        model.address1 = source.address1;
    }

    if (!source.address2 && isNew) {
        model.address2 = '';
    }
    else if (source.address2) {
        model.address2 = source.address2;
    }

    if (source.city) {
        model.city = source.city;
    }

    if (source.state) {
        model.state = source.state;
    }

    if (source.zip) {
        model.zip = source.zip;
    }

    if (!source.type && isNew) {
        model.type = 'main';
    } else if (source.type) {
        model.type = source.type;
    }

    if (!source.primary && isNew) {
        model.primary = false;
    } else if (source.primary) {
        model.primary = source.primary;
    }
    else {
        model.primary = false;
    }

}
address.prototype.Populate = populate;

function save(app, source, changePerson, isNew) {
    var deferred = Q.defer(),
        model = {},
        actionDate = new Date();
    try {
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
                        function () {
                            t.rollback();

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

function removePrimary(app, source) {
    var deferred = Q.defer(),
        errors = [],
        model = require('./../models/' + objectType)(app.db).Model();

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    try {

        var criteria = new SearchMethod().allButThisId;
        criteria.where.id.ne = source.id;
        criteria.where.personid = source.personid;

        base.GetEntities(model, criteria, true)
            .then(function (models) {

                var itemsToSave = [];
                var sourceData = [];
                _.each(models, function (model) {
                    model.primary = false;

                    base.VerifyDefaults(model, model, errors, false);
                    if (errors.length === 0) {
                        base.BuildSaveArray(itemsToSave, sourceData, build(app, model, model, false), model);
                    } else {
                        return deferred.reject({message: JSON.stringify(errors.join(', ')), code: 500});
                    }
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
                                        deferred.resolve(newmodel);
                                    });
                                },
                                function () {
                                    t.rollback();

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
        return deferred.reject({message: e, code: 500});
    }

    return deferred.promise;
}

function generate(app, req) {

    var deferred = Q.defer(),
        changePerson = req.user.person,
        source = req.body,
        promises = [],
        isNew = true;

    try {
        promises.push(save(app, source, changePerson, isNew));
        if (source.primary === true) {
            promises.push(removePrimary(app, source));
        }
        Q.all(promises)
            .then(function (data) {
                deferred.resolve(data[0]);
            }, function (error) {
                deferred.reject(error);
            });
    }

    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
address.prototype.Generate = generate;

function update(app, req) {

    var deferred = Q.defer(),
        changePerson = req.user.person,
        source = req.body,
        promises = [],
        isNew = false;

    try {
        promises.push(save(app, source, changePerson, isNew));
        if (source.primary === true) {
            promises.push(removePrimary(app, source));
        }
        Q.all(promises)
            .then(function (data) {
                deferred.resolve(data[0]);
            }, function (error) {
                deferred.reject(error);
            });
    }

    catch (e) {
        return deferred.reject({message: e, code: 400});
    }
    return deferred.promise;
}
address.prototype.Update = update;

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
address.prototype.Remove = remove;

function search(app, req) {
    var deferred = Q.defer(),
        body = req.body;

    try {
        //
        var criteria,
            model = require('./../models/' + objectType)(app.db).Model();

        if (!(body.criteria instanceof Object)) {
            criteria = JSON.parse(body.criteria);
        }
        else {
            criteria = body.criteria;
        }

        var ids = base.GetSearchCriteria(criteria, 'id');
        var personids = base.GetSearchCriteria(criteria, 'personid');

        var modelCriteria = {};
        modelCriteria.where = {};
        if (ids.id && ids.id.length > 0) {
            modelCriteria.where.id = ids.id;
        }
        if (personids.personid && personids.personid.length > 0) {
            modelCriteria.where.personid = personids.personid;
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
address.prototype.Search = search;

address.instance = null;

if (address.callee !== address.getInstance) {
    throw new Error('This object cannot be instantiated');
}

address.getInstance = function () {
    if (this.instance === null) {
        this.instance = new address();
    }
    return this.instance;
};
module.exports = address.getInstance();

