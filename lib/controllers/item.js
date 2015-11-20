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
        }
        res.status(err.status).send(err);
    });
};

/**
 * Get number of items
 */

exports.noOfItems = function (req, res) {
    return Item.count(function (err, count) {
        if (!err) {
            //console.log(count);
            return res.json(count);
        }
        res.status(err.status).send(err);
    });
};
/**
 * Get items by page no
 */

exports.itemsByPage = function (req, res) {
    var pages = req.params.qpages;
    var pageSize = req.params.qsize;
    var sort = req.params.qsort;
    // return res.json(Item.find().skip(pages > 0 ? ((pages - 1) * pageSize) : 0).limit(pageSize));
    return Item.find(null, null, {
        limit: pageSize,
        skip: pages > 0 ? ((pages - 1) * pageSize) : 0
    }, function (err, items) {
        if (!err) {
            return res.json(items);
        }
        res.status(err.status).send(err);
    });
};
/**
 * Get item
 */

exports.item = function (req, res) {
    var value = req.params.qvalue;
    return Item.findOne({
        _id: value
    }, function (err, item) {
        if (!err && item !== null) {
            return res.json(item);
        } else if (item === null) {
            res.status(404).send("Item was not existed");
        } else {
            res.status(400).send(err);
        }
    });
};

/**
 * Add item
 */

exports.addItem = function (req, res) {
    var item = new Item(req.body);
    item.save(function (err, i) {
        if (!err) {
            res.json(i);
        } else {
            res.status(err.status).send(err);
        }
    });
};

/**
 * Add items
 */

// exports.addItems = function (req, res) {
// var items = req.body;
// for (var no = items.length; no - 1 > 0; no--) {
//     var item = new Item(items[no]);
//     item.save(function (err, newItem) {
//         if (err) {
//             res.status(400).send(err);
//         }
//     })
// };
//     Item.insert()
//     res.json(items);
// };


/**
 * Update item
 */

exports.updateItem = function (req, res) {
    var item = new Item(req.body);
    Item.findOne({
        name: item.name
    }, function (err, i) {
        if (!err && i !== null) {
            i.id = item.id;
            i.description = item.description;
            i.category = item.category;
            i.specification = item.specification;
            i.image = item.image;
            i.name = item.name;
            i.price = item.price;
            i.quantity = item.quantity;
            i.views = item.views;
            i.canPurchase = item.canPurchase;
            i.isSale = item.isSale;
            i.discountPct = item.discountPct;
            i.save(function (err) {
                if (!err) {
                    res.json(i);
                    //res.send("Item is updated");
                } else {
                    res.status(err.status).send(err);
                }
            });
        } else if (i === null) {
            res.status(404).send("Item was not existed");
        } else {
            res.status(400).send(err);
        }
    });
};
/**
 * Remove item
 */

exports.removeItem = function (req, res) {
    var key = req.params.qkey;
    var value = req.params.qvalue;
    return Item.findOne({
        key: value
    }, function (err, item) {
        if (!err && item !== null) {
            item.remove(function (err) {
                if (!err) {
                    res.send("Item is removed");
                } else {
                    res.status(err.status).send(err);
                }
            });
        } else if (item === null) {
            res.status(404).send("Item was not existed");
        } else {
            res.status(400).send(err);
        }
    });
};
