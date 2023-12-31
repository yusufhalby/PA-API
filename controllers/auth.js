/**

auth.js
This file contains the authentication controller functions for the API application.
It includes the signup and login functions.
*/

// Import required modules
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const jwt = require('jsonwebtoken');

const {
    validationResult
} = require('express-validator');

const User = require('../models/user');


//Handle user signup
exports.signup = (req, res, next) => {
    // console.log("im here");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error =  new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        return user.save();
    })
    .then(result =>{
        res.status(201).json({message: 'User created.', userId: result._id});

    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


//Handle user login
exports.login = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    let loadedUser;
    User.findOne({email}) 
    .then(user => {
        if(!user){
            const error =  new Error('A user with this email could not be found.');
            res.statusCode = 401; //not authenticated, 404 user not found
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual){
            console.log("not successful");
            const error =  new Error('Wrong password');
            res.statusCode = 401; 
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            id: loadedUser._id.toString(),
            isSuperAdmin: loadedUser.isSuperAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
        );
        console.log("successful");
        res.status(200).json({token, userId: loadedUser._id.toString() });
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};