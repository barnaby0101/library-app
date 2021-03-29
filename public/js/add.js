"use strict";

$("#submitButton").click((e) => {
    e.preventDefault();	
    const dataToSend = $("#addBook").serializeArray();
    $.ajax({
        url: "/book/add",
        type: "POST",
        data: dataToSend,
        cache: false,
        success: () => {
            $.toast({
                heading: "Success!",
                text: "Your book has been added to your library.",
                position: "top-right"
            })
        }
    });
})
 
$("#submitButtonIsbn").click((e) => {
    e.preventDefault();	
    const isbn = $("#addBookIsbn").serializeArray();
    $.ajax({
        url: "/book/add/isbn",
        type: "POST",
        data: isbn,
        cache: false,
        success: () => {
            $.toast({
                heading: "Success!",
                text: "Your book has been added to your library.",
                position: "top-right"
            })
        }
    });
})