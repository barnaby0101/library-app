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

module.exports = {
    sanitizeString,
    sanitizeObject
};