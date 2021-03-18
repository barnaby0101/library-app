"use strict";

const express = require("express");
const { addBook } = require("../db/book_db");

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

// add book
router.post("/book/add", 
  (req, res) => {
    const book = req.body;
    const user = req.user;
    addBook(book, user);
    res.status(200).send();
})

router.get("/book", (req, res) => {
    res.render("book", {
      title: "Ulysses"
    }); 
})

module.exports = router;