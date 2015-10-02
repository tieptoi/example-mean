'use strict';

var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    errorhandler = require('errorhandler'),
    config = require('./config');

/**
 * Express configuration
 */
module.exports = function (app) {
    // app.configure('development', function(){
    var env = app.get('env');
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
    // });

    //app.configure('production', function(){
    if ('production' === env) {
        //app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('views', path.join(config.root, 'views'));
    }
    //});

    //app.configure(function () {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    //app.use(express.logger('dev'));
    app.use(morgan('dev'));
    //app.use(express.json());
    app.use(bodyParser.json());
    //app.use(express.urlencoded());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    //app.use(express.methodOverride());
    // Router (only error handlers should come after this)
    //app.use(app.router);
    //});

    // Error handler
    //app.configure('development', function () {
    if ('development' === env) {
        app.use(errorhandler());
    }
    //});
};
