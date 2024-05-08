'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notify extends Model {
    static associate(models) {
     
    }
  }
  Notify.init({
    content: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Notify'
  });
  return Notify;
};