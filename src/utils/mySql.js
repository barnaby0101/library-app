"use strict";

const mysql = require("mysql");
const mysqlAsync = require("promise-mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

const deleteDb = () => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query('DROP DATABASE IF EXISTS library;', (error, results, fields) => {
        if (error) throw error;
    });
    connection.end(function(err) {});
    console.log("Database deleted!");
}

const createDb = () => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("CREATE DATABASE IF NOT EXISTS library;", (error) => {
        if (error) throw error;
    });
    connection.query("USE library;", (error) => {
        if (error) throw error;
    });
    connection.query(`CREATE TABLE IF NOT EXISTS Books 
            (title VARCHAR(100), author_name_first VARCHAR(30), author_name_last VARCHAR(30), pub_date INT, 
            pub VARCHAR(30), num_pages Int, description VARCHAR(200), book_id INT PRIMARY KEY AUTO_INCREMENT);`,
        (error) => {
            if (error) throw error;
        });
    connection.query(`CREATE TABLE IF NOT EXISTS Users 
        (username VARCHAR(30), password VARCHAR(30), user_id INT PRIMARY KEY AUTO_INCREMENT, role ENUM("user", "admin") );`,
    (error) => {
        if (error) throw error;
    });
    connection.end(function(err) {});
    console.log("Database created!");
}

const addBook = (book) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
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
    connection.end(function(err) {});
    console.log("Book Added!");
}

async function checkDbExists() {
    let connection;
    return mysqlAsync.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    }).then(async (conn) => {
        connection = conn;
        return await connection.query(`SELECT SCHEMA_NAME 
            FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "library";`);
    }).then((res) => {
        let outcome = false;
        if (res.length !== 0) outcome = true;
        connection.end();
        return outcome;
    })
}



const createUser = (newUser) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => {
        if (error) throw error;
    });
    connection.query(`INSERT INTO Users (username, password, role) 
            VALUES ("${newUser.username}", "${newUser.password}", "admin");`, // TODO for now all users are admin
        (error, results, fields) => {
            if (error) throw error;
        });
    connection.end()
}

module.exports = {
    createDb, 
    deleteDb,
    addBook, 
    checkDbExists,
    createUser
};