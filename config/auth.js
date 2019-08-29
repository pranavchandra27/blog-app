//MODEL
const Comment = require("../model/comment"),
  Blog = require("../model/blogs");

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please login first");
    res.redirect("/users/login");
  },

  commentOwnership: function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          res.redirect("back");
        } else {
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error_msg", "You must login first");
      res.redirect("/users/login");
    }
  },

  blogOwnership: function(req, res, next) {
    if (req.isAuthenticated()) {
      Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
          console.log(err);
          res.redirectb("back");
        } else {
          if (foundBlog.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error_msg", "You must login first");
      res.redirect("/users/login");
    }
  }
};
