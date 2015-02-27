module.exports = function(sequelize, Sequelize) {
  var Location = sequelize.define('Location', {
    address: Sequelize.STRING,
    lat: Sequelize.FLOAT,
    lng: Sequelize.FLOAT,
  }, {
        classMethods: {
      // Creates an association function that is run AFTER all the models are loaded into sequelize.
      associate: function (models) {
        Location.belongsTo(models.Area);
      }
    }
  });
  return Location;
};
