// Dummy data setup

// Category.create({
//   name: 'conditonal tense',
//   userId: null, // if the category is modified, attach this userId to this field
//   parentId: null // if the category is modified, attach this category's objectId to this field
// });



Question.create({
  text: 'What did you eat for dinner last night?',
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  numLikes: 0,
  userId: null, // if the question is modified, attach this userId to this field
  parentId: null, // if the question is modified, attach this question's objectId to this field
  isLiked: false
});
