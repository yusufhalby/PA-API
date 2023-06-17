const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const logSchema = new Schema({
    ph:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    humidity:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    co2:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    landId:{
        type: Schema.Types.ObjectId,
        ref: 'Land',
    },
    deviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Device',
    },

}, {toJSON: {getters: true}}
,{ timestamps: true });

module.exports = mongoose.model('Log', logSchema);



function getValue(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};


