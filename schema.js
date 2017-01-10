// ========================
// DATABASE SETUP
// ========================

const mongoose = require('mongoose');

const ObjectId = mongoose.mongo.ObjectId;
const categorySchema = new mongoose.Schema({
  name: String,
  userId: String, // if the category is modified, attach this userId to this field
  parentId: String // if the category is modified, attach this category's objectId to this field
});
const questionSchema = new mongoose.Schema({
  text: String,
  categories: [{
    name: String,
    _id: mongoose.Schema.Types.ObjectId
  }],
  userId: String, // if the question is modified, attach this userId to this field
  parentId: String, // if the question is modified, attach this question's objectId to this field
  isLiked: Boolean // only possible to change value if userId isn't 'null'
});

// MVP 2/3
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const tokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
  timestamp: Date
});

exports.Category = mongoose.model('Category', categorySchema);
exports.Question = mongoose.model('Question', questionSchema);
exports.User = mongoose.model('User', userSchema);
exports.Token = mongoose.model('Token', tokenSchema);



// Dummy data setup
// =====================

// Category.create({
//   name: 'controversial',
//   userId: null, // if the category is modified, attach this userId to this field
//   parentId: null // if the category is modified, attach this category's objectId to this field
// });

// Question.create({
//   text: 'Animal testing in scientific research is necessary.',
//   categories: [{
//     name: 'controversial',
//     _id: ObjectId("585b259ae4177fee1ace63db")
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

// Question.create({
//   text: 'What would constitute a "perfect" day for you?',
//   categories: [{
//     name: 'opinions',
//     _id: ObjectId("5869a0e6516fd7476a6927d4")
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


// Question.create({
//   text: 'What is your proudest moment?',
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

// Question.create({
//   text: 'Have you ever met anyone famous?',
//   categories: [{
//     name: 'have you ever',
//     _id: ObjectId("586ad0a2fd9bec0cb393f0d2")
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

// Question.create({
//   text: '',
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

// Question.find( { categories:  {$elemMatch: { name: 'past simple'} } }  )
//   .then((questions) => {
//     console.log(questions);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// 3) get all questions from multiple categories

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


// 4) Modify a field in the db with Mongoose (doesn't work, but close)

// let updateQuery = { categories:  {$elemMatch: { name: 'past simple'} } };
// let updateUpdate = { $set: { categories: { name: 'past tense'} } };

// let updateUpdate = { $set: {'categories': [
//   {
//     name: 'past tense',
//     _id: ObjectId("585838055164359e2b57cf66"),
//     userId: null,
//     parentId: null
//   }
// ]}
// };

// Question.update(updateQuery, updateUpdate)
//   .then((questions) => {
//     console.log(questions);
//     console.log('hey');
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// {
//     "_id" : ObjectId("585838055164359e2b57cf66"),
//     "name" : "past tense"
// }
//
// {
//     "name" : "present tense",
//     "_id" : ObjectId("586adbc9aebb190eb4f48867")
// }
//
// {
//     name: 'opinions',
//      _id: ObjectId("5869a0e6516fd7476a6927d4")
//  }
//
// {
//      name: 'future tense',
//      _id: ObjectId("585837d0e247fe9e25b8180a")
//  }
