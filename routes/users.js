const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

//Model
const User = require("../model/users");

//Show register form
router.get("/register", (req, res) => {
    res.render("users/register");
  });
  
  //Handle Sign up logic
  router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    //Fill in the blanks
    if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please fill in the all fields" });
    }
  
    if (password !== password2) {
      errors.push({ msg: "Password do not match" });
    }
  
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" });
    }
  
    if (errors.length > 0) {
      res.render("users/register", {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      //Validation Passed
      User.findOne({ email: email })
        //User Exist
        .then(user => {
          if (user) {
            errors.push({ msg: "Email is already registred" });
            res.render("users/register", {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });
  
            //Hash Password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                //SET PASSWORD TO HASH
                newUser.password = hash;
                //SAVE USER
                newUser
                  .save()
                  .then(user => {
                    req.flash("success_msg", "You have successfully registered");
                    res.redirect("/users/login");
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        })
        .catch(err => console.log(err));
    }
  });
  
  //Show Login Form
  router.get("/login", (req, res) => {
    res.render("users/login");
  });
  
  //Handle Login Logic
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/blogs",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  });
  
  //Login handle
  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/blogs");
  })

  module.exports = router;