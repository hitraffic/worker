// processAddress.js
// receives single JSON obj from processIncidents.js
// prepares valid address
// returns valid address to processAddress.js for getGeoCode.js

var badAddress = "test&test";
// var badAddress = "test/test";
// var badAddress = "MOANALUA";
// var badAddress = "KAM";
console.log(badAddress);
var validAddress;

// reminder: bad addresses can have more than one problem
// total: 4149

// contains "KAM" - replace with "KAMEHAMEHA" 1053
if(badAddress.match(/\bKAM\b/)) {
  validAddress = badAddress.replace(/\bKAM\b/, "KAMEHAMEHA");
  // console.log(validAddress);
}

// contains "/" 948
if(badAddress.match(/\//)) {
  validAddress = badAddress.replace(/\//, " / ");
  // console.log(validAddress);
}

// contains "&" 413
if(badAddress.match(/\&/)) {
  validAddress = badAddress.replace(/\&/, " & ");
  // console.log(validAddress);
}

// contains "MOANALUA" - replace with "HI-78" 84
if(badAddress.match(/\bMOANALUA\b/)) {
  validAddress = badAddress.replace(/MOANALUA/, "HI-78");
  // console.log(validAddress);
}

// other: 1651
// if(badAddress.match()) {

  // console.log(validAddress);
// }

console.log(validAddress); 

// return validAddress;