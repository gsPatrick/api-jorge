require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || "default_secret",
    jwtExpiration: process.env.JWT_EXPIRATION || "365d", // 1 year
    jwtRefreshExpiration: 31536000, // 1 year in seconds
};
