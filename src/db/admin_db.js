"use strict";

const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

const deleteDb = () => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query('DROP DATABASE IF EXISTS library;', (error, results, fields) => {
        if (error) throw error;
        connection.end(function (err) { });
        console.log("Database deleted!");
    });
}

const createDb = () => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("CREATE DATABASE IF NOT EXISTS library;", (error) => {
        if (error) throw error;
        connection.query("USE library;", (error) => {
            if (error) throw error;
            connection.query(`CREATE TABLE IF NOT EXISTS Books 
                (title VARCHAR(100), 
                author_name_first VARCHAR(30), 
                author_name_last VARCHAR(30), 
                pub_date INT, 
                pub VARCHAR(30), 
                num_pages Int, 
                description VARCHAR(200), 
                book_id INT PRIMARY KEY AUTO_INCREMENT);`,
                (error) => {
                    if (error) throw error;
                    connection.query(`CREATE TABLE IF NOT EXISTS Users 
                        (username VARCHAR(30), 
                        password VARCHAR(30), 
                        user_id INT PRIMARY KEY AUTO_INCREMENT, 
                        role ENUM("user", "admin") );`,
                        (error) => {
                            if (error) throw error;
                            connection.end(function (err) { });
                            console.log("Database created!");
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
        if (error) throw error;
        connection.end()
        return cb(Boolean(res.length !== 0));
    });
}

module.exports = {
    createDb,
    deleteDb,
    checkDbExists
};