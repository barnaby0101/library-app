"use strict";

$("#createAccountButton").click((e) => {
    e.preventDefault();	
    const dataToSend = $("#createAccount").serializeArray();
    console.log(dataToSend);
    if (dataToSend[1].value !== dataToSend[2].value) {
        return alert("Passwords do not match.");
    }
    $.ajax({
        url: "/create_account",
        type: "POST",
        data: dataToSend,
        cache: false,
        success: () => {
            $.toast({
                heading: "Success!",
                text: "Your account has been created!",
                position: "top-right"
            })
        }
    });
})