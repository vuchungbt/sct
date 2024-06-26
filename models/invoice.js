'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      models.Invoice.belongsTo(models.User, {
        foreignKey: 'createdById',
        as :'createdby'
      });
      models.Invoice.belongsTo(models.TechpackStock, {
        foreignKey: 'toStockId',
        as : 'supplier'
      });
      models.Invoice.belongsToMany(models.Techpack, {
        through: models.InvoiceDeltail,
        foreignKey: 'invoiceId',
        otherKey: 'techpackId',
        as: 'techpacks'
      });
      models.Invoice.hasMany(models.InvoiceDeltail, {
        foreignKey: 'invoiceId',
        as :'detail'
      });

    }
  }
  Invoice.init({
    createdById: DataTypes.INTEGER,
    toStockId: DataTypes.INTEGER,
    typePayment: DataTypes.STRING,
    total: DataTypes.INTEGER,
    status: DataTypes.STRING,
    note: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Invoice'
  });
  return Invoice;
};