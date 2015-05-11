let scraper = require('../scraper');
let geocoders = require('../geocoders');
let Incident = require('../incidents');

let MapQuest = geocoders.MapQuest;
let geocoder = new MapQuest(process.env.MAPQUEST_API_KEY);

function geocodeData(data) {
  return geocoder.geocode(data.address, data.location).then((response) => {
    data.geocode_response = response;
    if (response) {
      data.geometry = {
        latitude: response.latLng.lat,
        longitude: response.latLng.lng
      };
    }

    return data;
  });
}

function saveData(data) {
  return new Promise((resolve, reject) => {
    Incident.create(data, (err, incident) => err ? reject(err) : resolve(incident));
  });
}

function updateData(incident) {
  return new Promise((resolve, reject) => {
    incident.save((err, newIncident) => err ? reject(err) : resolve(newIncident));
  });
}

function scrapeData() {
  let promises = [scraper(), Incident.newestIncident()];

  return Promise.all(promises).then(([incidents, newest]) => {
    if (newest) {
      incidents = incidents.filter((incident) => incident.date > newest.date);
    }

    console.log(`Scraped ${incidents.length} incidents`);
    return Promise.all(incidents.map((incident) => geocodeData(incident).then(saveData)));
  });
}

function reprocessData(query={}) {
  return Incident.find(query).then((incidents) => {
    return Promise.all(incidents.map((incident) => geocodeData(incident).then(updateData)));
  });
}

function getUnprocessedData() {
  return Incident.ungeocodedIncidents();
}

module.exports = {
  scrapeData,
  reprocessData,
  getUnprocessedData,
};
