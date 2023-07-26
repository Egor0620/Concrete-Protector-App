/**
 * Created by tbbates on 7/18/14.
 */
'use strict';
var base = require('./base')(),
    Q = require('q'),
    uuid = require('node-uuid'),
    objectType = 'accountrole';

var accountrole = function accountrole() {};

function SearchMethod() {
    return {
        byId: {where: {id: 'need to supply the id'}},
        byAccountId: {where: {accountid: 'need to supply the accountid'}}
    };
}

var roles = {
    user: 'user',
    administrator: 'administrator',
    subscriber: 'subscriber',
    machine: 'machine',
    concreteprotector: 'concreteprotector'
};
accountrole.prototype.Roles = roles;

function build(app, source, isNew, criteria) {
    var deferred = Q.defer(),
        errors = [],
        accountModel = require('./../models/' + objectType)(app.db).Model(),
        searchCriteria = {};

    if (!source) {
        return deferred.reject({message: 'source ' + objectType + ' missing', code: 420});
    }

    if (isNew && !source.id) {
        return deferred.reject({message: 'source ' + objectType + ' id missing', code: 420});
    }

    if (!criteria) {
        searchCriteria = new SearchMethod().byId;
        searchCriteria.where.id = source.id;
    } else {
        searchCriteria = criteria;
    }

    try {
        base.GetEntity(accountModel, searchCriteria, true)
            .then(function (accountrole) {
                isNew = accountrole.isNewRecord;
                if (isNew) {
                    if (!source.accountid) {
                        errors.push('missing accountid');
                    } else {
                        accountrole.accountid = source.accountid;
                    }
                }

                //username
                if (!source.role && isNew) {
                    errors.push('missing role');
                } else if (source.role && source.role.length === 0) {
                    errors.push('missing role');
                } else {
                    accountrole.role = source.role;
                    accountrole.hasChanges = true;
                }


                if (!isNew) {

                    if (!source.version && accountrole.version) {
                        source.version = accountrole.version;
                    }
                }

                base.VerifyDefaults(source, accountrole, errors, isNew);


                if (errors.length === 0) {
                    return deferred.resolve(accountrole);
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
accountrole.prototype.Build = build;

function populate(source, model, isNew) {

    if (isNew) {
        model.id = uuid.v4();
    }
    else {
        model.id = source.id;
    }

    if (source.role) {
        model.role = source.role;
    }

    if (isNew) {
        if (source.accountid) {
            model.accountid = source.accountid;
        }
    }

}
accountrole.prototype.Populate = populate;

accountrole.instance = null;

if (accountrole.callee !== accountrole.getInstance) {
    throw new Error('This object cannot be instantiated');
}

accountrole.getInstance = function () {
    if (this.instance === null) {
        this.instance = new accountrole();
    }
    return this.instance;
};
module.exports = accountrole.getInstance();
