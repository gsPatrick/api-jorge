const express = require('express');
const router = express.Router();

const authRoutes = require('../features/Auth/auth.routes');
const userRoutes = require('../features/User/user.routes');
const templateRoutes = require('../features/Template/template.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/templates', templateRoutes);

module.exports = router;
