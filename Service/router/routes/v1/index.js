'use strict';
module.exports = function (app, path) {
        var base = require('./base')();

    base.Router.use(
        app.utility.HeaderCheck, // verify that the header accesskey has been provided
        function (req, res, next) {
            next();
        });

    base.Router.use(
        app.utility.CoorsCheck, // COORS check
        function (req, res, next) {
            next();
        });

    base.Router.use(
        app.utility.Jwt,
        function (req, res, next) {
            next();
        });

    base.Router.use(
        app.utility.DecryptAccount, // verify that the header accesskey has been provided
        function (req, res, next) {
            next();
   });

    app.use(path, base.Router);
};