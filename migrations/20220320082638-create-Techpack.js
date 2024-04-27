'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Techpacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createById: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TechpackCategorys',
          key: 'id',
        }
      },
      updateById: {
        type: Sequelize.INTEGER
      },
      verifyById: {
        type: Sequelize.INTEGER,
      },
      confirmById: {
        type: Sequelize.INTEGER,
      },
      sub_categoryId: {
        type: Sequelize.INTEGER
      },
      clothId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TechpackCloths',
          key: 'id',
        }
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      
      price: {
        type: Sequelize.INTEGER
      },
      xMay: {
        type: Sequelize.INTEGER
      },
      xTheu: {
        type: Sequelize.INTEGER
      },
      xIn: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      b_image: {
        type: Sequelize.STRING
      },
      a_image: {
        type: Sequelize.STRING
      },
      f_image: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('Techpacks');
  }
};