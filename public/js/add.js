$("#submitButton").click((e) => {
    e.preventDefault();	
    const dataToSend = $("#addBook").serializeArray();
    $.ajax({
        url: "/",
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