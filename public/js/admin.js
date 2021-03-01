"use strict";

$(document).ready(() => {
    $("#createDb").click(async (e) => {
        e.preventDefault();
        await checkDbExists().then((result) => {
            if (result === true) {
                window.alert("Database already exists!");
            } else {
                $.post("/createDb");
                window.alert("Database created!");
                console.log("Create DB command send from client.");
            }
        });
    });
})

$(document).ready(() => {
    $("#deleteDb").click(async (e) => {
        e.preventDefault();
        await checkDbExists().then((result) => {
            if (result === true) {
                if (confirm('Are you sure you want to delete your database?') === true) {
                    $.post("/deleteDb");
                    console.log("Delete DB command send from client.");
                }
            } else {
                window.alert("There is no database to delete!");
            }
        })
        
    });
});

$(document).ready(function () {
    $("#testButton").click((e) => {
        e.preventDefault();
        $.post("/test");
    });
});

const checkDbExists = async () => {
    const result = await $.ajax({
        url: "/does_db_exist",
        type: "GET",
        cache: false,
    });
    console.log("result", result);
    return result;
}