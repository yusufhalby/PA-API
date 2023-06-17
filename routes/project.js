const express = require('express');

const photoController = require('../controllers/photo');
const logController = require('../controllers/log');
const deviceController = require('../controllers/device');

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


module.exports = router;
