// getGeoName.js
// given geo coordinates, retrieve address (city and state)

var request = require('request');
// var environment = process.env.NODE_ENV || "development";
// var config = require('./config.json')[environment];
var config = require('./config.json');
// console.log(environment);

var lat = "21.5714894";
var lng = "-158.1291613";
var city = "" || "Honolulu";
var state = "" || "HI";

request('http://open.mapquestapi.com/geocoding/v1/reverse?key='+config.development.AppKey+'&location='+lat+','+lng, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    try {
      // console.log(body); // sanity check
      var jsonData = JSON.parse(body);
      // console.log(jsonData); // sanity check
      city = jsonData.results[0].locations[0].adminArea5;
      state = jsonData.results[0].locations[0].adminArea3;
console.log(city + ", " + state);
    } catch(error) {
      console.log("***** Problem geo coordinates: ");
    }
  }
});
