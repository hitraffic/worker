var request = require('request');
// getIncidentData.js simply return the object.
request('https://data.honolulu.gov/resource/ix32-iw26.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
});

// retrieves JSON data from Traffic API
// Use request method from "Postit"?
// get request for https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD
// returns JSON data for processIncidents.js

