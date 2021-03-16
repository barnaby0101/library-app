"use strict";

const mysql = require("mysql");
const mysqlPassword = process.env.MYSQL_PASSWORD;

const getUser = (id, username, cb) => {
    let user = {};
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (err) => {
        if (err) throw err;
    });
    if (!id && !username) throw err;
    if (id) {
        connection.query(`SELECT * FROM Users WHERE user_id="${id}";`, (err, res) => {
            if (err) cb(error, null);
            user = {
                username: res[0].username,
                id,
                password: res[0].password,
                role: res[0].role
            }
            return cb(null, user);
        });
    }
    if (!id && username) {
        connection.query(`SELECT * FROM Users WHERE username="${username}";`, (err, res) => {
            if (err) cb(err, null);
            if (res.length === 0) return cb(null, null);  // if no user found, return null
            user = {
                username,
                id: res[0].user_id,
                password: res[0].password,
                role: res[0].role
            }
            return cb(null, user);
        });
    }
    connection.end();
}

const verifyPassword = (username, password, cb) => {
    getUser(null, username, (err, user) => {
        if (err) return cb(err, null);
        if (user && user.password === password) return cb(null, user);
        else return cb(null, null);
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
        connection.query(`INSERT INTO Users (username, password, role) 
        VALUES ("${newUser.username}", "${newUser.password}", "admin");`, // TODO for now all users are admin
            (error) => {
                if (error) throw error;
            });
    });
}

module.exports = {
    getUser,
    verifyPassword,
    createUser
};