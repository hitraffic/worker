var request = require('request');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
var procAddr = require('./processAddress.js');
// var addr = require('./data/problem_addresses.dat');
var addr = require('./data/prob_moanalua.dat');
// var addr = require('./data/prob_kam.dat');
// var addr = require('./data/prob_ampersand.dat');
// var addr = require('./data/prob_slash.dat');

var fixedAddr = null;

// console.log(addr);
addr.forEach(function(a) {
  fixedAddr = procAddr(a.key);
  console.log(fixedAddr);

  var latitude;
  var longitude;

  // [2c] get geo coordinates from GeoCode API
  request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+fixedAddr, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var jsonData = JSON.parse(body);

      if (jsonData && 
          jsonData.results[0] &&
          jsonData.results[0].locations[0] &&
          jsonData.results[0].locations[0].latLng &&
          jsonData.results[0].locations[0].latLng.lng && 
          jsonData.results[0].locations[0].latLng.lat) {

          longitude = jsonData.results[0].locations[0].latLng.lng;
          latitude = jsonData.results[0].locations[0].latLng.lat;

      } else {

          console.log("***** Problem address: " + fixedAddr);
          latitude = null;
          longitude = null;

      }

      console.log(fixedAddr);
      console.log("lat: " + latitude);
      console.log("lng: " + longitude);
    }
    
  });

});
