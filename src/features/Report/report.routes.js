const express = require('express');
const router = express.Router();
const controller = require('./report.controller');
const authJwt = require('../../middleware/authJwt');

router.get(
    '/photographers',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getPhotographerRanking
);

module.exports = router;
