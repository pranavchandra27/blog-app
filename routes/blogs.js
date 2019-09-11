const express = require("express");
const router = express.Router();

//Authentication
const { ensureAuthenticated, blogOwnership } = require("../config/auth");

//Model
const Blogs = require("../model/blogs");
const User = require("../model/users");
//SHOW ROUTE
router.get("/", (req, res) => {
  res.render("home");
});

//Index Route
router.get("/blogs", (req, res) => {
  Blogs.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/index", {
        blogs: blogs
      });
    }
  });
});

//CREATE ROUTE
router.get("/blogs/new", ensureAuthenticated, (req, res) => {
  res.render("blogs/new");
});

//Creat New Blog
router.post("/blogs", ensureAuthenticated, (req, res) => {
  //Get Data From 'FORM' And Add Into Database
  const title = req.body.title;
  const image = req.body.image;
  const body = req.body.body;
  const author = {
    id: req.user._id,
    name: req.user.name
  };

  const newBlog = { title: title, image: image, body: body, author: author };
  Blogs.create(newBlog, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
router.get("/blogs/:id", (req, res) => {
  Blogs.findById(req.params.id)
    .populate("comment")
    .exec((err, foundBlog) => {
      if (err) {
        console.log(err);
      } else {
        res.render("blogs/show", {
          blogs: foundBlog
        });
      }
    });
});

//EDIT ROUTE
router.get("/blogs/:id/edit", blogOwnership, (req, res) => {
  Blogs.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/edit", {
        blogs: foundBlog
      });
    }
  });
});

//UPDATE ROUTE
router.put("/blogs/:id", blogOwnership, (req, res) => {
  Blogs.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE
router.delete("/blogs/:id", blogOwnership, (req, res) => {
  Blogs.findByIdAndDelete(req.params.id, (err, deletedBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

module.exports = router;
