'use strict';

var mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Item = mongoose.model('Item');

// /**
//  * Get item
//  */

function findOneByName(name) {
    //var key = req.params.qkey;
    //var value = req.params.qvalue;
    Item.findOne({
        'name': name
    }, function (err, item) {
        if (!err) {
            return item;
        } else {
            return null;
        }

    });
}

/**
 * Get orders
 */

exports.orders = function (req, res) {
    return Order.find(function (err, orders) {
        if (!err) {
            res.json(orders);
        } else {
            res.send(err);
        }
    });
};

// /**
//  * Add item
//  */

exports.addOrder = function (req, res) {
    var order;

    order = new Order({
        orderdetails: req.body.orderdetails,
        date: req.body.date
    });

    order.save(function (err) {
        if (!err) {
            res.send("Order is created");
        } else {
            res.send(err);
        }
    });
};
