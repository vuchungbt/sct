'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechpackProcess extends Model {
    static associate(models) {
      // define association here
    }
  }
  TechpackProcess.init({
    stockId: DataTypes.INTEGER,
    techpackId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TechpackProcess',
  });
  return TechpackProcess;
};