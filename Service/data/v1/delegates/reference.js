/**
 * Created by tbbates on 7/14/14.
 */
'use strict';
module.exports = function () {
    var Q = require('q'),
        base = require('./base')();

    function getGeneric(app, req) {
        var deferred = Q.defer();
        try {
            var model = require('./../models/' + req.params.id)(app.db).Model();
            base.GetEntities(model)
                .then(function (result) {
                    return deferred.resolve(result);
                },
                function (error) {
                    return deferred.reject(error);
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    function getStates(app, req) {
        var deferred = Q.defer();
        try {
            var model = require('./../models/state')(app.db).Model();
            // + req.params.id
            base.GetEntities(model,
                {where: {'countryid': req.params.id.toUpperCase()}})
                .then(function (result) {
                    return deferred.resolve(result);
                },
                function (error) {
                    return deferred.reject(error);
                });
        }
        catch (e) {
            return deferred.reject({message : e, code : 400 });
        }
        return deferred.promise;
    }

    return{
        GetGeneric: getGeneric,
        GetStates: getStates
    };
};