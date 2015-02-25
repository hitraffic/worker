// getIncidentData.js simply returns the object.
// retrieves raw data from Traffic API
// converts to JSON data and stores in the hitraffic database
var request = require('request');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
var bodyParser = require('body-parser');
console.log(environment);
var Sequelize = require('sequelize'),
  sequelize = new Sequelize(config.database, config.username, config.password, config);

var RawIncident = sequelize.define('raw_incident', {
  item: Sequelize.INTEGER,
  date: Sequelize.DATE,
  code: Sequelize.STRING,
  type: Sequelize.STRING,
  address: Sequelize.STRING,
  location: Sequelize.STRING,
  area: Sequelize.STRING
});

request('https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD', function (error, response, body) {
  if (!error && response.statusCode === 200) {
    var jsonData = JSON.parse(body).data;
    var map = Array.prototype.map;
    var fixedData = jsonData.map(function (record) {
      return {
        "item": record[0],
        "date": record[8],
        "code": record[9],
        "type": record[10],
        "address": record[11],
        "location": record[12],
        "area": record[13]
      };
    });

    //console.log(fixedData);
    sequelize
      .sync({ force: true }).complete(function (err) {
        if (!err) {
          console.log('An error occurred while creating the table:', err);
        } else {
          console.log('It worked!');
          return RawIncident.bulkCreate(fixedData).then(function () {
            console.log("Aloha");
            return;
          });
        }
      });
  }
});

sequelize
  .authenticate()
  .complete(function (err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err);
    } else {
      console.log('Connection has been established successfully.');
    }
  });
