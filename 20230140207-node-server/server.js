const express = require("express");
const cors = require("cors");
const path = require("path"); // ← WAJIB untuk akses folder static

const app = express();
const PORT = 3001;

// IMPORT ROUTES
const bookRoutes = require("./routes/books");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const iotRoutes = require("./routes/iot");

app.use("/api/iot", iotRoutes);


// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 STATIC FOLDER UNTUK FOTO SELFIE
// Bisa diakses via: http://localhost:3001/uploads/namafile.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DEBUG REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`📌 [${req.method}] ${req.url}`);
  console.log("➡ Body:", req.body);
  next();
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/books", bookRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API Server Running...");
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

