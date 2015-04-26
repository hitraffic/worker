if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let scraper = require('./app/scraper');
let geocoders = require('./app/geocoders');
let Incident = require('./app/incidents');

let MapQuest = geocoders.MapQuest;
let geocoder = new MapQuest(process.env.MAPQUEST_API_KEY);

function geocodeData(data) {
  return geocoder.geocode(data.address).then((response) => {
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

    return Promise.all(incidents.map((incident) => geocodeData(incident).then(saveData)));
  });
}

function reprocessData() {
  return new Promise((resolve, reject) => {
    Incident.find({geocode_response: null}, (err, incidents) => {
      return Promise.all(incidents.map((incident) => geocodeData(incident).then(updateData)));
    });
  });
};

module.exports = {
  scrapeData,
  reprocessData
};

if (require.main === module) {
  scrapeData().then((incidents) => {
    console.log(`Geocoded ${incidents.length} incidents`);
    process.exit();
  });
}
