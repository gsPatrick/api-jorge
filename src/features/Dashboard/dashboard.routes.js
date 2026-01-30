const express = require('express');
const router = express.Router();
const controller = require('./dashboard.controller');
const authJwt = require('../../middleware/authJwt');

router.get(
    '/stats',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getStats
);

module.exports = router;
