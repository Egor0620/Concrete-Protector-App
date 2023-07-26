/**
 * Created by tbbates on 7/10/14.
 */
'use strict';
/* indent: 2, node:true, nomen: true, maxlen: 80, vars: true*/
module.exports = function (app) {
    var uuid = require('node-uuid'),
        crypto = require('crypto'),
     expressJwt = require('express-jwt')({
        secret: app.config.jwtSecret
    }).unless({path: app.skipoptions});

    function coorsCheck(req, res, next) {

        try {

            var whiteList = ['localhost', 'concrete.natomis.com', 'http://0.0.0.0:9000'];
            var blackList = ['badpeople.com'];

            if (req.cpAccessGranted === true) {
                if (whiteList.indexOf(req.hostname) === -1) {
                    whiteList.push(req.hostname);
                }
            }

            var isWhiteList = _.contains(whiteList, req.hostname);
            var isBlackList = _.contains(blackList, req.hostname);

            var fullUrl = req.headers.origin;// + req.originalUrl;

            if (isWhiteList && !isBlackList) {
                //if (!isBlackList) {
                res.header('Access-Control-Allow-Origin', fullUrl); //'*'
                res.header('Access-Control-Allow-Headers', 'X-Requested-With, Concrete-Access, Content-Type, Authorization');
                res.header('Access-Control-Allow-Credentials', true);
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
                res.header('Access-Control-Request-Headers', 'Null, Accept');
                res.header('Access-Control-Expose-Headers','renewtoken');
            }
            next();
        }
        catch (e) {
            console.log(e);
        }
    }

    function headerCheck(req, res, next) {
        try {
            req.cpAccessGranted = false;
            /// skip options, they don't have headers
            if (req.method.toLowerCase() === 'options') {
                if (req.header('access-control-request-headers').indexOf('concrete-access') > -1) {
                    req.cpAccessGranted = true;
                }
                next();
            }
            else {
                var tryKey = req.header('Concrete-Access');
                if (!tryKey) {
                    res.statusCode = 400;
                    res.end('access key required');
                } else {
                    req.cpAccessGranted = true;
                    next();
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    function decryptAccount(req, res, next) {
        if (req.user) {

            if (req.user.token) {
                req.token = req.user.token;
                //Decrypt the user token from the request user
                var requestUser = decryptAes(app.config.jwtKey, req.user.token);

                //Replace the request user with the decrypted user from above
                req.user = JSON.parse(requestUser);
            }
        }
        next();
    }

    function decryptAes(password, input) {
        var dcipher = crypto.createDecipher('aes-256-cbc', password);
        var dcryptedBuffers = [dcipher.update(new Buffer(input))];
        dcryptedBuffers.push(dcipher.final());
        return Buffer.concat(dcryptedBuffers).toString('utf8');
    }

    function jwt(req, res, next) {

        var canSkip = false,
            url = req.url,
            authpresent = false,  // was the authorization header present
            wasSkipped = false;   // was the path originally being skipped


        // See if authentication is being sent from the client
        if (req.headers.authorization) {
            authpresent = true;
            wasSkipped = true;
        }


        if (app.skipoptions.indexOf(url) > -1) {
            canSkip = true;
            wasSkipped = true;
        }

        if (canSkip === false) {
            app.regexskipoptions.forEach(function (pattern) {
                var myRegex = new RegExp(pattern);
                var matches = myRegex.exec(url);
                if (matches && matches.length > 0) {
                    app.skipoptions.push(url);
                    wasSkipped = true;
                }
            });
        }
/*
        if(canSkip){
            expressJwt = require('express-jwt')({
                secret: app.config.jwtSecret
            }).unless({path: app.skipoptions});
            expressJwt(req,res, next);
        }
        */
         if (authpresent && wasSkipped) {
            // get an instance of express-jwt where we are not skipping any routes
            var noskip = require('express-jwt')({secret: app.config.jwtSecret});
            noskip(req, res, next);
        } else {
            expressJwt = require('express-jwt')({
                secret: app.config.jwtSecret
            }).unless({path: app.skipoptions});
            expressJwt(req, res, next);
        }
    }

    function auditAccess(req, res, next) {
        var id = uuid.v4();
        var user = 'cf1a62e3-766d-4a65-94a8-c7e81cfa06e1'; // used when req.user does not exist, unauthenticated routes
        if (req.user) {
            user = req.user.id;
        }

        var actionDate = new Date();

        app.entities.models.v1.security.audit.create({
            'id': id,
            'ipaddress': req.connection.remoteAddress,
            'route': req.originalUrl,
            'method': req.method,
            'added': actionDate,
            'addedby': user
        })
            .success(function () {
                console.log('audited');
            }).error(function (e) {
                console.log('not audited:', e);
            });
        next();
    }

    function requireRoles(roles) {
        return function (req, res, next) {
            // if roles are not supplied, then next
            if(!roles){
                next();
            }
            // if no user and no user roles then return 403
            if (req.user && req.user.roles) {
                if (_.intersection(req.user.roles, roles).length > 0) {
                    next();
                }
                else {
                    res.send(403);
                }
            }
            else {
                res.send(403);
            }
        };
    }

    return {
        CoorsCheck: coorsCheck,
        HeaderCheck: headerCheck,
        DecryptAccount: decryptAccount,
        AuditAccess: auditAccess,
        Jwt: jwt,
        RequireRoles: requireRoles
    };
};
