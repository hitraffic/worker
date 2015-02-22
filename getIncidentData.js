var request = require('request');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
var bodyParser = require('body-parser');
var Sequelize = require('sequelize'),
    sequelize = new Sequelize(config.database, config.username, config.password, config);
var RawIncident = sequelize.define('raw_incident', {
  item: Sequelize.INTEGER,
  date: Sequelize.DATE,
  code: Sequelize.INTEGER,
  type: Sequelize.STRING,
  address: Sequelize.STRING,
  location: Sequelize.STRING,
  area: Sequelize.STRING
});

//getIncidentData.js simply return the object.
request('https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD', function (error, response, body) {
  if (!error && response.statusCode == 200) {
     var jsonData = JSON.parse(body).data;
     var map = Array.prototype.map;
     var fixedData = jsonData.map(function(record){
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
  .sync({ force: true }) .complete(function(err) {
     if (!!err) {
       console.log('An error occurred while creating the table:', err);
     } else {
       console.log('It worked!');
        return RawIncident.bulkCreate(fixedData).then(function(){
          console.log("Aloha");
          return;
        });
      }
    });
  }
}); 
// function sendRequest (){//Take in parameters: $offset and $limit
//   request('https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD', handleResult);
// }

// function handleResult(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(JSON.parse(body));
//   }
// }










  

// retrieves JSON data from Traffic API
// Use request method from "Postit"?
// get request for https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD
// returns JSON data for processIncidents.js

