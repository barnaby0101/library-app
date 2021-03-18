"use strict";

const createTableFromArray = (array) => {
    const numRows = array.length;
    const numCols = Object.keys(array[0]).length;

    let table = "<table>\n<tr><th>Title</th><th>Author</hd><th></th><th>Pub</th></tr>\n"
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
    createTableFromArray
};