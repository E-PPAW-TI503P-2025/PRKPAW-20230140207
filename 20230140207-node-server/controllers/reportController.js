const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");

/* ================== DAILY REPORT =================== */
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
