const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const photoSchema = new Schema({
    photoUrl:{
        type: String,
        required: true,
    },
    status:{
        type: String,
    },
    landId:{
        type: Schema.Types.ObjectId,
        ref: 'Land',
    },
    deviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Device',
    },
    isChecked:{
        type: Boolean,
        default: false
    }

},{ timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);






