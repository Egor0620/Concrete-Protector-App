'use strict';
module.exports = function () {
    var express = require('express'),
        moment = require('moment'),
        router = express.Router();


    function skip(app, path, options) {
        options.forEach(function (option) {
            app.skipoptions.push(path + option);
        });
    }

    function regexskip(app, options) {
        options.forEach(function (option) {
            app.regexskipoptions.push(option);
        });
    }

    function restAction(app, req, res, next, managerMethod) {
        try {
            //   If we have a user and  the token is about to expire, extend the token and include it in
            //   a response header named extend
            if (req.user && req.user.expires) {
                //var testexp = moment(req.user.expires);
                var expirationMoment = moment.utc(req.user.expires);
                var expiresIn = expirationMoment.diff(moment.utc((new Date())), 'm');

                if (expiresIn < app.config.tokenRenewIn) {

                    var account = require('../../../data/v1/delegates/account')();
                    account.ExtendToken(app, req)
                        .then(function (newToken) {
                            res.setHeader('renewtoken', newToken);
                            return managerMethod;
                        })
                        .fail(function (error) {
                            throw error;
                        });
                }
                else {
                    return managerMethod;
                }
            }
        }
        catch (e) {
            var err = new Error(e);
            err.code = 500;
            // forward control on to the next registered error handler:
            return next(err);
        }
    }

    return {
        RestAction: restAction,
        Router: router,
        Skip: skip,
        RegExSkip: regexskip
    };
};