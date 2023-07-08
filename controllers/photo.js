/**
 * photo.js
 *
 * This file contains the controller functions for photo-related operations.
 * It includes functions for fetching all photos, fetching user-specific photos,
 * fetching a single photo, creating a new photo, deleting a photo, and fetching photos for a specific land.
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');

const Photo =  require('../models/photo');
const Device =  require('../models/device');

// Get all photos (Super admin only)
exports.getAllPhotos = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 4;
    let totalItems;
    Photo.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Photo.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(photos => {
        if(!photos){
            const error = new Error('Could not find photos.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Photos fetched.', photos, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Get user-specific photos
exports.getPhotos = (req, res, next) => {
    const userId= req.userId;
    const currentPage = req.query.page || 1;
    const perPage = 4;
    let totalItems;
    Photo.find({userId})
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Photo.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(photos => {
        if(!photos){
            const error = new Error('Could not find photos.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Photos fetched.', photos, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Get a single photo
exports.getPhoto = (req, res, next) => {
    const userId= req.userId;
    const photoId = req.params.photoId;
    Photo
    .findById(photoId)
    .then(photo => {
        if(!photo){
            const error = new Error('Could not find photo.');
            error.statusCode = 404;
            throw error;
        }
        if(photo.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({message: 'Photo fetched.', photo});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Create a new photo
exports.postPhoto = (req, res, next) => {
    if(!req.file){
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const photoUrl = req.file.path;
    const deviceId = req.body.deviceId;
    const status = req.fileName;
    let landId;
    let userId;
    let photo;

    Device
    .findById(deviceId)
    .then(device =>{
        if(!device){
            const error = new Error('Device not found.');
            error.statusCode = 404;
            throw error;
            } 
        landId = device.landId;
        userId = device.userId;
        photo = new Photo({
            photoUrl,
            status,
            landId,
            deviceId,
            userId
        });
        return photo.save()
    })
    .then(result =>{
        res.status(201).json({ 
            message: 'Created successfully.',
            photo,
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

};


// Delete a photo
exports.deletePhoto = (req, res, next) => {
    const userId = req.userId;
    const photoId = req.params.photoId;
    Photo.findById(photoId)
    .then(photo => {
        if(!photo){
            const error = new Error('Could not find photo.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        if(photo.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        clearImage(photo.imageUrl);
        return Photo.deleteOne({_id: photoId});
    })
    .then(result=>{
        res.status(200).json({message: 'Photo deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Get photos for a specific land
exports.getLandPhotos = (req, res, next) => {
    const userId= req.userId;
    const landId = req.params.landId;
    const currentPage = req.query.page || 1;
    const perPage = 4;
    let totalItems;

    Land.findById(landId)
    .then(land => {
        if(!land){
            const error = new Error('Could not find land.');
            error.statusCode = 404;
            throw error; 
        }
        if(land.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        return Photo.find({landId, userId}).countDocuments()
    })
    .then(count => {
        totalItems = count; 
        return Log.find({landId, userId})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(photos => {
        if(!photos){
            const error = new Error('Could not find photos.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Photos fetched.', photos, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


// Helper function to delete the image file
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
