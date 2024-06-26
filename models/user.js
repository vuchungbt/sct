'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as : 'role'
      });
      models.User.hasMany(models.Techpack, {
        foreignKey: 'createById'
      });
      models.User.hasMany(models.Techpack, {
        foreignKey: 'verifyById'
      });
      models.User.hasMany(models.Invoice, {
        foreignKey: 'createdById'
      });
      models.User.hasMany(models.Notify, {
        foreignKey: 'assignToId'
      });
      models.User.hasMany(models.TechpackStock, {
        foreignKey: 'ownerById',
        as : 'stocks'
      });

    }
  }
  User.init({
    name: DataTypes.STRING,
    status: DataTypes.INTEGER,
    tel: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    email_verified_at: DataTypes.DATE,
    remember_token: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    modelName: 'User'
  });
  return User;
};