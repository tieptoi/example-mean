'use strict';

var mongoose = require('mongoose'),
    validator = require('validator'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var MenuSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subMenus: [{
        title: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        sortOrder: {
            type: Number,
            required: true
        }
    }],
    link: {
        type: String,
        required: true
    },
    sortOrder: {
        type: Number,
        required: true
    }
});

/**
 * Validations
 */
//Tittle Validation=========================
MenuSchema.path('title').validate(function (text) {
    return text !== null && text !== 'undefined' && text.trim().length >= 1;
}, 'Title is empty');

//Submenus Validation=========================
MenuSchema.path('subMenus').validate(function (array) {
    return (array !== null || !Array.isArray(array));
}, 'SubMenus is invalid');

//Link URL Validation=========================
MenuSchema.path('link').validate(function (link) {
    return (link !== null && link !== 'undefined' && link.trim().length >= 1);
}, 'Link is invalid');

//Link Menu SortOrder=========================
MenuSchema.path('sortOrder').validate(function (num) {
    return (num !== null && num !== 'undefined' && validator.isNumeric(num));
}, 'Menu Sort Order is invalid');
mongoose.model('Menu', MenuSchema);