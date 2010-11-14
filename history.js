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
        console.log(sorted);
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

function getHistory(callback) {
    var query = {
        text: "",
        maxResults: 10000
    };
    chrome.history.search(query, callback);
}

function sortVisitsByDay(visits) {
    var sorted = {};
    for (var i in visits) {
        var visit = visits[i];
        var date = new Date(visit.time);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        sorted[year] = sorted[year] || {};
        sorted[year][month] = sorted[year][month] || {};
        sorted[year][month][day] = sorted[year][month][day] || [];
        sorted[year][month][day].push(visit);
    }
    return sorted;
}

function allVisits(callback) {
    var visits = [];
    getHistory(function(historyItems) {
        var num = historyItems.length;
        historyItems.forEach(function(history) {
            var details = {url: history.url};
            chrome.history.getVisits(details, function(visitItems) {
                for (var j in visitItems) {
                    var visit = visitItems[j];
                    visits.push({
                        url: history.url,
                        title: history.title,
                        time: visit.visitTime,
                        transition: visit.transition
                    });
                }
                num--;
                if (num === 0) {
                    callback(visits);
                }
            });
        });
    });
}
