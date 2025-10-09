const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const bookRoutes = require('./routes/books');

// Middleware
app.use(cors());
app.use(express.json()); // Baca JSON body
app.use(express.urlencoded({ extended: true })); // Support form body

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log("Body:", req.body); // Debug body
    next();
});

// Route utama
app.get('/', (req, res) => {
    res.send('Home Page for API');
});

// Route untuk books
app.use('/api/books', bookRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Express server running at http://localhost:${PORT}/`);
});
