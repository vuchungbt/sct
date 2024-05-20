'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceDeltail extends Model {
    static associate(models) {
      models.InvoiceDeltail.belongsTo(models.Invoice, {
        foreignKey: 'invoiceId'
      });
      
      models.InvoiceDeltail.belongsTo(models.Techpack, {
        foreignKey: 'techpackId',
        as :'techpack'
      });
    }
  }
  InvoiceDeltail.init({
    invoiceId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    type: DataTypes.STRING,
    techpackId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvoiceDeltail',
  });
  return InvoiceDeltail;
};