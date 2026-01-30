const express = require('express');
const router = express.Router();
const controller = require('./template.controller');
const authJwt = require('../../middleware/authJwt');
const upload = require('../../config/storage.config');

router.post(
    '/',
    [authJwt.verifyToken, authJwt.isAdmin, upload.single('file')],
    controller.upload
);

router.get(
    '/assigned',
    [authJwt.verifyToken],
    controller.getAssigned
);

router.get(
    '/active',
    [authJwt.verifyToken],
    controller.getActive
);

router.get(
    '/:id/download',
    // Download might need auth or might be public depending on requirements.
    // Prompt says "Endpoint for app to download", implying it might use the token from the app.
    [authJwt.verifyToken],
    controller.download
);

module.exports = router;
