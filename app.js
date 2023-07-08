/**

app.js
This file is the entry point for the API application built using Express.js framework.
It sets up the server, database connection, middleware, and defines the routes for handling incoming requests.
*/

// Import required modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');

// Import routers
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth');

// Set up database connection URI
//for local development
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/project?retryWrites=true&w=majority'; 
//for production
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.bs6du.mongodb.net/${process.env.MONGO_DEF_DB}?retryWrites=true&w=majority`;

// Initialize Express application
const app = express();

// Set up security middleware
app.use(helmet());

// Configure multer for handling file uploads
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        req.fileName = file.originalname.slice(0,-5);
        cb(null, new Date().toISOString().replace(/:/g, '.') + '-' + 'photo.jpg');
    },
});

// Configure photos filter
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

// Configure body parsers 
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

//  Set up CORS Headers - Cross-Origin Resource Sharing 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*', '*://localhost:*/*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, method'); //Authorization must be enabled on front-end
    next();
});

// Set up routes
app.use('/auth', authRoutes);
app.use(projectRoutes);

// Route to handle requests to the API root domain
app.get('/', (req, res, next)=>{
    // Send a welcome message to users accessing the root domain
    return res.status(200).send(`
        <h1>Welcome to the Precision Agriculture API!</h1>
        <p>This API provides endpoints for accessing and managing precision agriculture data. It offers a range of features and functionalities to optimize agricultural processes, improve crop yield, and enhance farming efficiency.</p>
        <p>Please refer to the API documentation for detailed information on available endpoints and how to interact with the API.</p>
        <h2>Happy farming!</h2>
    `);
})

// Error handler middleware
app.use((error, req, res, next)=>{
    console.log(error);
    const status = error.statusCode || 500; //setting default value of 500
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data});
});

// Connect to the database and start the server
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 8080); //localhost:8080 in development
        console.log('connected');
    })
    .catch(err => {
        console.log(err);
    });