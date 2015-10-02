'use strict';

var api = require('./controllers/api'),
    item = require('./controllers/item'),
    order = require('./controllers/order'),
    menu = require('./controllers/menu'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function (app) {

    // Server API Routes
    app.get('/api/awesomeThings', api.awesomeThings);
    app.get('/api/awesomeThing/:id', api.awesomeThing);
    app.post('/api/addThing', api.addThing);
    //Item
    app.get('/api/items', item.items);
    app.get('/api/item/:qkey/:qvalue', item.item);
    app.get('/api/removeItem/:qkey/:qvalue', item.removeItem);
    app.post('/api/additem', item.addItem);
    app.post('/api/updateitem', item.updateItem);
    //Order
    app.get('/api/orders', order.orders);
    app.post('/api/addorder', order.addOrder);
    //Menu
    app.get('/api/menus', menu.menus);
    app.get('/api/removeMenu/:qkey/:qvalue', menu.removeMenu);
    app.post('/api/addmenu', menu.addMenu);
    app.post('/api/updateMenu', menu.updateMenu);
    // All undefined api routes should return a 404
    app.get('/api/*', function (req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', index.index);
};
