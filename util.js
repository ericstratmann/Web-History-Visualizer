// Various utility methods

var _visits = []

allVisits(function(all) {
    _visits = all;
    for (var i in visitCallbacks) {
        visitCallbacks[i]();
    }
});

function getTimeScaleFunc(scale) {
    if (scale === TimeScale.HOUR) {
       return "getHours";
    } else if (scale === TimeScale.DAY) {
        return "getDate";
    } else if (scale === TimeScale.MONTH) {
        return "getMonth"; 
    } else if (scale === TimeScale.YEAR) {
        return "getFullYear";
    }
    throw "Invalid TimeScale";
}


// Calls `callback' with an array of all history items
function getHistory(callback) {
    var query = {
        text: '',
        maxResults: 100000,
        startTime: 0,
        endTime: new Date().getTime()
    };
    chrome.history.search(query, callback);
}

// Returns the amount of time 'units' between the most and least recent
// visit in `visits'. For example, if the timeScale is HOUR, it'll return
// the number of hours inbetween the first and last visit
function getTimeSpan(visits, timeScale) {
    var min = new Date().getTime();
    var max = 0;
    for (var i in visits) {
        var time = visits[i].time;
        if (time < min) {
            min = time;
        }
        if (time > max) {
            max = time;
        }
    }

    var diff = max - min;
    if (timeScale === TimeScale.HOUR) {
        return diff/(60*60*1000);
    } else if (timeScale === TimeScale.DAY) {
        return diff/(24*60*60*1000);
    } else if (timeScale === TimeScale.MONTH) {
        return diff/(30*24*60*60*1000);
    } else if (timeScale === TimeScale.YEAR) {
        return diff/(365*24*60*60*1000);
    } else {
        throw "Invalid timeScale"
    }
}

// Converts a date object into a human readable date string
function dateToStr(date) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var month = months[date.getMonth()];
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return month + " " + day + " " + hour + ":" + minutes;
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
                        id: visit.id,
                        url: history.url,
                        title: history.title,
                        time: visit.visitTime,
                        refId: visit.referringVisitId,
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
