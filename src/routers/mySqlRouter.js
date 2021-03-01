"use strict";

const express = require("express");
const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;
const { createDb, deleteDb, addBook, test } = require("../utils/mySql");

const router = new express.Router();
router.use(express.urlencoded({ extended: true }));

// create database
router.post("/createDb", (req, res) => {
    createDb(); 
    res.status(200).send();
})

// delete database
router.post("/deleteDb", (req, res) => {
    deleteDb();
})

// add book
router.post("/", (req, res) => {
    const book = req.body;
    console.log("Request Body: ", book);
    addBook(book);
    res.status(200).send();
})

// run test function
router.post("/test", (req, res) => {
    test();
})

// does library exist
router.get("/does_db_exist", (req, res) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "library";`, (error, results) => {        
        var result = false;
        if (error) throw error;
        if (results.length !== 0) result = true;
        res.send(result);
    })
})

module.exports = router;