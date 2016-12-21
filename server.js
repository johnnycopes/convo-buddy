// ========================
// INITIAL SETUP
// ========================

// Requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const schema = require('./schema');
const bluebird = require('bluebird');
const app = express();
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

// While true, prints out every command sent to db in MongoDB format
mongoose.set('debug', true);

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());


// ========================
// ROUTES
// ========================

app.get('/api/getQuestions', (req, res) => {
  let query = {};
  let data = req.query;
  if (data.categories) {
    data.categories = JSON.parse(data.categories);
    console.log('hit the "if" block (specific search)');
    query = {
      'categories.name': {
        $in: data.categories
      }
    };
  }
  Question.find(query)
    .then((questions) => {
      res.json({questions});
    })
    .catch((err) => {
      console.log('failed');
      res.status('401').json({error: err.message})
    });
});


app.get('/api/getCategories', (req, res) => {
  Category.find({})
    .then((categories) => {
      console.log('succeeded');
      res.json({categories});
    })
    .catch((err) => {
      console.log('failed');
      res.status('401').json({error: err.message})
    });
});




app.listen(3000, function() {
  console.log('listening on *:3000');
});
