'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('Users', [{
        name: 'Super admin',
        tel: '0123456789',
        status: 1,
        email: 'admin@admin.com',
        password: await bcrypt.hash('123456qqq',12)
                    .then(passwordHash => { return passwordHash; }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test User',
        tel: '0123456780',
        status: 1,
        email: 'user@user.com',
        password: await bcrypt.hash('123456qqq',12)
                    .then(passwordHash => { return passwordHash; }),
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.  
     */
     await queryInterface.bulkDelete('Users', null, {});
  }
};
