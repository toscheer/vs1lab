// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [], ejsLat: "", ejsLon: "", ejsMap: [] })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
  var newTag = new GeoTag(req.body["nameTag"], req.body["latitudeTag"], req.body["longitudeTag"], req.body["hashtagTag"]);
  geoTagStore.addGeoTag(newTag);
  var nearbyTags = geoTagStore.getNearbyGeoTags(newTag, true);
  res.render('index', { 
    taglist: nearbyTags, 
    ejsLat: req.body["latitudeTag"], 
    ejsLon: req.body["longitudeTag"], 
    ejsMap: JSON.stringify(nearbyTags)
  })
});

/**
* Route '/discovery' for HTTP 'POST' requests.
* (http://expressjs.com/de/4x/api.html#app.post.method)
*
* Requests cary the fields of the discovery form in the body.
* This includes coordinates and an optional search term.
* (http://expressjs.com/de/4x/api.html#req.body)
*
* As response, the ejs-template is rendered with geotag objects.
* All result objects are located in the proximity of the given coordinates.
* If a search term is given, the results are further filtered to contain 
* the term as a part of their names or hashtags. 
* To this end, "GeoTagStore" provides methods to search geotags 
* by radius and keyword.
*/

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  var currentLocation = new GeoTag(req.body["termDiscovery"], req.body["latitudeDiscovery"], req.body["longitudeDiscovery"], req.body["termDiscovery"]);
  var matchingAndNearbyTags = geoTagStore.searchNearbyGeoTags(currentLocation, req.body["termDiscovery"], true);
  res.render('index', { 
    taglist: matchingAndNearbyTags, 
    ejsLat: req.body["latitudeDiscovery"], 
    ejsLon: req.body["longitudeDiscovery"],
    ejsMap: JSON.stringify(matchingAndNearbyTags) 
  });
});

// API routes (A4)

router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencod

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:latitude&:longitude&:searchterm?', (req, res) => {
    var {latitude, longitude, searchterm} = req.params;
    var searchLocation = new GeoTag(
        "test",
        parseFloat(latitude),
        parseFloat(longitude),
        searchterm
    );
    if (!searchterm) {
      searchterm = "";
    }
    res.json(geoTagStore.searchNearbyGeoTags(searchLocation, searchterm));
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
    var {name, latitude, longitude, hashtag} = req.body;
    var newTag = new GeoTag(
        name,
        parseFloat(latitude),
        parseFloat(longitude),
        hashtag
    );
    res.json(geoTagStore.addAndReturnGeoTag(newTag));
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
    if(!geoTagStore.getTagByID(req.params.id)) {
        res.sendStatus(404);
        return;
    }
    res.json(geoTagStore.getTagByID(req.params.id));
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  if(!geoTagStore.getTagByID(req.params.id)) {
    res.sendStatus(404);
    return;
  }
  var {name, latitude, longitude, hashtag} = req.body;
  var newTag = new GeoTag(
    name,
    parseFloat(latitude),
    parseFloat(longitude),
    hashtag
  );
  res.json(geoTagStore.modifyTagByID(req.params.id, newTag));
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
    if(!geoTagStore.getTagByID(req.params.id)) {
      res.sendStatus(404);
      return;
    }
    res.json(geoTagStore.deleteTagByID(req.params.id));
});

module.exports = router;
