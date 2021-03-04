"use strict";

const express = require("express");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { createUser } = require("../utils/mySql")

// express setup

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

// passport and passport-local setup

passport.use(new LocalStrategy(
  function(username, password, cb) {
      User.findOne({ username: username }, (err, user) => {  //  passport-local boilerplate: 
        if (err) { return cb(err); }
        if (!user) { return cb(null, false, { message: 'Incorrect username.' }
        ) 
      }
      if (!user.validPassword(password)) {
        return cb(null, false, { message: 'Incorrect password.' });
      }
      return cb(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) { cb(null, user.id); });

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {       // TODO redo 
    if (err) { return cb(err); }
    cb(null, user);
  });
});

router.use(require('morgan')('combined'));
router.use(require('body-parser').urlencoded({ extended: true }));
router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

router.use(passport.initialize());
router.use(passport.session());

// routes

router.post("/create_account", (req, res) => {  // TODO redo
    const newUser = {
        username: req.body.username,
        password: req.body.password
    }
    createUser(newUser);
    res.status(200).send();
})

router.post("/login", 
  passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/library",
      failureFlash: true
      }),
  (req, res) => {
    res.redirect('/');
    });

module.exports = router;