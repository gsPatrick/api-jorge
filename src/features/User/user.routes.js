const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const authJwt = require('../../middleware/authJwt');

router.post(
    '/',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
);

router.get(
    '/',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
);

router.put(
    '/:id/status',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateStatus
);

router.delete(
    '/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
);

router.put(
    '/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
);

router.post(
    '/:id/templates',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.assignTemplates
);

module.exports = router;
