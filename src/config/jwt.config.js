require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || "default_secret",
    jwtExpiration: process.env.JWT_EXPIRATION || "24h", // 24 hours
    jwtRefreshExpiration: 86400, // 24 hours
};
