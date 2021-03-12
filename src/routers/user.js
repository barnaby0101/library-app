"use strict";

const express = require("express");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");

const { createUser } = require("../db/user_db");

// express setup

const router = new express.Router(); 

router.use(require("express-session")({
  secret: "my secret", 
  resave: false,
  saveUninitialized: false
}))

router.use(express.urlencoded({ extended: true }));
router.use(passport.initialize());
router.use(passport.session());


// routes

router.post("/login",
  passport.authenticate("local", { failureRedirect: 'login-warning' }),
  (req, res) => {
      res.render("library", { username: req.user.username });
})

router.post("/create_account", (req, res) => {  // TODO redo
  const newUser = {
    username: req.body.username,
    password: req.body.password
  }
  createUser(newUser);
  res.status(200).send();
})

module.exports = router;