const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

const index = require('./routes/index');
const users = require('./routes/users');
const db = require('./models');
const appConfig = require('./config');

const app = express();

const server = http.Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
});

app.use(require('./routes'));

// Catch other errors
app.use((err, req, res, next) => {
    res.send({
        success: false,
        error: err
    });
});

// Initialize server
let p = db
    .then((res) => {
        return new Promise((resolve) => {
            server.listen(appConfig.server.port, appConfig.server.hostname, () => {
                console.log('Server start listen port: ' + appConfig.server.port);
                resolve();
            });
        })
    })
    .then(() => app);

p.catch(err => {
    log.error('Initialise Server Error', err);
    throw err;
});

module.exports = app;
