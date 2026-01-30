const express = require('express');
const cors = require('cors');
const db = require('./src/config/db.config');
const router = require('./src/routes');
require('./src/models/associations'); // Register associations

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
db.authenticate()
    .then(() => {
        console.log('Database connected...');
        // Sync models
        // Force: false ensures we don't drop tables on every restart
        // Alter: true tries to update tables if models change
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

// Uploads directory static access (optional, if we want direct link access without auth)
// But requirements said download endpoint, so we might keep it restricted via controller.
// app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
