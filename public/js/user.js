"use strict";

const checkPasswordMatch = () => {
    if (document.getElementById("password").value !== document.getElementById("passwordConfirm").value) {
        alert("Passwords do not match!");
        return false;
    }
    return true;
}