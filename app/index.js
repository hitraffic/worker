if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let worker = require('./worker');

module.exports = main;

function main() {
  if (process.argv.length > 2 && process.argv[2] === 'ungeocoded') {
    worker.getUnprocessedData().then((incidents) => {
      console.log('Address,Location');
      incidents.forEach((incident) => console.log(`${incident.address},${incident.location}`));
      process.exit();
    });
  }

  else if (process.argv.length > 2 && process.argv[2] === 'run') {
    setInterval(() => {
      worker.scrapeData().then(incidents => {
        console.log(`[${new Date()}] Geocoded ${incidents.length} incidents`);
      });
    }, 60000);
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
