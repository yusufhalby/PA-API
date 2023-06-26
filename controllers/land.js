/**
 * land.js
 *
 * This file contains the controller functions for land-related operations.
 * It includes functions for fetching all lands, fetching user-specific lands,
 * fetching a single land, creating a new land, deleting a land, and updating a land.
 */

// Import required modules
const mongoose = require('mongoose'); 

const Land = require('../models/land');
const { ObjectId } = require('mongodb');

// Get all lands (Super admin only)
exports.getAllLands = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Land.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Land.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(lands => {
        if(!lands){
            const error = new Error('Could not find lands.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'lands fetched.', lands, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Get user-specific lands
exports.getLands = (req, res, next) => {
    const userId= req.userId;
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Land.find({userId})
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Land.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(lands => {
        if(!lands){
            const error = new Error('Could not find lands.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'lands fetched.', lands, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Get a single land
exports.getLand = (req, res, next) => {
    const userId= req.userId;
    const landId = req.params.landId;
    Land.findById(landId)
    .then(land => {
        if(!land){
            const error = new Error('Could not find land.');
            error.statusCode = 404;
            throw error; 
        }
        if(land.userId != userId || !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({message: 'landId fetched.', landId});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Create a new land
exports.postLand = (req, res, next) => {
    // console.log(req);
    const userId= req.userId;
    const id = req.body.id;
    const plantLabel = req.body.plantLabel || "";
    const description = req.body.description || "";

    const land = new Land({
        id,
        plantLabel,
        description,
        userId,
    });

    land
        .save()
        .then(result =>{
            res.status(201).json({
                message: 'created successfully',
                land
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


// Delete a land
exports.deleteLand = (req, res, next) => {
    const userId = req.userId;
    const landId = req.params.landId;
    Land.findById(landId)
    .then(land => {
        if(!land){
            const error = new Error('Could not find land.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        if(land.userId != userId || !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        return Land.deleteOne({_id: landId});
    })
    .then(result=>{
        res.status(200).json({message: 'land deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Update a land
exports.postUpdateLand = (req, res, next) => {
    // console.log(req);
    const userId= req.userId;
    const landId = req.body.landId;
    const id = req.body.id;
    const plantLabel = req.body.plantLabel;
    const description = req.body.description;

    land
        .findById(landId)
        .then(land =>{
            if(!land){
                const error = new Error('Could not find land.');
                error.statusCode = 404;
                throw error; 
            }
            if(land.userId != userId || !req.isSuperAdmin){
                const error = new Error('Not Authorized.');
                error.statusCode = 401;
                throw error;
            }
            land.id = id;
            land.plantLabel = plantLabel;
            land.description = description;
            return land.save();
        })
        .then(result =>{
            res.status(201).json({
                message: 'Updated successfully',
                land
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};