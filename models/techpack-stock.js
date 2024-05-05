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
        otherKey: 'techpackId'
      });
    }
  }
  TechpackStock.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    tel: DataTypes.STRING,
	  password: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechpackStock'
  });
  return TechpackStock;
};