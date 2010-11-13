$(init);

function addClickHandlers() {
    $("#showHistory").click(showHistory);
    $("#pagesPerDay").click(pagesPerDay);
}

function showHistory() {
    $("#results").html("History!");
    return false;
}

function pagesPerDay() {
    $("#results").html("Pages per day!");
    return false;
}

function init() {
    addClickHandlers();
    $("#results").html("History goes here");
}
