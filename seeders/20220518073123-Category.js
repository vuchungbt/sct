'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('techpackcategories', [{
        name: 'Cate1',
        id:1,
        code: 'C1',
        description: 'body',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'sub-cate',
        code: 'S1',
        id:2,
        description: 'cloth1',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('techpackcategories', null, {});
  }
};
