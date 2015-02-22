var request = require('request');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];
var Sequelize = require('sequelize')
  , sequelize = new Sequelize(config.database, config.username, config.password, config);
var bodyParser = require('body-parser');
 
sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.')
    }
  })

//getIncidentData.js simply return the object.
request('https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD', function (error, response, body) {
  if (!error && response.statusCode == 200) {
     var jsonData = JSON.parse(body); 
     console.log(jsonData);
     //console.log(jsonData.data[0][12]);
     console.log(jsonData.data.length);
     var dataLength = jsonData.data.length;
     for (var i = 0; i < dataLength; i++) {
        console.log("item: "+jsonData.data[i][0]);
        console.log("date: "+jsonData.data[i][8]);
        console.log("code: "+jsonData.data[i][9]);
        console.log("type: "+jsonData.data[i][10]);
        console.log("address: "+jsonData.data[i][11]);
        console.log("location: "+jsonData.data[i][12]);
        console.log("area: "+jsonData.data[i][13]); 
        console.log("****");     
     };

    // jsonData.forEach(function(item){
    //   console.log(item[0][0]);
      // console.log(item.address);
      // console.log(item.code);
      // console.log(item.area);
      // console.log(item.type);
      // console.log(item.date);
      // console.log("****");
  //   })
   }
});

function sendRequest (){//Take in parameters: $offset and $limit
  request('https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD', handleResult);
}

function handleResult(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.parse(body));
  }
}



  

// retrieves JSON data from Traffic API
// Use request method from "Postit"?
// get request for https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD
// returns JSON data for processIncidents.js

