
/**

user.js
This file defines the user model for the API application using Mongoose.
*/

// Import required modules
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

// Define user schema
const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isSuperAdmin:{
        type: Boolean,
        default: false,
    },
});

// Export the user model
module.exports = mongoose.model('User', userSchema);