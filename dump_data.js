var db = require('./models');

db.raw_incident.findAll({limit: 100}).then(function (incidents) {
// db.raw_incident.find({ where: {id: 200}}).then(function (incidents) {
  // console.log(incidents);
  incidents.forEach(function(rec) {
    console.log(rec.address);
    
  });
});