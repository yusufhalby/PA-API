const mongoose = require('mongoose'); 

const Device = require('../models/device');
const { ObjectId } = require('mongodb');

// super admin only
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
        if(device.userId != userId){
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


exports.postDevice = (req, res, next) => {
    // console.log(req);
    const waterPump = req.body.waterPump;
    const anyPump = req.body.anyPump;
    // const landId = new ObjectId("64334038a421c67ef36399e1") ;
    const landId = req.body.landId;
    const userId = req.userId;
    const device = new Device({
        waterPump,
        anyPump,
        landId,
        userId
    });

    device
    .save()
    .then(result =>{
        res.status(201).json({
            message: 'created successfully',
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
        if(device.userId != userId){
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


exports.postUpdateDevice = (req, res, next) => {
    const userId = req.userId;
    const waterPump = req.body.waterPump;
    const anyPump = req.body.anyPump;
    const deviceId = req.body.deviceId;
    Device.findById(deviceId)
    .then(device => {
        if(!device){
            const error = new Error('Could not find device.');
            error.statusCode = 404;
            throw error; 
        }
        if(device.userId != userId){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        device.waterPump = waterPump;
        device.anyPump = anyPump;
        return device.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'Updated successfully',
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