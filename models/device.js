const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    waterPump:{ //for control
        type: Boolean,
        required: true,
    },
    anyPump:{ //for control
        type: Boolean,
        required: true,
    },
    landId:{
        type: Schema.Types.ObjectId,
        ref: 'Land',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

});

module.exports = mongoose.model('Device', deviceSchema);






