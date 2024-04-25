'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsTo(models.Role, {
        foreignKey: 'roleId'
      });
    }
  }
  User.init({
    roleId: DataTypes.INTEGER,
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