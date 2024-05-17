'use strict';
const { Model } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
  class TechpackStock extends Model {
    static associate(models) {
      models.TechpackStock.hasMany(models.Invoice, {
        foreignKey: 'toStockId'
      });
      models.TechpackStock.belongsToMany(models.Techpack, {
        through: models.TechpackProcess,
        foreignKey: 'stockId',
        otherKey: 'techpackId',
        as: 'techpack'
      });
      models.TechpackStock.hasMany(models.TechpackProcess, {
        foreignKey: 'stockId',
        as: 'stockprocess'
      });
      models.TechpackStock.belongsTo(models.User, {
        foreignKey: 'ownerById'
        
      });
    }
  }
  TechpackStock.init({
    ownerById:DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    tel: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechpackStock'
  });
  return TechpackStock;
};