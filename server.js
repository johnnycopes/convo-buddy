'use strict';

// ========================
// INITIAL SETUP
// ========================

// Requirements
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schema = require('./schema');
var bluebird = require('bluebird');
var app = express();
// const bcrypt = require('bcrypt');
// const uuid = require('uuid');

// DB aliases (from schema.js)
var ObjectId = mongoose.mongo.ObjectId;
var Question = schema.Question;
var Category = schema.Category;
var User = schema.User;
var Token = schema.Token;

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

app.get('/api/getQuestions', function (req, res) {
  var query = {};
  var data = req.query;
  if (data.categories) {
    data.categories = JSON.parse(data.categories);
    console.log('hit the "if" block (specific search)');
    query = {
      'categories.name': {
        $in: data.categories
      }
    };
  }
  Question.find(query).then(function (questions) {
    console.log(questions);
    res.json({ questions: questions });
  }).catch(function (err) {
    console.log('failed');
    res.status('401').json({ error: err.message });
  });
});

app.get('/api/getCategories', function (req, res) {
  Category.find({}).then(function (categories) {
    console.log('succeeded');
    res.json({ categories: categories });
  }).catch(function (err) {
    console.log('failed');
    res.status('401').json({ error: err.message });
  });
});

// Category.create({
//   name: 'would you rather',
//   userId: null, // if the category is modified, attach this userId to this field
//   parentId: null // if the category is modified, attach this category's objectId to this field
// });

// Question.create({
//   text: 'Would you rather have a family of ten children or never be able to have children at all?',
//   categories: [{
//     name: 'would you rather',
//     _id: ObjectId("585b28ef00a902ef1120dfbf")
// },
// {
//   name: 'conditional tense',
//   _id: ObjectId("585838ef82789b9e48ea6e15")
// }],
//   numLikes: 0,
//   userId: null, // if the question is modified, attach this userId to this field
//   parentId: null, // if the question is modified, attach this question's objectId to this field
//   isLiked: false
// })
//   .then((results) => {
//     console.log('success');
//     console.log(results);
//   })
//   .catch((err) => {
//     console.log('error');
//     console.log(err.message);
//     console.log(err.errors);
//   });


app.listen(3001, function () {
  console.log('listening on *:3001');
});
