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
// var incidents = require('./data/fixedData.dat');
// var raw_incidents = require('./getIncidentData');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
var db = require('./models');
var procAddr = require('./processAddress.js');

// var getIncidents = require('./getIncidentData.js');

// [1] (A) getIncidentData.js to get JSON data from Traffic API

// var incidents = getIncidents();

// console.log(db);
// [2] (J) process for each incident (this file)
db
  .sequelize.sync({force: true})
  // .raw_incident.findAll({ order: '"id" asc', limit: 1, offset: 1000 })
  .raw_incident.findAll({ order: '"id" asc' })
  // .then(function() {
    // return raw_incident.findAll({ limit: 10} );
  // })
  .then(function(incidents) {

    incidents.forEach(function(incident) {
      // console.log(incident);

      // [2a] convert stored epoch time to local time
      // NOTE: this is being handled in getIncidentData.js
      // TODO: need to actually change incident date
      // TODO: need to remove day of week and "GMT-1000 (HST)""
      // var epochDateTime = incident.date;
      // var localTime = convertEpochToLocalTime(epochDateTime);
      // console.log(localTime);  // sanity check

      // [2b] validate address with processAddress.js (possible issues):
        // blank location - assign to null
        // remove X's? - probably not necessary
        // add space before and after "&" and "/" - required
        // "KAM" needs to be replaced with "KAMEHAMEHA"
        // "MONALUA FWY" needs to be replaced with "HI-78"

      var addr = procAddr(incident.address);
      // console.log(addr);

      // [2c] get geo coordinates from GeoCode API
      request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          var jsonData = JSON.parse(body);
          var latitude;
          var longitude;

          // console.log(addr);  // sanity check

          if (jsonData && 
              jsonData.results[0] &&
              jsonData.results[0].locations[0] &&
              jsonData.results[0].locations[0].latLng &&
              jsonData.results[0].locations[0].latLng.lng && 
              jsonData.results[0].locations[0].latLng.lat) {
            // console.log("lng: " + jsonData.results[0].locations[0].latLng.lng);
            // console.log("lat: " + jsonData.results[0].locations[0].latLng.lat);

            latitude = jsonData.results[0].locations[0].latLng.lat;
            longitude = jsonData.results[0].locations[0].latLng.lng;
          } else {
            // console.log("***** Problem address: " + addr);
            latitude = null;
            longitude = null;
          }

      // [2d] (A) store incident to db storeIncident.js

          var areaData = {
              name: incident.area
            };

          var locationData = {
              address: addr,
              lat: latitude,
              lng: longitude
              // AreaId : area
            };

          var incidentTypeData = {
              name: incident.type,
              code: incident.code
            };

          db.Area.findOrCreate({ 
            where: areaData,
            defaults: areaData
          })
          .spread(function(area) {
            return  db.Location.findOrCreate({
              where: locationData,
              defaults: locationData
            }).spread(function(location) {
              // console.log(location);
              location.setArea(area);
              return location;
            });
          })
          .then(function(location) {
            return db.IncidentType.findOrCreate({
              where: incidentTypeData,
              defaults: incidentTypeData
            })
            .spread(function(incidentType) {
              return db.Incident.create({
                item: incident.item,
                // date: localTime
                date: incident.date
              }).then(function(incident) {
                incident.setLocation(location);
                incident.setIncidentType(incidentType);
                return incident;
              });
            });
          });
        }
        console.log("============================");
      });


    }); // (J) end forEach()

console.log("============================================");

});

  

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