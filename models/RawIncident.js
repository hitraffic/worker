
module.exports = function(sequelize, Sequelize) {
  var RawIncident = sequelize.define('raw_incident', {
    item: Sequelize.INTEGER,
    date: Sequelize.DATE,
    code: Sequelize.STRING,
    type: Sequelize.STRING,
    address: Sequelize.STRING,
    location: Sequelize.STRING,
    area: Sequelize.STRING
  });
  return RawIncident;
};
