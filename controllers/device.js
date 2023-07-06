/**

device.js
This file contains the controller functions for device-related operations.
It includes functions for fetching all devices, fetching user-specific devices,
fetching a single device, creating a new device, deleting a device, and updating a device.
*/

// Import required modules
const mongoose = require('mongoose'); 

const Device = require('../models/device');
const { ObjectId } = require('mongodb');

// Get all devices (Super admin only)
exports.getAllDevices = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Device.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Device.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(devices => {
        if(!devices){
            const error = new Error('Could not find devices.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'devices fetched.', devices, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//Get user-specific devices
exports.getDevices = (req, res, next) => {
    const userId= req.userId;
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Device.find({userId})
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Device.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(devices => {
        if(!devices){
            const error = new Error('Could not find devices.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'devices fetched.', devices, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//Get a single device
exports.getDevice = (req, res, next) => {
    const userId = req.userId;
    const deviceId = req.params.deviceId;
    Device.findById(deviceId)
    .then(device => {
        if(!device){
            const error = new Error('Could not find device.');
            error.statusCode = 404;
            throw error; 
        }
        if(device.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({message: 'device fetched.', device});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//Create a new device
exports.postDevice = (req, res, next) => {
    // console.log(req);
    const waterPump = req.body.waterPump;
    const fertPump = req.body.fertPump;
    // const landId = new ObjectId("64334038a421c67ef36399e1") ;
    const landId = req.body.landId;
    const userId = req.userId;
    const device = new Device({
        waterPump,
        fertPump,
        landId,
        userId
    });

    device
    .save()
    .then(result =>{
        res.status(201).json({
            message: 'Created successfully.',
            device
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//Delete a device
exports.deleteDevice = (req, res, next) => {
    const userId = req.userId;
    const deviceId = req.params.deviceId;
    Device.findById(deviceId)
    .then(device => {
        if(!device){
            const error = new Error('Could not find device.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        if(device.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        return Device.deleteOne({_id: deviceId});
    })
    .then(result=>{
        res.status(200).json({message: 'device deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//Update a device
exports.postUpdateDevice = (req, res, next) => {
    const userId = req.userId;
    const waterPump = req.body.waterPump;
    const fertPump = req.body.fertPump;
    const deviceId = req.body.deviceId;
    Device.findById(deviceId)
    .then(device => {
        if(!device){
            const error = new Error('Could not find device.');
            error.statusCode = 404;
            throw error; 
        }
        if(device.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        device.waterPump = waterPump;
        device.fertPump = fertPump;
        return device.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'Updated successfully.',
            device
        });
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });


};