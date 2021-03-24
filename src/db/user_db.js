"use strict";

const mysql = require("mysql");
const bcrypt = require('bcryptjs');
const { sanitizeObject } = require("../utils/utils");
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
                id,
                username: res[0].username,
                firstName: res[0].first_name,
                lastName: res[0].last_name,
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
                id: res[0].user_id,
                username,
                firstName: res[0].first_name,
                lastName: res[0].last_name,
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
        if (!user) return cb(null, null);
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) throw err;
            if (res) return cb(null, user);
            return cb(null, null);
        })
    })
}

const createUser = (newUser) => {
    newUser = sanitizeObject(newUser);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
            if (err) throw err;
            connection.query("USE library;", (error) => {
                if (error) throw error;
                connection.query(`INSERT INTO Users (
                        username,
                        first_name,
                        last_name,
                        password,
                        role
                    ) 
                    VALUES (
                        "${newUser.username}",
                        "${newUser.firstName}",
                        "${newUser.lastName}",
                        "${hashedPassword}",
                        "admin"
                    );`, // TODO for now all users are admin
                    (error) => {
                        if (error) throw error;
                    });
            });
        })
    })
}

module.exports = {
    getUser,
    verifyPassword,
    createUser
};