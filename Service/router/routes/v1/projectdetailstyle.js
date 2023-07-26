'use strict';
module.exports = function (app, path) {
    var base = require('./base')(),
        config = {
            type: 'projectdetailstyle',
            generate: true,
            update: true,
            remove: true,
            search: true,
            simpleDelegate: false,
            simpleManager: true
        },
        manager = require('../../../data/v1/managers/simple')(config);

    var skipoptions = [];

    var regexskipoptions = [
        '\/api\/v1\/projectdetailstyle\/(.+)'
    ];

    function startup(){
        base.Skip(app, path, skipoptions);
        base.RegExSkip(app, regexskipoptions);
        app.use(path, base.Router);
    }

    base.Router.post('/', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Generate(app, req, res, next));
    });

    base.Router.put('/', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Update(app, req, res, next));
    });

    base.Router.delete('/:id', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Remove(app, req, res, next));
    });

    base.Router.post('/search', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Search(app, req, res, next));
    });

    startup();
};