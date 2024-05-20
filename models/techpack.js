'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Techpack extends Model {
    static associate(models) {
      models.Techpack.belongsTo(models.TechpackCategory, {
        foreignKey: 'categoryId',
        as : 'category'
      });
      models.Techpack.belongsTo(models.TechpackSubCategory, {
        foreignKey: 'sub_categoryId',
        as : 'sub_category'
      });
      models.Techpack.belongsTo(models.User, {
        foreignKey: 'createById',
        as : 'createby'
      });
      models.Techpack.belongsTo(models.User, {
        foreignKey: 'confirmById',
        as : 'confirmby'
      });
      models.Techpack.belongsTo(models.TechpackCloth, {
        foreignKey: 'clothId',
        as : 'cloth'
      });
      models.Techpack.belongsToMany(models.Invoice, {
        through: models.InvoiceDeltail,
        foreignKey: 'invoiceId',
        otherKey: 'techpackId' 
      });
      models.Techpack.belongsToMany(models.TechpackStock, {
        through: models.TechpackProcess,
        foreignKey: 'stockId',
        otherKey: 'techpackId'
      });
      models.Techpack.hasMany(models.TechpackHistory, {
        foreignKey: 'techpackId',
        as :'history'
      });
      models.Techpack.hasMany(models.InvoiceDeltail, {
        foreignKey: 'techpackId',
        as :'techpack'
      });
    }
  }
  Techpack.init({
    createById: DataTypes.INTEGER,
    updateById: DataTypes.INTEGER,
    verifyById: DataTypes.INTEGER,
    confirmById: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    sub_categoryId: DataTypes.INTEGER,
    clothId: DataTypes.INTEGER,
    xMay: DataTypes.INTEGER,
    xIn: DataTypes.INTEGER,
    xTheu: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    name: DataTypes.STRING,
    seasion: DataTypes.STRING,
    SKU: DataTypes.STRING,
    status: DataTypes.INTEGER,
    b_image: DataTypes.STRING,
    a_image: DataTypes.STRING,
    f_image: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    reason: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Techpack'
  });
  return Techpack;
};