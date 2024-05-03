'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('techpackcloths', [{
        name: 'cotton',
        code: 'cottonUS',
        description: 'cloth1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'cloth-name',
        code: 'cloth-code-1',
        description: 'cloth1',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('techpackcloths', null, {});
  }
};
