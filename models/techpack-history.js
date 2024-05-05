'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TechpackHistory extends Model {
    static associate(models) {
      models.TechpackHistory.belongsTo(models.Techpack, {
        foreignKey: 'techpackId'
      });
    }
  }
  TechpackHistory.init({
    techpackId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    modelName: 'TechpackHistory'
  });
  return TechpackHistory;
};