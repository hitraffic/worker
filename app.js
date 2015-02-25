// app.js
var env = process.env.NODE_ENV || "development";
var config = require('./config')[env];

console.log(config);
var Sequelize = require('sequelize'), sequelize = new Sequelize(config.database, config.username, config.password, config);

var raw_incident = sequelize.define('raw_incident', {
  item: Sequelize.INTEGER,
  date: Sequelize.DATE,
  code: Sequelize.INTEGER,  // might need to be STRING
  type: Sequelize.STRING,
  address: Sequelize.STRING,
  location: Sequelize.STRING,
  area: Sequelize.STRING
});

var incident = sequelize.define('incident', {
  date: Sequelize.DATE
});

var incident_type = sequelize.define('incident_type', {
  type: Sequelize.STRING,
  code: Sequelize.INTEGER
});

var location_type  = sequelize.define('location_type', {
  type: Sequelize.STRING
});

var location = sequelize.define('location', {
  address: Sequelize.STRING,
  lat: Sequelize.FLOAT,
  lng: Sequelize.FLOAT
});

var area = sequelize.define('area', {
  name: Sequelize.STRING
});

location.hasMany(incident);
incident.belongsTo(location);

location_type.hasOne(location);
location.belongsToMany(location_type);

area.hasOne(location);
location.belongsToMany(area);

sequelize
  // force drops all tables everytime we run
  .sync({ force: true }).complete(function (err) {
    if (!err) {
      console.log('An error occurred while creating the table:', err);
    } else {
      console.log('It worked!');
      // raw_incident
      //   .create({
      //     item: 1,
      //     date: 1346281822,
      //     code: 633,
      //     type: "STALLED/HAZARDOUS VEHICLE",
      //     address: "600X PALI HWY",
      //     location: "PALI TUNNELS D4 S",
      //     area: "KANEOHE"
      //   })
      area
        .create({
          name: "KANEOHE"
        })
          .then(function (area) {
            // console.log(area);
          return [area, location_type
            .create({
              name: "HIGHWAY"
            })];
        })
          .then(function (location_data) {
          // console.log(location_data[1]);
          console.log(location_data);
          // console.log(location_data.length);
          // console.log(location_data[0].dataValues.id);
          // console.log(location_data[1].dataValues.id);
          return location
            .create({
              area: location_data[0].dataValues.id,
              type: location_data[1].dataValues.id
            });
        })
          .then(function () {
          return incident_type
              .create({
            });
        })
          .then(function () {
          return incident
              .create({
            });
        })

        .complete(function (err, incident) {
          if (!err) {
            console.log('The instance has not been saved:', err);
          } else {
            console.log('We have a persisted instance now');
          }
        });
    }
  });