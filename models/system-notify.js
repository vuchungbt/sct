'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notify extends Model {
    static associate(models) {
      models.Notify.belongsTo(models.User, {
        foreignKey: 'assignToId'
      });
    }
  }
  Notify.init({
    content: DataTypes.STRING,
    data: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.INTEGER,
    assignToId: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Notify'
  });
  return Notify;
};