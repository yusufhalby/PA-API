/**

is-auth.js
This file defines the authentication middleware for the API application.
It checks if the user is authenticated by verifying the JWT token in the Authorization header.
*/

// Import required modules
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader){
        const error = new Error('Not authenticated.')
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1]; 
    //The setup in front-end must be: headers: {Authorization: 'Bearer ' + this.props.token}
    let decodedToken;
    try{
        decodedToken= jwt.verify(token, 'somesupersecretsecret')
    } catch (err) {
        err.statusCode =500;
        throw err
    }
    if (!decodedToken){
        const error = new Error('Not authenticated.')
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.id;
    next();
};