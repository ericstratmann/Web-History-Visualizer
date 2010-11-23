$(init);

// Automatically called when the DOM is loaded
function init() {
    addClickHandlers();
    setTimeout(showHistory, 100);
}


// Adds callbacks to run when the different visualizations are clicked
// All ids of anchor tags in the `links' div correspond to functions in
// visualizations.js
function addClickHandlers() {
    $("#links > a").each(function(i, link) {
        $(link).click(function() {
            $("#results").html("");
            window[link.id]();
            return false;
        });
    });
}
