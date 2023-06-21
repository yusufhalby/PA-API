const express = require('express');

const photoController = require('../controllers/photo');
const logController = require('../controllers/log');
const deviceController = require('../controllers/device');
const landController = require('../controllers/land');
const plantController = require('../controllers/plant');

const router = express.Router();

router.get('/photos', photoController.getPhotos);

router.get('/photos/:photoId', photoController.getPhoto);

router.delete('/photos/:photoId', photoController.deletePhoto);

router.post('/photos', photoController.postPhoto);


router.get('/logs', logController.getLogs);

router.get('/logs/:logId', logController.getLog);

router.delete('/logs/:logId', logController.deleteLog);

router.post('/logs', logController.postLog);


router.get('/devices', deviceController.getDevices);

router.get('/devices/:deviceId', deviceController.getDevice);

router.put('/devices', deviceController.putDevice);


router.get('/lands', landController.getLands);

router.get('/lands/:landId', landController.getLand);

router.put('/lands', landController.putLand);


router.get('/plants', plantController.getPlants);

router.get('/plants/:plantId', plantController.getPlant);

router.delete('/plants/:plantId', plantController.deletePlant);

router.post('/plants', plantController.postPlant);


module.exports = router;