'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Techpack extends Model {
    static associate(models) {
      models.Techpack.belongsTo(models.TechpackCategory, {
        foreignKey: 'categoryId'
      });
      models.Techpack.belongsTo(models.User, {
        foreignKey: 'createById'
      });
      models.Techpack.belongsTo(models.TechpackCloth, {
        foreignKey: 'clothId'
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
    status: DataTypes.INTEGER,
    b_image: DataTypes.STRING,
    a_image: DataTypes.STRING,
    f_image: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Techpack'
  });
  return Techpack;
};