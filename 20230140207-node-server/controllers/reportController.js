const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, startDate, endDate } = req.query;

    // Opsi default untuk query
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

    // FILTER NAMA melalui include.where
    if (nama) {
      options.include[0].where = {
        nama: {
          [Op.like]: `%${nama}%`,
        },
      };
    }

    // FILTER RANGE TANGGAL
    if (startDate && endDate) {
      options.where.checkIn = {
        [Op.between]: [
          new Date(startDate + " 00:00:00"),
          new Date(endDate + " 23:59:59"),
        ],
      };
    }
    // FILTER START DATE SAJA
    else if (startDate) {
      options.where.checkIn = {
        [Op.gte]: new Date(startDate + " 00:00:00"),
      };
    }
    // FILTER END DATE SAJA
    else if (endDate) {
      options.where.checkIn = {
        [Op.lte]: new Date(endDate + " 23:59:59"),
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: format(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Jakarta" }),
      data: records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
