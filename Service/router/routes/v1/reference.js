'use strict';
module.exports = function (app, path) {
    var base = require('./base')(),
        manager = require('../../../data/v1/managers/reference')();

    var skipoptions = [];

    var regexskipoptions = [
        '\/api\/v1\/reference\/(.+)'
    ];

    function startup(){
        base.Skip(app, path, skipoptions);
        base.RegExSkip(app, regexskipoptions);
        app.use(path, base.Router);
    }

    base.Router.get('/generic/:id', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.GetGeneric(app, req, res, next));
    });

    base.Router.get('/states/:id', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.GetStates(app, req, res, next));
    });

    startup();
};