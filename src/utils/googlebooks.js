"use strict";

// submits request for book data from Google Books API and returns book object
// publisher is currently unsupported by the API

const getBookInfo = (isbn, cb) => {
    const request = require("postman-request");
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    request({ url, json: true }, (err, { body }) => {
        if (err) cb("Unable to connect to book information service.", null);
        else if (body.totalItems === 0) cb(null, false); // false if no matching book returned by api
        else {
            const book = body.items[0].volumeInfo;
            const authorArray = book.authors[0].split(" ");

            const authorFirstName = authorArray[0];
            const authorLastName = authorArray[authorArray.length-1];
            const pubYear = book.publishedDate.split("-")[0];
            const numPages = book.pageCount.toString();
            const imgUrl = book.imageLinks.thumbnail;

            cb(null, {
                title: book.title,
                authorFirstName,
                authorLastName,
                pubYear,
                pub: "-",
                numPages,
                imgUrl
            });
        }
    })
}

module.exports = {
    getBookInfo
};