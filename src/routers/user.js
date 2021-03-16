"use strict";

const path = require("path");
const express = require("express");

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: "localhost",
  port: 3000
})

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
  passport.authenticate("local", { failureRedirect: 'login_warning' }),
  (req, res) => {
      res.render("library", { username: req.user.username });
})

router.get("/user/create", (req, res) => {  // TODO is this still in use? 
  res.render("create"); 
})

router.get("/create_successful", (req, res) => {
  res.render("create_successful"); 
})

router.post("/user/create", (req, res) => {
  const newUser = {
      username: req.body.username,
      password: req.body.password
    };
  createUser(newUser);
  res.redirect("/create_successful");
})

router.get('/logout', (req, res) => {
  req.logout();
  res.render("index");
})



module.exports = router;