// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory

// Shows a list of all visited websites
function showHistory() {
    var filter = {minTime: new Date().getTime() - 1 * 24 * 60 * 60 * 1000}
    var visits = getVisits(filter);
    sortBy(visits, "time");
    visits.reverse()

    visits.forEach(function(visit, id) {
        var parsed = parseUri(visit.url);
        var url = visit.url;
        var date = new Date(visit.time);

        var timeStr = "<a href='#' id='date-" + id + "'>" + dateToStr(date) +  " " + timeToStr(date);"</a>";
        var title = visit.title || "No title";
        var domain = " (<a href='#' id='domain-" + id + "'>" + parsed.host + "</a>)";

        var html = timeStr + ": <a href='#' id='visit-" + id + "'>" + title + "</a>" + domain + "<br/>";
        $("#results").append(html);

        $("#date-" + id).click(function() {
            $("#results").html("<div id='chart'></div>");
            renderDateView(date);
        });
        $("#visit-" + id).click(function() {
            $("#results").html("<div id='chart'></div>");
            renderAreaGraph('chart', parsed.host, TimeScale.DAY);
            $("#results").append("Show all visits here");
        });
        $("#domain-" + id).click(function() {
            $("#results").html("<div id='chart'></div>");
            renderAreaGraph('chart', parsed.host, TimeScale.DAY);
            $("#results").append("Show all visits here");
        });
    });
}

function renderDateView(date) {
    $("#results").append("On the day of " + dateToStr(date) + " you did some stuff");
}

// Displays the number of pages visited per day
function pagesPerDay() {
    var numVisits = numVisitsByTime(getVisits(), TimeScale.DAY);
    for (var time in numVisits) {
        $("#results").append(time + ": " + numVisits[time] + "<br/>");
    }


}

// Displays the most visited domains
function mostVisited() {
    var numDomainsToShow = 8;
    var numVisits = numVisitsByURL(getVisits());
    var sorted = hashToArray(numVisits, true).slice(-numDomainsToShow);
    for (var i in sorted) {
        $("#results").append(sorted[i].key + ": " + sorted[i].val + "<br/>");
    }
}
