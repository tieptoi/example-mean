'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    fs = require('fs-extra'),
    path = require('path'),
    config = require('../config/config');

/**
 * Get awesome things
 */

exports.awesomeThings = function (req, res) {
    return Thing.find(function (err, things) {
        if (!err) {
            return res.json(things);
        }
        res.status(err.status).send(err);
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
        res.status(err.status).send(err);

    });
};

/**
 * Add awesome thing
 */

exports.addThing = function (req, res) {
    console.log(req.body);
    var thing;

    thing = new Thing(req.body);

    thing.save(function (err) {
        if (!err) {
            console.log("created");
        }
        res.status(err.status).send(err);
    });
};

exports.uploadFile = function (req, res, next) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        //console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream(path.join(config.root, 'public/images', filename));
        file.pipe(fstream);
        fstream.on('close', function () {
            //console.log("Upload Finished of " + filename);
            res.status(200).send("Upload Finished of " + filename);
        });
    });
};
