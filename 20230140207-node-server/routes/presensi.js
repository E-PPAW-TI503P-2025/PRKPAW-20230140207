const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// CHECK-IN (DENGAN UPLOAD SELFIE)
router.post(
  "/check-in",
  [authenticateToken, presensiController.upload.single("image")],
  presensiController.CheckIn
);

// CHECK-OUT
router.post("/check-out", authenticateToken, presensiController.CheckOut);

// GET DAILY REPORT
router.get("/daily", authenticateToken, presensiController.getDailyReport);

module.exports = router;
