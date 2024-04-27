'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      models.Invoice.belongsTo(models.User, {
        foreignKey: 'createdById'
      });
      models.Invoice.belongsTo(models.TechpackStock, {
        foreignKey: 'toStockId'
      });
      models.Invoice.belongsToMany(models.Techpack, {
        through: models.InvoiceDeltail,
        foreignKey: 'invoiceId',
        otherKey: 'techpackId'
      });
    }
  }
  Invoice.init({
    createdById: DataTypes.INTEGER,
    toStockId: DataTypes.INTEGER,
    typePayment: DataTypes.STRING,
    total: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Invoice'
  });
  return Invoice;
};