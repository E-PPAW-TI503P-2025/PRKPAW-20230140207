const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

// CHECK-IN
exports.CheckIn = async (req, res) => {
  try {
    const userId = req.user.id; // ambil dari JWT token
    const { latitude, longitude } = req.body; // ambil lokasi dari request
    const waktuSekarang = new Date();

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // cek apakah sudah check-in hari ini (belum check-out)
    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId,
      nama: user.nama, // ambil nama dari user
      checkIn: waktuSekarang,
      latitude: latitude || null, // simpan latitude
      longitude: longitude || null, // simpan longitude
    });

    res.status(201).json({
      message: `Halo ${user.nama}, check-in berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: newRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// CHECK-OUT
exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id; // ambil dari JWT token
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in aktif untuk Anda hari ini.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    res.json({
      message: `Halo ${recordToUpdate.nama}, check-out berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: recordToUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// HAPUS PRESENSI
exports.hapusPresensi = async (req, res) => {
  try {
    const userId = req.user.id;
    const presensiId = req.params.id;

    const recordToDelete = await Presensi.findByPk(presensiId);
    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// UPDATE PRESENSI
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, latitude, longitude } = req.body;

    if (
      checkIn === undefined &&
      checkOut === undefined &&
      latitude === undefined &&
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data valid (checkIn, checkOut, latitude, atau longitude).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.latitude = latitude || recordToUpdate.latitude;
    recordToUpdate.longitude = longitude || recordToUpdate.longitude;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// GET DAILY REPORT
exports.getDailyReport = async (req, res) => {
  try {
    const { nama, startDate, endDate } = req.query;
    let options = {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email", "role"],
        },
      ],
      order: [["checkIn", "DESC"]],
      where: {},
    };

    if (nama) {
      options.include[0].where = {
        nama: { [Op.like]: `%${nama}%` },
      };
    }

    if (startDate && endDate) {
      options.where.checkIn = {
        [Op.between]: [
          new Date(startDate + " 00:00:00"),
          new Date(endDate + " 23:59:59"),
        ],
      };
    } else if (startDate) {
      options.where.checkIn = {
        [Op.gte]: new Date(startDate + " 00:00:00"),
      };
    } else if (endDate) {
      options.where.checkIn = {
        [Op.lte]: new Date(endDate + " 23:59:59"),
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: format(new Date(), "yyyy-MM-dd", { timeZone }),
      data: records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data laporan",
      error: error.message,
    });
  }
};
