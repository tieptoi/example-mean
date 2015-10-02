'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Menu = mongoose.model('Menu'),
    Item = mongoose.model('Item');

/**
 * Populate database with sample application data
 */

////Clear old things, then add things in
//Thing.find({}).remove(function () {
//  Thing.create({
//    name : 'HTML5 Boilerplate',
//    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
//    awesomeness: 10
//  }, {
//    name : 'AngularJS',
//    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
//    awesomeness: 10
//  }, {
//    name : 'Karma',
//    info : 'Spectacular Test Runner for JavaScript.',
//    awesomeness: 10
//  }, {
//    name : 'Express',
//    info : 'Flexible and minimalist web application framework for node.js.',
//    awesomeness: 10
//  }, {
//    name : 'MongoDB + Mongoose',
//    info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
//    awesomeness: 10
//  }, function () {
//    console.log('finished populating things');
//  }
//    );
//});
//
/////Clear old items, then add item in
//Item.find({}).remove(function () {
//  Item.create({
//    description: "Acorn squash, also called pepper squash or Des Moines squash, is a winter squash with distinctive longitudinal ridges and sweet yellow-orange flesh.",
//    image: "acorn_squash.png",
//    name: "Acorn Squash",
//    price: 7,
//    quantity: 17
//  }, {
//    description: "Bell peppers are botanically fruits, but are generally considered in culinary contexts to be vegetables.It is a cultivar group of the species Capsicum annuum",
//    image: "bell_pepper.png",
//    name: "Bell Pepper",
//    price: 6,
//    quantity: 4
//  }, {
//    description: "Blueberries is a berry 5–16 millimeters in diameter with a flared crown at the end; they are pale greenish at first, then reddish-purple, and finally dark purple when ripe. ",
//    image: "blueberries.png",
//    name: "Blueberries",
//    price: 6,
//    quantity: 30
//  }, {
//    description: "Broccoli is an edible green plant in the cabbage family, whose large flower head is used as a vegetable. The word broccoli, from the Italian plural of broccolo",
//    image: "broccoli.png",
//    name: "Broccoli",
//    price: 14,
//    quantity: 77
//  }, {
//    description: "Carrot is a root vegetable, usually orange in colour, though purple, red, white, and yellow varieties exist. It has a crisp texture when fresh.",
//    image: "carrot.png",
//    name: "Carrot",
//    price: 2,
//    quantity: 30
//  }, {
//    description: "Celery is used as a vegetable for the crisp petiole (leaf stalk).The leaves are used less often, either as a flavouring in soups and stews or as a dried herb.",
//    image: "celery.png",
//    name: "Celery",
//    price: 1,
//    quantity: 44
//  }, {
//    description: "Chilli Pepper is the fruit of plants from the genus Capsicum members of the nightshade family used in both food and medicine. ",
//    image: "chili_pepper.png",
//    name: "Chili Pepper",
//    pid: 7,
//    price: 6,
//    quantity: 150
//  }, {
//    description: "The leafy stalk produces ears which contain the grain, which are seeds called kernels. Maize kernels are often used in cooking as a starch.",
//    image: "corn.png",
//    name: "Corn",
//    price: 1,
//    quantity: 10
//  }, {
//    description: "Eggplant stem is often spiny.The egg-shaped glossy black fruit has white flesh with a meaty texture. ",
//    image: "eggplant.png",
//    name: "Eggplant",
//    price: 8,
//    quantity: 10
//  }, {
//    description: " Lettuce is most often grown as a leaf vegetable,Lettuce is most often used for salads,it is also seen in such as soups, sandwiches and wraps.",
//    image: "lettuce.png",
//    name: "Lettuce",
//    price: 3,
//    quantity: 40
//  }, {
//    description: "Mushroom (or toadstool) is the fleshy, spore-bearing fruiting body of a fungus, typically produced above ground on soil or on its food source. ",
//    image: "mushroom.png",
//    name: "Mushroom",
//    price: 2,
//    quantity: 70
//  }, {
//    description: "Onion plant has a fan of hollow, bluish-green leaves and the bulb at the base of the plant begins to swell when a certain day-length is reached",
//    image: "onion.png",
//    name: "Onion",
//    price: 9,
//    quantity: 50
//  }, {
//    description: "Potato is a starchy, tuberous crop from the perennial nightshade Solanum tuberosum L. The word \"potato\" may refer to the plant, itself.",
//    image: "potato.png",
//    name: "Potato",
//    price: 3,
//    quantity: 100
//  }, {
//    description: "Pumpkin refers to certain cultivars of squash, most commonly those of Cucurbita pepo, that are round, with smooth, slightly ribbed skin and deep yellow to orange coloration.",
//    image: "pumpkin.png",
//    name: "Pumpkin",
//    price: 11,
//    quantity: 15
//  }, {
//    description: "Radish is an edible root vegetable of the Brassicaceae family that was domesticated in Europe in pre-Roman times.Radish can sprout from seed to small plant in as little as 3 days.",
//    image: "radish.png",
//    name: "Radish",
//    price: 2,
//    quantity: 35
//  }, {
//    description: "Pumpkin known as Cucurbita genus is an important source of human food and is used for other purposes such as beverages, medicine, oil, and detergent.",
//    image: "squash.png",
//    name: "Squash",
//    price: 3,
//    quantity: 35
//  }, {
//    description: "Strawberry is a widely grown hybrid species of the genus Fragaria known for its characteristic aroma, bright red color, juicy texture, and sweetness. ",
//    image: "strawberry.png",
//    name: "Strawberry",
//    price: 7,
//    quantity: 50
//  }, {
//    description: "Snap peas,also known as sugar snap peas, are a cultivar group of edible-podded peas that differ from snow peas in that their pods are round as opposed to flat.",
//    image: "sugar_snap.png",
//    name: "Sugar Snap Peas",
//    price: 3,
//    quantity: 45
//  }, {
//    description: "Tomato is consumed as an ingredient in many dishes, sauces, salads, and drinks. While it is botanically a fruit, it is considered a vegetable for culinary purposes.",
//    image: "tomato.png",
//    name: "Tomato",
//    price: 4,
//    quantity: 44
//  }, {
//    description: "The apple is the pomaceous fruit of the apple tree, species Malus domestica in the rose family. ",
//    image: "apple.png",
//    name: "Apple",
//    price: 2,
//    quantity: 83
//  }, function () {
//    console.log('finished populating items');
//  }
//    );
//});