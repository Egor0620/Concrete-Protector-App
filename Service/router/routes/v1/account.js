'use strict';
module.exports = function (app, path) {
    var base = require('./base')(),
        email = require('../../../modules/emailer')(),
        config = {
            type: 'account',
            generate: true,
            update: true,
            remove: true,
            search: true,
            simpleDelegate: false,
            simpleManager: true
        },
        manager = require('../../../data/v1/managers/simple')(config),
        skipoptions = [
            '/',
            '/login',
            '/register',
            '/forgotpassword',
            '/verify'
        ];

    function startup() {
        base.Skip(app, path, skipoptions);
        app.use(path, base.Router);
    }

    base.Router.post('/login', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Login(app, req, res, next));
    });

    base.Router.post('/changepassword', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.ChangePassword(app, req, res, next));
    });

    base.Router.post('/forgotpassword', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.ForgotPassword(app, req, res, next));
    });

    base.Router.post('/feedback', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Feedback(app, req, res, next));
    });

    base.Router.post('/register', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Register(app, req, res, next));
    });

    base.Router.post('/extend', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.ExtendToken(app, req, res, next));
    });

    base.Router.post('/resolve', function (req, res, next) {
        return base.RestAction(app, req, res, next, manager.Resolve(app, req, res, next));
    });

    base.Router.post('/verify', function(req, res, next){
       return base.RestAction(app,req, res, next, manager.Verify(app,req,res, next));
    });

    //base.Router.get('/',app.utility.RequireRoles(['user']), function (req, res) {
    base.Router.get('/', function (req, res) {
        email.SendTextEmail(app, 'tbbates@gmail.com', 'brad@natomis.com', 'simple test', 'simple text');
        res.send({'status': 'active'});
    });

    startup();
};