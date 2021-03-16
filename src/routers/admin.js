"use strict";

const express = require("express");
const { createDb, deleteDb, checkDbExists } = require("../db/admin_db");

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

// does library exist   // TODO can I remove this endpoint and move this logic to the backend? 
router.get("/does_db_exist", (req, res) => {
    checkDbExists((exists) => {
        res.send(exists);
    });
})

module.exports = router;