const express = require("express");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },

  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Cute Puppy",
//     image: "https://cdn.pixabay.com/photo/2016/05/09/10/42/weimaraner-1381186__340.jpg",
//     body: "This Blog Post Is About A Cute Puppy"
// });

module.exports = Blog;
