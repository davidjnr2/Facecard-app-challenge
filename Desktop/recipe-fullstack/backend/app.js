// mongdb pw: NIg15vitkozmJvc4
//mongodb connection:  mongodb+srv://davidjnr2:<password>@cluster0-syyqu.mongodb.net/test?retryWrites=true&w=majority


const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const stuffRoutes = require('./routes/stuff');

mongoose.connect('mongodb+srv://davidjnr2:NIg15vitkozmJvc4@cluster0-syyqu.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/recipes', stuffRoutes);
module.exports = app;