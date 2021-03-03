"use strict";

const express = require("express");
const { createDb, deleteDb, checkDbExists } = require("../utils/mySql");

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

// create database
router.post("/createDb", (req, res) => {
    createDb(); 
    res.status(200).send();
})

// delete database
router.post("/deleteDb", (req, res) => {
    deleteDb();
    res.status(200).send();
})

// does library exist
router.get("/does_db_exist", async (req, res) => {
    const result = await checkDbExists();
    res.send(result);
})

module.exports = router;