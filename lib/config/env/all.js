'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    facebookAuth: {
        clientID: process.env.FACEBOOK_APPID || '478091019019627',
        clientSecret: process.env.FACEBOOK_SECRET || 'a292e28aaea14f1d2809c1bb0b7ccb22',
        callbackURL: 'http://localhost:9000/facebook'
    },
    token_secret: process.env.TOKEN_SECRET || 'JWT Token Secret',
    root: rootPath,
    port: process.env.PORT || 3000,
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    }
};
