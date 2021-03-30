"use strict";

const mysql = require("mysql");
const { sanitizeObject, createTableFromArray } = require("../utils/utils");
const mysqlPassword = process.env.MYSQL_PASSWORD;

const addBook = (book, user, cb) => {
    book = sanitizeObject(book);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => {
        if (error) throw `Error selecting Library: ${error}`;
        connection.query(`INSERT INTO Books (
            title,
            author_name_first,
            author_name_last,
            pub_year,
            pub,
            num_pages
        ) VALUES (
            "${book.title}",
            "${book.authorFirstName}",
            "${book.authorLastName}",
            "${book.pubYear}",
            "${book.pub}",
            "${book.numPages}"
        );`,
            (error) => {
                if (error) {
                    console.log(`Error adding book to Books table: ${error}`);
                    cb(error, null);
                }
                connection.query(`SELECT * FROM Books WHERE title="${book.title}";`, (error, res) => {
                    if (error) {
                        console.log(`Error retrieving book: ${error}`);
                        cb(error, null);
                    }
                    book = JSON.parse(JSON.stringify(res))[0];
                    connection.query(`INSERT INTO Ownership (
                        user_id,
                        book_id
                    ) VALUES (
                        "${user.id}",
                        "${book.book_id}"
                    );`, (error) => {
                        if (error) {
                            console.log(`Error adding Ownership record: ${error}`);
                            cb(error, null);
                        }
                        connection.end();
                        cb(null, true);
                    })
                })
            });
    });
}

// returns an HTML table of the logged-in user's books
const getBooksForUser = (user, cb) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => { 
        if (error) cb(error, null);
        connection.query(`CREATE TEMPORARY TABLE UsersBooks
                SELECT * FROM OWNERSHIP 
                WHERE user_id = ${user.id};`
            , (error) => {
            if (error) cb(error, null);
            connection.query(`Select title, author_name_first,
                    author_name_last, pub_year FROM Books
                    INNER JOIN UsersBooks
                    ON Books.book_id = UsersBooks.book_id
                    ;`, (error, result) => {
                if (error) cb(error, null);
                const books = JSON.parse(JSON.stringify(result));
                const booksTable = createTableFromArray(books);
                cb(null, booksTable);
                connection.end();
            })
        })
    })
}

module.exports = {
    addBook,
    getBooksForUser
};