// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory

// Shows a list of all visited websites
function showHistory(visits) {
    if (!visits) {
        var filter = {minTime: new Date().getTime() - 1 * 24 * 60 * 60 * 1000}
        var visits = getVisits(filter);
    }
    sortBy(visits, "time");
    visits.reverse()
    outputVisits(visits);
}

function renderUrlView(url) {
    $("#results").html("");

    var filter = {url: url};
    var visits = getVisits(filter);
    $("#results").append("<h2>" + url + "</h2>");
    $("#results").append("<div>You've visited this url " + visits.length + " times</div>");

    outputVisits(visits);
}

function renderDomainView(domain) {
    var d = new Date();
    var minDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var minTime = minDate.getTime();
    var maxTime = minTime + 86400*1000;
    var domains = new Array();
    domains.push(domain);

    var htmlString = '<div class="chart_title" style="margin-top:20px">Spotlight on <a href="javascript:void(0)">' + domain + '<\/a><\/div>';
    htmlString += "<div class='chart_heading'>Average Hourly Visits to " + domain + "</div>";
    htmlString += "<div id='chart'></div>";
    htmlString += "<div class='chart_heading' style='margin-top: 30px'>Visits for " + dateToStr(minDate);
    htmlString += "</div><div id='pings'></div>";

    $("#results").html(htmlString);

    renderAreaGraph('chart', domain, TimeScale.HOUR);
    renderPingsGraph('pings', minTime, maxTime, domains);

    $("#results").append("<br/>");
    outputVisits(getVisits({domain: domain}));
}

function renderDateView(date) {
    $("#results").html("");
    $("#results").append("<h2>Overview for " +  dateToStr(date)) + "</h2>";
    $("#results").append("<div id='chart'></div>");
    $("#results").append("<div>Pages you visited on this day</div>");
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
