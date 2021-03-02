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
})

// does library exist
router.get("/does_db_exist", async (req, res) => {
    console.log("exists", exists);
    res.send(exists);
})

module.exports = router;