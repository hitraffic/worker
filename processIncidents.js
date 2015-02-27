// processIncidents.js
// processes each incident in incidents JSON object
//    -converts stored epoch date to human readable local format
//    -validates/corrects stored address idiosyncracies for geo code retrieval
//    -inserts incident record (complete with converted date/time and additional lat/lng geo coordinates) to db
//    -data to be retrieved by mid and front end devs
// 
// calls:
//  getIncidentData.js - retrieves JSON data from Traffic API
//  processAddress.js - validates faulty address entry for GeoCode API
//  getGeoCode.js - uses valid to retrieve geo coordinates from GeoCode API
//  storeIncident.js - stores incident record with geo coordinates in PostgreSQL db
//
// ================================================
var request = require('request');
var incidents = require('./data/fixedData.dat');
// var raw_incidents = require('./getIncidentData');
var environment = process.env.NODE_ENV || "development";
var config = require('./config.json')[environment];

// var getIncidents = require('./getIncidentData.js');

// [1] (A) getIncidentData.js to get JSON data from Traffic API

// var incidents = getIncidents();

// one incident:
// var incidents = [
//   {
//     area: "KANEOHE",
//     location: "PALI TUNNELS D4 S",
//     address: "600X PALI HWY",             // good
//     code: "633",
//     type: "STALLED/HAZARDOUS VEHICLE",
//     date: 1346269607
//   }];

// many incidents:
// var incidents = [
//   {
//     area: "KANEOHE",
//     location: "PALI TUNNELS D4 S",
//     address: "600X PALI HWY",             // good
//     code: "633",
//     type: "STALLED/HAZARDOUS VEHICLE",
//     date: 1346269607
//   },
//   {
//     area: "HONOLULU",
//     location: "H1E AIRPORT OFF",
//     address: "16X E H1 FWY",              // fails
//     code: "632",
//     type: "HAZARDOUS DRIVER",
//     date: 1346269492
//   },
//   {
//     area: "HONOLULU",
//     address: "KILAUEA AVE & WAIALAE AVE", // good, spaces should surround "&"
//     code: "633",
//     type: "STALLED/HAZARDOUS VEHICLE",
//     date: 1346269077
//   },
//   {
//     area: "HONOLULU",
//     address: "HOAWA LN & S KING ST",      // good, spaces should surround "&"
//     code: "550",
//     type: "MOTOR VEHICLE COLLISION",
//     date: 1346268587
//   },
//   {
//     area: "HONOLULU",
//     address: "MAKALOA ST & SHERIDAN ST",  // good, spaces should surround "&"
//     code: "550",
//     type: "MOTOR VEHICLE COLLISION",
//     date: 1346268300
//   },
//   {
//     "area" : "HONOLULU",
//     "location" : "H1E 6TH OFF",
//     "address" : "25X E H1 FWY",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346363210
//   },
//   {
//     "area" : "HONOLULU",
//     "location" : "VARSITY HOUSE",
//     "address" : "250X COYNE ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346363209
//   },
//   {
//     "area" : "HONOLULU",
//     "location" : "H1E 6TH OFF",
//     "address" : "25X E H1 FWY",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346363179
//   },
//   {
//     "area" : "HONOLULU",
//     "location" : "LITTLE GEORGES",
//     "address" : "68X ALA MOANA",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346362923
//   }, 
//   {
//     "area" : "SCHOFIELD",
//     "address" : "KOLEKOLE RD&TRIMBLE RD",
//     "code" : "630",
//     "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//     "date" : 1346362872
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "KEEAUMOKU ST&S KING ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346364240
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "H1W KAPIOLANI OFF",
//     "address" : "25X W H1 FWY",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346364129
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "CLUB 100",
//     "address" : "52X KAMOKU ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346364084
//   },
//   {
//     "area" : "AIEA",
//     "location" : "HARANO TUNNEL H3E",
//     "address" : "57X E H3 FWY",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346363963
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "BOODA TOWING",
//     "address" : "246X S KING ST",
//     "code" : "560",
//     "type" : "TRAFFIC INCIDENT - NO COLLISION",
//     "date" : 1346363803
//   },
//    {
//     "area" : "KANEOHE",
//     "location" : "CASTLE HS",
//     "address" : "45038X KANEOHE BAY DR",
//     "code" : "632",
//     "type" : "HAZARDOUS DRIVER",
//     "date" : 1346363740
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "MFW STADIUM OFF",
//     "address" : "18X W MOANALUA FWY",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346365308
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "BEST WESTERN PLAZA HOTEL",
//     "address" : "325X N NIMITZ HWY",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346365251
//   }, 
//   {
//     "area" : "AIEA",
//     "location" : "H3E HALAWA VLY UP",
//     "address" : "H3E HALAWA VLY UP",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346365198
//   }, 
//   {
//     "area" : "KANEOHE",
//     "location" : "H3E E HARANO TUNNEL",
//     "address" : "H3E E HARANO TUNNEL",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346364900

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "144X LUSITANA ST",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346364786

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "N NIMITZ HWY&WAIAKAMILO RD",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346365759

