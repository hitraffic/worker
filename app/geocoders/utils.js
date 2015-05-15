let addresses = require('./prefetched_addresses');

const KAMEHAMEHA_REGEX = /KAM\sHWY/g;

function processAddress(address) {
  // Check if address contains "KAM"
  address = address.replace(KAMEHAMEHA_REGEX, "KAMEHAMEHA HWY");
  return address;
}

/**
 * @function prefetchAddress
 * Returns a geolocation if we have one stored for the address/location combo.
 *
 * @param address The address of the incident.
 * @param location The location of the incident.
 * @returns An object containing the latitude and longitude if we have the address stored. Null otherwise.
 */
function prefetchAddress(address, location) {
  let key = `${address},${location}`;

  if (addresses[key]) {
    let [lat, lng] = addresses[key];
    return {latLng: {lat, lng}};
  }

  return null;
}

module.exports = {processAddress, prefetchAddress};
