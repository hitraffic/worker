// getRayIncidents.js - reads data from raw_incidents database
// var request = require('request');
// var bodyParser = require('body-parser');
var raw_incidents = require('./getIncidentData');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];

// console.log(environment);

var Sequelize = require('sequelize'),
  sequelize = new Sequelize(config.database, config.username, config.password, config);

raw_incidents
  .findAll().then(function (record) {
    console.log(record);
  });

//     sequelize
//       .sync({ force: false }).complete(function (err) {
//         if (err) {
//           console.log('An error occurred while creating the table:', err);
//         } else {
//           console.log('entered bulkCreate()...');
//           return raw_incident.bulkCreate(fixedData).then(function () {
//             console.log("completed bulkCreate()");
//             return;
//           })
//             .complete(function (err, user) {  // user ?
//               if (err) {
//                 console.log('The instance has not been saved:', err);
//               } else {
//                 console.log('We have a persisted instance now');
//               }
//             });
//         }
//       });
//     console.log('It worked!');
//   }
// });



