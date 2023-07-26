var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    app = express(),
    https = require('https'),
    fs = require('fs'),
    compresssion = require('compression'),
    postal = require('postal');

GLOBAL._ = require('lodash');
GLOBAL.Sequelize = require('sequelize');
app.postal = postal;
app.use(compresssion());
app.disable('x-powered-by');


app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(multer());

app.config = require('./config/config');
app.db = require('./modules/database')(app);
app.utility  = require('./modules/utility')(app);

app.skipoptions = [];
app.regexskipoptions =[];
app.set('json spaces', 0);
//app.use(compresssion());

//var router = require('./router')(app);
require('./router')(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.code = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if (!err) {
        return next();
    }

    if (err.name === 'UnauthorizedError') {
        //res.send(401, 'Unauthorized');
        res.status(401).send('Unauthorized');
    }else{
        res.statusCode = err.code || 500;
        res.end(JSON.stringify({ error: err.message }));
    }


});

var options = {
    key:                fs.readFileSync('../certs/server.key').toString(),
    cert:               fs.readFileSync('../certs/STAR_natomis_com.crt').toString(),
    ca:                 [fs.readFileSync('../certs/AddTrustExternalCARoot.crt').toString(),
        fs.readFileSync('../certs/COMODORSAAddTrustCA.crt').toString(),
        fs.readFileSync('../certs/COMODORSADomainValidationSecureServerCA.crt').toString()],
    rejectUnauthorized: false,
    agent:              false
};
/*
app.listen(process.env.PORT || app.config.appPort, function () {
    console.log('Express server listening on port ' + app.config.appPort);
});
*/

https.createServer(options,app).listen(app.config.appPort, function () {
    console.log('');
    console.log('***********************************************************************************');
    console.log('  powered by ' + app.config.appName.concat(app.config.appVersion));
    console.log('  server listening on port ' + app.config.appPort );
    console.log('***********************************************************************************');
});

module.exports = app;