// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

document.getElementById("tagButton").addEventListener("click", () => {
    var newTag = {
        name: document.getElementById("nameTag").value,
        latitude: parseFloat(document.getElementById("latitudeTag").value),
        longitude: parseFloat(document.getElementById("longitudeTag").value),
        hashtag: document.getElementById("hashtagTag").value
    }
    var fetchSpecs = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag)
    }
    fetch('/api/geotags', fetchSpecs)
        .then(response => response.json())
        .then(tagAndKey => {
            var mapview = document.getElementById("mapView");
            var tagListJSON = mapview.getAttribute("data-tags");
            var tagList = tagListJSON ? JSON.parse(tagListJSON) : [];
            tagList.push(tagAndKey.tag);
            mapview.setAttribute("data-tags", JSON.stringify(tagList));
            updateLocation();
            updateListElements(tagList);
        });
});

document.getElementById("discoveryButton").addEventListener("click", () => {
    var uri = `/api/geotags/${document.getElementById("latitudeTag").value}&${document.getElementById("longitudeTag").value}&${document.getElementById("termDiscovery").value}`;
    let fetchSpecs = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }
    fetch(uri, fetchSpecs) 
        .then(response => response.json()) 
        .then(tagsAndKeys => {
            var onlyTags = tagsAndKeys.map(x => x.tag);
            document.getElementById("mapView").setAttribute("data-tags", JSON.stringify(onlyTags));
            updateLocation();
            updateListElements(onlyTags);
        });
});

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

function updateListElements(content) {
    var liHTML = content.map(function (tag) { return `<li>${tag.name} (${tag.latitude},${tag.longitude}) ${tag.hashtag} </li>` }).join('\n');
    document.getElementById('discoveryResults').innerHTML = liHTML;
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});