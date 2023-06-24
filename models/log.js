const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const logSchema = new Schema({
    n:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    p:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    k:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    temp:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    humidity:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    ph:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    rainfall:{
        type: Decimal128,
        required: true,
        get: getValue,
    },
    label:{
        type: String,
        required: true,
    },
    landId:{
        type: Schema.Types.ObjectId,
        ref: 'Land',
    },
    deviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Device',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
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


