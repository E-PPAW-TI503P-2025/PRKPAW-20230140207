const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// CHECK-IN (WAJIB FOTO)
router.post(
  "/check-in",
  authenticateToken,
  presensiController.upload.single("buktiFoto"),
  presensiController.CheckIn
);


// CHECK-OUT
router.post(
  "/check-out",
  authenticateToken,
  presensiController.CheckOut
);

// DAILY REPORT
router.get(
  "/daily",
  authenticateToken,
  presensiController.getDailyReport
);

module.exports = router;
