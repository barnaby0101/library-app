"use strict";

const mysql = require("mysql");
const { unescape } = require("validator");
const { sanitizeObject } = require("../utils/utils");
const mysqlPassword = process.env.MYSQL_PASSWORD;

const addBook = (book, user, cb) => {
    book = sanitizeObject(book);
    if (book.imgUrl) book.imgUrl = unescape(book.imgUrl);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => {
        if (error) {
            console.log(`Error selecting Library while adding book: ${error}`);
            return cb(error, null);
        }
        // check if book already exists in library
        connection.query(`SELECT * FROM Books 
                WHERE title="${book.title}"
                AND author_name_first="${book.authorFirstName}"
                AND author_name_last="${book.authorLastName}"
            ;`, (error, res) => {
                if (error) {
                    console.log(`Error checking if book exists in DB: ${error}`);
                    return cb(error, null);
                }
                if (res.length !== 0) {
                    const bookId = JSON.parse(JSON.stringify(res))[0].book_id;
                    // book exists, check if current user already owns it
                    connection.query(`SELECT * FROM Ownership 
                            WHERE user_id="${user.id}"
                            AND book_id="${bookId}"
                        ;`, (error, res) => {
                            if (error) {
                                console.log(`Error checking if user ownership record already exists: ${error}`);
                                return cb(error, null);
                            }
                            if (res.length !== 0) {
                                // book exists and user already owns
                                return cb("duplicate", null);
                            } else {
                                // book exists but no ownership record
                                connection.query(`INSERT INTO Ownership (
                                    user_id,
                                    book_id
                                ) VALUES (
                                    "${user.id}",
                                    "${bookId}"
                                );`, (error) => {
                                    if (error) {
                                        console.log(`Error adding Ownership record: ${error}`);
                                        return cb(error, null);
                                    }
                                    connection.end();
                                    return cb(null, true);
                                })
                            }
                        }
                    )
            return;
        }
        // book does not exist, add book and ownership record
        connection.query(`INSERT INTO Books (
            title,
            author_name_first,
            author_name_last,
            pub_year,
            pub,
            num_pages,
            imgUrl
        ) VALUES (
            "${book.title}",
            "${book.authorFirstName}",
            "${book.authorLastName}",
            "${book.pubYear}",
            "${book.pub}",
            "${book.numPages}",
            "${book.imgUrl}"
        );`,
            (error) => {
                if (error) {
                    console.log(`Error adding book to Books table: ${error}`);
                    return cb(error, null);
                }
                // read the newly-added book back out to get the db-generated book_id
                connection.query(`SELECT * FROM Books WHERE title="${book.title}";`, (error, res) => {
                    if (error) {
                        console.log(`Error retrieving book: ${error}`);
                        return cb(error, null);
                    }
                    book = JSON.parse(JSON.stringify(res))[0];
                    // add ownership record for new entry
                    connection.query(`INSERT INTO Ownership (
                        user_id,
                        book_id
                    ) VALUES (
                        "${user.id}",
                        "${book.book_id}"
                    );`, (error) => {
                        if (error) {
                            console.log(`Error adding Ownership record: ${error}`);
                            return cb(error, null);
                        }
                        connection.end();
                        return cb(null, true);
                    })
                })
            });
        });
    })
}

const getBookById = (id, cb) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => { 
        if (error) return cb(error, null);
        connection.query(`SELECT title, author_name_first,
                author_name_last, pub_year, num_pages, pub, imgUrl
                FROM Books
                WHERE book_id = ${id}
            ;`, (error, result) => {
                if (error) return cb(error, null);
                const book = JSON.parse(JSON.stringify(result))[0];
                connection.end();
                return cb(null, book);
        })
    })
}

// returns an HTML table of the logged-in user's books
const getBooksForUser = (user, cb) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => { 
        if (error) return cb(error, null);
        connection.query(`CREATE TEMPORARY TABLE UsersBooks
                SELECT * FROM OWNERSHIP 
                WHERE user_id = ${user.id};`
            , (error) => {
            if (error) return cb(error, null);
            connection.query(`SELECT Books.book_id, title, author_name_first,
                    author_name_last, pub_year, num_pages, pub FROM Books
                    INNER JOIN UsersBooks
                    ON Books.book_id = UsersBooks.book_id
                    ;`, (error, result) => {
                if (error) return cb(error, null);
                const books = JSON.parse(JSON.stringify(result));
                if (books.length === 0) { return cb(null, null ); };
                const booksTable = createBookTable(books);
                connection.end();
                return cb(null, booksTable);
            })
        })
    })
}

const createBookTable = (array) => {
    const numRows = array.length;
    let book = new Array;

    let table = "<table>\n"
    table += "<tr><th>Title</th><th>Author</th><th>Year</th><th>Pages</th><th>Publisher</th></tr>\n"

    for (let i = 0; i < numRows; i++) {
        // create array of all values for this book
        book = Object.values(array[i]);
        const author = book[2] + " " + book[3];
        const url = `/book/?book_id=${book[0]}`;
        
        table += `<tr><td><a href="${url}">${book[1]}</a><a href="/"${book[1]}</a></td><td>${author}</td><td>${book[4]}</td><td>${book[5]}</td><td>${book[6]}</td>`;
        
        book = [];
        table += "</tr>\n"
    }

    table += "</table>"
    return table;
}

module.exports = {
    addBook,
    getBooksForUser,
    getBookById
};