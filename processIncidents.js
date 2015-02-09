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
var incidents = [
  {
    area: "KANEOHE",
    location: "PALI TUNNELS D4 S",
    address: "600X PALI HWY",             // good
    code: "633",
    type: "STALLED/HAZARDOUS VEHICLE",
    date: 1346269607
  },
  // {
  //   area: "HONOLULU",
  //   location: "H1E AIRPORT OFF",
  //   address: "16X E H1 FWY",              // fails
  //   code: "632",
  //   type: "HAZARDOUS DRIVER",
  //   date: 1346269492
  // },
  {
    area: "HONOLULU",
    address: "KILAUEA AVE & WAIALAE AVE", // good, spaces should surround "&"
    code: "633",
    type: "STALLED/HAZARDOUS VEHICLE",
    date: 1346269077
  },
  {
    area: "HONOLULU",
    address: "HOAWA LN & S KING ST",      // good, spaces should surround "&"
    code: "550",
    type: "MOTOR VEHICLE COLLISION",
    date: 1346268587
  },
  {
    area: "HONOLULU",
    address: "MAKALOA ST & SHERIDAN ST",  // good, spaces should surround "&"
    code: "550",
    type: "MOTOR VEHICLE COLLISION",
    date: 1346268300
  }
];

// [2] (J) process for each incident (this file)
incidents.forEach(function(incident) {

  // [2a] convert stored epoch time to local time
  // TODO: need to actually change incident date
  // TODO: need to remove day of week and "GMT-1000 (HST)""
  var epochDateTime = incident.date;
  var localTime = convertEpochToLocalTime(epochDateTime);
  console.log(localTime);  // sanity check

  // [2b] validate address with processAddress.js (possible issues):
    // blank location - assign to null
    // remove X's? - probably not necessary
    // add space before and after "&" - required
  var addr = incident.address;
  console.log(addr);

  // [2c] get geo coordinates from GeoCode API
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

}); // (J) end forEach()

console.log("============================================");

  // var addr = "MAKALOA ST & SHERIDAN ST";  // actual address to be extracted from JSON incident

  // [2c] get geo coordinates from GeoCode API

  // cleaner, but does not work:
  // var geo_coord = getGeoCode(addr);
  // console.log(geo_coord);

  // console.log("Lat = " + geo_coord.lat);
  // console.log("Lng = " + geo_coord.lng);
  
  // not so clean, but works:
  // request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     // console.log(body); // sanity check
  //     var jsonData = JSON.parse(body);
  //     // console.log(jsonData); // sanity check
  //     console.log("lng: " + jsonData.results[0].locations[0].latLng.lng);
  //     console.log("lat: " + jsonData.results[0].locations[0].latLng.lat);
  //   }
  // });

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