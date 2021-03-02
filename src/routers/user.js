"use strict";

const express = require("express");

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

router.post("/create_account", (req, res) => {
    const newAccount = {
        username: req.body.username,
        password: req.body.password
    }
    console.log(newAccount)
})

module.exports = router;