'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    express = require('express'),
    // async = require('async'),
    request = require('request'),
    config = require('../config/config'),
    moment = require('moment'),
    // bcrypt = require('bcryptjs'),
    jwt = require('jwt-simple'),
    User = mongoose.model('User');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
// exports.isAuthenticated = function (req, res, next) {
//     console.log('isAuthenticated');
//     if (req.isAuthenticated())
//         return next();
//     res.send(401);
//     //res.redirect('/');
// };

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
exports.ensureAuthenticated = function (req, res, next) {
    console.log('authorization: ' + req.headers.authorization);
    if (!req.headers.authorization) {
        return res.status(401).send({
            message: 'Please make sure your request has an Authorization header'
        });
    }
    var token = req.headers.authorization.split(' ')[1];
    var now = moment().unix();
    var payload = null;
    try {
        payload = jwt.decode(token, config.token_secret);
    } catch (err) {
        return res.status(401).send({
            message: err.message
        });
    }

    if (payload.exp <= now) {
        return res.status(401).send({
            message: 'Token has expired'
        });
    }
    User.findById(payload.sub, function (err, user) {
        if (!user) {
            return res.status(400).send({
                message: 'User no longer exists.'
            });
        }
        req.user = user;
        next();
    });
};
/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
exports.createJWT = function (user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(60, 'minutes').unix()
    };
    //console.log(jwt.encode(payload, config.token_secret));
    return jwt.encode(payload, config.token_secret);
};
