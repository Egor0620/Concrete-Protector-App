/**
 * Created by tbbates on 7/14/14.
 */
'use strict';
module.exports = function () {
    var delegate = require('../delegates/reference')(),
        base = require('./base')();

    function getStates(app, req, res, next) {
        return base.GetAction(app, req, res, next, delegate.GetStates(app, req));
    }

    function getGeneric(app, req, res, next) {
        return base.GetAction(app, req, res, next, delegate.GetGeneric(app, req));
    }

    return{
        GetStates: getStates,
        GetGeneric: getGeneric
    };
};