module.exports = function(sequelize, Sequelize) {
  var Area = sequelize.define('Area', {
    name: {
      type: Sequelize.STRING,
      unique: true
    }
  });
  return Area;
};