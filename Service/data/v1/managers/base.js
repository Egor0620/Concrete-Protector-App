/**
 * Created by tbbates on 7/18/14.
 */
'use strict';
module.exports = function () {

    function post(app, req, res, next, delegateMethod) {
        var err = new Error();
        err.code = 401;

        if (!app) {
            err = new Error('app missing');
            err.code = 420;
            throw  err;
        }

        if (!req) {
            err = new Error('req missing');
            err.code = 420;
            throw  err;
        }

        if (!req.body) {
            var result = 'request body not found';
            console.log(result);
            err = new Error(result);
            err.code = 400;
            // forward control on to the next registered error handler:
            return next(err);
        }
        try {
            delegateMethod
                .then(function (data) {
                    if(!data){
                        err = new Error('no results');
                        err.code = 404;
                        // forward control on to the next registered error handler:
                        return next(err);
                    }
                    res.send(data);
                }, function(error){
                    err = new Error(error.message);
                    err.code = error.code;
                    // forward control on to the next registered error handler:
                    return next(err);
                })
                .fail(function(error){
                    err = new Error(error.message);
                    err.code = error.code;
                    // forward control on to the next registered error handler:
                    return next(err);
            })
                .catch(function(error){
                    err = new Error(error.message);
                    err.code = error.code;
                    // forward control on to the next registered error handler:
                    return next(err);
                    //
                });
        }
        catch (e) {
            err = new Error(e);
            // forward control on to the next registered error handler:
            return next(err);
        }
    }
/*
    function postOld(app, req, res, next, delegateMethod) {
        var err = new Error();
        err.code = 401;

        if (!app) {
            err = new Error('app missing');
            err.code = 420;
            throw  err;
        }

        if (!req) {
            err = new Error('req missing');
            err.code = 420;
            throw  err;
        }

        if (!req.body) {
           var result = 'request body not found';
            console.log(result);
            err = new Error(result);
            err.code = 400;
            // forward control on to the next registered error handler:
            return next(err);
        }
        try {
            delegateMethod
                .then(function (data) {
                    if(!data){
                        err = new Error('no results');
                        err.code = 404;
                        // forward control on to the next registered error handler:
                        return next(err);
                    }
                    res.send(data);
                }, function(error){
                    err = new Error(error.message);
                    err.code = error.code;
                    // forward control on to the next registered error handler:
                    return next(err);
                    //
                });
        }
        catch (e) {
            err = new Error(e);
            // forward control on to the next registered error handler:
            return next(err);
        }
    }
*/
    function get(app, req, res, next, delegateMethod) {
        var err = new Error();
        err.code = 401;
        if (!app) {
            err = new Error('app missing');
            err.code = 420;
            throw  err;
        }

        if (!req) {
            err = new Error('req missing');
            err.code = 420;
            throw  err;
        }

        try {
            delegateMethod
                .then(function (data) {
                    res.send(data);
                })
                .fail(function (error) {
                    err = new Error(error.message);
                    err.code = error.code;
                    // forward control on to the next registered error handler:
                    return next(err);
                    //
                });
        }
        catch (e) {
            err = new Error(e);
            // forward control on to the next registered error handler:
            return next(err);
        }
    }

    return{
        PostAction: post,
        GetAction: get
    };
};