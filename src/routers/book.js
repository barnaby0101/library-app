"use strict";

const express = require("express");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");
const { unescape } = require("validator");

const { addBook, updateBook, getBooksForUser, deleteBookForUser, getBookById } = require("../db/book_db");
const { getBookInfo } = require("../../src/utils/googlebooks");
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
        if (err) throw `Error retrieving user's books: ${err}`;
        res.render("library", { 
          reqUser: req.user,
          userBooks
        });
      });
})

// add book

router.get("/book/add", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    res.render("add", { reqUser: req.user }); 
})

router.get("/book/add_result", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    res.render("add_result", { reqUser: req.user }); 
})

// Get a single book leaf page
router.get("/book/",
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    getBookById(req.query.book_id, req.user.id, (err, book) => {
      if (err) console.log(`Error getting book information from db: ${err}`);
      if (book.imgUrl === "undefined") book.imgUrl = undefined;
      res.render("book", { 
        title: book.title,
        author: book.author_name_first + " " + book.author_name_last,
        year: book.pub_year,
        pages: book.num_pages,
        pub: book.pub,
        imgUrl: book.imgUrl,
        review: book.review,
        bookId: req.query.book_id
      });
    });
  }
)

router.get("/book/update", 
  ensureLogin.ensureLoggedIn("/login_warning"),
  (req, res) => {
    getBookById(req.query.book_id, req.user.id, (err, book) => {
      if (err) console.log(`Error getting book information from db: ${err}`);
      res.render("update", { 
        title: unescape(book.title),
        author: book.author_name_first + " " + book.author_name_last,
        year: book.pub_year,
        pages: book.num_pages,
        pub: book.pub,
        imgUrl: book.imgUrl,
        review: book.review,
        bookId: req.query.book_id
      });
    })
})

router.post("/book/add/isbn", 
  (req, res) => {
    const isbn = req.body.isbn;
    const user = req.user;
    getBookInfo(isbn, (err, book) => {
      if (err) return res.render("add_result", { result: "Sorry, something went wrong with our service."});
      if (book === false) {
        return res.render("add_result", { result: "We couldn't find a book with that ISBN, please try again. It is possible that this book is simply not included in the catalog we use."});
      }
      addBook(book, user, (err, success) => {
        if (err) {
          if (err === "duplicate") { 
            return res.render("add_result", { result: "It looks like that book is already in your library!"}); 
          } 
          return res.render("add_result", { result: "Sorry, something went wrong with our library catalog. Please try again later."});
        } 
        res.redirect(303, "/library?addSuccess=true"); 
      });
    })
})

router.post("/book/add", 
  (req, res) => {
    const book = req.body;
    const user = req.user;
    addBook(book, user, (err, success) => {
      if (err) {
        if (err === "duplicate") { 
          return res.render("add_result", { result: "It looks like that book is already in your library!"}); 
        } 
        res.render("add_result", { result: "Sorry, something went wrong with our service."});
      }
      res.redirect(303, "/library?addSuccess=true"); 
    });  
})

router.post("/book/delete", 
  (req, res) => {
    deleteBookForUser(req.query.book_id, req.user.id, (err, success) => {
      if (err) {
        res.render("add_result", { result: "Sorry, something went wrong with our service."});
      }
      res.redirect(303, "/library?updateSuccess=true"); 
    });  
})

router.post("/book/update", 
  (req, res) => {
    updateBook(req.body, req.query.book_id, req.user.id, (err, success) => {
      if (err) {
        res.render("add_result", { result: "Sorry, something went wrong with our service."});
      }
      res.redirect(303, "/library?updateSuccess=true"); 
    });  
})

module.exports = router;