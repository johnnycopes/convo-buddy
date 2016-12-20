const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const schema = require('./schema');
const bluebird = require('bluebird');
// const bcrypt = require('bcrypt');
// const uuid = require('uuid');


// DB aliases (from schema.js)
const ObjectId = mongoose.mongo.ObjectId;
const Question = schema.Question;
const Category = schema.Category;
const User = schema.User;
const Token = schema.Token;


mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/convo_buddy');


// When true, prints out every command sent to db in MongoDB format
mongoose.set('debug', true);
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());







app.listen(3000, function() {
  console.log('listening on *:3000');
});
