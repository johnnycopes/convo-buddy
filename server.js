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

// DB aliases (from schema.js)
const ObjectId = mongoose.mongo.ObjectId;
const Question = schema.Question;
const Category = schema.Category;
const User = schema.User;
const Token = schema.Token;

mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/convo_buddy');

// While true, prints out every command sent to db in MongoDB format
// mongoose.set('debug', true);

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
      res.status('400').json({error: err.message})
    });
});


app.get('/api/getCategories', (req, res) => {
  Category.find({}).sort({ 'name': 1 })
    .then((categories) => {
      res.json({categories});
    })
    .catch((err) => {
      console.log('failed');
      res.status('400').json({error: err.message})
    });
});


app.post('/api/sendMessage', (req, res) => {
  let message = req.body.message;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport('smtps://convobuddy1@gmail.com:treetopgummies@smtp.gmail.com');

  // setup e-mail data with unicode symbols
  let mailOptions = {
    from: '"Convo Buddy" <convobuddy1@gmail.com>', // sender address
    to: 'jdcoppola@gmail.com', // list of receivers
    subject: 'User message', // Subject line
    text: message, // plaintext body
    html: message // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions)
    .then((info) => {
      res.send('Message sent: ' + info.response);
    })
    .catch((err) => {
      res.status('500').json({error: err.message});
    });
});


app.listen(3001, function() {
  console.log('listening on *:3001');
});
