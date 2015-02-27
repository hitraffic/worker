module.exports = function(sequelize, Sequelize) {
  var Area = sequelize.define('Area', {
    name: Sequelize.STRING
  });
  return Area;
};