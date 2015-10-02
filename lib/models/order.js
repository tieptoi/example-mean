'use strict';

var mongoose = require('mongoose'),
    validator = require('validator'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var OrderSchema = new Schema({
    orderdetails: [{
        item: {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        },
        orderquantity: {
            type: Number,
            required: true
        }
    }],
    date: {
        type: Date,
        require: true,
        default: Date.now
    }
});

/**
 * Validations
 */
//Price Validation=========================
OrderSchema.path('orderdetails').validate(function (array) {
    return array !== null && Array.isArray(array);
}, 'Order details is empty');

//Date Validation=========================
OrderSchema.path('date').validate(function (date) {
    return validator.isDate(date) && date !== null && date !== '';
}, 'Date is invalid');

mongoose.model('Order', OrderSchema);
