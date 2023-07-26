/**
 * Created by tbbates on 7/22/14.
 */
'use strict';
var Q = require('q'),
    base = require('./base')(),
    uuid = require('node-uuid'),
    objectType = 'projectdetail';

var projectdetail = function projectdetail() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byProjectId: {where: {projectid: 'need to supply the project id'}}
    };
}

function build(app, source, isNew) {
    var deferred = Q.defer();
    var errors = [];
    var criteria = new SearchMethod().byId;
    var projectModel = require('./../models/' + objectType)(app.db).Model();

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    try {
        criteria.where.id = source.id;
        base.GetEntity(projectModel, criteria, true)
            .then(function (projectdetail) {

                if (isNew) {

                    if (!source.projectid) {
                        errors.push('missing project id');
                    } else {
                        projectdetail.projectid = source.projectid;
                    }

                    if (!source.systemid) {
                        errors.push('missing system id');
                    } else {
                        projectdetail.systemid = source.systemid;
                    }

                    if (!source.area) {
                        projectdetail.area = 0;
                    } else {
                        projectdetail.area = source.area;
                    }

                    if (!source.name) {
                        errors.push('missing name');
                    } else {
                        projectdetail.name = source.name;
                    }

                    if (source.systemsneeded) {
                        projectdetail.systemsneeded = source.systemsneeded;
                    }


                    if (!source.arealength) {
                        projectdetail.arealength = 0;
                    } else {
                        projectdetail.arealength = source.arealength;
                    }

                    if (!source.areawidth) {
                        projectdetail.areawidth = 0;
                    } else {
                        projectdetail.areawidth = source.areawidth;
                    }

                    if (!source.saleprice && isNew) {
                        projectdetail.saleprice = 0;
                    } else if (source.saleprice && source.saleprice.length === 0) {
                        projectdetail.saleprice = 0;
                    } else {
                        projectdetail.saleprice = source.saleprice;
                    }

                }
                else {

                    if (source.systemid) {
                        projectdetail.systemid = source.systemid;
                    }

                    if (source.area) {
                        projectdetail.area = source.area;
                    }

                    if (source.name) {
                        projectdetail.name = source.name;
                    }

                    if (source.systemsneeded) {
                        projectdetail.systemsneeded = source.systemsneeded;
                    } else {
                        projectdetail.systemsneeded = 0;
                    }

                    if (source.arealength) {
                        projectdetail.arealength = source.arealength;
                    }
                    else {
                        projectdetail.arealength = 0;
                    }

                    if (source.areawidth) {
                        projectdetail.areawidth = source.areawidth;
                    }
                    else {
                        projectdetail.areawidth = 0;
                    }

                    if (source.saleprice) {
                        projectdetail.saleprice = source.saleprice;
                    }
                    else {
                        projectdetail.saleprice = 0;
                    }
                }

                base.VerifyDefaults(source, projectdetail, errors, isNew);

                if (errors.length === 0) {
                    return deferred.resolve(projectdetail);
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
        projectDetail = body,
        actionDate = new Date();

    try {
        base.PopulateDefaults(body, projectDetail, actionDate, changePerson, isNew);

        if (isNew) {
            projectDetail.id = uuid.v4();
        }

        var itemsToSave = [];
        var sourceData = [];
        base.BuildSaveArray(itemsToSave, sourceData, build(app, projectDetail, isNew), projectDetail);


        Q.all(itemsToSave)
            .then(function (data) {
                app.db.Sequelize.transaction(function (t) {
                    var finalbuild = [];
                    for (var i = 0; i < data.length; i++) {
                        finalbuild.push(base.SaveEntity(data[i], sourceData[i], t));
                    }
                    Q.all(finalbuild)
                        .then(
                        function (saveresult) {
                            t.commit()
                                .error(function (error) {
                                    deferred.reject({message: error, code: 500});
                                });
                            t.done(function () {
                                deferred.resolve(saveresult[0]);
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

function search(app, req) {
    var deferred = Q.defer(),
        body = req.body,
        criteria = {};

    try {

        if (!(body.criteria instanceof Object)) {
            criteria = JSON.parse(body.criteria);
        }
        else {
            criteria = body.criteria;
        }

        var ids = base.GetSearchCriteria(criteria, 'id');
        var projectids = base.GetSearchCriteria(criteria, 'projectid');

        var pdc = {};
        pdc.where = {};

        var projectDetailModel = require('./../models/' + objectType)(app.db).Model();


        if (ids.id && ids.id.length > 0) {
            pdc.where.id = ids.id;
        }

        if (projectids.projectid && projectids.projectid.length > 0) {
            pdc.where.projectid = projectids.projectid;
        }

        base.GetEntities(projectDetailModel, pdc)
            .then(function (projectdetails) {
                var systems = _.pluck(projectdetails, 'systemid');

                var systemwhere = {};
                systemwhere.where = {};
                systemwhere.where.id = systems;
                var systemmodel = require('./../models/system')(app.db).Model();

                base.GetEntities(systemmodel, systemwhere)
                    .then(function (systems) {
                        //
                        var results = [];
                        _.each(projectdetails, function (pd) {

                            var newProjectDetail = JSON.parse(JSON.stringify(pd));
                            var newSystemDetail = _.where(systems, {'id': pd.systemid})[0];
                            newProjectDetail.system = JSON.parse(JSON.stringify(newSystemDetail));
                            results.push(newProjectDetail);
                        });

                        return deferred.resolve(results);
                    },
                    function (error) {
                        return deferred.reject(error);
                    });
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

projectdetail.instance = null;

projectdetail.prototype.Build = build;
projectdetail.prototype.Generate = generate;
projectdetail.prototype.Update = update;
projectdetail.prototype.Search = search;

if (projectdetail.callee !== projectdetail.getInstance) {
    throw new Error('This object cannot be instantiated');
}

projectdetail.getInstance = function () {
    if (this.instance === null) {
        this.instance = new projectdetail();
    }
    return this.instance;
};
module.exports = projectdetail.getInstance();