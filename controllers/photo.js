const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose'); 
const { ObjectId } = require('mongodb');

const Photo =  require('../models/photo');

exports.getPhotos = (req, res, next) => {
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
        res.status(200).json({message: 'photoss fetched.', photos, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getPhoto = (req, res, next) => {
    const photoId = req.params.photoId;
    Photo
    .findById(photoId)
    .then(photo => {
        if(!photo){
            const error = new Error('Could not find photo.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'photo fetched.', photo});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.postPhoto = (req, res, next) => {
    if(!req.file){
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const photoUrl = req.file.path;
    const landId = req.body.landId;
    const deviceId = req.body.deviceId;

    const photo = new Photo({
        photoUrl,
        landId,
        deviceId,
    });
    photo
    .save()
    .then(result =>{
        res.status(201).json({ 
            message: 'created successfully',
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




exports.deletePhoto = (req, res, next) => {
    const photoId = req.params.photoId;
    Photo.findById(photoId)
    .then(photo => {
        if(!photo){
            const error = new Error('Could not find photo.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        clearImage(photo.imageUrl);
        return Photo.findOneAndDelete(photoId);
    })
    .then(result=>{
        res.status(200).json({message: 'photo deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};



//helper function
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
