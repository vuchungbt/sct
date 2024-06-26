'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
        }
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.STRING
      },
      
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      email: {
        allowNull: false,
        unique: true,
        isEmail: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email_verified_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      remember_token: {
        type: Sequelize.STRING
      },     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};