'use strict';

var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    errorhandler = require('errorhandler'),
    config = require('./config'),
    busboy = require('connect-busboy'),
    flash = require('connect-flash'),
    //session = require('express-session'),
    cors = require('cors'),
    compress = require('compression'),
    cookieParser = require('cookie-parser');

/**
 * Express configuration
 */
module.exports = function (app, passport) {
    var env = app.get('env');
    app.use(compress());
    if ('development' === env) {
        app.use(require('connect-livereload')());

        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/scripts/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'app')));
        app.set('views', path.join(config.root, 'app/views'));
    }

    if ('production' === env) {
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('views', path.join(config.root, 'views'));
    }

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');;
    app.use(cors());
    app.use(morgan('dev'));
    app.use(busboy());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.text()); // allows bodyParser to look at raw text
    app.use(bodyParser.json({
        type: 'application/vnd.api+json'
    })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // required for passport
    // app.use(session({
    //     secret: config.token_secret,
    //     resave: true,
    //     saveUninitialized: true
    // }));


    // session secret
    app.use(passport.initialize());
    //app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session


    if ('development' === env) {
        app.use(errorhandler());
    }
};
