'use strict';
module.exports = function (app, path) {
    var base = require('./base')(),
        config = {
            type: 'team',
            generate: true,
            update: true,
            remove: true,
            search: true,
            simpleDelegate: false,
            simpleManager: true
        },
        manager = require('../../../data/v1/managers/simple')(config);


    var regexskipoptions = [
        '\/api\/v1\/team\/(.+)'
    ];
    function startup(){
        base.RegExSkip(app, regexskipoptions);
        app.use(path, base.Router);
    }

    base.Router.post('/', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Generate(app, req, res, next));
    });

    base.Router.put('/', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Update(app, req, res, next));
    });

    base.Router.post('/search', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Search(app, req, res, next));
    });

    base.Router.delete('/:id', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']),function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Remove(app, req, res, next));
    });

    base.Router.post('/permission', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Permission(app, req, res, next));
    });

    base.Router.post('/permissions', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Permissions(app, req, res, next));
    });

    base.Router.post('/ownership', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Ownership(app, req, res, next));
    });

    base.Router.post('/membership', app.utility.RequireRoles(['concreteprotector','subscriber','administrator']), function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Membership(app, req.user.person, res, next));
    });

    startup();
};