var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    app = express(),
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
    }else {
        res.statusCode = err.code || 500;
        res.end(JSON.stringify({ error: err.message }));
    }


});

app.listen(process.env.PORT || app.config.appPort, function () {
    console.log('Express server listening on port ' + app.config.appPort);
});

var fs = require('fs');
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
    //use the url to parse the requested url and get the image name
    var request = url.parse(req.url, true);
    var action = request.pathname;
    var imgPath = './upload' + action;

    try {
        // Query the entry
        var stats = fs.lstatSync(imgPath);

        // Is it a directory?
        if (stats.isFile()) {
            // Yes it is
            var img = fs.readFileSync(imgPath);
            res.writeHead(200, {'Content-Type': 'image/png' });
            res.end(img, 'binary');
        }
    }
    catch (e) {
        // ...
    }

}).listen(3333);

console.log("Server running at http://localhost:3333/");

module.exports = app;