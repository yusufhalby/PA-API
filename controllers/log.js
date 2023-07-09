/**
 * log.js
 *
 * This file contains the controller functions for log-related operations.
 * It includes functions for fetching all logs, fetching user-specific logs,
 * fetching a single log, creating a new log, deleting a log, and fetching logs for a specific land.
 */

// Import required modules
const Log = require('../models/log');
const Device = require('../models/device');
const Land = require('../models/land');
const dataset = require('../dataset.json');
const { json } = require('body-parser');
// const fetch = require('node-fetch');


// Get all logs (Super admin only)
exports.getAllLogs = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Log.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Log.find({userId})
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


// Get user-specific logs
exports.getLogs = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    const userId= req.userId;
    Log.find({userId})
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Log.find({userId})
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


// Get a single log
exports.getLog = (req, res, next) => {
    const logId = req.params.logId;
    const userId = req.userId;
    Log.findById(logId)
    .then(log => {
        if(!log){
            const error = new Error('Could not find log.');
            error.statusCode = 404;
            throw error; 
        }
        if(log.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
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


// Create a new log
exports.postLog = (req, res, next) => {
    // console.log(req);
    const n = req.body.n;
    const p = req.body.p;
    const k = req.body.k;
    const temp = req.body.temp;
    const humidity = req.body.humidity;
    const ph = req.body.ph;
    const rainfall = req.body.rainfall;
    const deviceId = req.body.deviceId;
    let landId;
    let label;
    let userId;
    let log;
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
        return Land.findById(landId);
    })
    .then(land => {
        if(!land){
            const error = new Error('land not found.');
            error.statusCode = 404;
            throw error;
        }
        label = findLabel({n, p, k, temp, humidity, ph, rainfall});
        log = new Log({
            n,
            p,
            k,
            temp,
            humidity,
            ph,
            rainfall,
            label,
            landId,
            deviceId,
            userId
        });
        return log.save()
    })
    .then(result =>{
        res.status(201).json({
            message: 'Created successfully.',
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


// Delete a log
exports.deleteLog = (req, res, next) => {
    const userId = req.userId;
    const logId = req.params.logId;
    Log.findById(logId)
    .then(log => {
        if(!log){
            const error = new Error('Could not find log.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        if(log.userId != userId && !req.isSuperAdmin){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        return Log.deleteOne({_id: logId});
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


// Get logs for a specific land
exports.getLandLogs = (req, res, next) => {
    const landId = req.params.landId;
    const userId = req.userId;
    const currentPage = req.query.page || 1;
    const perPage = 10;
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
        return Log.find({landId, userId}).countDocuments()
    })
    .then(count => {
        totalItems = count; 
        return Log.find({landId, userId})
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



exports.getAddLog = (req, res, next) => {
    const deviceId = req.params.deviceId;
    console.log(deviceId);
    const {n, p, k, temp, humidity, ph, rainfall} = generateRandomLog();
    fetch('https://pa-api.onrender.com/logs',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({n, p, k, temp, humidity, ph, rainfall, deviceId})
    })
    .then(res => {
        return res.json();
    })
    .then(resData => {
        console.log("response:", resData);
        res.status(200).send(resData);
    })
    .catch(err => {
        console.log(err);
    });
};





function findLabel(targetObject) {
    let nearestReading = null;
    let minDifference = Infinity;

    dataset.forEach((object) => {
        const difference = calculateSimilarity(targetObject, object);
        if (difference < minDifference) {
        minDifference = difference;
        nearestReading = object;
        }
    });
    return nearestReading.label;
};

function calculateSimilarity(obj1, obj2) {
    const keys = Object.keys(obj1);
    let sumOfSquaredDifferences = 0;

    keys.forEach((key) => {
        sumOfSquaredDifferences += Math.pow(obj1[key] - obj2[key], 2);
    });

    return Math.sqrt(sumOfSquaredDifferences);
};

function getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
};

function generateRandomLog() {
    const randomObject = {
        n: getRandomValue(1, 139),
        p: getRandomValue(5, 145),
        k: getRandomValue(5, 205),
        temp: getRandomValue(10, 43),
        humidity: getRandomValue(14, 99),
        ph: getRandomValue(3.51, 9.45),
        rainfall: getRandomValue(20, 291),
    };

    return randomObject;
};