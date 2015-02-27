module.exports = function(sequelize, Sequelize) {
  var Incident = sequelize.define('Incident', {
    item: Sequelize.INTEGER,
    date: Sequelize.DATE,
    location: Sequelize.STRING,
  }, {
    classMethods: {
      // Creates an association function that is run AFTER all the models are loaded into sequelize.
      associate: function (models) {
        Incident.belongsTo(models.IncidentType);
      }
    }
  });
  return Incident;
};
