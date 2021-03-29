"use strict";

const express = require("express");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");

const { addBook, getBooksForUser } = require("../db/book_db");
const { getBookInfo } = require("../../src/utils/utils");
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

router.get("/book/add", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    res.render("add", { reqUser: req.user }); 
})

router.post("/book/add", 
  (req, res) => {
    const book = req.body;
    const user = req.user;
    addBook(book, user);
    res.status(200).send();
})

router.post("/book/add/isbn", 
  (req, res) => {
    const isbn = req.body.isbn;
    const user = req.user;
    getBookInfo(isbn, (err, book) => {
      if (err) throw err;
      addBook(book, user);
    })
    res.status(200).send();
})

module.exports = router;