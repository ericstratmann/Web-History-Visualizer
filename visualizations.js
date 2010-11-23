// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory

// Shows a list of all visited websites
function showHistory() {
    var filter = {minTime: new Date().getTime() - 60 * 60 * 24 * 1000}
    var visits = getVisits(filter);
    sortBy(visits, "time");
    visits.reverse()
    for (var i in visits) {
        var url = visits[i].url;
        var title = visits[i].title || "No title";
        var html = "<a href='" + url + "'>" + title + "</a><br/>";
        $("#results").append(html);
    }
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
