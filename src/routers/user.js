"use strict";

const express = require("express");
const { createUser } = require("../utils/mySql")

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

router.post("/create_account", (req, res) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password
    }
    createUser(newUser);
    res.status(200).send();
})

module.exports = router;