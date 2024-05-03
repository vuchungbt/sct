'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceDeltail extends Model {
    static associate(models) {
      // define association here
    }
  }
  InvoiceDeltail.init({
    invoiceId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    techpackId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvoiceDeltail',
  });
  return InvoiceDeltail;
};