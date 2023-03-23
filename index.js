// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');

const cors = require('cors');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// get config vars
dotenv.config();
app.use(cors());

app.use(express.static('public'));
app.use('/public', express.static('public'));

// app.use(morgan('combined'));
// app.use(express.json());
// app.use(bodyParser.json({ type: '*/*', limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json())

// mongoose.connect('mongodb://localhost:auth/auth');


app.use(express.json());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(router);

app.listen(3090);
console.log('Server listening on:', 3090);
