'use strict';

var mongoose = require('mongoose'),
    Item = mongoose.model('Item');

/**
 * Get items
 */

exports.items = function (req, res) {
    return Item.find(function (err, items) {
        if (!err) {
            return res.json(items);
        } else {
            res.send(err);
        }
    });
};

/**
 * Get item
 */

exports.item = function (req, res) {
    //var key = req.params.qkey;
    var value = req.params.qvalue;
    return Item.findOne({
        'name': value
    }, function (err, item) {
        if (!err && item !== null) {
            return res.json(item);
        }
        if (item === null) {
            res.send("Item was not existed");
        } else {
            res.send(err);
        }
    });
};

/**
 * Add item
 */

exports.addItem = function (req, res) {
    var item;
    item = new Item({
        description: req.body.description,
        image: req.body.image,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        views: req.body.views,
        canPurchase: req.body.canPurchase
    });

    item.save(function (err) {
        if (!err) {
            res.send("Item is created");
        } else {
            res.send(err);
        }
    });
};


/**
 * Update item
 */

exports.updateItem = function (req, res) {
    var item;
    item = new Item({
        description: req.body.description,
        image: req.body.image,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        views: req.body.views,
        canPurchase: req.body.canPurchase
    });

    Item.findOne({
        name: item.name
    }, function (err, i) {
        if (!err && i !== null) {
            i.description = item.description;
            i.image = item.image;
            i.name = item.name;
            i.price = item.price;
            i.quantity = item.quantity;
            i.views = item.views;
            i.canPurchase = item.canPurchase;
            i.save(function (err) {
                if (!err) {
                    res.send("Item is updated");
                } else {
                    res.send(err);
                }
            });
        } else if (i === null) {
            res.send("Item was not existed");
        } else {
            res.send(err);
        }
    });
};
/**
 * Remove item
 */

exports.removeItem = function (req, res) {
    //var key = req.params.qkey;
    var value = req.params.qvalue;
    return Item.findOne({
        'name': value
    }, function (err, item) {
        if (!err && item !== null) {
            item.remove(function (err) {
                if (!err) {
                    res.send("Item is removed");
                } else {
                    res.send(err);
                }
            });
        } else if (item === null) {
            res.send("Item was not existed");
        } else {
            res.send(err);
        }
    });
};
