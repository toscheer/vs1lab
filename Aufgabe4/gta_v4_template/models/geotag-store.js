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
    #currentID = 0;

    constructor() {
        for (let i in GeoTagExamples.getAsGeoTags) {
            this.#tagList.push({id:this.#currentID++, tag:GeoTagExamples.getAsGeoTags[i]});
        }
    }

    allTags() {
        return this.#tagList.map(entry => entry.tag);
    }

    addGeoTag(newTag) {
        this.#tagList.push({id:this.#currentID++, tag:newTag});
    }

    addAndReturnGeoTag(newTag) {
        this.#tagList.push({id:this.#currentID++, tag:newTag});
        return this.#tagList[this.#tagList.length - 1];
    }

    removeGeoTag(name) {
        this.#tagList = this.#tagList.filter(entry => (entry.tag.name !== name));
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
        // we filter for all tags within a radius of 5km
        return d <= 5;
    }

    getNearbyGeoTags(location, onlyTags = false) {
        var nearbyTags = this.#tagList.filter(entry => this.#distanceInKm(location.latitude, location.longitude, entry.tag.latitude, entry.tag.longitude));
        if (onlyTags) {
            return nearbyTags.map(entry => entry.tag);
        }
        return nearbyTags;
    }

    searchNearbyGeoTags(location, keyword, onlyTags = false) {
        var nearbyTags = this.getNearbyGeoTags(location).filter(entry => 
            (entry.tag.name.toLowerCase().includes(keyword.toLowerCase()) || entry.tag.hashtag.toLowerCase().includes(keyword.toLowerCase()))
        );
        if (onlyTags) {
            return nearbyTags.map(entry => entry.tag);
        }
        return nearbyTags
    }

    getTagByID(key) {
        var index = this.#tagList.findIndex(entry => entry.id == key);
        return this.#tagList[index];
    }

    deleteTagByID(key) {
        var toDelete = this.getTagByID(key);
        var deletionIndex = this.#tagList.findIndex(entry => entry.id == key);
        this.#tagList.splice(deletionIndex, 1);
        return toDelete;
    }

    modifyTagByID(key, newContent) {
        var modificationIndex = this.#tagList.findIndex(entry => entry.id == key);
        this.#tagList[modificationIndex].tag = newContent;
        return this.#tagList[modificationIndex];
    }

}

module.exports = InMemoryGeoTagStore
