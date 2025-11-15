const express = require('express');
const router = express.Router();

// contoh route
router.post('/login', (req, res) => {
    res.send('Login route aktif');
});

module.exports = router;
