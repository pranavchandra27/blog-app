const express = require("express");
const router = express.Router();

//Authentication
const { ensureAuthenticated, commentOwnership } = require("../config/auth");

//Models
const Blog = require("../model/blogs");
const Comment = require("../model/comment");

//Create New Comment Page
router.get("/blogs/:id/comments/new", ensureAuthenticated, (req, res) => {
  //Finb Blog By ID Using (req.params.id)....
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.render("comments/new", { blog: blog });
    }
  });
});

//Creating/Adding new comment to the show page
router.post("/blogs/:id/comments", ensureAuthenticated, (req, res) => {
  //lookup for blog from ID
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      Comment.create(req.body, (err, comment) => {
        if (err) {
          console.log(err);
          req.flash("error", "Something went wrong");
        } else {
          //Add User and Id To Comment
          comment.author.id = req.user._id;
          comment.author.name = req.user.name;
          console.log(req.user);
          //save comment
          comment.save();
          blog.comment.push(comment);
          blog.save();
          console.log(comment);
          res.redirect("/blogs/" + req.params.id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get(
  "/blogs/:id/comments/:comment_id/edit",
  commentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          blog_id: req.params.id,
          comment: foundComment
        });
      }
    });
  }
);

//COMMENT UPDATE ROUTE
router.put("/blogs/:id/comments/:comment_id", commentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    }
  );
});

//COMMENT DELETE/DESTROY ROUTE
router.delete(
  "/blogs/:id/comments/:comment_id",
  commentOwnership,
  (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, err => {
      res.redirect("/blogs/" + req.params.id);
    });
  }
);

module.exports = router;
