$(init);

function init() {
    addClickHandlers();
    showHistory();
}


function addClickHandlers() {
    $("#showHistory").click(showHistory);
    $("#pagesPerDay").click(pagesPerDay);
}

function showHistory() {
    $("#results").html("");
    getHistory(function(historyItems) {
        for (var i in historyItems) {
            var url = historyItems[i].url;
            var title = historyItems[i].title;
            var html = "<a href='" + url + "'>" + title + "</a><br/>";
            $("#results").append(html);
        }
    });
    return false;
}

function pagesPerDay() {
    $("#results").html("Pages per day!");
    return false;
}

function getHistory(fn) {
    var query = {
        text: "",
        maxResults: 50
    };
    chrome.history.search(query, fn);
}
