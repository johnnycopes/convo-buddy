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


// Dummy data setup
// =====================

// Category.create({
//   name: 'hypothetical',
//   userId: null, // if the category is modified, attach this userId to this field
//   parentId: null // if the category is modified, attach this category's objectId to this field
// });

// Question.create({
//   text: 'What change do you want in your life within the next five years?',
//   categories: [{
//     name: 'future tense',
//     _id: ObjectId("585837d0e247fe9e25b8180a")
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


// Test queries
// =====================

// 1) get all questions from the db, period

// Question.find({})
//   .then((results) => {
//     console.log('found all questions');
//     console.log(results);
//   })
//   .catch((err) => {
//     console.log('failed');
//     console.log(err.message);
//   });

// 2) get all questions from a specific category

// let category = 'past tense';
// Question.find({
//     $and: [
//         { 'categories.name': 'future tense' },
//         { 'categories.name': 'hypothetical' }
//     ]
// })
//   .then((results) => {
//     console.log('found questions from one category');
//     console.log(results);
//   })
//   .catch((err) => {
//     console.log('failed');
//     console.log(err.message);
//   });

// 3) get all questions from multiple categories

// let category = 'past tense';
// Question.find({
//     $and: [
//         { 'categories.name': 'future tense' },
//         { 'categories.name': 'hypothetical' }
//     ]
// })
//   .then((results) => {
//     console.log('found questions from multiple categories');
//     console.log(results);
//   })
//   .catch((err) => {
//     console.log('failed');
//     console.log(err.message);
//   });




app.listen(3000, function() {
  console.log('listening on *:3000');
});
