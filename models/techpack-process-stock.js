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
      models.TechpackProcess.belongsTo(models.Techpack, {
        foreignKey: 'techpackId',
        as :'techpackDetail'
      });
      models.TechpackProcess.belongsTo(models.Type, {
        foreignKey: 'type'
      });
    }
  }
  TechpackProcess.init({
    duedate: DataTypes.DATEONLY , 
    completeddate: DataTypes.DATEONLY  , 
    status: DataTypes.INTEGER,  
    groupID: DataTypes.STRING,   
    note : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechpackProcess',
  });
  return TechpackProcess;
};