//   }, 
//   {
//   "area" : "KAPOLEI",
//   "location" : "KAPOLEI THEATRES",
//   "address" : "89X KAMOKILA BLVD",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346366909

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "MFW RED HILL OFF",
//   "address" : "30X W MOANALUA FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346366625

//   }, 
//   {
//   "area" : "KANEOHE",
//   "location" : "H3W E HARANO TUNNEL",
//   "address" : "H3W E HARANO TUNNEL",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346366458

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "LAGOON DR&N NIMITZ HWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346366401

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "230X BINGHAM ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346366363

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "HAUSTEN ST&S KING ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346366254

//   }, 
//   {
//   "area" : "PEARL CITY",
//   "location" : "PEARL CITY NURSING HOME",
//   "address" : "91X LEHUA AVE",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346366079

//   }, 
//   {
//   "area" : "AIEA",
//   "location" : "H1E KAONOHI OP",
//   "address" : "12X E H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346366017

//   }, 
//   {
//   "area" : "KANEOHE",
//   "address" : "HAIKU RD&KAM HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346367709

//   }, 
//   {
//   "area" : "AIEA",
//   "location" : "HARANO TUNNEL H3W",
//   "address" : "57X W H3 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346367638

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "SEARS AMSC",
//   "address" : "145X ALA MOANA",
//   "code" : "560",
//   "type" : "TRAFFIC INCIDENT - NO COLLISION",
//   "date" : 1346367346

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1W WARD OP",
//   "address" : "22X W H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346367311

//   }, 
//   {
//   "area" : "WAIMANALO",
//   "address" : "MAHAILUA ST&WAIKUPANAHA ST",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346368601

//   }, 
//   {
//   "area" : "WAIPAHU",
//   "location" : "WAIPAHU HS",
//   "address" : "94121X FARRINGTON HWY",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346368220

//   }, 
//   {
//   "address" : "MFW ARIZONA OFF",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346368209

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "CENTRAL UNION PRESCH",
//   "address" : "166X S BERETANIA ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346368200

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "KAM HWY&N NIMITZ HWY",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346370400

//   }, 
//   {
//   "area" : "KAHUKU",
//   "address" : "KAM HWY&MARCONI RD",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346370212

//   }, 
//   {
//   "area" : "WAHIAWA",
//   "address" : "123X KAALA AVE",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346370026

//   }, 
//   {
//   "area" : "WAIPAHU",
//   "location" : "SERVCO LEEWARD",
//   "address" : "94072X FARRINGTON HWY",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346369968

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "HARBOR VIEW PLZ",
//   "address" : "167X ALA MOANA",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346371738

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "SCENIC TOWERS",
//   "address" : "79X ISENBERG ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346371598

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "21ST AVE&WAIALAE AVE",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346371434

//   }, 
//   {
//   "area" : "KAPOLEI",
//   "address" : "FARRINGTON HWY&KUALAKAI PKWY",
//   "code" : "560",
//   "type" : "TRAFFIC INCIDENT - NO COLLISION",
//   "date" : 1346371320

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1W KAM OP PH",
//   "address" : "15X W H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346371296

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "MCKINLEY HS",
//   "address" : "103X S KING ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346372615

