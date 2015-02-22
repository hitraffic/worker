// getIncidentData.js simply returns the object.
// retrieves JSON data from Traffic API
// stores JSON data for in the hitraffic_stage database
var request = require('request');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
console.log(environment);
var Sequelize = require('sequelize'), 
  sequelize = new Sequelize(config.database, config.username, config.password, config);
  // logging: console.log,
  // omitNull: true

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err);
    } else {
      console.log('Connection has been established successfully.');
    }
  });



// var exports = module.exports = {

// abbreviated link (1000 items) - works

  //   request('https://data.honolulu.gov/resource/ix32-iw26.json', function (error, response, body) {
  // // body is an object with an array of arrays {[ [],[],[],... ]}
  //     if (!error && response.statusCode == 200) {
  //       var json_data = JSON.parse(body); // array of objects [ {},{},{},... ]

  //       json_data.forEach(function(item) {
  //         // save to raw db
  //         console.log(item);
  //       });

  //       console.log(JSON.parse(body)); // array of objects [ {},{},{},... ]
  //       // console.log(json_data);
  //       // json_data.forEach(function(item) {
  //       //   incidents.push(item);
  //       // });
  //       // console.log(incidents);
  //       // return incidents;
  //     }
  //   });


  // console.log(incidents);

// }; // end module.exports



// complete data 
// request('https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD', function (error, response, body) {
// request('https://data.honolulu.gov/resource/ix32-iw26.json', function (error, response, body) {
    
    // var jsonData = JSON.parse(body); 
    // // console.log(jsonData[998].area);
    // return jsonData;

// });