"use strict";

// TODO currently commented out

$("#createAccountButton").click((e) => {
    e.preventDefault();	
    const dataToSend = $("#createAccount").serializeArray();
    if (dataToSend[1].value !== dataToSend[2].value) {
        return alert("Passwords do not match.");
    }
    $.ajax({
        url: "/user/create",
        type: "POST",
        data: dataToSend,
        cache: false,
        success: () => {
            window.location.href="/create_successful"
        }
    });
})