module.exports = function(sequelize, Sequelize) {
  var IncidentType = sequelize.define('IncidentType', {
    name: Sequelize.STRING,
    code: Sequelize.INTEGER
  });
  return IncidentType;
};
