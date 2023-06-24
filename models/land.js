/**

land.js
This file defines the land model for the API application using Mongoose.
*/
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

// Define land schema
const landSchema = new Schema({
    id:{
        type: Number,
        required: true
    },
    plantLabel:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});

// Export the land model
module.exports = mongoose.model('Land', landSchema);