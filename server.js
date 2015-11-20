'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = 'production';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

// Populate empty DB with sample data
//require('./lib/config/dummydata');

var app = express();

// Passport config
require('./lib/config/passport')(passport); // pass passport for configuration

// Express settings
require('./lib/config/express')(app, passport);

// Routing
require('./lib/routes')(app, passport);

// Start server
app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
