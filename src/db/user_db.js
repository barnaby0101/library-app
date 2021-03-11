"use strict";

const mysql = require("mysql");
const mysqlAsync = require("promise-mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

async function checkUserExists(username) {
    let connection;
    return mysqlAsync.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    }).then(async (conn) => {
        connection = conn;
        return await connection.query(
            `SELECT username FROM Users WHERE username="${username}";`,
            (error, results, fields) => {
                if (error) throw error;
            }).then((res) => {
                connection.end(function(err) {});
                return console.log("res", res);
            });  
    })
}

async function checkUserExists(username) {
    let connection;
    return mysqlAsync.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    }).then(async (conn) => {
        connection = conn;
        connection.query(
            "USE library;", (error) => {
                if (error) throw error;
            })
        return;
    }).then(async () => {
        return await connection.query(
            `SELECT username FROM Users WHERE username="${username}";`
    ).then(async (res) => {
        connection.end(function (err) { });
        if (res.length === 0) {
            return false;
        }
        return true;
        });
    })
}

async function verifyPassword(username, password) {
    let connection;
    return mysqlAsync.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    }).then(async (conn) => {
        connection = conn;
        connection.query(
            "USE library;", (error) => {
                if (error) throw error;
            })
        return;
    }).then(async () => {
        return await connection.query(
            `SELECT password FROM Users WHERE username="${username}";`
    ).then(async (res) => {
        connection.end(function (err) { });
        if (res !== password) {
            return false;
        }
        return true;
        });
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
    verifyPassword,
    createUser,
    checkUserExists
};