if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let worker = require('./app/worker');

if (require.main === module) {
  worker.scrapeData().then((incidents) => {
    console.log(`Geocoded ${incidents.length} incidents`);
    process.exit();
  });
}
