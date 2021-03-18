"use strict";

const path = require("path");
const express = require("express");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");

const { createUser } = require("../db/user_db");

// express setup

const router = new express.Router(); 

router.use(require("express-session")({
  secret: "my secret",  // TODO replace with actual secret
  resave: false,
  saveUninitialized: false
}))

router.use(express.urlencoded({ extended: true }));
router.use(passport.initialize());
router.use(passport.session());


// routes

router.get("/user/create", (req, res) => {
  res.render("create"); 
})

router.post("/user/create", (req, res) => {
  const newUser = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };
  createUser(newUser);
  res.redirect("/create_successful");
})

router.get("/create_successful", (req, res) => {
  res.render("create_successful"); 
})

router.get('/logout', (req, res) => {
  req.logout();
  res.render("index");
})


module.exports = router;