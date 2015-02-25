var env = process.env.NODE_ENV || "development";
var config = require('./config')[env];

console.log(config);
var Sequelize = require('sequelize'), sequelize = new Sequelize(config.database, config.username, config.password, config);

var api_incident = sequelize.define('api_incident', {
  item: Sequelize.INTEGER,
  date: Sequelize.DATE,
  code: Sequelize.STRING,
  type: Sequelize.STRING,
  address: Sequelize.STRING,
  location: Sequelize.STRING,
  area: Sequelize.STRING,
  lat: Sequelize.FLOAT,
  lng: Sequelize.FLOAT
});

var mock_data = [{
  index: 0,
  date: 1346421972,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "ALA MOANA & CORAL ST",
  location: null,
  area: "KAKAAKO",
  lat: 21.297355,
  lng: -157.861581
}, {
  index: 1,
  date: 1346421580,
  code: "632",
  type: "HAZARDOUS DRIVER",
  address: "N KAINALU DR & UILAMA ST",
  location: null,
  area: "KAILUA",
  lat: 21.412146,
  lng: -157.746353
}, {
  index: 2,
  date: 1346423449,
  code: "633",
  type: "STALLED/HAZARDOUS VEHICLE",
  address: "KALANI/KEAHOLE",
  location: null,
  area: null,
  lat: null,
  lng: null
}, {
  index: 3,
  date: 1346423201,
  code: "630",
  type: "TRAFFIC NUISANCE OR PARKING VIOLATION",
  address: "KAMEHAMEHA HWY & KULEANA RD",
  location: null,
  area: "PEARL CITY",
  lat: 21.389531,
  lng: -157.959728
}, {
  index: 4,
  date: 1346424769,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "99058X KAM HWY",
  location: "MAKALAPA GATE PH",
  area: "PEARL HBR",
  lat: 21.413385,
  lng: -157.800201
}, {
  index: 5,
  date: 1346424595,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "AUMOKU ST & KANEOHE BAY DR",
  location: null,
  area: "KANEOHE",
  lat: 21.403316,
  lng: -157.797841
}, {
  index: 6,
  date: 1346424434,
  code: "633",
  type: "STALLED/HAZARDOUS VEHICLE",
  address: "14X H1W FWY",
  location: "H1W RADFORD PED OP",
  area: "AIEA",
  lat: null,
  lng: null
}, {
  index: 7,
  date: 1346424353,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "KAHEKILI HWY & KAHUHIPA ST",
  location: null,
  area: "KANEOHE",
  lat: 21.41319,
  lng: -157.810308
}, {
  index: 8,
  date: 1346424234,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "45072X KEAAHALA RD",
  location: "WINDWARD COMM COLLEG",
  area: "KANEOHE",
  lat: 21.411072,
  lng: -157.807561
}, {
  index: 9,
  date: 1346425662,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "87111X PAAKEA RD",
  location: "MIKILUA GROCERY",
  area: "MAILI",
  lat: 21.424496,
  lng: -158.166762
}, {
  index: 10,
  date: 1346425565,
  code: "632",
  type: "HAZARDOUS DRIVER",
  address: "NUUANU AVE & PALI HWY",
  location: null,
  area: "NUUANU",
  lat: null,
  lng: null
}, {
  index: 11,
  date: 1346425384,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "KALAKAUA AVE & KANUNU ST",
  location: null,
  area: "HONOLULU",
  lat: 21.294117,
  lng: -157.836915
}, {
  index: 12,
  date: 1346425307,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "72X 8TH AVE",
  location: null,
  area: "KAIMUKI",
  lat: null,
  lng: null
}, {
  index: 13,
  date: 1346425227,
  code: "630",
  type: "TRAFFIC NUISANCE OR PARKING VIOLATION",
  address: "PALI HWY & WAOKANAKA ST",
  location: null,
  area: "NUUANU",
  lat: 21.342531,
  lng: -157.832538
}, {
  index: 14,
  date: 1346425194,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "174X KEALIA DR",
  location: null,
  area: "KALIHI",
  lat: 21.335616,
  lng: -157.859059
}, {
  index: 15,
  date: 1346425823,
  code: "633",
  type: "STALLED/HAZARDOUS VEHICLE",
  address: "20X H1E FWY",
  location: "H1E LIKELIKE OFF",
  area: "KALIHI",
  lat: null,
  lng: null
}, {
  index: 16,
  date: 1346426866,
  code: "560",
  type: "TRAFFIC INCIDENT - NO COLLISION",
  address: "421X BOUGAINVILLE AVE",
  location: null,
  area: "KALAELOA",
  lat: 21.326741,
  lng: -158.056985
}, {
  index: 17,
  date: 1346429134,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "330X AOLELE ST",
  location: null,
  area: "AIRPORT",
  lat: 21.332778,
  lng: -157.910043
}, {
  index: 18,
  date: 1346429122,
  code: "632",
  type: "HAZARDOUS DRIVER",
  address: "13X H1W FWY",
  location: "H1W KAIMAKANI OP",
  area: "AIEA",
  lat: null,
  lng: null
}, {
  index: 19,
  date: 1346428664,
  code: "550",
  type: "MOTOR VEHICLE COLLISION",
  address: "99X KALAPAKI ST",
  location: null,
  area: "HAWAII KAI",
  lat: 21.302793,
  lng: -157.683965
}];

mock_data.forEach(function(record) {
  var epochDateTime = record.date;
  var localTime = convertEpochToLocalTime(epochDateTime);
  console.log(localTime); 
  record.date = localTime;
});

// convert UTC/EPOCH to local date/time
function convertEpochToLocalTime(utcSeconds) {
  var d = new Date(0); // 0 is the key which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  return d;  // d holds the date in your local timezone
}

sequelize
  // force drops all tables everytime we run
  .sync({ force: true }).complete(function (err) {
     if(!!err) {
       console.log('An error occurred while creating the table:', err);
     } else {
      api_incident.bulkCreate(mock_data)
        .success(function() {
          console.log("Yaay!");
        })
      .complete(function(err, user) {
        if (!!err) {
          console.log('The instance has not been saved:', err);
        } else {
          console.log('We have a persisted instance now');
        }
      });
     console.log('It worked!');
   }
});