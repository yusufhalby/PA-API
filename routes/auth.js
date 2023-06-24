/**

auth.js
This file defines the authentication routes for the API application using Express.js.
It handles user signup and login requests.
*/

// Import required modules
const express = require('express');

const {
    body
} = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');


const router = express.Router();

// /auth/signup => PUT
router.put('/signup', [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                return User.findOne({email: value})
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email already in use');
                        }
                    })
        })
        .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}), //minimum length
        body('name')
            .trim()
            .not()
            .isEmpty()

    ],
    authController.signup);

// auth/login => POST
router.post('/login', authController.login);

module.exports = router;