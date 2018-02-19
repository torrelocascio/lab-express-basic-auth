const express = require("express");
const authRoutes = express.Router();

//User Model
const User = require("../models/user")

//Route to Display Signup Form
authRoutes.get("/signup", (req, res, next) => {
  res.render("signup");
});

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Routes to Handle Signup Form Submission
authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  //Validation for signin, must have something in each
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/");
      }
    });
    });
  });

  authRoutes.post("/login", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
          res.render("login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  });
  

  authRoutes.get("/login", (req, res, next) => {
    res.render("login");
  });
  module.exports = authRoutes