//   }, 
//   {
//   "area" : "WAHIAWA",
//   "location" : "HAWAIIAN EYE",
//   "address" : "61X KILANI AVE",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346372033

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "SHRINERS HOSPITAL",
//   "address" : "131X PUNAHOU ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346372024

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "ALA MOANA&HOBRON LN",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346372015

//   }, 
//   {
//   "area" : "HICKAM",
//   "address" : "N NIMITZ HWY&VALKENBURGH ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346371902

//   }, 
//   {
//   "area" : "AIEA",
//   "address" : "KAM HWY&SALT LAKE BLVD",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346373491

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1W ARIZONA OFF",
//   "address" : "15X W H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346373451

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1W AIRPORT OFF",
//   "address" : "16X W H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346373406

//   }, 
//   {
//   "area" : "PEARL CITY",
//   "location" : "H1W WAIMALU OFF",
//   "address" : "11X W H1 FWY",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346373219

//   }, 
//   {
//   "area" : "WAIANAE",
//   "address" : "FARRINGTON HWY&HOOKELE ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346373209

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "MAUNAKEA TOWER",
//   "address" : "124X MAUNAKEA ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346373019

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "MIDDLE ST&ROSE ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346374330

//   }, 
//   {
//   "area" : "KANEOHE",
//   "address" : "49004X KAM HWY",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346374047

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "SAFEWAY PALI",
//   "address" : "136X PALI HWY",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346375060

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "UNOCAL KALIHI",
//   "address" : "134X N SCHOOL ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346374815

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "HOUGHTAILING ST&N SCHOOL ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346374772

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "DAMIEN HS",
//   "address" : "140X HOUGHTAILING ST",
//   "code" : "550V",
//   "type" : "MOTOR VEHICLE COLLISION - TOWED",
//   "date" : 1346374739

//   }, 
//   {
//   "area" : "AIEA",
//   "location" : "H1E HALAWA HTS OFF",
//   "address" : "13X E H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346376005

//   }, 
//   {
//   "area" : "WAHIAWA",
//   "location" : "BRIDGE KARSTEN THOT",
//   "address" : "71040X KAM HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346375807

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "HALE NANI HEALTH CTR",
//   "address" : "167X PENSACOLA ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346376454

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "HALE NANI HEALTH CTR",
//   "address" : "167X PENSACOLA ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346376404

//   }, 
//   {
//   "area" : "HALEIWA",
//   "address" : "61011X IKUWAI PL",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346377765

//   }, 
//   {
//   "area" : "WAIANAE",
//   "address" : "87008X KULAAUPUNI ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346377674

//   }, 
//   {
//   "area" : "PEARL CITY",
//   "address" : "KAM HWY&WAIMANO HOME RD",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346377408

//   }, 
//   {
//   "area" : "WAIPAHU",
//   "location" : "SHELL WAIPAHU",
//   "address" : "94038X PUPUPANI ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346378257

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "HULI ST&N KUAKINI ST",
//   "code" : "560",
//   "type" : "TRAFFIC INCIDENT - NO COLLISION",
//   "date" : 1346378133

//   }, 
//   {
//   "area" : "WAIANAE",
//   "address" : "87102X HAKIMO RD",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346379411

//   }, 
//   {
//   "area" : "WAHIAWA",
//   "location" : "WHITMORE COMM PK",
//   "address" : "125X WHITMORE AVE",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346380739

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "PALI TUNNELS D5 N",
//   "address" : "519X PALI HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346380533

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "RADFORD HS",
//   "address" : "436X SALT LAKE BLVD",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346380420

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1W SCHOOL OFF",
//   "address" : "21X W H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346380232

