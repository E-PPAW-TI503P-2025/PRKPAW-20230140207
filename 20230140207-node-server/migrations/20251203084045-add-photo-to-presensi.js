'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tambah kolom buktiFoto ke tabel Presensis
    await queryInterface.addColumn('Presensis', 'buktiFoto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus kolom buktiFoto jika rollback
    await queryInterface.removeColumn('Presensis', 'buktiFoto');
  }
};
