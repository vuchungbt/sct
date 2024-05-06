'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SystemHistory extends Model {
    static associate(models) {
     
    }
  }
  SystemHistory.init({
    content: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    modelName: 'SystemHistory'
  });
  return SystemHistory;
};