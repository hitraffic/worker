module.exports = function(sequelize, Sequelize) {
  var Area = sequelize.define('Area', {
    name: {
      type: Sequelize.STRING,
      unique: true
    }
  }, {
        classMethods: {
      // Creates an association function that is run AFTER all the models are loaded into sequelize.
      associate: function (models) {
        Area.hasMany(models.Location);
      }
    }
  });
  return Area;
};