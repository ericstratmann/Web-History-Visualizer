// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory


var currentFilter = {};

// Shows a list of all visited websites
function showHistory(visits) {
    if (!visits) {
        var filter = {minTime: new Date().getTime() - 1 * 24 * 60 * 60 * 1000}
        var visits = getVisits(filter);
    }

    currentFilter = {};
    sortBy(visits, "time");
    visits.reverse();
    outputVisits(visits);

}

function renderUrlView(url) {
    $("#results").html("");

    var filter = {url: url};
    currentFilter = filter;
    var visits = getVisits(filter);
    $("#results").append("<h2>" + url + "</h2>");
    $("#results").append("<div>You've visited this url " + visits.length + " times</div>");

    outputVisits(visits);
}

function renderDomainView(domain) {
    var domains = new Array();
    domains.push(domain);
    renderCompareView(domains);
}

//todo: date
function renderCompareView(domains, minDate, scale) {
    if(!scale) { scale = 0; }
    var colors = new Array();
    colors.push('#359');
    colors.push('#a59');
    colors.push('#3a9');
    colors.push('#c64');
    colors.push('#bb4');
    var d = new Date();
    if(!minDate) {
      minDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    var minTime = minDate.getTime();
    var maxTime = minTime + 86400*1000;
    
    var domainString = "";
    for(var i = 0; i < domains.length - 1; i++) {
      domainString += domains[i] + ", ";
    }
    domainString += domains[domains.length - 1];
    
    var legend = "<div class='legend'>";
    for(var i = 0; i < domains.length; i++) {
      legend += "<div><div style='float:left; min-width: 140px;'>" + domains[i] + ": </div>" + "<div style='width:20px; height:20px; float: left; margin-left: 5px; background-color: " + colors[i] + "'></div></div>";
      legend += "<div style='clear:both'></div>";
    }
    legend += "</div>";
    
    
    var left = "<img class='arrow' id='left' src='left-green.png' alt='Back one day'/>";
    var right = "<img class='arrow' id='right' src='right-green.png' alt='Back one day'/>";
    if (minDate.getTime() + 24 * 60 * 60 * 1000 > new Date().getTime()) {
        right = "";
    }

    var charttitle = "Comparison of";
    if(domains.length <= 1) { charttitle = "Spotlight on"; }
    var htmlString = '<div class="chart_title" style="margin-top:20px">';
    htmlString += charttitle + ' ' + domainString + '<\/div>';
    htmlString += "<div>Add another domain: <input type=text name='add_domain' id='add_domain' /><input type=submit value='add' name='add' id='add_domain_button'/></div>";
    htmlString += "<div>Switch Scales: <a href='javascript:void(0)' scale='0' class='scale_link'>24 Hours</a>";
    htmlString += " | <a href='javascript:void(0)' scale='7' class='scale_link'>7 Days</a>";
    htmlString += " | <a href='javascript:void(0)' scale='30' class='scale_link'>30 Days</a>";
    htmlString += " | <a href='javascript:void(0)' scale='90' class='scale_link'>90 Days</a>";
    htmlString += " | <a href='javascript:void(0)' scale='365' class='scale_link'>365 Days</a></div>";
    htmlString += "<div class='chart_heading'>Average Hourly Visits to these domains</div>";
    htmlString += "<div id='chart' style='margin-left: 100px'></div>";
    htmlString += legend;
    htmlString += "<div class='chart_heading' style='margin-top: 30px'>Visits for " + left + dateToStr(minDate) + right;
    htmlString += "</div><div id='pings'></div>";

    $("#results").html(htmlString);

    if(!scale || scale == 0 || scale == 1) {
      renderLineGraph_Hour('chart', domains, colors, true); //Todo: day vs hour
    }
    else {
      day_maxTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
      day_minTime = day_maxTime - 86400*1000*scale;
      renderLineGraph_Day('chart', domains, colors, day_minTime, day_maxTime);
    }
    renderPingsGraph('pings', minTime, maxTime, domains);

    $("#results").append("<br/>");
    
    var allVisits = new Array();
    
    for(var i = 0; i < domains.length; i++) {
      var filter = {domain: domains[i]};
      allVisits = allVisits.concat(getVisits(filter));
    }
    //TODO: currentFilter only supports one domain at a time
    outputVisits(allVisits);
    
    $("#add_domain_button").click(function() {
      domains.push($('#add_domain').val());
      renderCompareView(domains, minDate, scale);
    });
    
    $(".scale_link").click(function() {
      var s = $(this).attr('scale');
      renderCompareView(domains, minDate, s);
    });
    
    $("#left").click(function() {
        renderCompareView(domains, new Date(minDate.getTime() - 24 * 60 * 60 * 1000), scale);
    });
    
    $("#left").mouseover(function() {
        $("#left").attr("src", "left-blue.png");
    });

    $("#left").mouseout(function() {
        $("#left").attr("src", "left-green.png");
    });

    $("#right").mouseover(function() {
        $("#right").attr("src", "right-blue.png");
    });

    $("#right").mouseout(function() {
        $("#right").attr("src", "right-green.png");
    });

    $("#right").click(function() {
        renderCompareView(domains, new Date(minDate.getTime() + 24 * 60 * 60 * 1000), scale);
    });
}

function renderDateView(date, visits) {
    $("#results").html("");
    var left = "<img class='arrow' id='left' src='left-green.png' alt='Back one day'/>";
    var right = "<img class='arrow' id='right' src='right-green.png' alt='Back one day'/>";
    if (date.getTime() + 24 * 60 * 60 * 1000 > new Date().getTime()) {
        right = "";
    }
    $("#results").append("<h2>Overview for " +  left + dateToStr(date) + right + "</h2>");
    $("#results").append("<div class='chart_heading'>Total Hourly Visits</div>");
    $("#results").append("<div id='chart' style='padding-left:100px'></div>");
    $("#results").append("<div class='chart_heading'>Individual Visits to Frequent Websites</div>");
    $("#results").append("<div id='pingsChart'></div>");
    $("#results").append("<div class='chart_heading'>Pages you visited on this day</div>");
    var start = getDayMin(date);
    var end = getDayMax(date);

    var filter = {
        minTime: start,
        maxTime: end
    }
    currentFilter = filter;

    if (!visits) {
        visits = getVisits(filter);
    }
    //renderNumVisitsGraph(visits, 'chart', TimeScale.HOUR, true);
    renderAreaGraph('chart', false, TimeScale.HOUR, false, false, false, visits);
    var domains = topDomains(visits, 5);
    domains.push("");
    renderPingsGraph('pingsChart', start, end, domains, visits);
    outputVisits(visits);

    $("#left").click(function() {
        renderDateView(new Date(date.getTime() - 24 * 60 * 60 * 1000));
    });

    $("#left").mouseover(function() {
        $("#left").attr("src", "left-blue.png");
    });

    $("#left").mouseout(function() {
        $("#left").attr("src", "left-green.png");
    });

    $("#right").mouseover(function() {
        $("#right").attr("src", "right-blue.png");
    });

    $("#right").mouseout(function() {
        $("#right").attr("src", "right-green.png");
    });

    $("#right").click(function() {
        renderDateView(new Date(date.getTime() + 24 * 60 * 60 * 1000));
    });
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
    htmlString += "<div class='chart_heading'>Last 24 hours</div>";
    htmlString += "<div id='last24_overview'></div>";
    htmlString += "<div class='chart_heading'>Average Hourly Browsing</div>";
    htmlString += "<div id='hourly_overview' style='margin-left: 100px'></div>";
    htmlString += "<div class='chart_heading'>Average Daily Browsing</div>";
    htmlString += "<div id='daily_overview'></div>";
    $("#results").html(htmlString);
    var last24Filter = {minTime: new Date().getTime() - 24 * 60 * 60 * 1000};
    //renderNumVisitsGraph(getVisits(last24Filter), 'last24_overview', TimeScale.HOUR, true);
    //renderNumVisitsGraph(getVisits(), 'hourly_overview', TimeScale.HOUR, true);
    var maxTime = new Date().getTime();
    var minTime = maxTime - 24 * 60 * 60 * 1000;
    var domains = topDomains(getVisits(last24Filter), 5);
    domains.push("");
    renderPingsGraph('last24_overview', minTime, maxTime, domains, false);
    renderAreaGraph('hourly_overview', false, TimeScale.HOUR, true);
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
