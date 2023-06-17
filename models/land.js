const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const landSchema = new Schema({
    id:{
        type: Number,
        required: true
    },
    description:{
        type: String,
    },
    plantId:{
        type: Schema.Types.ObjectId,
        ref: 'Plant',
    },
    deviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Device',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

});

module.exports = mongoose.model('Land', landSchema);






