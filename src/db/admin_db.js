"use strict";

const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;
const { createUser } = require("../db/user_db");

const initializeDb = (cb) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query('DROP DATABASE IF EXISTS library;', (error, res) => {
        if (error) {
            console.log(`Error deleting database: ${error}`);
            cb(error, null);
        }
        connection.query("CREATE DATABASE IF NOT EXISTS library;", (error, res) => {
            if (error) {
                console.log(`Error creating database: ${error}`);
                cb(error, null);
            }   
            connection.query("USE library;", (error, res) => {
                if (error) {
                    console.log(`Error selecting library while creating db: ${error}`);
                    cb(error, null);
                }   
                connection.query(`CREATE TABLE IF NOT EXISTS Books (
                    book_id INT PRIMARY KEY AUTO_INCREMENT,
                    title VARCHAR(100), 
                    author_name_first VARCHAR(30), 
                    author_name_last VARCHAR(30), 
                    pub_year VARCHAR(10), 
                    pub VARCHAR(30), 
                    num_pages VARCHAR(8),
                    imgUrl VARCHAR(200)
                    );`,
                    (error, res) => {
                        if (error) {
                            console.log(`Error creating Books table: ${error}`);
                            cb(error, null);
                        }
                        connection.query(`CREATE TABLE IF NOT EXISTS Users (
                            user_id INT PRIMARY KEY AUTO_INCREMENT,
                            username VARCHAR(30),
                            first_name VARCHAR(30),
                            last_name VARCHAR(30),
                            password VARCHAR(60), 
                            role ENUM("user", "admin")
                            );`,
                            (error, res) => {
                                if (error) {
                                    console.log(`Error creating Users table: ${error}`);
                                    cb(error, null);
                                }
                                connection.query(`CREATE TABLE IF NOT EXISTS Ownership (
                                    user_id INT,
                                    book_id INT,
                                    review VARCHAR(2500),
                                    rating INT,
                                    PRIMARY KEY (user_id, book_id)
                                    );`,
                                    (error, res) => {
                                        if (error) {
                                            console.log(`Error creating Ownership table: ${error}`);
                                            cb(error, null);
                                        }
                                        // create hard-coded admin account
                                        createUser({
                                            username: "admin",
                                            firstName: "",
                                            lastName: "",
                                            password: "temp",
                                            role: "admin"
                                        }, (error, res) => {
                                            if (error) {
                                                console.log(`Error creating admin account: ${error}`);
                                                cb(error, null);
                                            }
                                            connection.end();
                                            if (res) console.log("Database initialized!");
                                            cb(null, true);
                                        });
                                    });
                            });
                    });
            });
        });
    });
}

const checkDbExists = (cb) => {     // cb() invoked on BOOL, true if db exists
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
            WHERE SCHEMA_NAME = "library";`, 
        (error, res) => {
            if (error) {
                console.log(`Error while checking if library database exists: ${error}`);
                return cb (error, null)
            }
        connection.end()
        return cb(null, Boolean(res.length !== 0));
    });
}

module.exports = {
    initializeDb,
    checkDbExists
};