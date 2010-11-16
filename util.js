// Various utility methods

// Calls `callback' with an array of all history items
function getHistory(callback) {
    var query = {
        text: "",
        maxResults: 10000
    };
    chrome.history.search(query, callback);
}

// Returns the `num' most visited domains from `visits'.
// Returns: [{domain: "google.com", hits: 5}, ...]
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

    sortBy(arr, "hits");
    return arr.slice(-num);
}

// Sorts an array of objects based on the `field' property of each object
// e.g. sortBy([{a:2}, {a:1}], "a") => [{a:1}, {a:2}]
function sortBy(arr, field) {
    arr.sort(function(a, b) {
        if (a[field] < b[field]) {
            return -1;
        } else if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    });
}


// Returns a hash of the form:
// sorted[year][month][day] = [visit, visit2, ...]
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

// Calls `callback' with an array of all visits to all URLs
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
