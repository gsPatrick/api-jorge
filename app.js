const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/config/db.config');
const router = require('./src/routes');
require('./src/models/associations'); // Register associations

const app = express();

// Middleware — allow ALL origins, methods, and headers
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
db.authenticate()
    .then(() => {
        console.log('Database connected...');
        return db.sync({ alter: true });
    })
    .then(() => {
        console.log('Tables synced...');
    })
    .catch(err => {
        console.log('Error: ' + err);
    });

// Routes
app.use('/api', router);

// Uploads directory — PUBLIC static access (no auth required)
// Use absolute path to avoid issues with Docker/EasyPanel working directory
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath, {
    // Set proper headers for image files
    setHeaders: (res, filePath) => {
        // Allow any origin to access these files
        res.set('Access-Control-Allow-Origin', '*');
        // Cache for 1 hour (images don't change often)
        res.set('Cache-Control', 'public, max-age=3600');
    },
}));

// Debug: Log uploads path at startup
console.log(`[Server] Static uploads path: ${uploadsPath}`);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
