'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TechpackProcesses', {
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
          model: 'Techpacks',
          key: 'id',
        }
      },
      stockId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TechpackStocks',
          key: 'id',
        }
      },
      duedate : {
        allowNull: true,
        type: Sequelize.DATEONLY
      } , 
      completeddate : {
        allowNull: true,
        type: Sequelize.DATEONLY
      } , 
      status : {
        allowNull: true,
        type: Sequelize.INTEGER,
        defauleValue:0
      } ,   
      note : {
        allowNull: true,
        type: Sequelize.STRING
      } ,  
      type : {
        allowNull: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('TechpackProcesses');
  }
};