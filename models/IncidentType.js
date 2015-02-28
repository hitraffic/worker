module.exports = function(sequelize, Sequelize) {
  var IncidentType = sequelize.define('IncidentType', {
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    code: {
      type: Sequelize.INTEGER,
      unique: true,
    }
  });
  return IncidentType;
};
