if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let worker = require('./app/worker');

module.exports = worker;

function main() {
  if (process.argv.length > 2 && process.argv[2] === 'ungeocoded') {
    worker.getUnprocessedData().then((incidents) => {
      console.log('Address,Location');
      incidents.forEach((incident) => console.log(`${incident.address},${incident.location}`));
      process.exit();
    });
  }

  else {
    worker.scrapeData().then((incidents) => {
      console.log(`Geocoded ${incidents.length} incidents`);
      process.exit();
    });
  }
}

if (require.main === module) {
  main();
}
