/**

photo.js
This file defines the photo model for the API application using Mongoose.
*/

// Import required modules
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

// Define photo schema
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
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isChecked:{
        type: Boolean,
        default: true
    }

},{ timestamps: true });

// Export the photo model
module.exports = mongoose.model('Photo', photoSchema);