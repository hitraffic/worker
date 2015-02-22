var env = process.env.NODE_ENV || "development" //if process doesn't exist we go to development
var config = require ('./config')[env];


var Sequelize = require('sequelize')
  , sequelize = new Sequelize(config.database, config.username, config.password, 
      config
    )

  var RawIncident = sequelize.define('raw_incident', {
    item: Sequelize.INTEGER,
    date: Sequelize.DATE,
    code: Sequelize.INTEGER,
    type: Sequelize.STRING,
    address: Sequelize.STRING,
    location: Sequelize.STRING,
    area: Sequelize.STRING
  });

  sequelize
  .sync({ force: true })
  .complete(function(err) {
     if (!!err) {
       console.log('An error occurred while creating the table:', err)
     } else {
       console.log('It worked!')
         RawIncident
    .create({
    item: 1,
    date: 1346281822,
    code: 633, 
    type: "STALLED/HAZARDOUS VEHICLE",
    address: "600X PALI HWY",
    location: "PALI TUNNELS D4 S",
    area: "KANEOHE"
    })
    .complete(function(err, incident){
      if(!!err){
        console.log('The instance has not been saved:', err);
      } else {
        console.log('Persisted data has been saved');
      }

    });
     }
  })

  // RawIncident
  //   .create({
  //   item: 1,
  //   date: 1346281822,
  //   code: 633, 
  //   type: "STALLED/HAZARDOUS VEHICLE",
  //   address: "600X PALI HWY",
  //   location: "PALI TUNNELS D4 S",
  //   area: "KANEOHE"
  //   })
  //   .complete(function(err, incident){
  //     if(!!err){
  //       console.log('The instance has not been saved:', err);
  //     } else {
  //       console.log('Persisted data has been saved');
  //     }

  //   });