// processIncidents.js
// processes each incident in incidents JSON object

// calls:
//  processAddress.js
//  getGeoCode.js
//  storeIncident.js

// ================================================
var bodyParser = require('body-parser');
var request = require('request');

// getIncidentData.js to get JSON data from Traffic API

// process for each incident (this file)

  //    convert UTC/EPOC to local date/time
  var utcSeconds = 1234567890;
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  // d holds the date in your local timezone
  console.log("Local Date/Time is: " + d);

  //    validate address with processAddress.js
    // blank location
    // remove X?
  var addr = "Sydney,Australia";

  //    get geo code from GeoCode API with getGeoCode.js
  // { "results":[
  //    { "locations":[
  //      { "latLng":
  //        { "lng":-76.305669,
  //          "lat":40.03813},

  var request = require('request');
  request('http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluu8216zl1%2Cax%3Do5-94250w&location='+addr, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body); // Show the HTML for the Google homepage.
      var jsonData = JSON.parse(body);
      console.log(jsonData.results[0].locations[0].latLng.lng);
      console.log(jsonData.results[0].locations[0].latLng.lat);
      // console.log(body.results);
    }
  });

  //    store incident to db storeIncident.js