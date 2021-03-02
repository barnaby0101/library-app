"use strict";

const express = require("express");

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

// add book
router.post("/", (req, res) => {
    const book = req.body;
    console.log("Request Body: ", book);
    addBook(book);
    res.status(200).send();
})

router.get("/book_leaf", (req, res) => {
    res.render("book_leaf", {
      title: "Ulysses"
    }); 
  })

module.exports = router;