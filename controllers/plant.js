const Plant = require('../models/plant');


exports.getPlants = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Plant.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Plant.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(plant => {
        if(!plant){
            const error = new Error('Could not find plant.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'plant fetched.', plant, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getPlant = (req, res, next) => {
    const plantId = req.params.plantId;
    Plant.findById(plantId)
    .then(plant => {
        if(!plant){
            const error = new Error('Could not find plant.');
            error.statusCode = 404;
            throw error; 
        }
        res.status(200).json({message: 'plant fetched.', plant});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.postPlant = (req, res, next) => {
    console.log(req);
    const title = req.body.title;
    const description = req.body.description;
    const plant = new Plant({
        title,
        description
    });

    plant
        .save()
        .then(result =>{
            res.status(201).json({
                message: 'created successfully',
                plant
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deletePlant = (req, res, next) => {
    const plantId = req.params.plantId;
    Plant.findById(plantId)
    .then(plant => {
        if(!plant){
            const error = new Error('Could not find plant.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        return Plant.findOneAndDelete(plantId);
    })
    .then(result=>{
        res.status(200).json({message: 'plant deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

