var request = require('request');
// getIncidentData.js simply return the object.
request('https://data.honolulu.gov/resource/ix32-iw26.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.parse(body)[999]);
  }
});

function sendRequest (){//Take in parameters: $offset and $limit
  request('https://data.honolulu.gov/resource/ix32-iw26.json?', handleResult);
}

function handleResult(error, response, body) {
  if (!error && response.statusCode == 200) {
    var dataEnries = JSON.parse(body); 
    console.log(JSON.parse(body)[999]);
  }
}



  )

// retrieves JSON data from Traffic API
// Use request method from "Postit"?
// get request for https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD
// returns JSON data for processIncidents.js

