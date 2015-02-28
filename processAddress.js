// processAddress.js
// receives single problem address string from processIncidents.js
// returns valid address to processIncidents.js for getGeoCode.js

// NOTE: changes address to proper format, but address is not guaranteed 
// to be sufficient for GeoCode API

// module.exports = function(addr) {  // uncomment to activate

  // possible problems:
  // ==================
  // var address = "KAM";               // KAM s/b KAMEHAMEHA
  var address = "KAMEHAME DR";          // should not change KAMEHAME

  // var address = "TEST/TEST";         // slash with no spaces, needs spaces
  // var address = "1/10";              // num slash num, fraction do not change
  // var address = "TH/10";             // char slash num, needs spaces
  // var address = "1/E";               // num slash char, needs spaces
  // var address = "SOUTH ST/ KINKOS";  // needs space before slash
  // var address = "SB KAM /PAST";      // needs space after slash, 2 problems
  
  // var address = "TEST&TEST";         // ampersand needs spaces
  // var address = "N H2 FWY&KAM HWY";  // char & char, 2 problems
  // var address = "H2S EXIT 5&MEHEULA PKWY";  // num & char
  // var address = "N H2 FWY& KAM HWY"; // needs space before &, 2 problems
  // var address = "N H2 FWY &KAM HWY"; // needs space after &, 2 problems

  // var address = "MOANALUA FW";       // both FW and FWY exist
  // var address = "MOANALUA FWY";       // both FW and FWY exist
  // var address = "E MOANALUA FWY&PUULOA RD";  // 2 problems

  // =====================
  // end possible problems                

  // var address = addr; // uncomment to activate
  console.log(address);
  // var validAddress = address;

  // note: bad addresses can have more than one problem (total=4149+)

  // contains "KAM" - replace with "KAMEHAMEHA" (qty=1053+)
  if(address.match(/\bKAM\b/)) {
    address = address.replace(/\bKAM\b/, "KAMEHAMEHA");
    // console.log(address);
  }

  // contains "/" (qty=948+)
  if(address.match(/\//)) {
    if(address.match(/[A-Z0-9]\/[A-Z0-9]/)) {
      address = address.replace(/\//, " / ");
    } else if(address.match(/[A-Z]\/[ ]/)) {
      address = address.replace(/\//, " /");
    } else if(address.match(/[ ]\/[A-Z]/)) {
      address = address.replace(/\//, "/ ");
    }  // otherwise, do not change for fractions 1/4, 1/2, etc.
    // console.log(address);
  }

  // contains "&" (qty=413+)
  if(address.match(/\&/)) {
    if(address.match(/[A-Z0-9]\&[A-Z0-9]/)) {
      address = address.replace(/\&/, " & ");
    } else if(address.match(/[ ]\&[A-Z0-9]/)) {
      address = address.replace(/\&/, "& ");
    } else if(address.match(/[A-Z0-9]\&[ ]/)) {
      address = address.replace(/\&/, " &");
    }
    // console.log(address);
  }

  // contains "MOANALUA" - replace with "HI-78" (qty=84+)
  if(address.match(/\bMOANALUA\b/)) {
    address = address.replace(/MOANALUA FW[Y]?/, "HI-78");
    // console.log(address);
  }

  // other (qty=1651+)
  // if(address.match()) {
    // address = address.replace(//,);
    // console.log(address);
  // }

  console.log(address); 
  return address;

// };  // uncomment to activate