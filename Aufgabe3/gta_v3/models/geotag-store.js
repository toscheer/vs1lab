// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...

    #tagList = [];

    constructor() {
        this.#tagList = GeoTagExamples.tagList.map(entry => new GeoTag(entry[0], entry[1], entry[2], entry[3]));
    }

    addGeoTag(tag) {
        this.#tagList.push(tag);
    }

    removeGeoTag(name) {
        this.#tagList = this.#tagList.filter(tag => tag.name !== name);
    }

    #toRad(deg) {
        return deg * (Math.PI/180);
    }

    #distanceInKm(lat1, lon1, lat2, lon2) {
        // Using the Haversine Formula
        var R = 6371; // earth's radius in km
        var dLat = this.#toRad(lat2-lat1);  
        var dLon = this.#toRad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.#toRad(lat1)) * Math.cos(this.#toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // distance in km
        return d;
    }

    getNearbyGeoTags(location) {
        // filter for all tags within a radius of 5km
        return this.#tagList.filter(tag => this.#distanceInKm(location.latitude, location.longitude, tag.latitude, tag.longitude) <= 5);
    }

    searchNearbyGeoTags(location, keyword) {
        return this.getNearbyGeoTags(location).filter(tag => 
            (tag.name.toLowerCase().includes(keyword.toLowerCase()) || tag.hashtag.toLowerCase().includes(keyword.toLowerCase()))
        );
    }

}

module.exports = InMemoryGeoTagStore
