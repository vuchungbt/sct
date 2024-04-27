'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TechpackProcess', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      techpackId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Techpack',
          key: 'id',
        }
      },
      stockId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TechpackStock',
          key: 'id',
        }
      },
      duedate : {
        allowNull: true,
        type: Sequelize.DATE
      } , 
      completeddate : {
        allowNull: true,
        type: Sequelize.DATE
      } , 
      status : {
        allowNull: true,
        type: Sequelize.STRING
      } ,   
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
    await queryInterface.dropTable('TechpackProcess');
  }
};