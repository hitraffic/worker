// processIncidents.js
// processes each incident in incidents JSON object
// ================================================
var request = require('request');

// calls:
//  getIncidentData.js
//  processAddress.js
//  getGeoCode.js
//  storeIncident.js

// ================================================

// (A) getIncidentData.js to get JSON data from Traffic API

// (J) process for each incident (this file)

  // var epochDateTime = ... // pull time from JSON API date
  var localTime = convertEpochToLocalTime(1234567890);
  console.log(localTime);

  // validate address with processAddress.js:
    // blank location
    // remove X?
    // add space before and after "&"

  var addr = "Antarctica";

  // var geo_coord = getGeoCode(addr);
  // console.log(geo_coord);

  // console.log("Lat = " + geo_coord.lat);
  // console.log("Lng = " + geo_coord.lng);
  
  // get geo coordinates from GeoCode API
  request('http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluu8216zl1%2Cax%3Do5-94250w&location='+addr, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body); // Show the HTML for the Google homepage.
      var jsonData = JSON.parse(body);
      console.log(jsonData.results[0].locations[0].latLng.lng);
      console.log(jsonData.results[0].locations[0].latLng.lat);
    }
  });

  // (A) store incident to db storeIncident.js


// Helper Functions
// ================

function convertEpochToLocalTime(utcSeconds) {
  // convert UTC/EPOCH to local date/time
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  // d holds the date in your local timezone
  // Todo: remove GMT-1000 (HST)
  return d;
}

// no work!
// function getGeoCode(addr) {
//   // var geo_data;
//   // var jsonData;
//   request('http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluu8216zl1%2Cax%3Do5-94250w&location='+addr, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       // console.log(body); // Show the HTML for the Google homepage.
//       jsonData = JSON.parse(body);
//       // console.log(jsonData.results[0].locations[0].latLng.lng);
//       // console.log(jsonData.results[0].locations[0].latLng.lat);
//       geo_data = {
//         "lng": jsonData.results[0].locations[0].latLng.lng, 
//         "lat": jsonData.results[0].locations[0].latLng.lat
//       };
//     }
//   });
//   console.log(geo_data);
//   return geo_data;
// }