'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdById: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      toStockId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TechpackStocks',
          key: 'id',
        }
      },
      typePayment: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.INTEGER,
      }, 
      status: {
        type: Sequelize.STRING
      }, 
      note: {
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
    await queryInterface.dropTable('Invoices');
  }
};