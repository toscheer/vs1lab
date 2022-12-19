// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    // call findLocation to get LocationHelper with current location
    if (document.getElementById("latitudeTag").value == '' || document.getElementById("longitudeTag").value == '') {
        LocationHelper.findLocation(function(helper) {
            // fill in values for normal and hidden fields with current latitude and longitude
            document.getElementById("latitudeTag").value = helper.latitude;
            document.getElementById("longitudeTag").value = helper.longitude;
            document.getElementById("latitudeDiscovery").value = helper.latitude;
            document.getElementById("longitudeDiscovery").value = helper.longitude;
            console.log("Set new coordinates! Current latitude:", helper.latitude, "Current longitude:", helper.longitude);
            // change URL for image element to one fitting the current location via MapQuest
            updateMap(helper.latitude, helper.longitude);
        });
    } else {
        updateMap(document.getElementById("latitudeTag").value, document.getElementById("longitudeTag").value);
    }
}

function updateMap(latitude, longitude) {
    var tagListJSON = document.getElementById("mapView").getAttribute("data-tags");
    var tagList = tagListJSON ? JSON.parse(tagListJSON) : [];
    document.getElementById("mapView").src = new MapManager("hWa4XXaxnRItTYFMPqxKcflhfkGl8uHp").getMapUrl(latitude, longitude, tagList, 14);
    console.log("Successfully changed discovery map to one fitting the current location!");
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});