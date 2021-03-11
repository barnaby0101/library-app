"use strict";

const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

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

module.exports = {
    addBook
};