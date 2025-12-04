const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

const multer = require("multer");
const path = require("path");

/* ================== MULTER CONFIG =================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
};

exports.upload = multer({ storage, fileFilter });

/* ================== CHECK-IN =================== */
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

    const buktiFoto = req.file ? req.file.filename : null;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini.",
      });
    }

    const newRecord = await Presensi.create({
      userId,
      nama: user.nama,
      checkIn: waktuSekarang,
      latitude: latitude || null,
      longitude: longitude || null,
      buktiFoto: buktiFoto,
    });

    res.status(201).json({
      message: `Halo ${user.nama}, check-in berhasil!`,
      data: newRecord,
    });

  } catch (error) {
    console.error("CHECK-IN ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

/* ================== CHECK-OUT =================== */
exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const waktuSekarang = new Date();

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!record) {
      return res.status(404).json({
        message: "Tidak ada check-in aktif!",
      });
    }

    record.checkOut = waktuSekarang;
    await record.save();

    res.json({ message: "Check-out berhasil!", data: record });

  } catch (error) {
    console.error("CHECK-OUT ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

/* ================== GET DAILY REPORT =================== */
exports.getDailyReport = async (req, res) => {
  try {
    const records = await Presensi.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email", "role"],
        },
      ],
      order: [["checkIn", "DESC"]],
    });

    res.json({
      message: "Berhasil mengambil data laporan",
      data: records,
    });

  } catch (error) {
    console.error("DAILY REPORT ERROR:", error);
    res.status(500).json({
      message: "Gagal mengambil data laporan",
      error: error.message,
    });
  }
};
