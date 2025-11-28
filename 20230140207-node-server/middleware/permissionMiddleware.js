const jwt = require("jsonwebtoken");
const JWT_SECRET = "SECRETKEY123"; // DISAMAKAN DENGAN authController.js

// Middleware utama untuk proteksi JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token kosong" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    // Bedakan error expired atau invalid
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token kadaluarsa" });
    }
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// Validasi role admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Admin saja." });
  }
  next();
};
