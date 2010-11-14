// Each function in this file corresponds to one visualization in the history
// page. Each function should be named the same as the id of the HTML element
// in history.html that links to the visualization, e.g. showHistory
function showHistory() {
    $("#results").html("");
    allVisits(function(historyItems) {
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
    $("#results").html("");
    allVisits(function(visits) {
        var sorted = sortVisitsByDay(visits);
        for (var year in sorted) {
            var months = sorted[year];
            for (var month in months) {
                var days = sorted[year][month];
                for (var day in days) {
                    var date = year + "-" + month + "-" + day;
                    var num = sorted[year][month][day].length;
                    $("#results").append(date + ": " + num + "<br/>");
                }
            }
        }
    });
    return false;
}
