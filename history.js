$(init);

function init() {
    addClickHandlers();
    showHistory();
}


function addClickHandlers() {
    $("#showHistory").click(showHistory);
    $("#pagesPerDay").click(pagesPerDay);
}

