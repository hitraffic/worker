module.exports = function(sequelize, Sequelize) {
  var LocationType = sequelize.define('LocationType', {
    name: Sequelize.STRING
  });
  return LocationType;
};
