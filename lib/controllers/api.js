'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');

/**
 * Get awesome things
 */

exports.awesomeThings = function (req, res) {
    return Thing.find(function (err, things) {
        if (!err) {
            return res.json(things);
        }
        res.send(err);
    });
};

/**
 * Get awesome thing
 */

exports.awesomeThing = function (req, res) {
    return Thing.findById(req.params.id, function (err, thing) {
        if (!err) {
            return res.json(thing);
        }
        console.log(err);

    });
};

/**
 * Add awesome thing
 */

exports.addThing = function (req, res) {
    console.log(req.body);
    var thing;

    thing = new Thing({
        name: req.body.name,
        info: req.body.info,
        awesomeness: req.body.awesomeness
    });

    thing.save(function (err) {
        if (!err) {
            console.log("created");
        }
        res.send(err);

    });
    //TODO: return to list page, if saved
    //res.redirect('/drivers/', 301);
    //return res.send(driver);  
};
