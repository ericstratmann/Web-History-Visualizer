// A visit object represents one visit to a page. It has the properties: 
//   id: string,
//   url: string,
//   title: string,
//   time: int, milliseconds since epoch
//   refId: string, id of another visit object
//   transition: one of ["link", "typed", "auto_bookmark", "auto_subframe", "manual_subframe", "generated", "start_page", "form_submit", "reload", "keyword", "keyword_generated"]

// Pass one of these properties in to any function that asks for a timeScale
// e.g. someFunction(TimeScale.DAY)
var TimeScale = {
    HOUR: 1,  // 0 - 23
    DAY: 2,   // 1 - 31
    MONTH: 3, // 0 - 11
    YEAR: 4   // 1970 - 
}

// Invokes `callback' when visit data is ready
var visitCallbacks = [];
function visitsReady(callback) {
    visitCallbacks.push(callback);
}


// Returns all visits that match the optional `filter'.
// A filter object can have any of the following properties:
//   maxTime: int
//   minTime: int
//   domain: string
//   url: string
//   category: string (not implemented)
//   visitId: string (not implemented)
function getVisits(filter) {
    filter = filter || {}
    var filteredVisits = [];


    if (filter.url) {
        var filterUri = parseUri(filter.url);
    }
    for (var i in _visits) {
        var visit = _visits[i];
        var uri = parseUri(visit.url);
        if (filter.domain && uri.host !== filter.domain) {
            continue;
        }
        if (filter.minTime && visit.time < filter.minTime) {
            continue;
        }
        if (filter.maxTime && visit.time > filter.maxTime) {
            continue;
        }
        if (filter.url && (uri.host !== filterUri.host || uri.path !== filterUri.path || uri.query !== filterUri.query)) {
            continue;
        }
        filteredVisits.push(visit);
   }
   return filteredVisits;
}

// Returs a hash in the form of {2009: 3, 2010: 5, ...}, showing the number
// of visits in each time period
function numVisitsByTime(visits, timeScale) {
    var func = getTimeScaleFunc(timeScale);

    var numVisits = {};
    for (var i in visits) {
        var time = new Date(visits[i].time)[func]();
        numVisits[time] = numVisits[time] || 0;
        numVisits[time]++;
    }
    return numVisits;
}


// Returs a hash in the form of {"google.com", 5, "cnn.com": 3, ...}, showing
// the number of visits to each domain
function numVisitsByURL(visits) {
    var numVisits = {};
    for (var i in visits) {
        var domain = parseUri(visits[i].url).host;
        numVisits[domain] = numVisits[domain] || 0;
        numVisits[domain]++;
    }
    return numVisits;
}

// Returns a hash of the form {2010: 12345, ...}, showing the number of minutes
// browsed per unit of time.
// `visits` should NOT be filtered except possibly by time.
function timeSpentBrowsing(visits, timeScale) {
    var IDLE_CUTOFF = 5 * 60 * 1000; // 5 minutes
    var timeSpent = {};
    sortBy(visits, "time");
    var last = visits[0].time;
    var func = getTimeScaleFunc(timeScale);

    for (var i in visits) {
        var visit = visits[i];
        var bucket = new Date(visit.time)[func]();
        timeSpent[bucket] = timeSpent[bucket] || 0;
        var timeSinceLast = visit.time - last;
        if (timeSinceLast > IDLE_CUTOFF) {
            timeSpent[bucket] += IDLE_CUTOFF/(60*1000);
        } else {
            timeSpent[bucket] += timeSinceLast/(60*1000);
        }
        last = visit.time;
    }
    timeSpent[bucket] += IDLE_CUTOFF/(60*1000);
    for (var i in timeSpent) {
        timeSpent[i] = Math.round(timeSpent[i]);
    }
    return timeSpent;
}

// Converts a hash into an array of the form: 
// [{key: ..., val: ...}, ...]
// The array will be sorted by key unless the optional `sortByValue` is true,
// in which case it will be sorted by value
function hashToArray(hash, sortByValue) {
    var arr = [];
    for (var i in hash) {
        arr.push({
            key: i,
            val: hash[i]
        });
    }
    sortBy(arr, sortByValue ? "val" : "key");
    return arr;
}
