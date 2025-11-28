const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// ROUTE USER
router.post("/check-in", authenticateToken, presensiController.CheckIn);
router.post("/check-out", authenticateToken, presensiController.CheckOut);
router.get("/daily", authenticateToken, presensiController.getDailyReport);

module.exports = router;
