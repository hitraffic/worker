// processIncidents.js
// processes each incident in incidents JSON object
//    -converts stored epoch date to human readable local format
//    -validates/corrects stored address idiosyncracies for geo code retrieval
//    -inserts incident record (complete with converted date/time and additional lat/lng geo coordinates) to db
//    -data to be retrieved by mid and front end devs
// 
// calls:
//  getIncidentData.js - retrieves JSON data from Traffic API
//  processAddress.js - validates faulty address entry for GeoCode API
//  getGeoCode.js - uses valid to retrieve geo coordinates from GeoCode API
//  storeIncident.js - stores incident record with geo coordinates in PostgreSQL db
//
// ================================================
var request = require('request');
var config = require('./config.json');
// var getIncidents = require('./getIncidentData.js');

// [1] (A) getIncidentData.js to get JSON data from Traffic API

// var incidents = getIncidents();

// [2] (J) process for each incident (this file)

  // [2a] convert stored epoch time to local time
  // var epochDateTime = ... // pull time from JSON API date
  // var localTime = convertEpochToLocalTime(epochDateTime);
  var localTime = convertEpochToLocalTime(0123456789);
  console.log(localTime);  // sanity check
  // need to change incident date

  // [2b] validate address with processAddress.js (possible issues):
    // blank location - assign to null
    // remove X's? - probably not necessary
    // add space before and after "&" - required

  var addr = "Antarctica";  // actual address to be extracted from JSON incident

  // [2c] get geo coordinates from GeoCode API

  // cleaner, but does not work:
  // var geo_coord = getGeoCode(addr);
  // console.log(geo_coord);

  // console.log("Lat = " + geo_coord.lat);
  // console.log("Lng = " + geo_coord.lng);
  
  // not so clean, but works:
  request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body); // sanity check
      var jsonData = JSON.parse(body);
      // console.log(jsonData); // sanity check
      console.log("lng: " + jsonData.results[0].locations[0].latLng.lng);
      console.log("lat: " + jsonData.results[0].locations[0].latLng.lat);
    }
  });

  // [2d] (A) store incident to db storeIncident.js

// (J) end [2] processing each incident (this file)


// Helper Functions
// ================

// convert UTC/EPOCH to local date/time
// TODO: remove GMT-1000 (HST)
function convertEpochToLocalTime(utcSeconds) {
  var d = new Date(0); // 0 is the key which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  return d;  // d holds the date in your local timezone
}

// preferred, but does not work - object not accessible (undefined) in main space:
// function getGeoCode(addr) {
//   // var geo_data;
//   // var jsonData;
//   request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       // console.log(body); // sanity check
//       jsonData = JSON.parse(body);
//       // console.log(jsonData.results[0].locations[0].latLng.lng);
//       // console.log(jsonData.results[0].locations[0].latLng.lat);
//       geo_data = {
//         "lng": jsonData.results[0].locations[0].latLng.lng, 
//         "lat": jsonData.results[0].locations[0].latLng.lat
//       };
//     }
//   });
//   // console.log(geo_data);
//   return geo_data;
// }