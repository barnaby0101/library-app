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
    connection.query("USE library;", (error) => {
        if (error) throw `Error selecting library while getting user: ${error}`;
    });
    if (!id && !username) throw "No ID or username provided.";
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
            if (err) throw `Error while verifying password: ${err}`;
            if (res) return cb(null, user);
            return cb(null, null);
        })
    })
}

// TODO update all error handling etc to use CB structure
const createUser = (newUser, cb) => {
    newUser = sanitizeObject(newUser);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw `Error generating salt: ${err}`;
        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
            if (err) cb(`Error hashing password: ${err}`, null);
            connection.query("USE library;", (err) => {
                if (err) cb(`Error selecting library while creating user: ${err}`, null);
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
                        "user"
                    );`,
                    (err) => {
                        if (err) cb(`Error writing new user to database: ${err}`, null);
                        cb(null, true);                        
                    });
            });
        })
    })
}

const deleteUser = (userId) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => {
        if (error) throw `Error selecting library while deleting user: ${error}`;
        connection.query(`DELETE FROM Users 
                WHERE user_id=${userId}
            ;`,
            (error) => {
                if (error) throw `Error deleting user from Users: ${error}`;
                connection.query(`DELETE FROM Ownership 
                    WHERE user_id=${userId}
                ;`,
                    (error) => {
                        if (error) throw `Error deleting user records from Ownership table: ${error}`;
                    });
            });
    });
}

const updateUser = (update) => {
    update = sanitizeObject(update);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "devuser",
        password: mysqlPassword
    });
    connection.query("USE library;", (error) => {
        if (error) throw `USE library error: ${error}`;
        if (update.username) {
            connection.query(`UPDATE Users 
                SET username = "${update.username}"
                WHERE user_id = ${update.userId}
            ;`, (error, res) => { if (error) throw `Update username error: ${error}`; }
            )};
        if (update.firstName) {
            connection.query(`UPDATE Users 
            SET first_name = "${update.firstName}"
            WHERE user_id = ${update.userId}
            ;`, (error) => { if (error) throw `Update firstName error: ${error}`; }
        )};
        if (update.lastName) {
            connection.query(`UPDATE Users 
            SET last_name = "${update.lastName}"
            WHERE user_id = ${update.userId}
            ;`, (error) => { if (error) throw `Update lastName error: ${error}`; }
        )};
        if (update.password) {
            bcrypt.genSalt(10, (error, salt) => {
                if (error) throw `Error generating salt: ${error}`;
                bcrypt.hash(update.password, salt, (error, hashedPassword) => {
                    if (error) throw `Error hashing password: ${error}`;
                    connection.query(`UPDATE Users 
                        SET password = "${hashedPassword}"
                        WHERE user_id = ${update.userId}
                    ;`), (error) => {
                        if (error) throw `Error writing new password to database: ${error}`;
                    };
                });
            });
        }
    });
}
 
module.exports = {
    getUser,
    verifyPassword,
    createUser,
    deleteUser,
    updateUser
};