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