//   }, 
//   {
//   "area" : "KANEOHE",
//   "address" : "47018X IUIU ST",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346380057

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "KUHIO AVE&NOHONANI ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346379943

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "HAPPY VALLEY PIZZA",
//   "address" : "KANAINA AVE&MONSARRAT AVE",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346381577

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "MFE MIDDLE OP",
//   "address" : "MIDDLE ST/E MOANALUA FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346382535

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "MFE MIDDLE OP",
//   "address" : "MIDDLE ST/E MOANALUA FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346382328

//   }, 
//   {
//   "area" : "AIEA",
//   "location" : "MONTEREY BAY CANNERS",
//   "address" : "98017X KAONOHI ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346382307

//   }, 
//   {
//   "area" : "KANEOHE",
//   "location" : "HAIRPIN TURN PALI",
//   "address" : "634X PALI HWY",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346382056

//   }, 
//   {
//   "area" : "KAILUA",
//   "location" : "MACYS KAILUA",
//   "address" : "57X KAILUA RD",
//   "code" : "560",
//   "type" : "TRAFFIC INCIDENT - NO COLLISION",
//   "date" : 1346383207

//   }, 
//   {
//   "area" : "HALEIWA",
//   "location" : "CHUNS REEF",
//   "address" : "61052X KAM HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346383031

//   }, 
//   {
//   "area" : "KAILUA",
//   "location" : "WOMENS CORR FACILITY",
//   "address" : "42047X KALANIANAOLE HWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346382804

//   }, 
//   {
//   "area" : "KANEOHE",
//   "address" : "ANOI RD&LIKELIKE HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346383996

//   }, 
//   {
//   "area" : "WAIANAE",
//   "address" : "86049X PAHEEHEE RD",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346385415

//   }, 
//   {
//   "area" : "KANEOHE",
//   "address" : "KAM HWY&PALI HWY",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346385333

//   }, 
//   {
//   "area" : "KAHUKU",
//   "location" : "KUILIMA TURTLE BAY",
//   "address" : "57010X KUILIMA DR",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346385301

//   }, 
//   {
//   "area" : "WAIPAHU",
//   "address" : "KA UKA BLVD&KAM HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346386719

//   }, 
//   {
//   "area" : "KAAAWA",
//   "location" : "KAAAWA BCH PK",
//   "address" : "51039X KAM HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346386288

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1E WAIALAE OFF",
//   "address" : "26X E H1 FWY",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346386229

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1E PUNAHOU OFF",
//   "address" : "23X E H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346387887

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1E WARD ON",
//   "address" : "22X E H1 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346387241

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "MAKANANI DR&SKYLINE DR",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346387188

//   }, 
//   {
//   "area" : "WAHIAWA",
//   "address" : "JOSEPH P LEONG HWY&KAM HWY",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346409686

//   }, 
//   {
//   "area" : "KAPOLEI",
//   "address" : "KOKOLE ST&PALAILAI ST",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346406392

//   }, 
//   {
//   "area" : "EWA BEACH",
//   "address" : "FORT WEAVER RD&OLD FORT WEAVER",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346403907

//   }, 
//   {
//   "area" : "LAIE",
//   "location" : "MCDONALDS LAIE",
//   "address" : "55040X KAM HWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346398904

//   }, 
//   {
//   "area" : "WAIPAHU",
//   "location" : "PARKVIEW VILLAGE 4",
//   "address" : "94061X KAHAKEA ST",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346398486

//   }, 
//   {
//   "area" : "KAPOLEI",
//   "address" : "FORT BARRETTE RD&KAMAAHA AVE",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346397931

//   }, 
//   {
//   "area" : "HONOLULU",
//   "location" : "H1E LIKELIKE OFF",
//   "address" : "20X E H1 FWY",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346395769

//   }, 
//   {
//   "area" : "AIEA",
//   "location" : "H3E W HARANO TUNNEL",
//   "address" : "H3E W HARANO TUNNEL",
//   "code" : "632",
//   "type" : "HAZARDOUS DRIVER",
//   "date" : 1346394122

//   }, 
//   {
//   "area" : "AIEA",
//   "location" : "HARANO TUNNEL H3E",
//   "address" : "57X E H3 FWY",
//   "code" : "633",
//   "type" : "STALLED/HAZARDOUS VEHICLE",
//   "date" : 1346392381

