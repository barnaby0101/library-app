"use strict";

const path = require("path");
const express = require("express");

const passport = require("passport")
const ensureLogin = require("connect-ensure-login");

const { createUser, deleteUser, updateUser } = require("../db/user_db");
const sessionSecret = process.env.SESSION_SECRET;
const accessRestricted = process.env.ACCOUNT_CREATE_ACCESS_RESTRICTED === "true";

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
  createUser(newUser, (err, success) => {
    if (err) {
      console.log(`Error creating new user: ${err}`);
      if (err = "username already exists") {
        return res.redirect("/user/create_result?duplicate=true")
      } else {
        return res.redirect("/user/create_result?error=true")
      }
    }
    res.redirect(303, "/user/create_result?success=true");
  });
})

router.get("/user/create_result", (req, res) => {
  res.render("create_result", { 
    success: req.query.success,
    duplicate: req.query.duplicate
  }); 
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

router.get("/user/update_successful", (req, res) => {
  res.render("update_successful"); 
})

router.get('/logout', (req, res) => {
  req.logout();
  res.render("index", { accessRestricted });
})


module.exports = router;