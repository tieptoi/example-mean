'use strict';

var mongoose = require('mongoose'),
    validator = require('validator'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var ItemSchema = new Schema({
    id: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    specification: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true,
        default: 0
    },
    discountPct: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        require: true,
        default: 0
    },
    views: {
        type: Number,
        require: true,
        default: 0

    },
    canPurchase: {
        type: Boolean,
        default: true
    },
    isSale: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Sets the created_at parameter equal to the current time
ItemSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

/**
 * Validations
 */
//Price Validation=========================
ItemSchema.path('price').validate(function (num) {
    return num !== null && validator.isNumeric(num) && num >= 1;
}, 'Price is invalid number');

//Quantity Validation=========================
ItemSchema.path('quantity').validate(function (num) {
    return num !== null && validator.isNumeric(num) && num >= 0;
}, 'Price is invalid number');


//Description Validation=========================

ItemSchema.path('description').validate(function (text) {
    return text !== null && !validator.isNull(text) && text.trim().length >= 1;
}, 'Description can not be blank');

//Name Validation==============================

ItemSchema.path('name').validate(function (text) {
    return text !== null && !validator.isNull(text) && text.trim().length >= 1;
}, 'Name can not be blank');

//Image Validation=========================

ItemSchema.path('image').validate(function (text) {
    return text !== null && !validator.isNull(text) && text.trim().length >= 1;
}, 'Image can not be blank');

//Discount Percentage Validation=========================
ItemSchema.path('quantity').validate(function (num) {
    return num !== null && validator.isNumeric(num) && num >= 0;
}, 'Discount Percentage is invalid number');
mongoose.model('Item', ItemSchema);