//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "KAPIOLANI BLVD&PIIKOI ST",
//   "code" : "630",
//   "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//   "date" : 1346392137

//   }, 
//   {
//     "address" : "FARRINGTON/POWER PLANT",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346392007
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "SAFEWAY BERETANIA",
//     "address" : "123X S BERETANIA ST",
//     "code" : "560",
//     "type" : "TRAFFIC INCIDENT - NO COLLISION",
//     "date" : 1346391934
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "H1W HOUGHTAILING OFF",
//     "address" : "20X W H1 FWY",
//     "code" : "632",
//     "type" : "HAZARDOUS DRIVER",
//     "date" : 1346390972
//   }, 
//   {
//     "area" : "WAHIAWA",
//     "address" : "30X OHAI PL",
//     "code" : "630",
//     "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//     "date" : 1346390962
//   }, 
//   {
//     "area" : "PEARL CITY",
//     "address" : "KAM HWY&LEHUA AVE",
//     "code" : "632",
//     "type" : "HAZARDOUS DRIVER",
//     "date" : 1346390704
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "KUAKINI HOSP",
//     "address" : "34X N KUAKINI ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346389950
//   }, 
//   {
//     "area" : "HAUULA",
//     "location" : "PUNALUU BCH PK",
//     "address" : "53030X KAM HWY",
//     "code" : "632",
//     "type" : "HAZARDOUS DRIVER",
//     "date" : 1346389712
//   }, 
//   {
//     "address" : "H1W PRI H2 SPLIT",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346417652
//   }, 
//   {
//     "address" : "H2N B4 KA UKA",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346417814
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "KAIMUKI HS",
//     "address" : "270X KAIMUKI AVE",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346419002
//   }, 
//   {
//     "area" : "PEARL CITY",
//     "location" : "H1W WAIMALU OFF",
//     "address" : "11X W H1 FWY",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346418675
//   }, 
//   {
//     "area" : "PEARL CITY",
//     "location" : "H1W WAIMALU OFF",
//     "address" : "11X W H1 FWY",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346418554
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "HOPAKA ST&PIIKOI ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346421972
//   }, 
//   {
//     "area" : "KAILUA",
//     "address" : "S KALAHEO AVE&KUULEI RD",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346421580
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "N NIMITZ HWY&VALKENBURGH ST",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346423449
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "MFE TRIPLER OFF",
//     "address" : "33X E MOANALUA FWY",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346423201
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "FCU HONOLULU POLICE",
//     "address" : "153X YOUNG ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346424769
//   }, 
//   {
//     "area" : "KAILUA",
//     "location" : "HPD KAILUA",
//     "address" : "21X KUULEI RD",
//     "code" : "560",
//     "type" : "TRAFFIC INCIDENT - NO COLLISION",
//     "date" : 1346424595
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "S KING ST&UNIVERSITY AVE",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346424434
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "340X PINAO ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346424353
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "KALAKAUA AVE&OHUA AVE",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346424234
//   }, 
//   {
//     "area" : "WAIPAHU",
//     "location" : "H2S WAIANAE OFF",
//     "address" : "X S H2 FWY",
//     "code" : "630",
//     "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//     "date" : 1346425662
//   }, 
//   {
//     "area" : "WAIANAE",
//     "address" : "89060X POHAKUNUI AVE",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346425565
//   }, 
//   {
//   "area" : "HONOLULU",
//   "address" : "ELELUPE RD&KALANIANAOLE HWY",
//   "code" : "550",
//   "type" : "MOTOR VEHICLE COLLISION",
//   "date" : 1346425384
//   }, 
//   {
//     "area" : "KAILUA",
//     "address" : "ONEAWA ST&ONEAWAKAI PL",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346425307
//   }, 
//   {
//     "area" : "WAIPAHU",
//     "address" : "AWAIKI ST&AWANUI ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346425227
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "LINAPUNI ST&N SCHOOL ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346425194
//   }, 
//   {
//     "area" : "AIEA",
//     "address" : "KAONOHI ST&MOANALUA RD",
//     "code" : "630",
//     "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//     "date" : 1346425823
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "HALEMAUMAU ST&KALANIANAOLE HWY",
//     "code" : "630",
//     "type" : "TRAFFIC NUISANCE OR PARKING VIOLATION",
//     "date" : 1346426866
//   }, 
//   {
//     "area" : "HONOLULU",
//     "address" : "KAPIOLANI BLVD&KONA IKI ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346429134
//   }, 
//   {
//     "area" : "KAPOLEI",
//     "location" : "HFD KAPOLEI 40",
//     "address" : "202X LAUWILIWILI ST",
//     "code" : "550",
//     "type" : "MOTOR VEHICLE COLLISION",
//     "date" : 1346429122
//   }, 
//   {
//     "area" : "HONOLULU",
//     "location" : "LUNALILO ONTO H1W",
//     "address" : "LUNALILO ONTO H1W",
//     "code" : "633",
//     "type" : "STALLED/HAZARDOUS VEHICLE",
//     "date" : 1346428664
//   }
// ];

