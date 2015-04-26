var request = require('request');

var processAddress = require('./utils').processAddress;

const GEOCODE_BASE_URL = 'http://open.mapquestapi.com/geocoding/v1/address';

function MapQuest(apiKey) {
  this.key = apiKey;

  return this;
}

MapQuest.prototype.geocode = function (address) {
  address = processAddress(address);
  let uri = `${GEOCODE_BASE_URL}?key=${this.key}&street=${address}&county=Oahu&state=HI`;

  return new Promise((resolve, reject) => {
    request({uri, json: true}, (err, _, response) => {
      // If there is a location, then we were successful.
      if (response.results[0].locations.length > 0) {
        resolve(response.results[0].locations[0]);
      }
      else {
        // Let's just resolve this for now. Not really an error yet.
        let error = new Error('No results returned');
        resolve(null);
      }
    });
  });
}

module.exports = MapQuest;
