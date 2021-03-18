"use strict";

const express = require("express");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");

const { addBook } = require("../db/book_db");
const { getBooksForUser } = require("../db/book_db");
const sessionSecret = process.env.SESSION_SECRET;

const router = new express.Router();

router.use(require("express-session")({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}))

router.use(express.urlencoded({ extended: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get("/library", 
  ensureLogin.ensureLoggedIn("/login_warning"),
    (req, res) => { 
      getBooksForUser(req.user, (err, userBooks) => {
        if (err) console.log(err);
        res.render("library", { 
          reqUser: req.user,
          userBooks,
        });
      });
})

// add book

router.get("/add", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    res.render("add", { reqUser: req.user }); 
})

router.post("/book/add", 
  (req, res) => {
    const book = req.body;
    const user = req.user;
    console.log("req.user", req.user); // todo remove
    console.log("req.body", req.body); // todo remove
    addBook(book, user);
    res.status(200).send();
})

router.get("/book", (req, res) => {
    res.render("book", {
      title: "Ulysses"
    }); 
})

module.exports = router;