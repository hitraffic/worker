// getGeoCodes.js
// provides valid address to Geo Code API to retrieve geo coordinates (lat=latitude, lng=longitude)

// receives valid address from processAddress.js via processIncidents.js
// sends request for geo code to GeoCode API
// receives valid geo code (lat, lng) from GeoCode API
// returns valid geo code (lat, lng) and data object to processIncidents.js for storeIncidents.js