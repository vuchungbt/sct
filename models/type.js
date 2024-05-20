'use strict';
// const 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      models.Type.hasMany(models.TechpackProcess, {
        foreignKey: 'type'
      });
    }
  }
  Type.init({
    name: DataTypes.STRING,
    typeOf: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Type'
  });
  return Type;
};