const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  title: {
    type: String
    // required: true
  },

  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
