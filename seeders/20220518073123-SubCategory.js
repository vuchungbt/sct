'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('techpacksubcategories', [{
        name: 'SubCate1',
        code: 'SU1',
        categoryId :1,
        description: 'bodysub',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'THUN1',
        code: 'SU2',
        categoryId :1,
        description: 'bodysub',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'SubCate1',
        code: 'SU3',
        categoryId :2,
        description: 'bodysub',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'THUN2',
        code: 'SU3',
        categoryId :2,
        description: 'bodysub',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('techpacksubcategories', null, {});
  }
};
