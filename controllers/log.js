const mongoose = require('mongoose'); 

const Log = require('../models/log');
const { ObjectId } = require('mongodb');


exports.getLogs = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Log.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Log.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(logs => {
        if(!logs){
            const error = new Error('Could not find logs.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'logs fetched.', logs, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getLog = (req, res, next) => {
    const logId = req.params.logId;
    Log.findById(logId)
    .then(log => {
        if(!log){
            const error = new Error('Could not find log.');
            error.statusCode = 404;
            throw error; 
        }
        res.status(200).json({message: 'log fetched.', log});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.postLog = (req, res, next) => {
    console.log(req);
    const ph = req.body.ph;
    const humidity = req.body.humidity;
    const co2 = req.body.co2;
    const landId = new ObjectId("64334038a421c67ef36399e1") ;
    // const landId = req.body.landId;
    const deviceId = new ObjectId("64333da6a421c67ef36399dd");
    // const deviceId = req.body.deviceId;
    const log = new Log({
        ph,
        humidity,
        co2,
        landId,
        deviceId
    });

    log
        .save()
        .then(result =>{
            res.status(201).json({
                message: 'created successfully',
                log
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteLog = (req, res, next) => {
    const logId = req.params.logId;
    Log.findById(logId)
    .then(log => {
        if(!log){
            const error = new Error('Could not find log.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        return Log.findOneAndDelete(logId);
    })
    .then(result=>{
        res.status(200).json({message: 'log deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

