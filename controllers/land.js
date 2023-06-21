const mongoose = require('mongoose'); 

const Land = require('../models/land');
const { ObjectId } = require('mongodb');

exports.getLands = (req, res, next) => {
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


exports.getLand = (req, res, next) => {
    const landId = req.params.landId;
    Land.findById(landId)
    .then(land => {
        if(!landId){
            const error = new Error('Could not find landId.');
            error.statusCode = 404;
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


exports.putLand = (req, res, next) => {
    console.log(req);
    const id = req.body.id;
    const description = req.body.description || "";
    // const landId = new ObjectId("64334038a421c67ef36399e1") ;
    // const landId = req.body.landId;
    const deviceId = new ObjectId("64333da6a421c67ef36399dd");
    // const deviceId = req.body.deviceId;
    const userId = new ObjectId("6423038ec260d28577197a88");
    // const userId = req.body.userId;
    const plantId = new ObjectId("6423038ec260d28577197a88");
    // const plantId = req.body.plantId;
    const land = new Land({
        id,
        description,
        deviceId,
        userId,
        plantId
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
