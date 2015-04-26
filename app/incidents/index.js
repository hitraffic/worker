var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incidentSchema = new Schema({
  date: {type: Date, index: true},
  type: {type: String, index: true},
  address: String,
  location: String,
  area: {type: String, index: true},
  geometry: {
    latitude: Number,
    longitude: Number
  },
  // Don't want to tie this to a specific schema yet.
  geocode_response: Schema.Types.Mixed
});

incidentSchema.statics.newestIncident = function() {
  return new Promise((resolve, reject) => {
    this.findOne().sort('-date').exec((err, incident) => {
      err ? reject(new Error(err)) : resolve(incident);
    });
  });
};

module.exports = mongoose.model('Incident', incidentSchema);
