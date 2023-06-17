const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
//routers
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth');

//DB
const MONGODB_URI = 'mongodb://localhost:27017/project?retryWrites=true&w=majority';

const app = express();

//photos storage handler
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '.') + '-' + file.originalname);
    },
});

//photos filter
const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case 'image/png':
        case 'image/jpg':
        case 'image/jpeg':
        case 'image/webp':
            cb(null, true);     //accept the file
            break;
        default:
            cb(null, false);    //reject the file
    }
};  

//body parsers 
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// CORS Headers - Cross-Origin Resource Sharing 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //Authorization must be enabled on front-end
    next();
});

//use routers
app.use('/auth', authRoutes);
app.use(projectRoutes);

//error handler
app.use((error, req, res, next)=>{
    console.log(error);
    const status = error.statusCode || 500; //setting default value of 500
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data});
});

//DB connection
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(8080);
        console.log('connected');
    })
    .catch(err => {
        console.log(err);
    });