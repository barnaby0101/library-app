"use strict";

const mysql = require("mysql");
const mysqlDbName = process.env.MYSQL_DB_NAME;
const mysqlHost = process.env.MYSQL_HOST;
const mysqlUsername = process.env.MYSQL_USERNAME;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const { createUser } = require("../db/user_db");

const initializeDb = (cb) => {
    const connection = mysql.createConnection({
        host: mysqlHost,
        user: mysqlUsername,
        password: mysqlPassword
    });
    connection.query(`DROP DATABASE IF EXISTS ${mysqlDbName};`, (error, res) => {
        if (error) {
            console.log(`Error deleting database: ${error}`);
            cb(error, null);
        }
        connection.query(`CREATE DATABASE IF NOT EXISTS ${mysqlDbName};`, (error, res) => {
            if (error) {
                console.log(`Error creating database: ${error}`);
                cb(error, null);
            }   
            connection.query(`USE ${mysqlDbName};`, (error, res) => {
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

const checkTablesExist = (cb) => {     // cb() invoked on BOOL, true if all tables exists
    let tableCount = 0;
    const connection = mysql.createConnection({
        host: mysqlHost,
        user: mysqlUsername,
        password: mysqlPassword
    });
    connection.query(`SELECT count(*) FROM information_schema.TABLES
            WHERE (TABLE_SCHEMA = "${mysqlDbName}") AND (TABLE_NAME = "Books");`,
        (error, res) => {
            if (error) {
                console.log(`Error while checking if db table exists: ${error}`);
                return cb (error, null)
            }
            tableCount += res;
            connection.query(`SELECT count(*) FROM information_schema.TABLES
                WHERE (TABLE_SCHEMA = "${mysqlDbName}") AND (TABLE_NAME = "Users");`,
            (error, res) => {
                if (error) {
                    console.log(`Error while checking if db table exists: ${error}`);
                    return cb (error, null)
                }
                tableCount += res;
                connection.query(`SELECT count(*) FROM information_schema.TABLES
                    WHERE (TABLE_SCHEMA = "${mysqlDbName}") AND (TABLE_NAME = "Ownership");`,
                (error, res) => {
                    if (error) {
                        console.log(`Error while checking if db table exists: ${error}`);
                        return cb (error, null)
                    }
                    tableCount += res;
                connection.end()
                return cb(null, Boolean(tableCount !== 0));
            })
        })
    });
}

module.exports = {
    initializeDb,
    checkTablesExist
};