'use strict';

var mongoose = require('mongoose'),
    Menu = mongoose.model('Menu');
/**
 * Get all menus
 */

exports.menus = function (req, res) {
    Menu.find(function (err, menus) {
        if (!err) {
            return res.json(menus);
        }
        res.send(err);

    });
};

/**
 * Add Menu
 */

exports.addMenu = function (req, res) {
    var menu;
    menu = new Menu({
        title: req.body.title,
        link: req.body.link,
        subMenus: req.body.subMenus,
        sortOrder: req.body.sortOrder
    });

    menu.save(function (err) {
        if (!err) {
            res.send("Menu is created");
        } else {
            res.send(err);
        }
    });
};
/**
 * Update Menu
 */

exports.updateMenu = function (req, res) {
    var menu;
    menu = new Menu({
        title: req.body.title,
        link: req.body.link,
        submMenus: req.body.subMenus,
        sortOrder: req.body.sortOrder
    });

    Menu.findOne({
        title: menu.title
    }, function (err, i) {
        if (!err && i !== null) {
            i.title = menu.title;
            i.link = menu.link;
            i.submMenus = menu.submMenus;
            i.sortOrder = menu.sortOrder;
            i.save(function (err) {
                if (!err) {
                    res.send("Menu is updated");
                } else {
                    res.send(err);
                }
            });
        } else if (i === null) {
            res.send("Menu was not existed");
        } else {
            res.send(err);
        }
    });
};
/**
 * Remove menu
 */

exports.removeMenu = function (req, res) {
    //var key = req.params.qkey;
    var value = req.params.qvalue;
    Menu.findOne({
        'title': value
    }, function (err, menu) {
        if (!err && menu !== null) {
            menu.remove(function (err) {
                if (!err) {
                    res.send("Menu is removed");
                }
                res.send(err);
            });
        } else if (menu === null) {
            res.send("Menu was not existed");
        } else {
            res.send(err);
        }
    });
};
