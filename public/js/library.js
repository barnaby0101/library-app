"use strict";

function GetURLParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) return sParameterName[1];
    }
}

const bookAdded = GetURLParameter("addSuccess");

$( document ).ready(() => {
    if (bookAdded) {
        $.toast({
            heading: "Success!",
            text: "Your book has been added to your library.",
            position: "top-right"
        })
    }
})