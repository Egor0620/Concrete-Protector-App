/**
 * Created by tbbates on 7/10/14.
 * This will serve as a simple class for create update search
 */
'use strict';
module.exports = function (configuration) {
    var base = require('./base')(),
        delegate = {};

    if (configuration.simpleDelegate === true) {
        delegate = require('../delegates/simple')(configuration.type);
    }
    else {
        delegate = require('../delegates/' + configuration.type);
    }
    /*
     the configuration object should look like this:
     config = {
     type: 'project',
     create: true,
     update: true,
     remove: false,
     search: true,
     simpleDelegate: false,
     simpleManager: true
     }
     */

    function search(app, req, res, next) {
        if (configuration.search === true) {
            return base.PostAction(app, req, res, next, delegate.Search(app, req, next));
        }
        next();
    }

    function generate(app, req, res, next) {
        if (configuration.generate === true) {
            return base.PostAction(app, req, res, next, delegate.Generate(app, req));
        }
        next();
    }

    function update(app, req, res, next) {
        if (configuration.update === true) {
            return base.PostAction(app, req, res, next, delegate.Update(app, req));
        }
        next();
    }

    function remove(app, req, res, next) {
        if (configuration.remove === true) {
            return base.PostAction(app, req, res, next, delegate.Remove(app, req));
        }
        next();
    }

    // Person Lead
    function leadShares(app, req, res, next) {
        if (configuration.type === 'personlead') {
            return base.GetAction(app, req, res, next, delegate.LeadShares(app, req));
        }
        next();
    }

    //account
    function login(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.Login(app, req.body));
        }
        next();
    }

    function changepassword(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.ChangePassword(app, req));
        }
        next();
    }

    function forgotpassword(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.ForgotPassword(app, req.body));
        }
        next();
    }

    function feedback(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.Feedback(app, req));
        }
        next();
    }

    function register(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.Register(app, req.body));
        }
        next();
    }

    function extend(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.ExtendToken(app, req));
        }
        next();
    }

    function resolve(app, req, res, next) {
        if (configuration.type === 'account') {
            return base.PostAction(app, req, res, next, delegate.Resolve(app, req));
        }
        next();
    }

    function verify(app, req,res,next){
        if(configuration.type === 'account'){
            return base.GetAction(app,req,res,next, delegate.Verify(app,req));
        }
    }

    function permission(app, req, res, next) {
        if (configuration.type === 'team') {
            return base.PostAction(app, req, res, next, delegate.Permission(app, req, next));
        }
        next();
    }

    function permissions(app, req, res, next) {
        if (configuration.type === 'team') {
            return base.PostAction(app, req, res, next, delegate.Permissions(app, req));
        }
        next();
    }

    function uploadimage(app, req, res, next) {
        if (configuration.type === 'storage') {
            return base.PostAction(app, req, res, next, delegate.Uploadimage(app, req));
        }
        next();
    }

    function downloadString(app, req, res, next) {
        if (configuration.type === 'storage') {
            return base.PostAction(app, req, res, next, delegate.DownloadString(app, req));
        }
        next();
    }

    function sendTo(app, req, res, next) {
        if (configuration.type === 'contract') {
            return base.PostAction(app, req, res, next, delegate.SendTo(app, req));
        }
        next();
    }


    return {
        Generate: generate,
        Update: update,
        Remove: remove,
        Search: search,
        LeadShares: leadShares,
        Login: login,
        ExtendToken: extend,
        Register: register,
        Resolve: resolve,
        ChangePassword: changepassword,
        ForgotPassword: forgotpassword,
        DownloadString: downloadString,
        Uploadimage: uploadimage,
        Feedback: feedback,
        Permission: permission,
        Permissions: permissions,
        Verify: verify,
        SendTo: sendTo
    };
};