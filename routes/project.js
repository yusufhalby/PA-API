/**

project.js
This file defines the project routes for the API application using Express.js.
It handles various routes related to lands, devices, logs, and photos.
Authentication and authorization middleware (isAuth, isSuperAdmin) are applied to specific routes.
*/

// Import required modules
const express = require('express');

const photoController = require('../controllers/photo');
const logController = require('../controllers/log');
const deviceController = require('../controllers/device');
const landController = require('../controllers/land');
const isAuth = require('../middleware/is-auth');
const isSuperAdmin = require('../middleware/is-super-admin');

const router = express.Router();


// Routes accessible by super admin
router.get('/allPhotos', isAuth, isSuperAdmin, photoController.getAllPhotos);

router.get('/allLogs', isAuth, isSuperAdmin, logController.getAllLogs);

router.get('/allDevices', isAuth, isSuperAdmin, deviceController.getAllDevices);

router.get('/allLands', isAuth, isSuperAdmin, landController.getAllLands);


// Lands routes
router.get('/lands', isAuth, landController.getLands);

router.get('/lands/:landId', isAuth, landController.getLand);

router.post('/lands',isAuth, landController.postLand);

router.delete('/lands/:landId', isAuth, landController.deleteLand);

router.post('/updateLands', isAuth, landController.postUpdateLand);


// Logs routes
router.get('/logs', isAuth, logController.getLogs);

router.get('/logs/:logId', isAuth, logController.getLog);

router.post('/logs', logController.postLog);

router.delete('/logs/:logId', isAuth, logController.deleteLog);

router.get('/landLogs/:landId', isAuth, logController.getLandLogs);


// Photos routes
router.get('/photos', isAuth, photoController.getPhotos);

router.get('/photos/:photoId', isAuth, photoController.getPhoto);

router.post('/photos', photoController.postPhoto);

router.delete('/photos/:photoId', isAuth, photoController.deletePhoto);

router.get('/landPhotos/:landId', isAuth, photoController.getLandPhotos);


module.exports = router;