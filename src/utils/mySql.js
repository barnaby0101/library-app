"use strict";

const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

const connection = mysql.createConnection({
    host: "localhost",
    user: "devuser",
    password: mysqlPassword
});

const checkDbExists = () => {
    var result = true;
    connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "collection";`, (error, results) => {        
        if (error) throw error;
        if (results.length === 0) { result = false; }
        console.log("result: ", result);
        return result;
    })
}

const createDb = () => {
    connection.query("CREATE DATABASE IF NOT EXISTS library;", (error) => {
        if (error) throw error;
    });
    connection.query("USE library;", (error) => {
        if (error) throw error;
    });
    connection.query(`CREATE TABLE IF NOT EXISTS Books 
            (title VARCHAR(100), author_name_first VARCHAR(30), author_name_last VARCHAR(30), pub_date INT, 
            pub VARCHAR(30), num_pages Int, description VARCHAR(200), BookID INT PRIMARY KEY AUTO_INCREMENT );`,
        (error) => {
            if (error) throw error;
        });
    connection.query(`CREATE TABLE IF NOT EXISTS Users 
        (name_first VARCHAR(30), name_last VARCHAR(30), password VARCHAR(30) );`,
    (error) => {
        if (error) throw error;
    });
    console.log("Database created!");
}

const deleteDb = () => {
    connection.query('DROP DATABASE IF EXISTS library;', (error, results, fields) => {
        if (error) throw error;
    });
    console.log("Database deleted!");
}

const addBook = (book) => {
    connection.query("USE library;", (error) => {
        if (error) throw error;
    });
    connection.query(`INSERT INTO Books 
            (Title, author_name_first, author_name_last, pub_date, pub, num_pages, description) VALUES 
            ("${book.title}", "${book.authorFirstName}", "${book.authorLastName}", "${book.pubDate}", 
            "${book.pub}", "${book.numPages}", "${book.desc}");`,
        (error, results, fields) => {
            if (error) throw error;
        });
    console.log("Book Added!");
}

module.exports = {
    createDb, 
    deleteDb,
    addBook, 
    checkDbExists, 
    // test
};