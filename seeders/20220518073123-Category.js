'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('techpackcloths', [{
        name: 'Cate1',
        code: 'C1',
        type:'category',
        description: 'body',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'sub-cate',
        code: 'S1',
        type:'sub-category',
        description: 'cloth1',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('techpackcloths', null, {});
  }
};
