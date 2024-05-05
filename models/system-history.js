'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SystemHistory extends Model {
    static associate(models) {
      models.SystemHistory.belongsTo(models.User, {
        foreignKey: 'createdById'
      });
    }
  }
  SystemHistory.init({
    createdById: DataTypes.INTEGER,
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