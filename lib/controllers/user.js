'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');


/**
 * Get users
 */

exports.users = function (req, res) {
    User.find(function (err, users) {
        if (!err) {
            return res.json(users);
        }
        res.status(err.status).send(err);

    });
};
/**
 * Add User
 */

exports.addUser = function (req, res) {
    var user = new User(req.body);
    console.log(user);
    user.save(function (err, u) {
        if (!err) {
            res.json(u);
        } else {
            res.status(err.status).send(err);
        }
    });
};