// [2] (J) process for each incident (this file)
incidents.forEach(function(incident) {

  // [2a] convert stored epoch time to local time
  // TODO: need to actually change incident date
  // TODO: need to remove day of week and "GMT-1000 (HST)""
  var epochDateTime = incident.date;
  var localTime = convertEpochToLocalTime(epochDateTime);
  // console.log(localTime);  // sanity check

  // [2b] validate address with processAddress.js (possible issues):
    // blank location - assign to null
    // remove X's? - probably not necessary
    // add space before and after "&" - required
  var addr = incident.address;
  // console.log(addr);

  // [2c] get geo coordinates from GeoCode API
  request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        console.log(addr);  // sanity check
        // console.log(body); // sanity check
        var jsonData = JSON.parse(body);
        // console.log(jsonData); // sanity check
        console.log("lng: " + jsonData.results[0].locations[0].latLng.lng);
        console.log("lat: " + jsonData.results[0].locations[0].latLng.lat);
      } catch(err) {
        console.log("***** Problem address: " + addr);
      }
    }
    console.log("============================");
  });

  // [2d] (A) store incident to db storeIncident.js

}); // (J) end forEach()

console.log("============================================");

  // [2c] get geo coordinates from GeoCode API
  // tester code for single problematic addresses

  // var addr = "MAKALOA ST & SHERIDAN ST";  // actual address to be extracted from JSON incident

  // cleaner, but does not work:
  // var geo_coord = getGeoCode(addr);
  // console.log(geo_coord);

  // console.log("Lat = " + geo_coord.lat);
  // console.log("Lng = " + geo_coord.lng);
  
  // not so clean, but works:
  // request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     // console.log(body); // sanity check
  //     var jsonData = JSON.parse(body);
  //     // console.log(jsonData); // sanity check
  //     console.log("lng: " + jsonData.results[0].locations[0].latLng.lng);
  //     console.log("lat: " + jsonData.results[0].locations[0].latLng.lat);
  //   }
  // });



// Helper Functions
// ================

// convert UTC/EPOCH to local date/time
// TODO: remove GMT-1000 (HST)
function convertEpochToLocalTime(utcSeconds) {
  var d = new Date(0); // 0 is the key which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  return d;  // d holds the date in your local timezone
}

// preferred, but does not work - object not accessible (undefined) in main space:
// function getGeoCode(addr) {
//   // var geo_data;
//   // var jsonData;
//   request('http://open.mapquestapi.com/geocoding/v1/address?key='+config.AppKey+'&location='+addr, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       // console.log(body); // sanity check
//       jsonData = JSON.parse(body);
//       // console.log(jsonData.results[0].locations[0].latLng.lng);
//       // console.log(jsonData.results[0].locations[0].latLng.lat);
//       geo_data = {
//         "lng": jsonData.results[0].locations[0].latLng.lng, 
//         "lat": jsonData.results[0].locations[0].latLng.lat
//       };
//     }
//   });
//   // console.log(geo_data);
//   return geo_data;
// }