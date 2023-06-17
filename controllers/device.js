const Device = require('../models/device');


exports.getDevices = (req, res, next) => {
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


exports.getDevice = (req, res, next) => {
    const deviceId = req.params.deviceId;
    Device.findById(deviceId)
    .then(device => {
        if(!device){
            const error = new Error('Could not find device.');
            error.statusCode = 404;
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


exports.putDevice = (req, res, next) => {
    console.log(req);
    const waterPump = req.body.waterPump;
    const anyPump = req.body.anyPump;
    const landId = new ObjectId("64334038a421c67ef36399e1") ;
    // const landId = req.body.landId;
    // const deviceId = new ObjectId("64333da6a421c67ef36399dd");
    // // const deviceId = req.body.deviceId;
    const userId = new ObjectId("6423038ec260d28577197a88");
    // const deviceId = req.body.deviceId;
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
