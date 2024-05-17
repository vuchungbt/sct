'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechpackProcess extends Model {
    static associate(models) {
      models.TechpackProcess.belongsTo(models.TechpackStock, {
        foreignKey: 'stockId',
        as: 'stockprocess'
      });
    }
  }
  TechpackProcess.init({
    duedate: DataTypes.DATEONLY , 
    completeddate: DataTypes.DATEONLY  , 
    status: DataTypes.INTEGER  ,   
    note : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechpackProcess',
  });
  return TechpackProcess;
};