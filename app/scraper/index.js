var request = require('request');
var HpdParser = require('./hpd_parser');

const SCRAPER_URL = 'http://www4.honolulu.gov/hpdtraffic/MainPrograms/frmMain.asp?sSearch=All+Incidents&sSort=I_tTimeCreate';

/*
 * Callback signature should be function(err, objects) {};
 */
function scrapeHpdSite() {
  return new Promise((resolve, reject) => {
    request({uri: SCRAPER_URL}, (err, _, body) => {
      if (err) {
        reject(err);
      }
      else {
        let parser = new HpdParser(body);
        resolve(parser.processData());
      }
    });
  });
}

module.exports = scrapeHpdSite;
