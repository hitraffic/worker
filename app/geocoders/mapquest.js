var request = require('request');

var {processAddress, prefetchAddress} = require('./utils');

const GEOCODE_BASE_URL = 'http://open.mapquestapi.com/geocoding/v1/address';

function MapQuest(apiKey) {
  this.key = apiKey;
  return this;
}

MapQuest.prototype.geocode = function (address, location) {
  return new Promise((resolve, reject) => {
    let prefetched = prefetchAddress(address, location);
    if (prefetched) {
      resolve(prefetched);
    }

    address = processAddress(address);
    let uri = `${GEOCODE_BASE_URL}?key=${this.key}&street=${address}&county=Oahu&state=HI`;

    request({uri, json: true}, (err, _, response) => {
      // There should be a location at the county level.
      if (response.results[0].locations.length > 0) {
        let location = response.results[0].locations[0];
        (location.geocodeQuality === 'STREET') ? resolve(location) : resolve(null);
      }
      else {
        // Let's just resolve this for now. Not really an error yet.
        resolve(null);
      }
    });
  });
}

module.exports = MapQuest;
