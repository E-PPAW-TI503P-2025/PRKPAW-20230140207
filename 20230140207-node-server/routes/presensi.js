const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');

router.post("/check-in", addUserData, presensiController.CheckIn);
router.post("/check-out", addUserData, presensiController.CheckOut);
router.put(
  "/:id",
  [
    addUserData,
    body("waktuCheckIn")
      .isISO8601()
      .withMessage("waktuCheckIn harus dalam format tanggal valid (ISO8601)"),
    body("waktuCheckOut")
      .isISO8601()
      .withMessage("waktuCheckOut harus dalam format tanggal valid (ISO8601)"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  presensiController.updatePresensi
);

router.delete("/:id", addUserData, presensiController.deletePresensi);

router.get("/reports/daily", presensiController.getDailyReport);


module.exports = router;
