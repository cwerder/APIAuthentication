const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost/APIAuthentication', 
{ useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(cors());

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));

// Start the server
const port = process.env.Port || 5000;
app.listen(port);
console.log(`Server listening at ${port}`);