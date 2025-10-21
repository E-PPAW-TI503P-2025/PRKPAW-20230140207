const presensiRecords = require("../data/presensiData");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = (req, res) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();
  const existingRecord = presensiRecords.find(
    (record) => record.userId === userId && record.checkOut === null
  );

  if (existingRecord) {
    return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
  }

  const newRecord = {
    userId,
    nama: userName,
    checkIn: waktuSekarang,
    checkOut: null,
  };

  presensiRecords.push(newRecord);

  res.status(201).json({
    message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
    data: newRecord,
  });
};

exports.CheckOut = (req, res) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();
  const recordToUpdate = presensiRecords.find(
    (record) => record.userId === userId && record.checkOut === null
  );

  if (!recordToUpdate) {
    return res.status(404).json({
      message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
    });
  }

  recordToUpdate.checkOut = waktuSekarang;

  res.json({
    message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
    data: recordToUpdate,
  });
};
