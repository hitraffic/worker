var cheerio = require('cheerio');
var moment = require('moment');

const DATETIME_FORMAT = 'MM/DD/YYYY hh:mm::ss A';

function HpdParser(body) {
  this.$ = cheerio.load(body);

  return this;
}

HpdParser.prototype.processRow = function ($row) {
  let parser = this;

  // Helper function to get the text out.
  function getText(index) {
    let $children = $row.children();
    return parser.$($children.get(index)).text();
  }

  // Parse out the contents.
  let incidentDate = getText(0);
  let incidentTime = getText(1);
  let date = moment(`${incidentDate} ${incidentTime}`, DATETIME_FORMAT).toDate();

  return {
    date,
    type: getText(2),
    address: getText(3),
    location: getText(4),
    area: getText(5)
  };
}

HpdParser.prototype.processData = function() {
  let data = [];

  this.$('table tr').each((index, element) => {
    // Skip header rows.
    if (index > 2) {
      data.push(this.processRow(this.$(element)));
    }
  });

  return data;
};

module.exports = HpdParser;
