'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InvoiceDeltails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoiceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Invoices',
          key: 'id',
        }
      },
      techpackId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Techpacks',
          key: 'id',
        }
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
    await queryInterface.dropTable('InvoiceDeltails');
  }
};