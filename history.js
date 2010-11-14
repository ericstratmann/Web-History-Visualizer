$(init);

function init() {
    addClickHandlers();
    showHistory();
}


function addClickHandlers() {
    $("#links > a").each(function(i, link) {
        $(link).click(function() {
            $("#results").html("");
            window[link.id]();
            return false;
        });
    });
}

