"use strict";

const sanitizeString = (string) => {
    const validator = require("validator");
    return validator.trim(validator.escape(string));
}

const sanitizeObject = (object) => {
    const validator = require("validator");
    Object.keys(object).forEach((key) => {
        if (object[key]) {   // ignore nulls
            object[key] = validator.trim(validator.escape(object[key]));
        }
    })
    return object;
}

const createTableFromArray = (array) => {
    let table = "<table>\n<tr><th>Title</th><th>Author</hd><th></th><th>Pub</th></tr>\n"
    
    const numRows = array.length;
    for (let i = 0; i < numRows; i++) {
        table += "<tr>";
        for (const [key, value] of Object.entries(array[i])) {
            table += `<td>${value}</td>`    
        }
        table += "</tr>\n"
    }
    table += "</table>"
    return table;
}

// submits request for book data from Google Books API and returns book object
// publisher is currently unsupported
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

            cb(null, {
                title: book.title,
                authorFirstName,
                authorLastName,
                pubYear,
                pub: "-",
                numPages
            });
        }
    })
}

module.exports = {
    sanitizeString,
    sanitizeObject,
    createTableFromArray,
    getBookInfo
};