const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

// 🟢 CHECK-IN
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cek apakah user sudah check-in hari ini (belum check-out)
    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // Simpan data baru ke database
    const newRecord = await Presensi.create({
      userId,
      nama: userName,
      checkIn: waktuSekarang,
      checkOut: null
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 🔵 CHECK-OUT
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari presensi yang belum di-checkout
    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Tidak ada data check-in aktif untuk Anda." });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: recordToUpdate
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 🟣 UPDATE DATA PRESENSI
exports.updatePresensi = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, nama } = req.body;

    if (!checkIn && !checkOut && !nama) {
      return res.status(400).json({ message: "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama)." });
    }

    const presensi = await Presensi.findByPk(id);
    if (!presensi) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (checkIn) presensi.checkIn = new Date(checkIn);
    if (checkOut) presensi.checkOut = new Date(checkOut);
    if (nama) presensi.nama = nama;

    await presensi.save();

    res.json({ message: "Data presensi berhasil diperbarui.", data: presensi });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 🔴 DELETE PRESENSI
exports.deletePresensi = async (req, res) => {
  try {
    const { id } = req.params;

    const presensi = await Presensi.findByPk(id);
    if (!presensi) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    await presensi.destroy();
    res.status(200).json({ message: "Catatan presensi berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    let options = { where: {} };

    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
