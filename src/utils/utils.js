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

module.exports = {
    sanitizeString,
    sanitizeObject,
    createTableFromArray
};