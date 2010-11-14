// Various utility methods

function getHistory(callback) {
    var query = {
        text: "",
        maxResults: 10000
    };
    chrome.history.search(query, callback);
}

function getMostVisitedDomains(visits, num) {
    var hits = {};
    for (var i in visits) {
        var domain = parseUri(visits[i].url).host;
        hits[domain] = hits[domain] || 0;
        hits[domain]++;
    }

    var arr = [];
    for (var i in hits) {
        arr.push({domain: i, hits: hits[i]}); 
    }
    arr.sort(function(a, b) {
        if (a.hits < b.hits) {
            return -1;
        } else if (a.hits > b.hits) {
            return 1;
        } else {
            return 0;
        }
    });
    return arr.slice(-num);
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
