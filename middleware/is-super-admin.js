
/**

is-super-admin.js
This file defines the super admin authorization middleware for the API application.
It checks if the user is a super admin by verifying their user ID and the isSuperAdmin property in the User model.
*/

// Import required modules
const User = require('../models/user');

module.exports = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId)
    .then(user=>{
        if(!user.isSuperAdmin){
            const error = new Error('Not authorized.')
            error.statusCode = 401;
            throw error;
        }
        next();
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}