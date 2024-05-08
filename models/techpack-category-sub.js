'use strict';
const { Model } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
  class TechpackSubCategory extends Model {
    static associate(models) {
      models.Techpack.belongsTo(models.TechpackCategory, {
        foreignKey: 'categoryId'
      });
      models.TechpackSubCategory.hasMany(models.Techpack, {
        foreignKey: 'sub_categoryId'
      });
    }
  }
  TechpackSubCategory.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechpackSubCategory'
  });
  return TechpackSubCategory;
};