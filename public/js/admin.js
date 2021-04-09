"use strict";

$(document).ready(() => {
    $("#wipeDb").click(async (e) => {
        e.preventDefault();
        await checkDbExists().then((result) => {
            if (result === true) {
                if (confirm('Are you sure you want to delete your database? This action cannot be reversed.') === true) {
                    $.post("/wipeDb");
                    console.log("Delete DB command send from client.");
                    window.alert("Database re-initialized. Please log out to continue.");
                }
            } else {
                window.alert("There is no database to delete!");
            }
        })
    });
});

const checkDbExists = async () => {
    const result = await $.ajax({
        url: "/does_db_exist",
        type: "GET",
        cache: false,
    });
    return result;
}