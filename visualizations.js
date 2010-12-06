// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory

// Shows a list of all visited websites
function showHistory() {
    var filter = {minTime: new Date().getTime() - 1 * 24 * 60 * 60 * 1000}
    var visits = getVisits(filter);
    sortBy(visits, "time");
    visits.reverse()
    outputVisits(visits);
}

function renderDateView(date) {
    $("#results").html("<div id='chart'></div>");
    $("#results").append("On the day of " + dateToStr(date) + " you did some stuff");
    var start = getDayMin(date);
    var end = getDayMax(date);
    var filter = {
        minTime: start,
        maxTime: end
    }
    var visits = getVisits(filter);
    renderNumVisitsGraph(visits, 'chart', TimeScale.HOUR, true);
    outputVisits(visits);
}

// Displays the number of pages visited per day
function pagesPerDay() {
    $("#results").html("<div id='chart'></div>");
    $("#results").append("This is how many pages you view per day");
    renderNumVisitsGraph(getVisits(), 'chart');
}

// Displays the most visited domains
function mostVisited() {
    $("#results").html("<div id='chart'></div>");
    renderTopDomains('chart');
}
