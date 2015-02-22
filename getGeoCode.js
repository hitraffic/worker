// getGeoCode.js
// provides a valid address to GeoCode API and receives geodetic coordinates (lat and lng) in return.
// geodetic coordinates are stored in the database, for an associated record
var request = require('request');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
console.log(environment);

// test data: 33X E MOANALUA FWY

// var addr = "33X E MOANALUA FWY";  // exits 13-19, what is 30 and 33?
var addr = "18X W H-201,HI";
// var addr = "Antarctica";
console.log(addr);

  // [2c] get geo coordinates from GeoCode API
  request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        console.log(body); // sanity check
        var jsonData = JSON.parse(body);
        console.log(jsonData); // sanity check
        console.log("lng: " + jsonData.results[0].locations[0].latLng.lng);
        console.log("lat: " + jsonData.results[0].locations[0].latLng.lat);
      } catch(error) {
        console.log("***** Problem address: " + addr);
      }
    }
  });