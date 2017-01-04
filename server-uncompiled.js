// ========================
// INITIAL SETUP
// ========================

// Requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const schema = require('./schema');
const bluebird = require('bluebird');
const nodemailer = require('nodemailer')
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
  Question.find(query).sort({ 'categories.name': 1 })
    .then((questions) => {
      res.json({questions});
    })
    .catch((err) => {
      console.log('failed');
      res.status('401').json({error: err.message})
    });
});


app.get('/api/getCategories', (req, res) => {
  Category.find({}).sort({ 'name': 1 })
    .then((categories) => {
      res.json({categories});
    })
    .catch((err) => {
      console.log('failed');
      res.status('401').json({error: err.message})
    });
});

app.get('/api/sendMessage', (req, res) => {
  let message = req.body.data;
  console.log(message);
  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport('smtps://convobuddy1@gmail.com:treetopgummies@smtp.gmail.com');
  //
  // // setup e-mail data with unicode symbols
  // let mailOptions = {
  //     from: '"Convo Buddy" <convobuddy1@gmail.com>', // sender address
  //     to: 'jdcoppola@gmail.com', // list of receivers
  //     subject: 'Hello ✔', // Subject line
  //     text: 'Hello world ?', // plaintext body
  //     html: '<b>Hello world ?</b>' // html body
  // };
  //
  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, function(error, info){
  //     if(error){
  //         return console.log(error);
  //     }
  //     console.log('Message sent: ' + info.response);
  // });
});


// Category.create({
//   name: 'present simple',
//   userId: null, // if the category is modified, attach this userId to this field
//   parentId: null // if the category is modified, attach this category's objectId to this field
// });

// Question.create({
//   text: 'What are some of your predictions for this year?',
//   categories: [{
//     name: 'personal experience',
//     _id: ObjectId("58699ece3ec2b546bc1feb89")
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



app.listen(3001, function() {
  console.log('listening on *:3001');
});
