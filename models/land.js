const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

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

module.exports = mongoose.model('Land', landSchema);






