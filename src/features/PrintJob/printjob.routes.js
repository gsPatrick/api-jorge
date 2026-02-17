const express = require('express');
const router = express.Router();
const controller = require('./printjob.controller');
const authJwt = require('../../middleware/authJwt');

// Any authenticated user can create a print job
router.post('/', [authJwt.verifyToken], controller.create);

// Get my print history
router.get('/mine', [authJwt.verifyToken], controller.getMyPrints);

module.exports = router;
