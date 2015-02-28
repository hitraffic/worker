var procAddr = require('./processAddress.js');
// var addr = require('./data/prob_moanalua.dat');
// var addr = require('./data/prob_kam.dat');
// var addr = require('./data/prob_ampersand.dat');
// var addr = require('./data/prob_slash.dat');
var addr = require('./data/problem_addresses.dat');

// console.log(addr instanceof Array);

addr.forEach(function(a) {
  procAddr(a.key);
});
