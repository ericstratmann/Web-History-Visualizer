// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory

// Shows a list of all visited websites
function showHistory(visits) {
    if (!visits) {
        var filter = {minTime: new Date().getTime() - 1 * 24 * 60 * 60 * 1000}
        var visits = getVisits(filter);
    }
    $("#results").append("<input type='text'/>");
    $("#results").append("<input type='submit' value='Search'/><br/>");
    sortBy(visits, "time");
    visits.reverse();
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

    renderAreaGraph('chart', domain, TimeScale.HOUR, true);
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

// Displays the number of pages visited per day
function overviewVis() {
    var htmlString = "<div class='chart_title'>Web browsing overview</div>";
    htmlString += "<div class='chart_heading'>Average Hourly Browsing</div>";
    htmlString += "<div id='hourly_overview'></div>";
    htmlString += "<div class='chart_heading'>Average Daily Browsing</div>";
    htmlString += "<div id='daily_overview'></div>";
    $("#results").html(htmlString);
    renderNumVisitsGraph(getVisits(), 'hourly_overview', TimeScale.HOUR, true);
    renderNumVisitsGraph(getVisits(), 'daily_overview', TimeScale.DAY, true);
}

// Displays the most visited domains
function mostVisited() {
    var htmlString = "<div class='chart_title'>Most Visited Domains</div>";
    htmlString += "<div class='chart_heading'>All Time</div>";
    htmlString += "<div id='chart_all'></div>";
    htmlString += "<div class='chart_heading'>Last Month</div>";
    htmlString += "<div id='chart_month'></div>";
    htmlString += "<div class='chart_heading'>Last 24 hrs</div>";
    htmlString += "<div id='chart_day'></div>";
    $("#results").html(htmlString);
    var now = new Date();
    var month = new Date();
    month.setMonth(month.getMonth() - 1);
    var day = new Date();
    day.setDate(month.getDate() - 1);
    renderTopDomains('chart_all', '#89d');
    renderTopDomains('chart_month', '#9d8', true, month.getTime(), now.getTime());
    renderTopDomains('chart_day', '#d89', true, day.getTime(), now.getTime());
}
