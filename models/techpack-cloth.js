'use strict'; 
const {   Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechpackCloth extends Model {
    static associate(models) {
      models.TechpackCloth.hasMany(models.Techpack, {
        foreignKey: 'clothId'
      });
    }
  }
  TechpackCloth.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechpackCloth'
  });
  return TechpackCloth;
};