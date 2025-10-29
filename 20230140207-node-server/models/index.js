const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Buat koneksi ke SQLite (atau ganti MySQL sesuai kebutuhanmu)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../data/database.sqlite"), // simpan di folder data/
  logging: false,
});

// Import model Presensi
const Presensi = require("./presensi")(sequelize, DataTypes);

module.exports = { sequelize, Presensi };
