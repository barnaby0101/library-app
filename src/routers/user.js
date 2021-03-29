"use strict";

const path = require("path");
const express = require("express");

const passport = require("passport")
const ensureLogin = require("connect-ensure-login");

const { createUser, deleteUser, updateUser } = require("../db/user_db");
const sessionSecret = process.env.SESSION_SECRET;

// express setup

const router = new express.Router(); 

router.use(require("express-session")({
  secret: sessionSecret,
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

router.get("/user/account", 
  ensureLogin.ensureLoggedIn("/login_warning"),
    (req, res) => {
      res.render("account", { reqUser: req.user }); 
    }  
)

router.post("/user/create", (req, res) => {
  const newUser = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };
  createUser(newUser);
  res.redirect("/user/create_successful");
})

router.post("/user/delete", 
  ensureLogin.ensureLoggedIn("/login_warning"),
    (req, res) => { 
      deleteUser(req.user.id);
      req.logout();
      res.redirect("/");
})

router.post("/user/update", 
  ensureLogin.ensureLoggedIn("/login_warning"),
    (req, res) => { 
      const update = {
        userId: req.user.id.toString(),
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
      }
      updateUser(update);
      res.redirect("/user/update_successful");
})

router.get("/user/create_successful", (req, res) => {
  res.render("create_successful"); 
})

router.get("/user/update_successful", (req, res) => {
  res.render("update_successful"); 
})

router.get('/logout', (req, res) => {
  req.logout();
  res.render("index");
})


module.exports = router;